// health check v2
module.exports = async function handler(req, res) {
  const status = {
    supabaseUrl: process.env.SUPABASE_URL ? '✅ Đã có' : '❌ Thiếu',
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Đã có (giá trị bị ẩn)' : '❌ Thiếu',
    turnstileSecret: process.env.TURNSTILE_SECRET_KEY ? '✅ Đã có' : '❌ Thiếu'
  };
  
  console.log('Health check:', status);
  res.status(200).json(status);
};