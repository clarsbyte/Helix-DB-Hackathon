import requests

get = requests.get(
      "http://localhost:8000/pdfs"
    )

print(get.json())