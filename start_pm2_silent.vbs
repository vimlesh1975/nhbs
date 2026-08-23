Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd.exe /c npx pm2 start ecosystem.config.js && npx pm2 save", 0, False
