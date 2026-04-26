// health check v3 - debug
module.exports = async function handler(req, res) {
  // Lấy danh sách tất cả key của biến môi trường
  const envKeys = Object.keys(process.env).sort();
  
  // Tạo object chỉ chứa tên biến (KHÔNG in giá trị)
  const debugEnv = {};
  envKeys.forEach(key => {
    if (key === 'SUPABASE_URL' || key === 'SUPABASE_SERVICE_ROLE_KEY' || key === 'TURNSTILE_SECRET_KEY') {
      // Với các biến ta quan tâm, báo có/không
      debugEnv[key] = process.env[key] ? '✅ Exists' : '❌ Missing';
    } else {
      // Các biến khác (của hệ thống) không hiển thị
      debugEnv[key] = '(hidden)';
    }
  });

  res.status(200).json({
    customVars: {
      SUPABASE_URL: process.env.SUPABASE_URL ? '✅' : '❌',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌',
      TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY ? '✅' : '❌'
    },
    totalEnvKeys: envKeys.length,
    message: 'Nếu thấy ❌, biến chưa được đưa vào runtime này.'
  });
};