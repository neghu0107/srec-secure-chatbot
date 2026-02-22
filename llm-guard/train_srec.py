import requests
from bs4 import BeautifulSoup
import os

URLS = [
    "https://www.srec.ac.in/",
    "https://www.srec.ac.in/about",
    "https://www.srec.ac.in/departments",
    "https://www.srec.ac.in/admission",
    "https://www.srec.ac.in/contact"
]

all_text = ""

for url in URLS:
    print("Scraping:", url)
    r = requests.get(url)
    soup = BeautifulSoup(r.text, "html.parser")

    page_text = soup.get_text()
    all_text += page_text + "\n"

os.makedirs("data", exist_ok=True)

with open("data/srec.txt", "w", encoding="utf-8") as f:
    f.write(all_text)

print("Saved data/srec.txt")
