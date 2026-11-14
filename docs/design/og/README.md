# Share image (og.png)

`react/public/og.png` (1200 x 630) is drawn in code from `og.html` in this folder: no image generator, no stock art. It shows the Sorting Frame: the typed line in the IN slot and the same task filed under Tomorrow with a postmark. The image has no real dates, so it does not go stale.

To make it again after a design change (from this folder, after `npm install` in `react/`):

```bash
msedge --headless=new --hide-scrollbars --force-device-scale-factor=1 --window-size=1200,630 --virtual-time-budget=3000 --screenshot=og.png og.html
```

Then copy `og.png` to `react/public/og.png`. Chrome works the same way.
