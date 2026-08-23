@echo off
echo ========================================================
echo   NHBS Studio - Starting Production Server via PM2
echo ========================================================
cd /d "%~dp0"

echo 1. Building Next.js production bundle...
call npm run build

echo 2. Launching application with PM2...
call npx pm2 start ecosystem.config.js

echo 3. Saving PM2 process list...
call npx pm2 save

echo ========================================================
echo   NHBS Studio is now running in background!
echo   URL: http://localhost:22000
echo ========================================================
call npx pm2 status
pause
