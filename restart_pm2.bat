@echo off
echo ========================================================
echo   NHBS Studio - Restarting PM2 Process
echo ========================================================
cd /d "%~dp0"
call npx pm2 restart nhbs-studio
call npx pm2 status
echo ========================================================
echo   NHBS Studio restarted.
echo ========================================================
pause
