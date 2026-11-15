# Share images

Both images are drawn in code from the HTML in this folder: no image generator, no stock art. They show the Sorting Frame: the typed line in the IN slot and the same task filed under Tomorrow with a postmark. They have no real dates, so they do not go stale.

| Image | Source | Size | Used for |
|---|---|---|---|
| `react/public/og.png` | `og.html` | 1200 x 630 | Link previews of the start page |
| `github-social.png` | `github-social.html` | 2560 x 1280 (1280 x 640 at 2x) | The GitHub social preview (Settings > General > Social preview) |

To make them again after a design change (from this folder, after `npm install` in `react/`):

```bash
msedge --headless=new --hide-scrollbars --force-device-scale-factor=1 --window-size=1200,630 --virtual-time-budget=3000 --screenshot=og.png og.html
msedge --headless=new --hide-scrollbars --force-device-scale-factor=2 --window-size=1280,640 --virtual-time-budget=3000 --screenshot=github-social.png github-social.html
```

Then copy `og.png` to `react/public/og.png`, and upload `github-social.png` in the repository settings. Chrome works the same way.
