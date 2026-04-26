#!/usr/bin/env python3
"""
Nam FC Online - Security Tester (dành cho chủ sở hữu)
Kiểm tra các lớp bảo vệ: Turnstile, Rate Limit, File Upload Validation
"""
import requests
import time
import random
from colorama import Fore, Style, init

init(autoreset=True)

# Cấu hình
BASE_URL = "https://your-domain.vercel.app"  # Thay bằng domain thật của bạn
API_SUBMIT = f"{BASE_URL}/api/submit"
HEALTH_URL = f"{BASE_URL}/api/health"

# Dữ liệu test hợp lệ
VALID_DATA = {
    "name": "Security Test",
    "position": "ST",
    "nationality": "VN",
    "club": "Test Club",
    "season": "Legend"
}

# Token Turnstile giả (lấy từ trình duyệt sau khi giải captcha một lần, hoặc để trống)
# Bạn có thể lấy token thật bằng cách inspect form khi đã pass captcha và copy.
# Nếu không có token thật, script vẫn test được các trường hợp token sai.
REAL_TURNSTILE_TOKEN = "1.FADkZlX1wmqadd8UaANv5yeB1Hnn_edfNOWL9dvl8JH0tJMr9JSly4AL3u_52U5unNHZmKMjDDncjoectvvUIqVt1gVlIEoYxtS2-cwPqxThZ_NCHFm82zjweVlHoMlWwShdEY9JgGGX6tx-Nr1U1jvhgldm3hQigz4MK6T5wrK-3wrRjjtt7liPUsCqvPeuTHLwSloLhDTkUdSBWYyPPfSjpi_r6tqy4gpLYtD8aAeXZgYB7A7tv53kxSb3L3qwWb-YQ-_YxrmZkXw6MulbS4J-9yjmFfJkJrEzbyZuXg2l7b8PH2rKxKgfaJnsDoAOOP8if8tjDgWVsNUhkZuEdEwvdUZqekG9zMmvPiQj1WqMlDhJCS1rlSDuDiaxpSvE7VzL7wRlZ8N6Do6iP3uXxZGm1LlDuzAVRZz9m2l1ct6Xz-L9Doi28jVD5sh-dcTXxBeKZRQoOHctO_D_FRMQuWWxjCxusFn9Dx_fkNdly53IbGhKVf1RAFNNKc79SREowhShyEK-KhGLJj-iJGKzGFztc-F78pH1LyOtlsskFdHRTJD-JKS4Cm0eRvpzIWj-b8pk2Q7YEu4mDgxNnziNcJEH43YdgPhg9kfRpx2v8c3ApQmi8zHRdmBWcjZGyBci8rRByToqq3hRqRa6Bhku346UPNdzVJyOQm_9_7jIz7MXl86wgWJW-dePQMyBzx6R.Mu6X69V66b8VXyZj5sET5A.895a625a49a3ad8383e0d9ccc50946b3f774348603b7b2a9e5cf3c93ef0cb074"  # Nếu có, test rate limit với token thật. Nếu không thì để trống.

# ========================
# 1. Test Health Check
# ========================
def test_health():
    print(Fore.CYAN + "[*] Kiểm tra /api/health...")
    try:
        r = requests.get(HEALTH_URL, timeout=10)
        data = r.json()
        print(Fore.GREEN + f"   -> Status: {r.status_code}")
        print(f"   -> Env vars: {data.get('customVars', 'N/A')}")
        if all(v == "✅" for v in data.get("customVars", {}).values()):
            print(Fore.GREEN + "   => Tất cả biến môi trường OK.")
        else:
            print(Fore.YELLOW + "   => Thiếu biến, kiểm tra lại cấu hình.")
    except Exception as e:
        print(Fore.RED + f"   [FAIL] {e}")

# ========================
# 2. Test Turnstile (token sai / thiếu)
# ========================
def test_turnstile_missing():
    print(Fore.CYAN + "\n[*] Test Turnstile: thiếu token hoàn toàn...")
    files = {"image": ("test.jpg", b"fake image data", "image/jpeg")}
    data = VALID_DATA.copy()
    # Không gửi turnstileToken
    try:
        r = requests.post(API_SUBMIT, data=data, files=files, timeout=15)
        print(f"   -> Status: {r.status_code}, Response: {r.text[:200]}")
        if r.status_code == 400 and "captcha" in r.text.lower():
            print(Fore.GREEN + "   => Đã chặn thiếu captcha => OK.")
        else:
            print(Fore.RED + "   => Cần kiểm tra lại, server không từ chối.")
    except Exception as e:
        print(Fore.RED + f"   [FAIL] {e}")

def test_turnstile_fake():
    print(Fore.CYAN + "\n[*] Test Turnstile: token rác...")
    files = {"image": ("test.jpg", b"fake image data", "image/jpeg")}
    data = VALID_DATA.copy()
    data["turnstileToken"] = "FAKE_TOKEN_12345"
    try:
        r = requests.post(API_SUBMIT, data=data, files=files, timeout=15)
        print(f"   -> Status: {r.status_code}, Response: {r.text[:200]}")
        if r.status_code == 400 and "captcha" in r.text.lower():
            print(Fore.GREEN + "   => Đã phát hiện token giả => OK.")
        else:
            print(Fore.RED + "   => Có thể Turnstile verify chưa hoạt động.")
    except Exception as e:
        print(Fore.RED + f"   [FAIL] {e}")

