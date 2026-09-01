@echo off
setlocal
chcp 65001 >nul

set "SCRIPT_DIR=%~dp0"
if exist "%SCRIPT_DIR%package.json" (
  set "PROJECT_ROOT=%SCRIPT_DIR%"
) else (
  set "PROJECT_ROOT=%SCRIPT_DIR%..\"
)

if exist "%PROJECT_ROOT%runtime\node.exe" (
  set "NODE_BIN=%PROJECT_ROOT%runtime\node.exe"
) else (
  where node >nul 2>nul
  if errorlevel 1 (
    echo Node.js runtime is missing. / 缺少 Node.js 运行环境。
    echo Please download the Windows release package again.
    pause
    exit /b 1
  )
  set "NODE_BIN=node"
)

cd /d "%PROJECT_ROOT%"
"%NODE_BIN%" "%PROJECT_ROOT%src\export-interactive.mjs"
set "EXPORT_STATUS=%ERRORLEVEL%"

if not "%EXPORT_STATUS%"=="0" (
  echo Export failed; the error is shown above. / 导出失败，错误信息见上方。
)

echo.
pause
exit /b %EXPORT_STATUS%
