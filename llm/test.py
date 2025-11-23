import requests

pdf1 = requests.post(
        "http://localhost:8000/process-pdf/",
        json={"pdf_path": "vectors.pdf"}
)

get = requests.get(
      "http://localhost:8000/pdfs"
    )

print(pdf1.json())
print(get.json())