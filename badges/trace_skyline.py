"""One-off: traces the 2025 raster skyline into a vector path, for large formats like the roll-up."""

import sys
from pathlib import Path

HERE = Path(__file__).parent
sys.path.insert(0, str(HERE / "pylib"))

import numpy as np  # noqa: E402
import potrace  # noqa: E402
from PIL import Image  # noqa: E402

UPSCALE = 4

mask = Image.open(HERE / "assets" / "skyline-mask.png").getchannel("A")
width, height = mask.size
big = mask.resize((width * UPSCALE, height * UPSCALE), Image.LANCZOS)
ink = np.asarray(big) > 127

# Without the inversion the sky gets traced instead of the ink (seen on the first render)
plist = potrace.Bitmap(~ink).trace(turdsize=UPSCALE * UPSCALE * 2, alphamax=1.0, opttolerance=0.4)

parts = []
for curve in plist:
    start = curve.start_point
    parts.append(f"M{start.x:.1f},{start.y:.1f}")
    for segment in curve.segments:
        if segment.is_corner:
            parts.append(f"L{segment.c.x:.1f},{segment.c.y:.1f}L{segment.end_point.x:.1f},{segment.end_point.y:.1f}")
        else:
            parts.append(
                f"C{segment.c1.x:.1f},{segment.c1.y:.1f} {segment.c2.x:.1f},{segment.c2.y:.1f} "
                f"{segment.end_point.x:.1f},{segment.end_point.y:.1f}"
            )
    parts.append("Z")

svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width * UPSCALE} {height * UPSCALE}" '
    f'preserveAspectRatio="none" fill="currentColor"><path fill-rule="evenodd" d="{"".join(parts)}"/></svg>'
)
(HERE / "assets" / "skyline.svg").write_text(svg)
print(f"{len(plist)} contours, {len(svg) // 1024} Ko")
