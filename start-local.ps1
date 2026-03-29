$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $root "backend"
$frontendDir = Join-Path $root "frontend"
$frontendPort = 3100
$venvPython = Join-Path $backendDir ".venv\Scripts\python.exe"
$ollamaExe = "C:\Users\arees\AppData\Local\Programs\Ollama\ollama.exe"

if (-not (Test-Path $venvPython)) {
  Write-Host "Creating backend virtual environment..."
  py -m venv (Join-Path $backendDir ".venv")
}

Write-Host "Checking backend dependencies..."
& $venvPython -c "import fastapi,uvicorn,sqlalchemy,pydantic,pypdf,docx" 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Installing backend dependencies..."
  & $venvPython -m pip install -r (Join-Path $backendDir "requirements.txt")
}

$ollamaHealthy = $false
try {
  $null = Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:11434/api/tags" -TimeoutSec 3
  $ollamaHealthy = $true
} catch {
  $ollamaHealthy = $false
}

if (-not $ollamaHealthy -and (Test-Path $ollamaExe)) {
  Write-Host "Starting Ollama on http://127.0.0.1:11434"
  Start-Process $ollamaExe -ArgumentList "serve" | Out-Null
  Start-Sleep -Seconds 3
}

Write-Host "Starting CareerCopilot AI backend on http://127.0.0.1:8000"
Start-Process $venvPython `
  -ArgumentList "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000" `
  -WorkingDirectory $backendDir | Out-Null

Write-Host "Starting CareerCopilot AI frontend on http://127.0.0.1:$frontendPort"
Start-Process cmd `
  -ArgumentList "/c", "npm.cmd run dev -- --hostname 127.0.0.1 --port $frontendPort" `
  -WorkingDirectory $frontendDir | Out-Null

Write-Host ""
Write-Host "Opening the app in your default browser..."
Start-Sleep -Seconds 3
Start-Process "http://127.0.0.1:$frontendPort"
