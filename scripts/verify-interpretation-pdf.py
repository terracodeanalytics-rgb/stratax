"""Verify a controlled report's last retained value is present in its printed PDF."""
import json
from pypdf import PdfReader

reader=PdfReader('.release/interpretation-buttons-20261108/report-full-rows.pdf')
text=' '.join(page.extract_text() for page in reader.pages)
print(json.dumps(dict(pages=len(reader.pages),lastValue='5000.666666666667' in text)))
