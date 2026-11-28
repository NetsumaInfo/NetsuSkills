# Opens a real, empty Windows application whose icon is the given PNG, so it shows in the real
# taskbar next to the user's apps. One window per call; close it to stop.
# Usage: powershell -ExecutionPolicy Bypass -File show-in-taskbar.ps1 -Png icon.png [-Name "NetsuRush"]
param(
  [Parameter(Mandatory = $true)][string]$Png,
  [string]$Name = [IO.Path]::GetFileNameWithoutExtension($Png),
  # Keep the PNG's own frame: icons of one family drawn on the same canvas keep the same head size
  [switch]$KeepFrame
)
Add-Type -AssemblyName System.Windows.Forms, System.Drawing
Add-Type @'
using System.Runtime.InteropServices;
public static class Shell { [DllImport("shell32.dll")] public static extern int SetCurrentProcessExplicitAppUserModelID([MarshalAs(UnmanagedType.LPWStr)] string id); }
'@
# Own taskbar group, so the button is not merged with PowerShell's
[void][Shell]::SetCurrentProcessExplicitAppUserModelID("Netsu.TaskbarPreview." + ($Name -replace '\W', ''))

# Read from memory: FromFile would lock the PNG while the window is open
$src = New-Object Drawing.Bitmap (New-Object IO.MemoryStream (, [IO.File]::ReadAllBytes((Resolve-Path $Png))))
if (-not [Drawing.Image]::IsAlphaPixelFormat($src.PixelFormat)) { Write-Warning "$Name has no alpha channel: the taskbar will show its background square" }
elseif ($src.GetPixel(0, 0).A -gt 250) { Write-Warning "$Name has an opaque corner: it is not transparent" }

# Crop to the visible pixels (read on a 256 px copy: GetPixel is slow), so the icon fills its slot
$probe = New-Object Drawing.Bitmap $src, 256, 256
$data = $probe.LockBits((New-Object Drawing.Rectangle 0, 0, 256, 256), 'ReadOnly', ([Drawing.Imaging.PixelFormat]::Format32bppArgb))
$bytes = New-Object byte[] (256 * 256 * 4); [Runtime.InteropServices.Marshal]::Copy($data.Scan0, $bytes, 0, $bytes.Length); $probe.UnlockBits($data)
$x0 = 256; $y0 = 256; $x1 = 0; $y1 = 0
for ($i = 3; $i -lt $bytes.Length; $i += 4) { if ($bytes[$i] -gt 8) { $p = ($i - 3) / 4; $x = $p % 256; $y = [Math]::Floor($p / 256)
  if ($x -lt $x0) { $x0 = $x }; if ($x -gt $x1) { $x1 = $x }; if ($y -lt $y0) { $y0 = $y }; if ($y -gt $y1) { $y1 = $y } } }
$k = $src.Width / 256
$side = [Math]::Max($x1 - $x0, $y1 - $y0) + 1
$crop = New-Object Drawing.RectangleF ((($x0 + $x1) / 2 - $side / 2) * $k), ((($y0 + $y1) / 2 - $side / 2) * $k), ($side * $k), ($side * $k)
if ($KeepFrame) { $crop = New-Object Drawing.RectangleF 0, 0, $src.Width, $src.Height }

# One .ico with a PNG entry per size Windows asks for
$sizes = 16, 20, 24, 32, 40, 48, 64, 256
$pngs = foreach ($s in $sizes) {
  $b = New-Object Drawing.Bitmap $s, $s, ([Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [Drawing.Graphics]::FromImage($b)
  $g.InterpolationMode = 'HighQualityBicubic'; $g.PixelOffsetMode = 'HighQuality'; $g.SmoothingMode = 'HighQuality'
  $g.DrawImage($src, (New-Object Drawing.RectangleF 0, 0, $s, $s), $crop, [Drawing.GraphicsUnit]::Pixel)
  $m = New-Object IO.MemoryStream; $b.Save($m, [Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $b.Dispose()
  , $m.ToArray()
}
$ico = New-Object IO.MemoryStream; $w = New-Object IO.BinaryWriter $ico
$w.Write([uint16]0); $w.Write([uint16]1); $w.Write([uint16]$sizes.Count)
$offset = 6 + 16 * $sizes.Count
for ($i = 0; $i -lt $sizes.Count; $i++) {
  $s = $sizes[$i] % 256
  $w.Write([byte]$s); $w.Write([byte]$s); $w.Write([byte]0); $w.Write([byte]0)
  $w.Write([uint16]1); $w.Write([uint16]32); $w.Write([uint32]$pngs[$i].Length); $w.Write([uint32]$offset)
  $offset += $pngs[$i].Length
}
foreach ($p in $pngs) { $w.Write($p) }
$ico.Position = 0
$icon = New-Object Drawing.Icon $ico

$form = New-Object Windows.Forms.Form
$form.Text = $Name; $form.Icon = $icon; $form.ShowInTaskbar = $true
$form.Size = New-Object Drawing.Size 420, 220; $form.StartPosition = 'CenterScreen'; $form.BackColor = '#11161d'
$label = New-Object Windows.Forms.Label
$label.Text = "$Name`n`nLook at the taskbar. Close this window to stop."; $label.ForeColor = 'White'; $label.Dock = 'Fill'; $label.TextAlign = 'MiddleCenter'
$form.Controls.Add($label)
# A hidden launcher passes "hidden" to the first window it shows: show it ourselves first
$form.Add_Load({ $form.Visible = $true; $form.WindowState = 'Normal' })
$form.ShowDialog() | Out-Null
