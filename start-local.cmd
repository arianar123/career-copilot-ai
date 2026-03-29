@echo off
setlocal

set "ROOT=%~dp0"
set "BACKEND_DIR=%ROOT%backend"
set "FRONTEND_DIR=%ROOT%frontend"
set "FRONTEND_PORT=3100"
set "VENV_PYTHON=%BACKEND_DIR%\.venv\Scripts\python.exe"
set "OLLAMA_EXE=C:\Users\arees\AppData\Local\Programs\Ollama\ollama.exe"

if not exist "%VENV_PYTHON%" (
  echo Creating backend virtual environment...
  py -m venv "%BACKEND_DIR%\.venv"
  if errorlevel 1 (
    echo Failed to create the backend virtual environment.
    pause
    exit /b 1
  )
)

echo Checking backend dependencies...
"%VENV_PYTHON%" -c "import fastapi,uvicorn,sqlalchemy,pydantic,pypdf,docx" >nul 2>&1
if errorlevel 1 (
  echo Installing backend dependencies...
  "%VENV_PYTHON%" -m pip install -r "%BACKEND_DIR%\requirements.txt"
  if errorlevel 1 (
    echo Failed to install backend dependencies.
    pause
    exit /b 1
  )
)

curl -s http://127.0.0.1:11434/api/tags >nul 2>&1
if errorlevel 1 (
  if exist "%OLLAMA_EXE%" (
    echo Starting Ollama on http://127.0.0.1:11434
    start "Ollama" "%OLLAMA_EXE%" serve
    timeout /t 3 /nobreak >nul
  )
)

echo Starting CareerCopilot AI backend on http://127.0.0.1:8000
start "CareerCopilot Backend" cmd /k "cd /d ""%BACKEND_DIR%"" && ""%VENV_PYTHON%"" -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

echo Starting CareerCopilot AI frontend on http://127.0.0.1:%FRONTEND_PORT%
start "CareerCopilot Frontend" cmd /k "cd /d ""%FRONTEND_DIR%"" && npm.cmd run dev -- --hostname 127.0.0.1 --port %FRONTEND_PORT%"

echo.
echo Opening the app in your default browser...
timeout /t 4 /nobreak >nul
start "" "http://127.0.0.1:%FRONTEND_PORT%"

endlocal
