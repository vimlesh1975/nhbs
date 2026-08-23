Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd.exe /c npx pm2 stop nhbs-studio && npx pm2 delete nhbs-studio && npx pm2 save", 0, False
