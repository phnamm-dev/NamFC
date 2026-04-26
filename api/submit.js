import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

async function isRateLimited(ip) {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error } = await supabaseAdmin
    .from('submission_logs')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .gte('created_at', oneHourAgo);

  if (error) {
    console.error(error);
    return true; // nếu lỗi thì chặn an toàn
  }
  return count >= 3;
}

async function uploadImage(fileBuffer, fileName, mimeType) {
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formidable = await import('formidable');
    const form = new formidable.IncomingForm();
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const name = fields.name?.[0] || fields.name;
    const position = fields.position?.[0] || fields.position;
    const nationality = fields.nationality?.[0] || fields.nationality;
    const club = fields.club?.[0] || fields.club;
    const season = fields.season?.[0] || fields.season;
    const turnstileToken = fields.turnstileToken?.[0] || fields.turnstileToken;
    const imageFile = files.image?.[0] || files.image;

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '0.0.0.0';

    if (!turnstileToken || !(await verifyTurnstile(turnstileToken, ip))) {
      return res.status(400).json({ error: 'Xác thực captcha không hợp lệ.' });
    }

    if (await isRateLimited(ip)) {
      return res.status(429).json({ error: 'Bạn đã gửi quá nhiều. Vui lòng đợi 1 giờ.' });
    }

    let imageUrl = null;
    if (imageFile) {
      const buffer = require('fs').readFileSync(imageFile.filepath);
      const fileName = `${Date.now()}_${imageFile.originalFilename.replace(/\s+/g, '_')}`;
      imageUrl = await uploadImage(buffer, fileName, imageFile.mimetype);
    }

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

    await supabaseAdmin.from('submission_logs').insert({
      ip_address: ip,
      created_at: new Date().toISOString()
    });

    return res.status(200).json({ success: true, message: 'Gửi thành công!' });
  } catch (error) {
    console.error('Submit error:', error);
    return res.status(500).json({ error: 'Lỗi máy chủ nội bộ.' });
  }
}