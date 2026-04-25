@echo off
echo Starting AppGesApp...

:: Start Backend
start "Backend - Laravel" /d "%~dp0backend" php artisan serve

:: Start Frontend
start "Frontend - React" /d "%~dp0frontend" npm run dev

:: Wait for servers to initialize
timeout /t 5 /nobreak > nul

:: Open Browser
start http://localhost:5173

echo Application is running!
pause
