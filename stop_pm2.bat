@echo off
echo ========================================================
echo   NHBS Studio - Stopping PM2 Process
echo ========================================================
cd /d "%~dp0"
call npx pm2 stop nhbs-studio
call npx pm2 delete nhbs-studio
call npx pm2 save
echo ========================================================
echo   NHBS Studio has been stopped.
echo ========================================================
pause
