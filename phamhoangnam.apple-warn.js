/**
 * safari-warning.js
 * Cảnh báo người dùng Safari về khả năng tương thích và khuyến khích chuyển trình duyệt.
 * Phong cách thể thao Nam FC Online (vàng-đen-xanh).
 * Nhúng: <script src="safari-warning.js"></script> vào cuối body index.html
 */
(function() {
    'use strict';

    // ---------- PHÁT HIỆN SAFARI ----------
    function isSafari() {
        const ua = navigator.userAgent;
        // Safari trên desktop và mobile (iOS), loại trừ Chrome, Edge, Opera, CriOS (Chrome iOS), FxiOS (Firefox iOS)
        const isSafariUA = /^((?!chrome|android|crios|fxios|edg|opr|opera).)*safari/i.test(ua);
        // Kiểm tra thêm: Safari thường có 'AppleWebKit' và không có 'Chrome'
        const isWebKit = /AppleWebKit/.test(ua);
        const isChrome = /Chrome/i.test(ua);
        const isEdge = /Edg/i.test(ua);
        const isOpera = /OPR/i.test(ua);
        const isFirefox = /Firefox/i.test(ua);
        
        // Loại trừ rõ ràng các trình duyệt không phải Safari
        if (isChrome || isEdge || isOpera || isFirefox) return false;
        
        // Nếu là WebKit và có Safari trong UA (không phải Chrome, Edge...) thì coi là Safari
        return isWebKit && /Safari/i.test(ua) && !isChrome;
    }

    // Nếu không phải Safari thì không làm gì cả
    if (!isSafari()) return;

    // ---------- KIỂM TRA LOCALSTORAGE ĐÃ ĐÓNG POPUP CHƯA ----------
    const STORAGE_KEY = 'namfc_safari_warning_closed';
    if (localStorage.getItem(STORAGE_KEY)) return;

    // ---------- CSS ĐỘNG ----------
    const style = document.createElement('style');
    style.textContent = `
        /* Overlay tối */
        .namfc-safari-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            animation: namfcSafariFadeIn 0.3s ease-out;
            font-family: 'Segoe UI', 'Exo 2', Arial, sans-serif;
        }

        /* Hộp thoại chính */
        .namfc-safari-dialog {
            background: linear-gradient(135deg, #0a2f1a 0%, #0d3d1e 100%);
            border: 3px solid #FFD700;
            border-radius: 24px;
            padding: 28px 24px 22px;
            max-width: 440px;
            width: 100%;
            color: white;
            box-shadow: 
                0 12px 0 #6b4f0a, 
                0 15px 30px rgba(0,0,0,0.7), 
                inset 0 2px 0 rgba(255,255,255,0.2),
                0 0 30px rgba(255,215,0,0.4);
            text-align: center;
            position: relative;
            animation: namfcSafariScaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            transform-origin: center;
        }

        /* Icon cảnh báo */
        .namfc-safari-icon {
            font-size: 3rem;
            margin-bottom: 10px;
            filter: drop-shadow(0 4px 6px black);
            display: block;
        }

        /* Tiêu đề */
        .namfc-safari-title {
            font-size: 1.6rem;
            font-weight: 900;
            text-transform: uppercase;
            color: #FFD700;
            margin: 0 0 12px;
            letter-spacing: 1px;
            text-shadow: 2px 2px 0 #000, 0 0 15px #FFA500;
            line-height: 1.3;
        }

        /* Nội dung */
        .namfc-safari-message {
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 22px;
            color: #e0e0e0;
            padding: 0 5px;
            font-weight: 500;
        }

        .namfc-safari-message strong {
            color: #FFD700;
        }

        /* Nhóm nút */
        .namfc-safari-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 14px;
            justify-content: center;
        }

        /* Nút chung */
        .namfc-safari-btn {
            display: inline-block;
            border: none;
            padding: 12px 22px;
            border-radius: 50px;
            font-weight: 900;
            font-size: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            cursor: pointer;
            transition: all 0.12s ease;
            box-shadow: 0 6px 0 rgba(0,0,0,0.4);
            text-decoration: none;
            min-width: 130px;
            text-align: center;
            outline: none;
            border: 1px solid rgba(255,255,255,0.2);
        }

        /* Nút Đã hiểu */
        .namfc-safari-btn.understand {
            background: linear-gradient(180deg, #FFD700 0%, #FFA500 100%);
            color: #0a2f1a;
            box-shadow: 
                0 6px 0 #8B6914,
                0 6px 12px rgba(0,0,0,0.5),
                inset 0 2px 0 rgba(255,255,255,0.8);
            border: 1px solid #FFE066;
        }

        .namfc-safari-btn.understand:hover {
            transform: translateY(3px);
            box-shadow: 
                0 3px 0 #8B6914,
                0 8px 15px rgba(0,0,0,0.5);
            background: linear-gradient(180deg, #FFE44D 0%, #FFB830 100%);
        }

        .namfc-safari-btn.understand:active {
            transform: translateY(6px);
            box-shadow: 0 0 0 #8B6914, 0 4px 10px rgba(0,0,0,0.5);
        }

        /* Nút Tải Chrome */
        .namfc-safari-btn.download {
            background: linear-gradient(180deg, #4CAF50 0%, #2E7D32 100%);
            color: white;
            box-shadow: 0 6px 0 #1B5E20, 0 6px 12px rgba(0,0,0,0.5);
            border: 1px solid #81C784;
        }

        .namfc-safari-btn.download:hover {
            transform: translateY(3px);
            background: linear-gradient(180deg, #66BB6A 0%, #388E3C 100%);
        }

        .namfc-safari-btn.download:active {
            transform: translateY(6px);
            box-shadow: 0 0 0 #1B5E20;
        }

        /* Animation */
        @keyframes namfcSafariFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes namfcSafariScaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        /* Responsive */
        @media (max-width: 480px) {
            .namfc-safari-dialog {
                padding: 22px 16px 18px;
                border-radius: 20px;
            }
            .namfc-safari-title {
                font-size: 1.3rem;
            }
            .namfc-safari-message {
                font-size: 0.85rem;
            }
            .namfc-safari-btn {
                padding: 10px 16px;
                font-size: 0.9rem;
                min-width: 110px;
            }
        }
    `;
    document.head.appendChild(style);

    // ---------- HTML POPUP ----------
    const overlay = document.createElement('div');
    overlay.className = 'namfc-safari-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'namfc-safari-title');

    overlay.innerHTML = `
        <div class="namfc-safari-dialog">
            <span class="namfc-safari-icon">⚠️</span>
            <h2 class="namfc-safari-title" id="namfc-safari-title">Trình duyệt không được khuyến nghị</h2>
            <p class="namfc-safari-message">
                Chúng tôi <strong>không khuyên dùng</strong> các trình duyệt của Apple như <strong>Safari</strong>.
                Trình duyệt này chống Bypass về <strong>âm thanh rất nghiêm ngặt</strong>, hiện tại Nam FC Online chưa hoàn toàn hỗ trợ Safari.
                <br>Vui lòng chuyển sang <strong>Chrome, Edge, Firefox</strong> hoặc trình duyệt khác, tốt nhất là trình duyệt Android để có trải nghiệm tốt nhất.
            </p>
            <div class="namfc-safari-buttons">
                <button class="namfc-safari-btn understand" id="namfcSafariUnderstand">Đã hiểu</button>
                <a href="https://www.google.com/chrome/" target="_blank" rel="noopener noreferrer" class="namfc-safari-btn download">⬇️ Tải Chrome</a>
            </div>
        </div>
    `;

    // ---------- GẮN VÀO BODY ----------
    document.body.appendChild(overlay);

    // ---------- XỬ LÝ SỰ KIỆN ----------
    function closePopup(remember = true) {
        if (remember) {
            try {
                localStorage.setItem(STORAGE_KEY, '1');
            } catch (e) {
                // localStorage không khả dụng
            }
        }
        // Animation fade out rồi remove
        overlay.style.transition = 'opacity 0.2s';
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 250);
    }

    // Nút "Đã hiểu"
    const understandBtn = overlay.querySelector('#namfcSafariUnderstand');
    understandBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closePopup(true);
    });

    // Click ra ngoài overlay (vùng tối) cũng đóng (có lưu)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closePopup(true);
        }
    });

    // Phím Escape để đóng (có lưu)
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closePopup(true);
            document.removeEventListener('keydown', escHandler);
        }
    });

    // Nút Tải Chrome không đóng popup, để người dùng tự quyết định
    // Nhưng khi click link thì vẫn để popup đó, không ảnh hưởng.

})();