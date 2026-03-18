$ErrorActionPreference = "Stop"

function Write-Pass($message) {
  Write-Host "[PASS] $message" -ForegroundColor Green
}

function Write-Fail($message) {
  Write-Host "[FAIL] $message" -ForegroundColor Red
}

function Assert-Exists($path, $label) {
  if (Test-Path $path) {
    Write-Pass "$label exists"
    return $true
  }

  Write-Fail "$label missing: $path"
  return $false
}

function Assert-NotExists($path, $label) {
  if (Test-Path $path) {
    Write-Fail "$label should not exist: $path"
    return $false
  }

  Write-Pass "$label not found"
  return $true
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $root

$ok = $true
Write-Host "Sweety QA Check Start" -ForegroundColor Cyan

$ok = (Assert-Exists ".\\index.html" "Splash page") -and $ok
$ok = (Assert-Exists ".\\home-screen.html" "Home page") -and $ok
$ok = (Assert-Exists ".\\assets\\css\\main.css" "Main CSS") -and $ok
$ok = (Assert-Exists ".\\assets\\js\\main.js" "Splash JS") -and $ok
$ok = (Assert-Exists ".\\assets\\js\\home-screen.js" "Home JS") -and $ok
$ok = (Assert-Exists ".\\assets\\image\\logo.svg" "Logo SVG") -and $ok

$ok = (Assert-NotExists ".\\hoem-screen.html" "Typo HTML file") -and $ok
$ok = (Assert-NotExists ".\\assets\\js\\hoem-screen.js" "Typo JS file") -and $ok
$ok = (Assert-NotExists ".\\assets\\css\\hoem-screen.css" "Typo CSS file") -and $ok

Write-Host "Checking required references..." -ForegroundColor Cyan
$homeHtml = Get-Content ".\\home-screen.html" -Raw
if ($homeHtml -match "assets/css/main.css") { Write-Pass "home-screen uses main.css" } else { Write-Fail "home-screen does not reference assets/css/main.css"; $ok = $false }
if ($homeHtml -match "assets/js/home-screen.js") { Write-Pass "home-screen uses home-screen.js" } else { Write-Fail "home-screen does not reference assets/js/home-screen.js"; $ok = $false }

$indexHtml = Get-Content ".\\index.html" -Raw
if ($indexHtml -match "assets/css/main.css") { Write-Pass "index uses main.css" } else { Write-Fail "index does not reference assets/css/main.css"; $ok = $false }
if ($indexHtml -match "assets/js/main.js") { Write-Pass "index uses main.js" } else { Write-Fail "index does not reference assets/js/main.js"; $ok = $false }

$mainCss = Get-Content ".\\assets\\css\\main.css" -Raw
if ($mainCss -match "safe-area-inset-top" -and $mainCss -match "safe-area-inset-bottom") {
  Write-Pass "safe-area rules found"
} else {
  Write-Fail "safe-area rules missing in main.css"
  $ok = $false
}

Write-Host "Checking local server response..." -ForegroundColor Cyan
try {
  $indexRes = Invoke-WebRequest -Uri "http://localhost:5500/index.html" -UseBasicParsing -TimeoutSec 2
  if ($indexRes.StatusCode -eq 200) { Write-Pass "index.html served (200)" } else { Write-Fail "index.html status: $($indexRes.StatusCode)"; $ok = $false }

  $homeRes = Invoke-WebRequest -Uri "http://localhost:5500/home-screen.html" -UseBasicParsing -TimeoutSec 2
  if ($homeRes.StatusCode -eq 200) { Write-Pass "home-screen.html served (200)" } else { Write-Fail "home-screen.html status: $($homeRes.StatusCode)"; $ok = $false }
}
catch {
  Write-Fail "Local server check failed. Run: node server.js"
  $ok = $false
}

if ($ok) {
  Write-Host "\nQA CHECK: SUCCESS" -ForegroundColor Green
  Pop-Location
  exit 0
}

Write-Host "\nQA CHECK: FAILED" -ForegroundColor Red
Pop-Location
exit 1
