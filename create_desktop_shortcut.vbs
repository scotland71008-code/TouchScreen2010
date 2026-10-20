Set oWS = WScript.CreateObject("WScript.Shell")
strDesktopPath = oWS.SpecialFolders("Desktop")

Set oLink = oWS.CreateShortcut(strDesktopPath & "\Octave Platform.lnk")
oLink.TargetPath = "C:\Users\aibrahim\Documents\TouchScreen\START_OCTAVE.bat"
oLink.WorkingDirectory = "C:\Users\aibrahim\Documents\TouchScreen"
oLink.Description = "Launch Octave Enterprise Platform"
oLink.IconLocation = "C:\Users\aibrahim\Documents\TouchScreen\public\octave-logo-mark.svg"
oLink.Save

MsgBox "Desktop shortcut created! Look for 'Octave Platform' on your desktop.", vbInformation, "Success"
