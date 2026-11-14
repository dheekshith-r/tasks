# App icons

The mark is a 2 x 2 sorting frame: white rules on ink, a yellow label strip in the first box and a red slip in the second. It matches the Sorting Frame design. `mark.svg` is the source; each `*.html` here renders one size.

| File in react/public | Size | Mark size in a 512 box | Notes |
|---|---|---|---|
| icon-192.png | 192 | 330 | manifest |
| icon-512.png | 512 | 330 | manifest |
| icon-maskable-512.png | 512 | 270 | manifest, purpose maskable: the mark stays inside the 80% safe circle |
| apple-touch-icon.png | 180 | 330 | iOS home screen (iOS rounds the corners) |

To make one again (from this folder): `msedge --headless=new --hide-scrollbars --force-device-scale-factor=1 --window-size=512,512 --screenshot=icon-512.png icon-512.html`, then copy the PNG to `react/public/`.
