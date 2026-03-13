$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $projectRoot "backend"
$frontendPath = Join-Path $projectRoot "frontend\slc-website"
$adminPath = Join-Path $projectRoot "admin-panel"

Write-Host "Starting backend on port 5010..."
Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "cd '$backendPath'; `$env:PORT='5010'; node server.js"
)

Write-Host "Starting frontend on port 3010..."
Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "cd '$frontendPath'; `$env:PORT='3010'; `$env:REACT_APP_API_URL='http://localhost:5010/api'; npm start"
)

Write-Host "Starting admin panel on port 8010..."
Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "cd '$adminPath'; `$env:PORT='8010'; `$env:REACT_APP_API_URL='http://localhost:5010/api'; npm start"
)

Write-Host "Done. Backend: http://localhost:5010 | Frontend: http://localhost:3010 | Admin: http://localhost:8010"