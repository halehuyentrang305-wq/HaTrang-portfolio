# Adds subtle feminine eyelashes to each open eye in the face spritesheet.
# Preserves image dimensions, sprite grid, and UV layout (only draws a few
# small strokes at the outer-top corner of existing eyes). Non-destructive:
# writes to an output path; the original is backed up separately.
import sys
from PIL import Image, ImageDraw
import numpy as np
from scipy import ndimage

SRC, OUT = sys.argv[1], sys.argv[2]
INK = (78, 39, 42, 255)  # core model ink color

im = Image.open(SRC).convert("RGBA")
a = np.array(im)
alpha = a[:, :, 3]
lab, n = ndimage.label(alpha > 60)
objs = ndimage.find_objects(lab)

# collect eye-like blobs (round, open)
eyes = []
for i, sl in enumerate(objs):
    if sl is None:
        continue
    y0, y1 = sl[0].start, sl[0].stop
    x0, x1 = sl[1].start, sl[1].stop
    w, h = x1 - x0, y1 - y0
    area = int((lab[sl] == (i + 1)).sum())
    if area > 1000 and h >= 24 and w >= 30:   # open eyes only (skip blink dashes)
        eyes.append({"x0": x0, "y0": y0, "x1": x1, "y1": y1, "w": w, "h": h,
                     "cx": (x0 + x1) / 2, "cy": (y0 + y1) / 2})

# pair eyes within the same face (group by row, then adjacent by x)
eyes.sort(key=lambda e: (round(e["cy"] / 90), e["cx"]))
rows = {}
for e in eyes:
    rows.setdefault(round(e["cy"] / 90), []).append(e)
for row in rows.values():
    row.sort(key=lambda e: e["cx"])
    for k in range(0, len(row) - 1, 2):
        row[k]["side"] = "L"      # left eye -> lashes fan upper-left
        row[k + 1]["side"] = "R"  # right eye -> lashes fan upper-right
    if len(row) % 2 == 1:
        row[-1]["side"] = "R"

# supersample for smooth lashes
S = 4
big = im.resize((im.width * S, im.height * S), Image.NEAREST)
d = ImageDraw.Draw(big)

def lash(cx, cy, ang, length, width):
    # slightly curved tapered stroke from (cx,cy) outward at angle `ang`
    import math
    steps = 8
    pts = []
    for t in range(steps + 1):
        f = t / steps
        # gentle upward curve
        x = cx + math.cos(ang) * length * f
        y = cy + math.sin(ang) * length * f - (length * 0.18) * (f ** 1.6)
        pts.append((x * S, y * S))
    for t in range(steps):
        ww = max(1, int(width * S * (1 - 0.6 * (t / steps))))
        d.line([pts[t], pts[t + 1]], fill=INK, width=ww)

import math
added = 0
for e in eyes:
    side = e.get("side", "R")
    top = e["y0"] + e["h"] * 0.22
    if side == "L":
        ox = e["x0"] + e["w"] * 0.12
        base = math.radians(200)   # up-left
        spread = math.radians(-16)
    else:
        ox = e["x1"] - e["w"] * 0.12
        base = math.radians(340)   # up-right
        spread = math.radians(16)
    # 3 lashes fanning from the outer corner
    for j, L in enumerate((13, 15, 12)):
        lash(ox, top + j * 1.2, base + spread * (j - 1) * 0.6, L, 2.4)
        added += 1

out = big.resize((im.width, im.height), Image.LANCZOS)
out.save(OUT)
print("eyes found:", len(eyes), "| lashes drawn:", added)
