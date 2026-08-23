Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd.exe /c npx pm2 restart nhbs-studio", 0, False
