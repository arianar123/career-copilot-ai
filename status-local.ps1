$ports = @(3100, 8000, 11434)

foreach ($port in $ports) {
  $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
    Select-Object -First 1

  if ($null -ne $connection) {
    Write-Host "Port $port is listening (PID $($connection.OwningProcess))"
  } else {
    Write-Host "Port $port is not listening"
  }
}
