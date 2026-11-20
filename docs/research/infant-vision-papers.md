# Infant Vision Parameters for a Baby-Vision Simulator — Three-Paper Extraction Report

**Purpose:** extract quantitative parameters (acuity, contrast sensitivity, color, visual field, rendering/blur parameters) for a browser-based, week-by-week baby-vision camera filter.
**Method note:** All three PDFs were read in full via text extraction (pypdf). Figures were additionally analyzed by extracting embedded images and running OCR + pixel-level curve/axis analysis (no image-capable model was available, so figure numbers were recovered forensically and cross-checked against the papers' published source code on GitHub, which turned out to be the authoritative source for the key acuity table). Every number below is quoted exactly from text, table, code, or measured from figures (figure measurements are labeled as such).

---

## Paper 1 — "Learning to See Through a Baby's Eyes: Early Visual Diets Enable Robust Visual Intelligence in Humans and Machines"

### Bibliographic info
- **Authors:** Yusen Cai¹, Qing Lin¹\*, Bhargava Satya Nunna¹·², Mengmi Zhang¹\* (¹Nanyang Technological University, Singapore; ²Indian Institute of Technology Madras; \*co-corresponding).
- **Venue/year:** arXiv:2511.14440v2 [cs.CV], 24 Mar 2026 (CVPR-style manuscript; no venue named in the text beyond arXiv).

### Summary
The paper trains self-supervised learning (SSL) models (SimCLR and DINO, on ResNet and ViT backbones) on object-centric videos under staged "visual diets" that mimic infant visual development: **CDiet** (grayscale→color), **ADiet** (blur→sharp), and **TDiet** (temporal continuity), collectively **CATDiet**; a two-phase **CombDiet** uses CATDiet as a 30%-of-epochs warm-up before standard SSL training. It benchmarks on 10 datasets (clean/corrupted recognition, texture–shape cue conflict, silhouettes, depth-order classification, visual cliff) and reports that the developmental ordering improves robustness and induces biologically aligned patterns (FIM dynamics resembling macaque V1 synaptic density, visual-cliff-like behavior).

### Quantitative facts about infant vision / infant-perspective filtering

**Important negative finding:** despite the task premise, **this paper contains NO acuity-by-age curve in cycles per degree, Snellen, or logMAR, and no age→blur mapping.** I read all 20 pages (main + supplementary) and OCR'd/pixel-analyzed Figures 1 and 2. The "acuity" simulation is a **5-stage Gaussian-blur schedule indexed by training epoch, not by infant age**. Figure 2b plots blur-kernel σ vs. *training epochs*, not acuity vs. age. No contrast-sensitivity values, no visual-field values, and no color-vision thresholds appear anywhere in the paper.

What the paper does specify (all for 224×224 training images):

1. **ADiet (blur-to-sharp curriculum), Sec. 3.1:** five stages; each training image is blurred with Gaussian **σ ∈ [4, 3, 2, 1, 0] pixels**, with **kernel sizes [25, 19, 13, 7, 1] pixels**; stage durations **[10, 6, 6, 3, 5] epochs**. Design rationale quoted: "This design reflects developmental psychology findings that **visual acuity increases approximately exponentially during the first year of life [85, 122]**."
   - [85] = **Norcia, A.M. & Tyler, C.W. (1985). "Spatial frequency sweep VEP: visual acuity during the first year of life." *Vision Research*, 25(10):1399–1408.** (The primary source for the exponential-growth claim; the actual cpd values are NOT reproduced in this paper.)
   - [122] = **Teller, D.Y. (1997). "First glances: The vision of infants." The Friedenwald Lecture. *Investigative Ophthalmology & Visual Science*, 38(11):2183–2203.**
2. **CATDiet interleaved schedule (Suppl. S1):** eight stages of lengths **[10, 6, 1, 5, 1, 2, 3, 2] epochs** with **σ = [4, 3, 2, 2, 1, 1, 0, 0] pixels**.
3. **CDiet (gray-to-color curriculum), Sec. 3.1:** five stages; each image is blended as **s·I_color + (1−s)·I_gray** with **s sampled uniformly within (0.20, 0.36), (0.36, 0.52), (0.52, 0.68), (0.68, 0.84), (0.84, 1.0)** for stages 1–5; stage durations **[10, 7, 6, 5, 2] epochs**. Rationale: "rapid increase in chromatic sensitivity during early infancy [26, 29, 75, 111, 129, 140]", i.e.:
   - [26] Crognale, M.A. (2002). "Development, maturation, and aging of chromatic visual pathways: VEP results." *J. Vision*, 2(6):2.
   - [29] Dobkins, K.R., Anderson, C.M. & Kelly, J. (2001). "Development of psychophysically-derived detection contours in L- and M-cone contrast space." *Vision Research*, 41(14):1791–1807.
   - [75] Maule, J., Skelton, A.E. & Franklin, A. (2023). "The development of color perception and cognition." *Annu. Rev. Psychology*, 74:87–111.
   - [111] Skelton, A.E., Maule, J. & Franklin, A. (2022). "Infant color perception: Insight into perceptual development." *Child Development Perspectives*, 16(2):90–95.
   - [140] Werner, J.S. & Wooten, B.R. (1979). "Human infant color vision and color perception." *Infant Behavior and Development*, 2:241–273.
   - [129] Vogelsang, M. et al. (2024). "Impact of early visual experience on later usage of color cues." *Science*, 384(6698):907–912.
4. **Phase split:** CATDiet warm-up = first **30%** of training epochs ("mirrors infants' first-year visual progression"); remaining 70% standard augmentation (SDiet, "mature vision"). Training images 224×224, batch 64.
5. Qualitative claims with citations (no numbers): newborn vision is "blurry, desaturated, and continuously unfolding in time" [75, 127, 129, 130, 140, 141]; absence of early low-acuity input linked to lasting face-processing deficits [37, 76, 93, 127] — [127] = Vogelsang, L. et al. (2018). "Potential downside of high initial visual acuity." *PNAS* 115(44):11333–11338; immature photoreceptors bias infants toward luminance over chromatic cues [129].
6. Other cited acuity sources (bibliography only, no values quoted): [77] **Mayer, D.L. & Dobson, V. (1982). "Visual acuity development in infants and young children, as assessed by operant preferential looking." *Vision Research*, 22(9):1141–1151.**

### Assessment for a real-time week-by-week camera filter
**Not directly usable as a parameter source.** The paper provides no age-anchored acuity/contrast/color values — its blur (σ in pixels on 224×224 images) and saturation (blend ratio s) are training-epoch curricula, only *loosely inspired* by infant development. What it *does* provide: (a) qualitative validation that a progressive blur-to-sharp + gray-to-color pipeline is a faithful and useful model of infant vision; (b) the pointer to the primary acuity literature (Norcia & Tyler 1985; Teller 1997; Mayer & Dobson 1982) where actual acuity-by-age curves live; (c) a 5-stage shape for saturation/blur progressions that a simulator could adopt if stages are mapped onto ages by explicit design choice (the paper itself never makes that mapping). For a live camera filter, its Gaussian-blur-in-pixels approach is trivially implementable in a WebGL/canvas pipeline but would need an external age→σ calibration.

---

## Paper 2 — "Infant simulator with an embodied caregiver: Generating infant-perspective touch and vision during social interaction"

### Bibliographic info
- **Authors:** Noemi Vaculinova and Matej Hoffmann (Department of Cybernetics, FEE, Czech Technical University in Prague).
- **Venue/year:** arXiv:2610.05997v1 [cs.RO], 5 Oct 2026 (IEEE conference format, 8 pages; funded by Czech Science Foundation GAČR project no. 25-18113S). Companion repo: github.com/ctu-vras/mom-for-mimo; data on Google Drive; details also in a CTU Master's thesis (Vaculinová, 2026).

### Summary
The paper extends the MuJoCo-based MIMo infant simulator with an articulated, physics-based **embodied caregiver** (adult female model parameterized from 50th-percentile ANSUR anthropometry, Gordon et al. 2014, with body-segment masses from Plagenhoef et al. 1983), a motion-capture replay pipeline (43 markers, scenarios up to 40 s), and origin-aware touch logging (self / caregiver / environment) aggregated into touches/min heatmaps over 50 infant body regions. It showcases replaying the same recorded caregiver motions with a **newborn and a two-month-old** infant model, and generates the infant's first-person **binocular eye-camera views** during holding/soothing interaction (the focus of analysis is touch, not vision).

### Quantitative facts about infant vision / infant-perspective rendering
**The paper contains essentially no infant-vision physiology numbers.** Vision facts found:

1. Qualitative statement only: "although **vision is quite poor at birth, it develops quickly** and the details about how often, for how long, and from which angles the caregiver appears in the infant's visual field may be important..." (Introduction; no numbers).
2. Vision is rendered from **MIMo's binocular "eye" cameras** (cameras in both eyes); first-person visual streams are logged alongside a third-person render; the paper states "The first-person visual streams are available, but will not be analyzed in detail."
3. Rendering tweak: in close-contact "hug" configurations they **reduce the near clipping distance (znear)** in MuJoCo visual parameters to render near-surface geometry (no numeric value given; MuJoCo default znear = 0.01 m).
4. Deferral to MIMo grows!: "one can also emulate the gradual maturation of infant vision in the simulator, **manipulating the field of view, acuity, etc. [24]**" — [24] = López, F.M., Lenz, M., Fedozzi, M.G., Aubret, A. & Triesch, J. (2025). "MIMo Grows! Simulating Body and Sensory Development in a Multimodal Infant Model," *2025 IEEE ICDL*. (i.e., all infant-vision emulation capability lives in Paper 3's system, not this one.)
5. From the companion repo (mom-for-mimo, checked on GitHub): the infant eye cameras `eye_left`/`eye_right` in **both the newborn and 2-month MIMo model XMLs are `fovy="60"`** (vertical FOV 60°) at `pos="0.01125 0 0"` (±11.25 mm → 22.5 mm inter-camera baseline, not age-scaled); the repo's `vision.py` renders at the environment's default resolution with **no acuity, blur, contrast, or color filtering whatsoever** — it only saves snapshots/videos (images captured at fps=100, video written with every 4th frame → 25 fps effective).
6. Non-vision quantitative facts (for context): ~**3,000 touch sensors** on the newborn model ("on the order of a few thousand... about three thousand in the default configuration"), denser on hands/feet; touch mapped to **50 body regions**; 8 recorded scenarios of **1,458–4,000 frames** each; motion capture with **43 markers**; replays with newborn and 2-month-old bodies.

### Assessment for a real-time week-by-week camera filter
**Not usable as a parameter source** — it contributes no acuity/contrast/color/field numbers and its own rendering applies no infant-vision filtering. Its value for the simulator project is indirect: it confirms the platform convention of **60° vertical FOV binocular eye cameras** and it explicitly points to Paper 3 (MIMo grows!) for age-dependent vision emulation.

---

## Paper 3 — "MIMo grows! Simulating body and sensory development in a multimodal infant model"

### Bibliographic info
- **Authors:** Francisco M. López\*, Miles Lenz\*, Marco G. Fedozzi\*, Arthur Aubret, and Jochen Triesch (\*equal contributions; Frankfurt Institute for Advanced Studies, Goethe University Frankfurt, University of Genova/IIT; funded by "The Adaptive Mind" Hessian Excellence Program and DFG ARENA).
- **Venue/year:** arXiv:2509.09805v1 [cs.RO], 11 Sep 2025; published in **2025 IEEE International Conference on Development and Learning (ICDL)** (per Paper 2's reference list). Code: **github.com/trieschlab/MIMo** (branch `v2/main`).

### Summary
MIMo v2 upgrades the MuJoCo multimodal infant simulator with (i) a **growing body from birth to 24 months** (segment sizes log-interpolated from AnthroKids data via f(x) = a·log(x+b)+c with b ≥ 0.1, validated against WHO growth standards; actuator strength scaled with body-part volume), (ii) **foveated vision with age-dependent visual acuity** implemented as a contrast-sensitivity-function low-pass filter in the FFT domain, (iii) **sensorimotor delays** (FIFO buffers; default timestep 5 ms), plus an inverse-dynamics controller and a random environment generator. This is the paper whose vision module can directly ground a baby-vision filter.

### Quantitative facts about infant vision and its simulation

**From the paper text:**

1. **CSF model (Sec. IV-A):** infant blur is characterized by the Contrast Sensitivity Function [25] (= Kiorpes, L. (2016). "The puzzle of visual development: behavior and neural limits." *J. Neuroscience* 36(45):11384–11393). They approximate the CSF as **linear functions**:
   **CSF_a(f) = 1 − f/a if f < a, 0 otherwise**, where **f = spatial frequency in cycles per degree** and **a = visual acuity, dependent on age** (their Eq. 2).
2. **Acuity source (paper text):** "we interpolate the **monocular visual acuities reported by Neijzen et al.** for infants **between 1 and 24 months** [26]" — [26] = Neijzen, C.M., de Wit, F.M., Hettinga, Y.M., de Boer, J.H., van Genderen, M.M. & de Wit, G.C. (2025). "Reference values for the Teller Acuity Cards II (TAC II) in infants and preverbal children, a meta-analysis." *Acta Ophthalmologica*. **The numeric acuity values are NOT printed in the paper text** — they appear only in Fig. 3(d).
3. **Filter application:** images are converted to the frequency domain with an FFT, each frequency-space value is multiplied by the corresponding CSF, and the image is converted back to pixel space (per color channel, per the code).
4. **Foveation (Sec. IV-B):** rendering at a single resolution and field-of-view in Cartesian space, conversion to **log-polar space**, and inversion back to Cartesian while retaining the logarithmic eccentricity dependency — expanding the central visual area and compressing the periphery (citing retinal photoreceptor density [27] = Wells-Gray et al. 2016 and cortical magnification [28] = Duncan & Boynton 2003). Alternative to the multi-concentric-view approach of Raabe et al. 2023 [15].
5. **Field of view:** Fig. 3 caption: the vision module is "rendered with a **field-of-view of 60º**." (Rendering choice; no infant visual-field development data given.)
6. **Sensorimotor delays (Sec. IV-C):** default simulation **timestep 5 ms**; user-defined delays are multiples of the timestep; estimates cited: minimum reaction times **50–100 ms** for proprioception-driven actions [29 = Manning et al. 2012], fastest adult reaction times **around 200 ms** [30 = Whelan 2008]. Reaching experiment compares sensory delays of **0, 50 ms, and 200 ms** (motor delay set to minimum 1 timestep = 5 ms); delays produce ataxia-like noisy trajectories.
7. Acknowledged simplification: the linear CSF "does not account for low sensitivity in the range of low spatial frequencies" (no band-pass; low frequencies are passed at full contrast).
8. Age range of the growing body: **birth to 24 months** (the paper); motor milestones referenced: head lifting typically at **4 months** [23 = van Iersel & Hadders-Algra 2021], leg lifting around **3 months** [24 = Angulo-Kinzler et al. 2002].

**From Figure 3(d) (pixel-level measurement, labeled as such):** the log-log CSF plot (x-axis "Spatial Frequency (cycles/degree)" from 10⁻¹; y-axis "CSF" from 10⁰ down to 10⁻³) shows 7 curves labeled **1, 2, 4, 6, 12, 18, 24 month(s)** plus "No filtering" (a horizontal gray line at CSF = 1). Measured cutoff frequencies where each curve terminates: **≈0.85, 1.00, 1.17, 1.36, 1.60, 1.90, 2.24 cpd** respectively. Axis calibration was verified against minor tick positions (2×10⁻¹ … 9×10⁻¹, 2×10⁰).

**From the published source code (authoritative; `mimoVision/vision.py`, branch `v2/main`):**

9. **Exact age→acuity table** (ages in months, acuities in cycles/degree; linear interpolation between points; clamped to the first/last value outside 1–36 months):

| age (mo) | acuity (cpd) | | age (mo) | acuity (cpd) |
|---|---|---|---|---|
| 1.0 | 0.852 | | 8.858 | 8.218 |
| 1.169 | 1.0005 | | 10.351 | 9.008 |
| 1.366 | 1.1745 | | 12.096 | 9.405 |
| 1.596 | 1.3795 | | 14.135 | 9.544 |
| 1.865 | 1.621 | | 16.519 | 9.6775 |
| 2.179 | 1.9065 | | 19.304 | 10.079 |
| 2.547 | 2.2445 | | 22.558 | 11.013 |
| 2.976 | 2.645 | | 26.362 | 12.54 |
| 3.478 | 3.121 | | 30.806 | 14.6785 |
| 4.064 | 3.6885 | | 36.0 | 17.4195 |
| 4.75 | 4.367 | | | |
| 5.55 | 5.179 | | | |
| 6.486 | 6.1425 | | | |
| 7.58 | 7.1985 | | | |

   The ages are geometrically spaced (ratio ≈ 1.1686, i.e., 24 points spanning 1→36 months). **Note the source discrepancy:** the paper text credits Neijzen et al. 2025 (TAC II meta-analysis), but the code docstring says the values are "interpolated from the values reported by **Mayer et al. (1995)**" with the link iovs.arvojournals.org/article.aspx?articleid=2179925 — i.e., **Mayer, D.L., Beiser, A.S., Warner, A.F., Pratt, E.M., Raye, K.N. & Lang, J.M. (1995). "Monocular acuity norms for the Teller Acuity Cards between ages one month and four years." *Invest. Ophthalmol. Vis. Sci.*, 36:671–685** (monocular Teller Acuity Card norms). Also note the code table extends to 36 months although the paper says 1–24.
10. **Figure/code discrepancy (important):** my measured Fig. 3(d) cutoffs (0.85/1.00/1.17/1.36/1.60/1.90/2.24 cpd for "1/2/4/6/12/18/24 months") **exactly match entries 1–7 of the code table, whose ages are 1.0, 1.169, 1.366, 1.596, 1.865, 2.179, 2.547 months** — not 1/2/4/6/12/18/24 months. The figure's age labels are therefore inconsistent with the shipped code table (probably a figure-generation bug: the first seven table entries were plotted under the intended age labels). Under the current code, acuity at 2 months is ≈1.74 cpd, not 1.0 cpd; at 24 months ≈11.6 cpd, not 2.2 cpd. I report both readings and flag the conflict rather than silently choosing one.
11. **Actual MTF implemented (differs from the paper's linear formula):** the code computes, per FFT bin, spatial frequency in cpd as `sqrt(((w/2−u)/w)² + ((h/2−v)/h)²) × fft_scale` with **`fft_scale = max(width, height)/fovy`** (pixels per degree), and applies:
    - MTF(f) = 1 for f < 0.1 cpd;
    - else **MTF(f) = a·f^b with b = −2/(1 + log10(acuity)), a = 10^b**, i.e. **MTF(f) = (10·f)^b**, **clipped to [0.01, 0.99]**.
    - By construction **MTF(acuity) = 0.01** and MTF(0.1) = 1. (The docstring, like the paper, describes a "linear function" — the implementation is a power law that is linear on log-log axes.)
    - Application: per RGB channel, `fft2 → fftshift → multiply by MTF array → ifftshift → ifft2 → abs → clip 0..255`.
12. **Default camera/render parameters (`mimoEnv/envs/mimo_env.py`):** `eye_left`/`eye_right` at **256×256 px, fovy 60°, acuity: False, foveation: False** by default. If `acuity=True` it is set to the environment's age in months; if `foveation=True` it defaults to **strength 10.0**. Model XML: eye cameras `fovy="60"`, `pos="0.01125 0 0"` (22.5 mm camera baseline, not age-scaled).
13. **Foveation warp formula (code):** for strength λ, with R = max corner radius from image center: **r_src = R · expm1((r_dst/R) · log1p(λ)) / λ**, applied as an OpenCV remap in polar coordinates (strength 0 = none, "<5 mild, >20 strong" per docstring).
14. Minor code quirk worth knowing if reusing: on exact table-age matches the lookup uses `self.env.age` rather than the passed `acuity_age` parameter.

### Assessment for a real-time week-by-week camera filter
**Yes — this is the paper (and codebase) that can ground the simulator.** It supplies (a) a complete **age→acuity (cpd) table** with an explicit interpolation rule covering 1–36 months (clamped below 1 month), (b) a concrete **frequency-domain filter** (FFT multiply by an MTF) that maps directly onto a WebGL/canvas shader or per-frame JS FFT pipeline, (c) rendering conventions (**256×256, 60° vertical FOV**; pixels-per-degree = max(w,h)/fovy for converting camera resolution to cpd), and (d) an optional **foveation warp** and **sensorimotor-delay** model. Caveats: the acuity norms are **monocular grating (Teller card) acuities**; the CSF is a simplification with **no low-frequency contrast attenuation** and no band-pass; **no color-vision development** and **no visual-field development** are modeled; and there is an unresolved **figure-vs-code and paper-vs-code source discrepancy** (Neijzen 2025 vs. Mayer 1995; figure labels vs. table ages) that should be documented in the simulator.

---

## Usable parameters for the simulator

### 1. Visual acuity by age (blur cutoff) — PRIMARY PARAMETER
**Source:** MIMo v2 code table (`mimoVision/vision.py`), which the code attributes to **Mayer et al. 1995** (monocular Teller Acuity Card norms, IOVS 36:671–685); the MIMo grows! paper text instead cites **Neijzen et al. 2025** (TAC II meta-analysis, Acta Ophthalmologica). Use the code table as ground truth for "what MIMo does"; if you need the provenance of each number, consult Mayer 1995 / Neijzen 2025 directly — neither paper prints the values except via MIMo's figure (whose labels conflict with the code, see below).

Anchor table (exact code values):

| Age (months) | Acuity (cpd) |
|---|---|
| 1.0 | 0.852 |
| 1.169 | 1.0005 |
| 1.366 | 1.1745 |
| 1.596 | 1.3795 |
| 1.865 | 1.621 |
| 2.179 | 1.9065 |
| 2.547 | 2.2445 |
| 2.976 | 2.645 |
| 3.478 | 3.121 |
| 4.064 | 3.6885 |
| 4.75 | 4.367 |
| 5.55 | 5.179 |
| 6.486 | 6.1425 |
| 7.58 | 7.1985 |
| 8.858 | 8.218 |
| 10.351 | 9.008 |
| 12.096 | 9.405 |
| 14.135 | 9.544 |
| 16.519 | 9.6775 |
| 19.304 | 10.079 |
| 22.558 | 11.013 |
| 26.362 | 12.54 |
| 30.806 | 14.6785 |
| 36.0 | 17.4195 |

**Rule:** linear interpolation in age between adjacent points; clamp to 0.852 cpd below 1 month and 17.4195 cpd above 36 months (exact code behavior). *Below 1 month there is no data in any of the three papers — the newborn value is an extrapolated clamp, not a measurement.*

Interpolated values at common ages (computed with the code's linear-interpolation rule — labeled derived, not quoted):

| Age | Acuity (cpd) | Derived logMAR (30 cpd = 20/20) | Derived Snellen |
|---|---|---|---|
| birth–1 mo (clamped) | 0.852 | 1.55 | ~20/704 |
| 2 mo | 1.744 | 1.24 | ~20/344 |
| 3 mo | 2.668 | 1.05 | ~20/225 |
| 4 mo | 3.627 | 0.92 | ~20/165 |
| 6 mo | 5.642 | 0.73 | ~20/106 |
| 9 mo | 8.293 | 0.56 | ~20/72 |
| 12 mo | 9.383 | 0.50 | ~20/64 |
| 18 mo | 9.891 | 0.48 | ~20/61 |
| 24 mo | 11.592 | 0.41 | ~20/52 |

Week-by-week values (months = weeks/4.345; derived): 0–4 wk: 0.852 (clamp) · 6 wk: 1.29 · 8 wk: 1.60 · 10 wk: 2.02 · 12 wk: 2.45 · 16 wk: 3.32 · 20 wk: 4.22 · 24 wk: 5.15 · 28 wk: 6.10 · 36 wk: 7.76 · 48 wk: 9.17 · 72 wk: 9.69 · 96 wk: 10.88 cpd.

**Conflict to document:** MIMo grows! Fig. 3(d) (pixel-measured) shows 1/2/4/6/12/18/24-month curves with cutoffs 0.85/1.00/1.17/1.36/1.60/1.90/2.24 cpd — these equal code-table entries for ages 1.0–2.547 months, so the figure's age labels contradict the shipped table. If you prefer the figure's reading (e.g., 24 mo ≈ 2.2 cpd), you would be using values the current code assigns to ~2.5 months.

### 2. The blur filter itself (acuity → image degradation)
**Source:** MIMo grows! Eq. 2 (paper) and `mimoVision/vision.py` (code).
- **Paper version (linear):** CSF_a(f) = 1 − f/a for f < a, else 0; f in cpd, a = acuity (cpd) from the table above.
- **Code version (power law, actually shipped):** MTF(f) = 1 for f < 0.1 cpd; else MTF(f) = (10·f)^(−2/(1+log10 a)), clipped to [0.01, 0.99]; satisfies MTF(a) = 0.01.
- **Application recipe (code):** per RGB channel: FFT2 → fftshift → multiply each frequency bin by MTF(|f|) → inverse shift → IFFT2 → magnitude → clamp to [0,255].
- **Frequency calibration for a camera feed:** pixels-per-degree = image_height / vertical_FOV_degrees (MIMo uses max(w,h)/fovy, with 256×256 and fovy 60° → ≈4.27 px/deg, Nyquist ≈2.13 cpd at that resolution — a real caveat: at 256×256/60° the render itself cannot represent acuities above ~2.1 cpd; a browser simulator should use a higher resolution, e.g., 720p/60° → 12 px/deg → Nyquist 6 cpd, or 1080p → 18 px/deg → 9 cpd).

### 3. Field of view / camera geometry
**Source:** MIMo model XMLs (main repo and mom-for-mimo); MIMo grows! Fig. 3 caption.
- Vertical FOV **60°** per eye (fovy=60 in MuJoCo), binocular cameras, 22.5 mm camera baseline (not age-scaled).
- No paper provides infant visual-field-development data (e.g., the known restriction of newborn visual field); 60° is a rendering convention, not a measured infant field.

### 4. Foveation (optional)
**Source:** MIMo grows! Sec. IV-B + code.
- Log-polar warp: r_src = R·expm1((r_dst/R)·log1p(λ))/λ; R = max distance from image center to a corner; strength λ: 0 = none, <5 mild, >20 strong; MIMo default λ = 10.
- Simplification: uniform acuity filter + geometric warp; no true eccentricity-dependent acuity.

### 5. Color vision
**Source:** Paper 1 (CDiet) — the only quantitative color model among the three papers, and it is **not age-anchored**.
- 5-stage saturation blend: s·I_color + (1−s)·I_gray with s ∈ (0.20–0.36) → (0.36–0.52) → (0.52–0.68) → (0.68–0.84) → (0.84–1.0); MIMo models no color development at all.
- For a week-based simulator you must choose the stage→age mapping yourself (e.g., 5 stages across 0–6 months); the supporting literature for the *shape* (rapid chromatic sensitivity increase in early infancy) is Werner & Wooten 1979, Dobkins et al. 2001, Crognale 2002, Skelton et al. 2022, Maule et al. 2023 (all cited by Paper 1; none provide the numeric schedule).

### 6. Alternative blur model (pixel-σ Gaussian)
**Source:** Paper 1 (ADiet) — not age-anchored.
- Gaussian blur σ = 4 → 3 → 2 → 1 → 0 px (kernels 25/19/13/7/1 px) on 224×224 images, 5 stages. Rationale: acuity grows ~exponentially in the first year (Norcia & Tyler 1985; Teller 1997 — values not in Paper 1).

### 7. Temporal aspects (optional)
**Source:** MIMo grows! Sec. IV-C.
- Sensorimotor delays: simulation timestep 5 ms; tested sensory delays 0 / 50 / 200 ms; cited human estimates: 50–100 ms proprioceptive, ~200 ms fastest adult exteroceptive reaction (Manning et al. 2012; Whelan 2008). A live camera filter could optionally add a 100–200 ms latency at young ages, but no age→delay schedule is given in any paper.

### 8. Gaps (nothing usable found in these three papers)
- **Contrast sensitivity:** no measured CSF data (peak sensitivity, low-frequency falloff) at any age — only MIMo's simplified low-pass MTF; the paper explicitly notes it ignores low-frequency insensitivity.
- **Visual field development:** nothing quantitative in any paper.
- **Acuity before 1 month:** nothing; MIMo clamps to the 1-month value.
- **Binocular vs monocular:** MIMo's table is monocular Teller norms; binocular acuity is typically ~1.5–2× monocular in infancy — not addressed in these papers.
- **Snellen/logMAR values:** not stated in any of the three papers; the conversions in section 1 are mine (30 cpd = 20/20 convention).
