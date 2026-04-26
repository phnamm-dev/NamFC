const { createClient } = require('@supabase/supabase-js');
const formidable = require('formidable');
const fs = require('fs');

// Khởi tạo Supabase Admin (service_role) – chỉ tồn tại ở server
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Xác minh Turnstile
async function verifyTurnstile(token, ip) {
  const body = new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET_KEY,
    response: token,
    remoteip: ip
  });
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body
  });
  const data = await res.json();
  return data.success;
}

// Kiểm tra rate limit (theo IP, 3 lần/giờ)
async function isRateLimited(ip) {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error } = await supabaseAdmin
    .from('submission_logs')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .gte('created_at', oneHourAgo);

  if (error) {
    console.error('Rate limit error:', error);
    return true; // an toàn: chặn nếu lỗi
  }
  return count >= 3;
}

// Upload ảnh lên Storage
async function uploadImage(filePath, originalName, mimeType) {
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

// Hàm chính xử lý request
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse form data (multipart)
    const form = new formidable.IncomingForm();
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    // Lấy giá trị từ form (formidable v3 trả về mảng hoặc string)
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

    // Lấy file ảnh (formidable v3 có thể trả về mảng)
    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '0.0.0.0';

    // 1. Xác thực Turnstile
    if (!turnstileToken || !(await verifyTurnstile(turnstileToken, ip))) {
      return res.status(400).json({ error: 'Xác thực captcha không hợp lệ.' });
    }

    // 2. Rate limit
    if (await isRateLimited(ip)) {
      return res.status(429).json({ error: 'Bạn đã gửi quá nhiều lần. Vui lòng đợi 1 giờ.' });
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

    // 4. Insert vào bảng submissions
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
    console.error('API error:', error);
    return res.status(500).json({ error: 'Lỗi máy chủ nội bộ.' });
  }
};