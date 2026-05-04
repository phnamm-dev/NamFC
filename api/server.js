// api/server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5500;

// ---- KIỂM TRA BIẾN MÔI TRƯỜNG ----
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_KEY trong file .env!');
    console.error('   Tạo file .env ở thư mục gốc với nội dung:');
    console.error('   SUPABASE_URL=https://mirxuscvrddxbsenoklz.supabase.co');
    console.error('   SUPABASE_SERVICE_KEY=eyJhbGciOi... (service_role key)');
    process.exit(1);
}

// ---- MIDDLEWARES ----
app.use(express.json());
app.use(cookieParser());

// Tạo user ID nếu chưa có (giải pháp thay thế auth ẩn danh)
app.use((req, res, next) => {
    if (!req.cookies.user_id) {
        const newUserId = 'user_' + Math.random().toString(36).substr(2, 9);
        res.cookie('user_id', newUserId, { 
            maxAge: 24 * 60 * 60 * 1000, // 24 giờ
            httpOnly: true,
            sameSite: 'lax'
        });
        req.userId = newUserId;
    } else {
        req.userId = req.cookies.user_id;
    }
    next();
});

// ---- CẤU HÌNH PROXY CHUNG ----
const proxyOptions = {
    target: SUPABASE_URL,
    changeOrigin: true,
    on: {
        proxyReq: (proxyReq, req, res) => {
            // Gắn Service Key vào mọi request đi qua proxy
            proxyReq.setHeader('Authorization', `Bearer ${SUPABASE_SERVICE_KEY}`);
            proxyReq.setHeader('apikey', SUPABASE_SERVICE_KEY);
            
            // Nếu client gửi Authorization từ anon key, xóa nó đi để dùng service key
            proxyReq.removeHeader('x-client-info');
        },
        error: (err, req, res) => {
            console.error('❌ Lỗi proxy:', err.message);
            res.status(500).json({ error: 'Lỗi kết nối đến Supabase' });
        }
    }
};

// ---- PROXY CÁC ENDPOINT SUPABASE ----
// REST API (database, storage)
app.use('/rest/v1', createProxyMiddleware({ ...proxyOptions }));

// Auth API (signInAnonymously, getSession...)
app.use('/auth/v1', createProxyMiddleware({ ...proxyOptions }));

// Realtime API (WebSocket cho subcribe)
app.use('/realtime/v1', createProxyMiddleware({ ...proxyOptions, ws: true }));

// Storage API (upload ảnh)
app.use('/storage/v1', createProxyMiddleware({ ...proxyOptions }));

// ---- API TỰ TẠO ----
// Lấy thông tin user hiện tại
app.get('/api/me', (req, res) => {
    res.json({ userId: req.userId });
});

// Kiểm tra server sống
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        time: new Date().toISOString(),
        userId: req.userId,
        supabaseUrl: SUPABASE_URL.replace(/\/\/.*@/, '//***@') // Ẩn key khi log
    });
});

// ---- PHỤC VỤ FILE TĨNH (ĐẶT CUỐI CÙNG) ----
app.use(express.static(path.join(__dirname, '..')));

// ---- KHỞI ĐỘNG SERVER ----
app.listen(PORT, () => {
    console.log('╔══════════════════════════════════════╗');
    console.log('║   ⚽  NAM FC ONLINE SERVER  ⚽      ║');
    console.log('╠══════════════════════════════════════╣');
    console.log(`║  Server:  http://localhost:${PORT}    ║`);
    console.log(`║  Proxy:   ${SUPABASE_URL}`);
    console.log('║  Status:  Đã bảo vệ Service Key 🔒  ║');
    console.log('╚══════════════════════════════════════╝');
});