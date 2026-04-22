(function(){
    "use strict";

    // ========== CONFIG ==========
    const SUPABASE_URL = 'https://mirxuscvrddxbsenoklz.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pcnh1c2N2cmRkeGJzZW5va2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NjcyNDEsImV4cCI6MjA5MjM0MzI0MX0.znSP9exUZOr8fxHw57EdGPWvSBzzYZx2e0qw4lZItQk';
    
    // Rate limit: 3 lần / giờ (dùng localStorage)
    const RATE_LIMIT_KEY = 'namfc_upload_requests';
    const MAX_REQUESTS = 3;
    const TIME_WINDOW_HOURS = 1;

    // Khởi tạo Supabase
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // DOM elements
    const form = document.getElementById('uploadForm');
    const imageInput = document.getElementById('imageInput');
    const preview = document.getElementById('preview');
    const submitBtn = document.getElementById('submitBtn');
    const statusDiv = document.getElementById('status');

    // Preview ảnh
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // ========== RATE LIMITING ==========
    function getRequestData() {
        const stored = localStorage.getItem(RATE_LIMIT_KEY);
        if (!stored) return { count: 0, firstTimestamp: null };
        return JSON.parse(stored);
    }

    function canSubmit() {
        const data = getRequestData();
        const now = Date.now();
        
        if (!data.firstTimestamp) return true;
        
        const elapsed = (now - data.firstTimestamp) / (1000 * 60 * 60); // hours
        if (elapsed >= TIME_WINDOW_HOURS) {
            // Reset sau khi hết thời gian
            localStorage.removeItem(RATE_LIMIT_KEY);
            return true;
        }
        
        return data.count < MAX_REQUESTS;
    }

    function recordRequest() {
        const data = getRequestData();
        const now = Date.now();
        
        if (!data.firstTimestamp || (now - data.firstTimestamp) / (1000*60*60) >= TIME_WINDOW_HOURS) {
            localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: 1, firstTimestamp: now }));
        } else {
            data.count += 1;
            localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
        }
    }

    function getRemainingTime() {
        const data = getRequestData();
        if (!data.firstTimestamp) return 0;
        const elapsed = Date.now() - data.firstTimestamp;
        const remainingMs = TIME_WINDOW_HOURS * 60 * 60 * 1000 - elapsed;
        if (remainingMs <= 0) return 0;
        return Math.ceil(remainingMs / (60 * 1000)); // minutes
    }

    // ========== SUBMIT ==========
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // ========== SỬ DỤNG PROTECTION ==========
        const protection = window.NamFCProtection;
        const validation = protection.validate();
        
        if (!validation.valid) {
            statusDiv.className = 'status-message error';
            statusDiv.innerHTML = `⚠️ ${validation.reason}`;
            return;
        }

        // Đánh dấu bắt đầu submit
        protection.start();

        const file = imageInput.files[0];
        if (!file) {
            statusDiv.className = 'status-message error';
            statusDiv.innerHTML = '❌ Bạn chưa chọn ảnh!';
            protection.end(false);
            return;
        }

        // UI loading
        statusDiv.className = 'status-message loading';
        statusDiv.innerHTML = '⏳ Đang tải ảnh lên, chờ xíu...';
        submitBtn.disabled = true;
        submitBtn.innerHTML = '⏳ ĐANG XỬ LÝ...';

        try {
            // 1. Upload ảnh
            const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
            const { error: uploadError } = await supabase.storage
                .from('player-images')
                .upload(fileName, file);

            if (uploadError) throw new Error(`Upload thất bại: ${uploadError.message}`);

            // 2. Lấy URL public
            const { data: { publicUrl } } = supabase.storage
                .from('player-images')
                .getPublicUrl(fileName);

            // 3. Lưu DB
            const { error: insertError } = await supabase
                .from('submissions')
                .insert({
                    name: document.getElementById('playerName').value,
                    position: document.getElementById('position').value,
                    nationality: document.getElementById('nationality').value,
                    club: document.getElementById('club').value,
                    season: document.getElementById('season').value,
                    image_url: publicUrl
                });

            if (insertError) throw new Error(`Lưu dữ liệu thất bại: ${insertError.message}`);

            // Thành công
            statusDiv.className = 'status-message success';
            statusDiv.innerHTML = '✅ Gửi thành công! Admin sẽ duyệt và tạo thẻ sớm.';
            
            form.reset();
            preview.style.display = 'none';
            submitBtn.innerHTML = '🎉 ĐÃ GỬI THÀNH CÔNG!';
            
            protection.end(true);

        } catch (error) {
            console.error(error);
            statusDiv.className = 'status-message error';
            statusDiv.innerHTML = `❌ Lỗi: ${error.message}`;
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'SENT!!!';
            
            protection.end(false);
        }
    });

    // Hiển thị version (có thể fetch giống index)
    const versionEl = document.getElementById('versionBox');
    fetch('js/version.json')
        .then(res => res.json())
        .then(data => { versionEl.textContent = `Version: ${data.version}`; })
        .catch(() => { versionEl.textContent = 'Version: 1.0.0'; });

})();