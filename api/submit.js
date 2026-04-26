const { createClient } = require('@supabase/supabase-js');
const formidable = require('formidable');
const fs = require('fs');

// === KIỂM TRA BIẾN MÔI TRƯỜNG SỚM ===
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Thiếu biến môi trường SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY');
  // Sẽ trả về lỗi khi gọi handler, tránh crash bí ẩn
}

let supabaseAdmin;
try {
  supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
  console.log('Supabase client đã được khởi tạo.');
} catch (err) {
  console.error('Lỗi khởi tạo Supabase client:', err);
}

async function verifyTurnstile(token, ip) {
  if (!TURNSTILE_SECRET_KEY) {
    console.error('Thiếu TURNSTILE_SECRET_KEY');
    return false;
  }
  try {
    const body = new URLSearchParams({
      secret: TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: ip
    });
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body
    });
    const data = await res.json();
    return data.success;
  } catch (err) {
    console.error('Lỗi verify turnstile:', err);
    return false;
  }
}

async function isRateLimited(ip) {
  if (!supabaseAdmin) {
    console.error('Supabase admin not initialized');
    return true;
  }
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error } = await supabaseAdmin
      .from('submission_logs')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .gte('created_at', oneHourAgo);

    if (error) {
      console.error('Rate limit check error:', error);
      return true;
    }
    return count >= 3;
  } catch (err) {
    console.error('Rate limit error:', err);
    return true;
  }
}

async function uploadImage(filePath, originalName, mimeType) {
  if (!supabaseAdmin) throw new Error('Supabase admin not ready');
  const fileBuffer = fs.readFileSync(filePath);
  const fileName = `${Date.now()}_${originalName.replace(/\s+/g, '_')}`;

  const { error } = await supabaseAdmin.storage
    .from('player-images')
    .upload(fileName, fileBuffer, {
      contentType: mimeType,
      upsert: false
    });
  if (error) throw error;

  const { data } = supabaseAdmin.storage
    .from('player-images')
    .getPublicUrl(fileName);
  return data.publicUrl;
}

module.exports = async function handler(req, res) {
  // CORS header để tránh lỗi nếu frontend khác domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Kiểm tra lại supabaseAdmin trước khi xử lý
  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Máy chủ chưa sẵn sàng (Supabase client).' });
  }

  try {
    const form = new formidable.IncomingForm();
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const getField = (field) => {
      const val = fields[field];
      return Array.isArray(val) ? val[0] : val;
    };

    const name = getField('name');
    const position = getField('position');
    const nationality = getField('nationality');
    const club = getField('club');
    const season = getField('season');
    const turnstileToken = getField('turnstileToken');
    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

    const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || '0.0.0.0';

    // 1. Turnstile
    if (!turnstileToken || !(await verifyTurnstile(turnstileToken, ip))) {
      return res.status(400).json({ error: 'Xác thực captcha không hợp lệ.' });
    }

    // 2. Rate limit
    if (await isRateLimited(ip)) {
      return res.status(429).json({ error: 'Bạn đã gửi quá nhiều. Vui lòng đợi 1 giờ.' });
    }

    // 3. Upload ảnh
    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadImage(
        imageFile.filepath,
        imageFile.originalFilename || 'image.jpg',
        imageFile.mimetype
      );
    }

    // 4. Insert DB
    const { error: insertError } = await supabaseAdmin
      .from('submissions')
      .insert({
        name,
        position,
        nationality,
        club,
        season,
        image_url: imageUrl
      });

    if (insertError) throw insertError;

    // 5. Ghi log rate limit
    await supabaseAdmin.from('submission_logs').insert({
      ip_address: ip,
      created_at: new Date().toISOString()
    });

    return res.status(200).json({ success: true, message: 'Gửi thành công!' });

  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: 'Lỗi máy chủ nội bộ.', details: error.message });
  }
};