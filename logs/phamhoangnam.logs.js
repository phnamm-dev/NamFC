(function () {
	"use strict";
	// ---------- DỮ LIỆU LOG (CHỈ CẦN SỬA Ở ĐÂY, KHÔNG CẦN ĐỘNG VÀO HTML) ----------
	const logDatabase = [
	{
		version: "v2026.04.21",
		snapshotTag: "SNAPSHOT 0",
		snapshotIcon: "fa-camera",
		date: "2026-04-21",
		changes: [{
			icon: "fa-plus-circle",
			iconColor: "#7c3aed",
			strong: "Cập nhật tính năng đăng thông tin",
			desc: "— Giờ đây Nam FC Online đã có hệ thống để bạn đăng thông tin để bạn trở thành cầu thủ mà không cần liên hệ trực tiếp.",
			mock: "mới"
		}, {
			icon: "fa-warning",
			iconColor: "#ff0000",
			strong: "Chưa gỡ Thẻ UCL Dreamchasers ST Nhu Y",
			desc: "— Hiện chưa có người chơi mới để thay thể."
		}],
		author: "Nam",
		time: "21:07" // nếu để trống sẽ tự lấy giờ hiện tại
	}, {
		version: "v2026.04.20",
		snapshotTag: "SNAPSHOT 1",
		snapshotIcon: "fa-camera",
		date: "2026-04-20",
		changes: [{
			icon: "fa-plus-circle",
			iconColor: "#7c3aed",
			strong: "Thêm thẻ A Nation's Story",
			desc: "Bồ Đào Nha giá 5.000.000 NCoins.",
			mock: "mới"
		}, {
			icon: "fa-circle-check",
			strong: "C. Ronaldo",
			desc: "— ST 117, Al Nassr."
		}, {
			icon: "fa-circle-check",
			strong: "Cong Khoi",
			desc: "— CDM 116, Manchester United."
		}],
		author: "Nam",
		time: "22:07" // nếu để trống sẽ tự lấy giờ hiện tại
	}, {
		version: "v2026.04.20",
		snapshotTag: "SNAPSHOT 0",
		snapshotIcon: "fa-camera",
		date: "2026-04-20",
		changes: [{
			icon: "fa-circle-check",
			strong: "Fix lỗi logo đội bóng",
			desc: "— đã sửa hiển thị logo đội bóng trên tất cả thiết bị, tối ưu cho mobile.",
			mock: "mới"
		}, {
			icon: "fa-circle-check",
			strong: "Tối ưu thông tin phiên bản",
			desc: "— phiên bản sẽ được đánh số bằng ngày, tháng cập nhật.",
			mock: "mới"
		}, {
			icon: "fa-arrow-down",
			iconColor: "#ff0000",
			strong: "Thẻ UCL Dreamchasers ST Nhu Y",
			desc: "dự kiến sẽ gỡ bỏ vào bản cập nhật sau vì chưa có sự đồng ý từ người trong thẻ."
		}],
		author: "Nam",
		time: "19:47"
	}, {
		version: "v2026.04.20",
		snapshotTag: "RA MẮT TÍNH NĂNG LOGS",
		snapshotIcon: "fa-camera-retro",
		date: "2026-04-20",
		changes: [{
			icon: "fa-plus-circle",
			iconColor: "#7c3aed",
			strong: "Khởi tạo hệ thống log",
			desc: "— nền tảng ghi nhận cập nhật theo thời gian thực."
		}, {
			icon: "fa-paint-brush",
			iconColor: "#d946ef",
			desc: "Làm mới giao diện — áp dụng ngôn ngữ thiết kế hiện đại, tối ưu trải nghiệm."
		}, {
			icon: "fa-shield",
			iconColor: "#f97316",
			desc: "Cải thiện bảo mật & hiệu năng tải trang."
		}],
		author: "Nam",
		time: "" // để trống -> tự động lấy giờ hiện tại
	}];
	// ---------- HÀM TIỆN ÍCH ----------
	function formatDate(dateInput) {
		if (!dateInput) {
			// nếu không có date, lấy ngày hiện tại
			const today = new Date();
			const day = today.getDate();
			const month = today.getMonth() + 1;
			const year = today.getFullYear();
			return `${day} Tháng ${month}, ${year}`;
		}
		// nếu là chuỗi YYYY-MM-DD
		if (typeof dateInput === 'string' && dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
			const [y, m, d] = dateInput.split('-');
			const monthNames = ['', 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
			return `${parseInt(d)} ${monthNames[parseInt(m)]}, ${y}`;
		}
		return dateInput; // fallback
	}

	function getCurrentTime() {
		const d = new Date();
		return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
	}
	// Cập nhật hiển thị tháng/năm trên header (tự động)
	function updateMonthDisplay() {
		const monthDisplay = document.getElementById('monthDisplay');
		if (monthDisplay) {
			const now = new Date();
			const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
			monthDisplay.textContent = `${monthNames[now.getMonth()]} năm ${now.getFullYear()}`;
		}
	}
	// ---------- RENDER LOG TỪ DATABASE ----------
	function renderLogs() {
		const container = document.getElementById('dynamicLogContainer');
		if (!container) return;
		let htmlString = '';
		logDatabase.forEach(entry => {
			// Xử lý ngày tháng
			const displayDate = formatDate(entry.date);
			// Xử lý giờ đăng
			let displayTime = entry.time;
			if (!displayTime || displayTime.trim() === '') {
				displayTime = getCurrentTime();
			}
			// Xây dựng danh sách thay đổi
			let changesHtml = '';
			entry.changes.forEach(change => {
				const iconStyle = change.iconColor ? `style="color: ${change.iconColor};"` : '';
				const strongText = change.strong ? `<strong>${change.strong}</strong>` : '';
				const descText = change.desc ? ` ${change.desc}` : '';
				const mockBadge = change.mock ? `<span class="mock-label">${change.mock}</span>` : '';
				changesHtml += `
			          <li>
			            <i class="fas ${change.icon} list-icon" ${iconStyle}></i>
			            <span class="change-desc">${strongText}${descText}${mockBadge}</span>
			          </li>
			        `;
			});
			// Icon snapshot mặc định nếu không có
			const snapIcon = entry.snapshotIcon || 'fa-camera';
			// Tạo card
			htmlString += `
			        <div class="update-card">
			          <div class="card-header">
			            <div class="version-badge">
			              <span class="version-number">${entry.version}</span>
			              <span class="snapshot-tag"><i class="fas ${snapIcon}"></i> ${entry.snapshotTag}</span>
			            </div>
			            <div class="date-chip">
			              <i class="far fa-calendar-alt"></i> ${displayDate}
			              <i class="fas fa-circle" style="font-size: 6px; color: #22c55e; margin-left: 6px;"></i>
			            </div>
			          </div>
			          <ul class="changes-list">
			            ${changesHtml}
			          </ul>
			          <div style="margin-top: 12px; font-size: 0.8rem; color: #64748b; display: flex; gap: 16px;">
			            <span><i class="far fa-check-circle" style="color: #059669;"></i> Đăng bởi ${entry.author || 'Nam'}</span>
			            <span><i class="far fa-clock"></i> Lúc ${displayTime}</span>
			          </div>
			        </div>
			      `;
		});
		container.innerHTML = htmlString;
	}
	// ---------- KHỞI TẠO ----------
	function init() {
		renderLogs();
		updateMonthDisplay();
		// Gắn sự kiện cho nút "Thêm bản cập nhật mới"
		const addBtn = document.getElementById('addNewLogBtn');
		if (addBtn) {
			addBtn.addEventListener('click', addNewDemoLog);
		}
	}
	// Chạy khi DOM sẵn sàng
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();