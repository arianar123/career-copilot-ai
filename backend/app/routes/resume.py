from fastapi import APIRouter, File, Form, UploadFile

from ..services.parser import extract_resume_text

router = APIRouter(prefix="/resume", tags=["resume"])


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    fallback_text: str = Form(default=""),
) -> dict[str, str]:
    content = await file.read()
    extracted_text = extract_resume_text(file.filename or "", content, fallback_text)
    return {
        "file_name": file.filename or "resume",
        "extracted_text": extracted_text,
        "characters": str(len(extracted_text)),
    }
