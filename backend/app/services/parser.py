from io import BytesIO
from pathlib import Path

from docx import Document
from pypdf import PdfReader


def _parse_pdf(content: bytes) -> str:
    reader = PdfReader(BytesIO(content))
    pages = [page.extract_text() or "" for page in reader.pages]
    return "\n".join(page.strip() for page in pages if page.strip()).strip()


def _parse_docx(content: bytes) -> str:
    document = Document(BytesIO(content))
    paragraphs = [paragraph.text.strip() for paragraph in document.paragraphs]
    return "\n".join(text for text in paragraphs if text).strip()


def _parse_plain_text(content: bytes) -> str:
    return content.decode("utf-8", errors="ignore").strip()


def extract_resume_text(filename: str, content: bytes, fallback_text: str = "") -> str:
    if fallback_text.strip():
        return fallback_text.strip()

    extension = Path(filename).suffix.lower()
    parsed_text = ""

    if extension == ".pdf":
        parsed_text = _parse_pdf(content)
    elif extension == ".docx":
        parsed_text = _parse_docx(content)
    elif extension in {".txt", ".md", ".rtf"}:
        parsed_text = _parse_plain_text(content)
    else:
        parsed_text = _parse_plain_text(content)

    if parsed_text:
        return parsed_text

    return (
        f"Could not extract text from {filename}. "
        "Upload a PDF, DOCX, or paste resume text as a fallback."
    )
