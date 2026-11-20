# pkowalski.com

Personal site and blog. The domain terms below belong to the Baby Vision
Simulator feature (`/baby-vision`); the rest of the site is a conventional
Astro blog and needs no special vocabulary.

## Language

### Baby Vision Simulator

**Weeks after birth**:
Chronological age — completed weeks plus fractional days — since the baby was
born; week 0 is the day of birth. The model and UI speak weeks everywhere and
interpolate below week resolution.
_Avoid_: months (display-only), gestational age, corrected age.

**Acuity**:
How fine a spatial pattern the infant resolves, measured behaviorally with
gratings (preferential looking / Teller Acuity Cards), in cycles per degree.
_Avoid_: "resolution", "sharpness", unqualified Snellen values.

**Grating vs recognition acuity**:
Grating (detection) acuity is what the Teller literature reports and what this
simulator models; recognition (optotype, letter) acuity is lower at the same
age. Snellen equivalents in the readout are approximate communication only.

**Contrast threshold**:
The minimum Michelson contrast the infant detects at low spatial frequencies,
as a fraction (e.g., 0.46 = 46% at birth). Its inverse is contrast sensitivity.

**Anchor**:
An (age → value, sourceId) point taken from a specific study. Anchors are the
only place numbers enter the model; interpolation between them is log-linear
for acuity and contrast, linear for channel gains.

**Opponent channels**:
The two color-opponent signals of the rendering basis: red–green (v = r − g,
≈ L−M) and blue–yellow (u = b − y, ≈ S), plus luminance-ish y = (r+2g+b)/4.
Age-keyed gains on v and u implement the color-vision timeline.

**Viewing distance**:
The distance between the adult viewer and their screen, in cm. Required to
convert cycles per degree into on-screen blur pixels; device-defaulted and
user-adjustable. A property of the viewer, not of the baby or the camera.

**Visual diet**:
The developmental sequence of visual input (blurry → sharp, gray → color).
Article-level context for the machine-learning parallel (Cai 2026), not a
simulator parameter.
