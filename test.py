import requests
import time

URL = "https://mirxuscvrddxbsenoklz.supabase.co/rest/v1/submissions"

HEADERS = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pcnh1c2N2cmRkeGJzZW5va2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NjcyNDEsImV4cCI6MjA5MjM0MzI0MX0.znSP9exUZOr8fxHw57EdGPWvSBzzYZx2e0qw4lZItQk",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pcnh1c2N2cmRkeGJzZW5va2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NjcyNDEsImV4cCI6MjA5MjM0MzI0MX0.znSP9exUZOr8fxHw57EdGPWvSBzzYZx2e0qw4lZItQk",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

data = {
    "name": "tinysweet",
    "position": "FW",
    "nationality": "VN",
    "club": "hentai",
    "season": "2026",
    "image_url": "https://mirxuscvrddxbsenoklz.supabase.co/storage/v1/object/player-images/1777188387165_9bf29f0801cf9751c6bdc0d66a9da15d.jpg"
}
# ở đây spam bao nhiêu tùy thích
for i in range(10):
    res = requests.post(URL, json=data, headers=HEADERS)
    print(i, res.status_code, res.text) #status code là 201 tức là thành công
    time.sleep(1)  # ngủ đê