# ========================
# 3. Test Rate Limiting
# ========================
def test_rate_limit():
    print(Fore.CYAN + "\n[*] Test Rate Limit: gửi 5 request liên tiếp (dùng token thật nếu có)...")
    if not REAL_TURNSTILE_TOKEN or REAL_TURNSTILE_TOKEN == "your-real-token-here":
        print(Fore.YELLOW + "   -> Không có token thật, sẽ test với token rác (vẫn bị chặn bởi captcha).")
        print(Fore.YELLOW + "   -> Để test rate limit thực, hãy lấy token từ trình duyệt và đặt vào biến REAL_TURNSTILE_TOKEN.")
        return

    files = {"image": ("test.jpg", b"fake image data", "image/jpeg")}
    data = VALID_DATA.copy()
    data["turnstileToken"] = REAL_TURNSTILE_TOKEN

    for i in range(5):
        try:
            r = requests.post(API_SUBMIT, data=data, files=files, timeout=15)
            print(f"   Request #{i+1}: Status {r.status_code} - {r.text[:100]}")
            if r.status_code == 429:
                print(Fore.GREEN + "   => Đã bị giới hạn (429) sau vài lần => Rate limit hoạt động.")
                return
            time.sleep(0.3)  # nhanh để kích hoạt rate limit
        except Exception as e:
            print(Fore.RED + f"   [FAIL] {e}")
            return
    print(Fore.RED + "   => Không nhận được 429 sau 5 request, rate limit có thể chưa hoạt động.")

# ========================
# 4. Test File Upload Validation (upload file không phải ảnh)
# ========================
def test_file_upload_malicious():
    print(Fore.CYAN + "\n[*] Test File Upload: upload file .php giả mạo...")
    php_code = b"<?php echo 'shell'; ?>"
    files = {"image": ("shell.php", php_code, "application/x-php")}
    data = VALID_DATA.copy()
    data["turnstileToken"] = REAL_TURNSTILE_TOKEN if REAL_TURNSTILE_TOKEN else "FAKE"

    try:
        r = requests.post(API_SUBMIT, data=data, files=files, timeout=15)
        print(f"   -> Status: {r.status_code}, Response: {r.text[:200]}")
        # Nếu thành công (200) là nguy hiểm vì chấp nhận file .php
        if r.status_code == 200:
            print(Fore.RED + "   => Server đã upload file PHP! Lỗ hổng nghiêm trọng. Cần validate file type.")
        elif r.status_code == 500:
            print(Fore.YELLOW + "   => Server lỗi (có thể do không xử lý được file lạ). Cần bắt lỗi và từ chối rõ ràng.")
        elif r.status_code == 400:
            print(Fore.GREEN + "   => Server từ chối file độc hại => OK.")
        else:
            print(Fore.YELLOW + "   => Hành vi không rõ ràng, kiểm tra thêm.")
    except Exception as e:
        print(Fore.RED + f"   [FAIL] {e}")

def test_file_upload_exe():
    print(Fore.CYAN + "\n[*] Test File Upload: upload file .exe...")
    exe_data = b"MZ\x90\x00\x03..."  # header giả
    files = {"image": ("virus.exe", exe_data, "application/x-msdownload")}
    data = VALID_DATA.copy()
    data["turnstileToken"] = REAL_TURNSTILE_TOKEN if REAL_TURNSTILE_TOKEN else "FAKE"

    try:
        r = requests.post(API_SUBMIT, data=data, files=files, timeout=15)
        print(f"   -> Status: {r.status_code}, Response: {r.text[:200]}")
        if r.status_code == 200:
            print(Fore.RED + "   => File .exe được upload! Nguy hiểm.")
        else:
            print(Fore.GREEN + "   => Từ chối hoặc lỗi => OK.")
    except Exception as e:
        print(Fore.RED + f"   [FAIL] {e}")

# ========================
# 5. Test X-Forwarded-For spoof (bypass rate limit IP)
# ========================
def test_ip_spoofer():
    print(Fore.CYAN + "\n[*] Test IP Spoof: giả mạo IP qua header X-Forwarded-For...")
    headers = {"X-Forwarded-For": "127.0.0.1"}
    files = {"image": ("test.jpg", b"data", "image/jpeg")}
    data = VALID_DATA.copy()
    data["turnstileToken"] = REAL_TURNSTILE_TOKEN if REAL_TURNSTILE_TOKEN else "FAKE"

    # Gửi thử 2 request với IP giả khác nhau
    for ip in ["1.2.3.4", "5.6.7.8"]:
        headers["X-Forwarded-For"] = ip
        try:
            r = requests.post(API_SUBMIT, data=data, files=files, headers=headers, timeout=15)
            print(f"   IP giả {ip}: Status {r.status_code} - {r.text[:100]}")
        except Exception as e:
            print(Fore.RED + f"   [FAIL] {e}")

    print(Fore.YELLOW + "   => Lưu ý: Vercel tự thay X-Forwarded-For bằng IP thật, nên không thể bypass. Nếu server vẫn nhận IP giả, rate limit sẽ vô hiệu.")

# ========================
# Main
# ========================
if __name__ == "__main__":
    print(Fore.MAGENTA + Style.BRIGHT + "\n=== NAM FC SECURITY TESTER ===")
    print(Fore.WHITE + f"Target: {BASE_URL}\n")

    test_health()
    test_turnstile_missing()
    test_turnstile_fake()
    test_rate_limit()
    test_file_upload_malicious()
    test_file_upload_exe()
    test_ip_spoofer()

    print(Fore.MAGENTA + "\n=== HOÀN TẤT ===")
    print(Fore.WHITE + "Nếu tất cả đều OK, server của bạn đã an toàn trước các kiểu tấn công phổ biến.")
    print(Fore.WHITE + "Hãy kiểm tra từng kết quả và cải thiện những điểm chưa đạt.\n")