
from PIL import Image
import os
import shutil

CERT_DIR = r"c:\Users\Admin\Desktop\Portfolio\certificate"
PHOTO_DIR = r"c:\Users\Admin\Desktop\Portfolio\photo"
CERT_ORIG_DIR = r"c:\Users\Admin\Desktop\Portfolio\certificate\_originals"
PHOTO_ORIG_DIR = r"c:\Users\Admin\Desktop\Portfolio\photo\_originals"

WEBP_QUALITY = 78
CERT_WIDTH_1X = 550
CERT_WIDTH_2X = 1100

os.makedirs(CERT_ORIG_DIR, exist_ok=True)
os.makedirs(PHOTO_ORIG_DIR, exist_ok=True)

# ─── CERTIFICATES ────────────────────────────────────────────
cert_files = [
    "Ai Fluency for Builders.png",
    "Claude 101.png",
    "Data Cleaning.png",
    "Data Visualization.png",
    "Data.png",
    "Excel.png",
    "Geospatial Analysis.png",
    "Intermediate Machine Learning.png",
    "Linguistic AI Certification.jpg",
    "pandas.png",
]

def resize_and_save_webp(src_path, dest_path, width, quality=WEBP_QUALITY):
    with Image.open(src_path) as img:
        img = img.convert("RGB")
        w, h = img.size
        new_h = int(h * width / w)
        img = img.resize((width, new_h), Image.LANCZOS)
        img.save(dest_path, "WEBP", quality=quality, method=6)
    size_kb = os.path.getsize(dest_path) / 1024
    print(f"  Saved {os.path.basename(dest_path)} ({width}px) → {size_kb:.0f} KB")

print("=== Converting Certificates ===")
for fname in cert_files:
    src = os.path.join(CERT_DIR, fname)
    if not os.path.exists(src):
        print(f"  MISSING: {fname}")
        continue

    # Archive original
    shutil.copy2(src, os.path.join(CERT_ORIG_DIR, fname))

    stem = os.path.splitext(fname)[0]
    out_1x = os.path.join(CERT_DIR, f"{stem}-550w.webp")
    out_2x = os.path.join(CERT_DIR, f"{stem}-1100w.webp")

    resize_and_save_webp(src, out_2x, CERT_WIDTH_2X)
    resize_and_save_webp(src, out_1x, CERT_WIDTH_1X)

    orig_kb = os.path.getsize(src) / 1024
    print(f"  Original {fname}: {orig_kb:.0f} KB → archived")
    os.remove(src)  # remove original from deployed folder

# ─── PROFILE PHOTO ───────────────────────────────────────────
print("\n=== Converting Profile Photo ===")
profile_src = os.path.join(PHOTO_DIR, "ahanaf-shahriar-nafiz.jpg")
if os.path.exists(profile_src):
    shutil.copy2(profile_src, os.path.join(PHOTO_ORIG_DIR, "ahanaf-shahriar-nafiz.jpg"))

    with Image.open(profile_src) as img:
        img = img.convert("RGB")
        w, h = img.size
        print(f"  Original: {w}x{h}")
        # Keep portrait crop: 960x961 is roughly square, crop to 960x1280 portrait
        # Current aspect is ~1:1. We want ~3:4 portrait. Crop top of image.
        target_aspect = 3 / 4
        new_h = int(w / target_aspect)
        if new_h > h:
            # image is too short for portrait, just use as-is
            new_h = h
        # Crop vertically from top (face is likely at top)
        crop_box = (0, 0, w, new_h)
        img = img.crop(crop_box)

        # Save at 1000px wide (2x) and 500px wide (1x)
        w2, h2 = img.size
        for out_w, suffix in [(1000, "1000w"), (500, "500w")]:
            out_h = int(h2 * out_w / w2)
            resized = img.resize((out_w, out_h), Image.LANCZOS)
            out_path = os.path.join(PHOTO_DIR, f"ahanaf-shahriar-nafiz-{suffix}.webp")
            resized.save(out_path, "WEBP", quality=82, method=6)
            sz = os.path.getsize(out_path) / 1024
            print(f"  Saved profile {suffix}: {out_w}x{out_h} → {sz:.0f} KB")

    os.remove(profile_src)
    print("  Original profile photo archived and removed.")

# ─── LOGO / LOG.PNG ──────────────────────────────────────────
print("\n=== Converting logo ===")
logo_src = os.path.join(PHOTO_DIR, "log.png")
if os.path.exists(logo_src):
    shutil.copy2(logo_src, os.path.join(PHOTO_ORIG_DIR, "log.png"))
    with Image.open(logo_src) as img:
        # Keep as PNG if has transparency, else WebP
        mode = img.mode
        print(f"  Logo mode: {mode}, size: {img.size}")
        if mode in ("RGBA", "LA", "P"):
            out_path = os.path.join(PHOTO_DIR, "log.webp")
            img.save(out_path, "WEBP", quality=80, lossless=True)
        else:
            out_path = os.path.join(PHOTO_DIR, "log.webp")
            img.convert("RGB").save(out_path, "WEBP", quality=80)
        sz = os.path.getsize(out_path) / 1024
        print(f"  Saved logo.webp → {sz:.1f} KB")
    os.remove(logo_src)
    print("  Original log.png archived and removed.")

print("\n=== DONE ===")
