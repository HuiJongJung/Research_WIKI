# rules-deck.md → 스킬 사본 동기화
# 위키 사본의 frontmatter를 떼어내고 seminar-deck-draft 스킬이 읽는 rules.md로 덮어쓴다.
# 사용법:  powershell -ExecutionPolicy Bypass -File tools\sync-rules.ps1

$repo = Split-Path -Parent $PSScriptRoot
$src  = Join-Path $repo "wiki\system\rules-deck.md"
$dst  = Join-Path $env:USERPROFILE ".claude\skills\seminar-deck-draft\references\rules.md"

if (-not (Test-Path $src)) { Write-Host "원본 없음: $src" -ForegroundColor Red; exit 1 }
if (-not (Test-Path (Split-Path -Parent $dst))) { Write-Host "스킬 폴더 없음: $dst" -ForegroundColor Red; exit 1 }

$text = [System.IO.File]::ReadAllText($src)
# -split 의 3번째 인자가 "최대 조각 수". [regex]::Split 은 그 자리가 옵션이라 쓰면 안 된다.
$parts = $text -split "(?m)^---?
", 3
if ($parts.Count -lt 3) { Write-Host "frontmatter를 찾지 못함" -ForegroundColor Red; exit 1 }
$body = $parts[2]   # awk 판과 결과를 일치시키기 위해 선행 빈 줄을 남긴다

[System.IO.File]::WriteAllText($dst, $body, (New-Object System.Text.UTF8Encoding $false))
$n = ($body -split "`n").Count
Write-Host "동기화 완료: $n 줄 -> $dst" -ForegroundColor Green
