@echo off
echo ========================================================
echo   NHBS Studio - Starting Dev Server via PM2
echo ========================================================
cd /d "%~dp0"

echo 1. Launching application in DEV mode with PM2...
call npx pm2 start ecosystem.config.js

echo 2. Saving PM2 process list...
call npx pm2 save

echo ========================================================
echo   NHBS Studio is now running in background (Dev Mode)!
echo   URL: http://localhost:22000
echo ========================================================
call npx pm2 status
pause
