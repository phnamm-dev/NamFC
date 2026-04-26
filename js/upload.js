(function () {
  'use strict';

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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = imageInput.files[0];
    if (!file) {
      statusDiv.className = 'status-message error';
      statusDiv.innerHTML = '❌ Chưa chọn ảnh!';
      return;
    }

    // Lấy Turnstile token
    const turnstileToken = window.turnstile?.getResponse?.();
    if (!turnstileToken) {
      statusDiv.className = 'status-message error';
      statusDiv.innerHTML = '⚠️ Vui lòng xác nhận captcha.';
      return;
    }

    statusDiv.className = 'status-message loading';
    statusDiv.innerHTML = '⏳ Đang tải ảnh và gửi...';
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ ĐANG XỬ LÝ...';

    try {
      const formData = new FormData();
      formData.append('name', document.getElementById('playerName').value);
      formData.append('position', document.getElementById('position').value);
      formData.append('nationality', document.getElementById('nationality').value);
      formData.append('club', document.getElementById('club').value);
      formData.append('season', document.getElementById('season').value);
      formData.append('turnstileToken', turnstileToken);
      formData.append('image', file);

      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Lỗi không xác định');
      }

      statusDiv.className = 'status-message success';
      statusDiv.innerHTML = '✅ Gửi thành công! Admin sẽ duyệt sớm.';
      form.reset();
      preview.style.display = 'none';
      submitBtn.innerHTML = '🎉 ĐÃ GỬI!';

      // Reset Turnstile widget
      window.turnstile?.reset?.();

    } catch (error) {
      statusDiv.className = 'status-message error';
      statusDiv.innerHTML = `❌ ${error.message}`;
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'SEND!!!';
      window.turnstile?.reset?.();
    }
  });

  // Version box
  const versionEl = document.getElementById('versionBox');
  if (versionEl) {
    fetch('js/version.json')
      .then(res => res.json())
      .then(data => { versionEl.textContent = `Version: ${data.version}`; })
      .catch(() => { versionEl.textContent = 'Version: 1.0.0'; });
  }
})();