import json
import os
from typing import Any
from urllib import error, request

from pydantic import BaseModel

from .service_errors import ExternalServiceError, ServiceConfigurationError


def _ollama_base_url() -> str:
    base_url = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434").strip()
    if not base_url:
        raise ServiceConfigurationError(
            "OLLAMA_BASE_URL is not configured. Set it to your Ollama server URL."
        )
    return base_url.rstrip("/")


def _ollama_model() -> str:
    model = os.getenv("OLLAMA_MODEL", "qwen3").strip()
    if not model:
        raise ServiceConfigurationError(
            "OLLAMA_MODEL is not configured. Set it to an installed Ollama model."
        )
    return model


def generate_structured_output(
    *,
    system_prompt: str,
    user_payload: dict[str, Any],
    schema_model: type[BaseModel],
) -> dict[str, Any]:
    body = {
        "model": _ollama_model(),
        "stream": False,
        "format": schema_model.model_json_schema(),
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": json.dumps(user_payload)},
        ],
        "options": {
            "temperature": 0.2,
        },
    }

    payload = json.dumps(body).encode("utf-8")
    req = request.Request(
        url=f"{_ollama_base_url()}/api/chat",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with request.urlopen(req, timeout=120) as response:
            raw = json.loads(response.read().decode("utf-8"))
    except error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore")
        raise ExternalServiceError(
            f"Ollama returned HTTP {exc.code}. {detail}".strip()
        ) from exc
    except error.URLError as exc:
        raise ExternalServiceError(
            "CareerCopilot could not reach the Ollama server. Make sure Ollama is running."
        ) from exc
    except TimeoutError as exc:
        raise ExternalServiceError(
            "Ollama took too long to respond."
        ) from exc

    message = raw.get("message", {})
    content = message.get("content", "").strip()
    if not content:
        raise ExternalServiceError("Ollama returned an empty response.")

    try:
        return json.loads(content)
    except json.JSONDecodeError as exc:
        raise ExternalServiceError(
            "Ollama returned a response that was not valid JSON."
        ) from exc
