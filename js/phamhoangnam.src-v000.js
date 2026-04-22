(function() {
    'use strict';

    // ========== CONFIG ==========
    const MIN_SUBMIT_INTERVAL = 3000;
    
    let lastSubmitTime = 0;
    let isSubmitting = false;

    // ========== HONEYPOT ==========
    function createHoneypot() {
        const honeypot = document.createElement('div');
        honeypot.style.cssText = 'position: absolute; left: -9999px; top: -9999px; opacity: 0; pointer-events: none;';
        honeypot.innerHTML = `
            <label for="website_url">Leave this empty</label>
            <input type="text" id="website_url" name="website_url" autocomplete="off" tabindex="-1">
        `;
        document.body.appendChild(honeypot);
        return honeypot;
    }

    const honeypotContainer = createHoneypot();
    const honeypotInput = honeypotContainer.querySelector('input');

    // ========== KIỂM TRA HONEYPOT ==========
    function isHoneypotFilled() {
        return honeypotInput && honeypotInput.value.trim() !== '';
    }

    // ========== KIỂM TRA THỜI GIAN ==========
    function canSubmitByTime() {
        const now = Date.now();
        if (now - lastSubmitTime < MIN_SUBMIT_INTERVAL) {
            const waitSeconds = Math.ceil((MIN_SUBMIT_INTERVAL - (now - lastSubmitTime)) / 1000);
            return { allowed: false, reason: `Vui lòng đợi ${waitSeconds} giây nữa.` };
        }
        return { allowed: true };
    }

    // ========== KIỂM TRA TURNSTILE ==========
    function getTurnstileToken() {
        const tokenInput = document.querySelector('[name="cf-turnstile-response"]');
        return tokenInput ? tokenInput.value : null;
    }

    // ========== RESET TURNSTILE ==========
    function resetTurnstile() {
        if (typeof turnstile !== 'undefined' && turnstile.reset) {
            turnstile.reset();
        }
    }

    // ========== VALIDATE TẤT CẢ ==========
    function validateSubmission() {
        // 1. Kiểm tra đang submit chưa
        if (isSubmitting) {
            return { valid: false, reason: 'Đang xử lý, vui lòng đợi...' };
        }

        // 2. Kiểm tra honeypot
        if (isHoneypotFilled()) {
            console.warn('Honeypot triggered - likely a bot');
            return { valid: false, reason: 'Hành vi đáng ngờ bị phát hiện.' };
        }

        // 3. Kiểm tra thời gian
        const timeCheck = canSubmitByTime();
        if (!timeCheck.allowed) {
            return { valid: false, reason: timeCheck.reason };
        }

        // 4. Kiểm tra Turnstile
        const token = getTurnstileToken();
        if (!token) {
            return { valid: false, reason: 'Vui lòng xác nhận "Tôi không phải robot".' };
        }

        return { valid: true };
    }

    // ========== ĐÁNH DẤU BẮT ĐẦU SUBMIT ==========
    function startSubmission() {
        isSubmitting = true;
        lastSubmitTime = Date.now();
    }

    // ========== KẾT THÚC SUBMIT ==========
    function endSubmission(success = true) {
        isSubmitting = false;
        if (!success) {
            resetTurnstile();
        }
    }

    // ========== RESET TOÀN BỘ ==========
    function resetProtection() {
        isSubmitting = false;
        honeypotInput.value = '';
        resetTurnstile();
    }

    // ========== EXPORT API ==========
    window.NamFCProtection = {
        validate: validateSubmission,
        start: startSubmission,
        end: endSubmission,
        reset: resetProtection,
        getTurnstileToken: getTurnstileToken,
        resetTurnstile: resetTurnstile
    };

    console.log('Nam FC Online');
})();