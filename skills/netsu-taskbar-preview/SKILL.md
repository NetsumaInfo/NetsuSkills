---
name: netsu-taskbar-preview
description: Use when the user wants to see an application icon for real — in the actual Windows taskbar, as if the app were installed and running — to check it is readable and recognisable among their other apps, compare several versions, or check its transparency. Opens one real, empty Windows window per icon, with that icon. Do NOT use for designing or redrawing the icon (netsu-app-icon), animating it (netsu-icon-motion), exporting the final .ico/.icns files of an app, or on macOS and Linux.
---

# NetsuTaskbarPreview

Put the icon where people meet it: the real taskbar, at the size Windows draws it, beside the
user's own apps. No mock-up page.

## Requirements

- Windows, with Windows PowerShell 5 (`powershell`). Stop and say so on another system.
- A transparent PNG per icon, 256 px or more: the mark alone, no background square.

## Procedure

1. **One window per icon.** For each, start the script detached so the call returns:
   ```powershell
   Start-Process powershell -WindowStyle Hidden -PassThru -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File','<skill>\scripts\show-in-taskbar.ps1','-Png','<icon.png>','-Name','<App name>'
   ```
   Keep the process ids. The script crops the PNG to its visible pixels (the icon fills its
   slot), builds an .ico of 16 to 256 px, and opens a small window named after the app, in its
   own taskbar group. Icons of one family (same character on the same canvas): add
   `-KeepFrame` to each, or the crop gives each head a different size. A PNG without alpha, or with an opaque corner, prints a warning to
   stderr: redirect it (`-RedirectStandardError`) and read it.
2. **Check it started**: after about 5 s, `Get-Process -Id <ids>` shows each `MainWindowTitle`.
   No title: read the stderr file.
3. **Tell the user** to look at the taskbar, and what to judge: can they name the app from the
   icon alone, beside their other apps; does it stand out or is it busier than them. Ask for
   their verdict. Do not judge it from a screen capture: on a scaled display the capture
   misses the bar, and the user's eye on their own screen is the test.
4. **Close** when they are done: `Stop-Process -Id <ids>`, or they close the windows.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| An HTML page imitating a taskbar | A real window, in the real taskbar |
| The icon with its dark background square | Transparent, cropped to its pixels, filling the slot |
| Launching in the foreground and blocking the agent | Detached, process ids kept, closed afterwards |
| "Looks good" from a 1024 px render | The user's verdict, on their own taskbar |
| Editing the icon from this skill | The redesign belongs to netsu-app-icon |
