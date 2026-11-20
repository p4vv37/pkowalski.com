# Infant visual development: quantitative data for the baby vision simulator

Research notes collected 2026-11-20 to ground a browser "baby vision simulator" that filters a live camera feed by the baby's week after birth (blur → sharp, plus contrast and color effects).

**Evidence labels used throughout:**

- ✅ **Established** — number stated directly in a primary study / authoritative review (linked).
- 🔎 **Derived** — computed by this research from published values (method stated); use as interpretation, not as a citation.
- ⚠️ **Approximation / judgment** — a defensible simplification for rendering, explicitly flagged as such.

Unit conventions: grating acuity in **cycles/degree (c/deg)**; conversion **30 c/deg ≈ 20/20 ≈ logMAR 0** (one bar of a 30 c/deg grating subtends 1 arcmin), so logMAR = log₁₀(30/cpd) and Snellen denominator = 20 × (30/cpd). Note that **grating (resolution/detection) acuity is not the same as recognition (optotype) acuity** — gratings systematically overestimate the toddler's letter acuity [Neijzen et al. 2025, Introduction](https://europepmc.org/articles/PMC12069961).

---

## 1. Visual acuity norms by age

### 1.1 The two measurement families (why numbers differ)

| Method | What it measures | Typical values |
|---|---|---|
| Behavioral (FPL / Teller Acuity Cards) | Grating detection via preferential looking | Lower; the clinical gold standard 0–36 months ✅ [Neijzen 2025](https://europepmc.org/articles/PMC12069961) |
| Sweep VEP (cortical) | Electrophysiological response threshold | Higher (cortex responds to gratings the baby can't behaviorally resolve) ✅ [Norcia 1990](https://europepmc.org/article/MED/2247957) |
| Recognition acuity (HOTV/ETDRS) | Optotype identification (older toddlers) | Lower than grating acuity at same age ✅ [Leone 2014](https://doi.org/10.1111/aos.12366) |

A simulator should use **behavioral (TAC) values** — they represent what the infant demonstrably resolves.

### 1.2 Master acuity table

TAC II columns are 🔎 **derived geometric means** computed from the 95% prediction limits published in Appendix A (Table A1) of the [Neijzen et al. 2025 TAC II meta-analysis](https://europepmc.org/articles/PMC12069961) (5 studies 1990–2006, 837 binocular / 1052 monocular assessments, ages 0–36 months; limits = mean ± 1.96 SD in the log domain, SD ≈ constant, so the geometric mean of the two limits recovers the fitted mean/median). Interpolation between the published age points is linear in log-age/log-acuity.

| Age | TAC II mono 🔎 c/deg | logMAR / Snellen | TAC II bino 🔎 c/deg | logMAR / Snellen | Sweep VEP ✅ [Norcia 1990] | Clinical milestone ✅ [AAO EyeWiki](https://eyewiki.aao.org/Visual_Acuity_Assessment_in_Children) |
|---|---|---|---|---|---|---|
| Birth (newborn, in-hospital) | — | 0.78 c/deg (dLIM median); 1.20 c/deg (MCS median) ✅ [Brown 2018](https://europepmc.org/articles/PMC6016435) | — | ≈ 0.5–1 c/deg | ~5 c/deg "during the first month" | 20/400 |
| 1 month | 0.69 | 1.64 / 20/870 | 1.05 | 1.45 / 20/570 | ~5 c/deg | — |
| 2 months | 1.41 | 1.33 / 20/430 | 2.06 | 1.16 / 20/290 | rising | — |
| 3 months | 2.15 | 1.14 / 20/280 | 3.01 | 1.00 / 20/200 | rising | TAC ≈ 20/200 (EyeWiki) |
| 4 months | 2.92 | 1.01 / 20/210 | 3.92 | 0.88 / 20/150 | rising | 20/200 |
| 6 months | 4.53 | 0.82 / 20/130 | 5.63 | 0.73 / 20/110 | rising | 20/120 |
| 9 months | 6.64 | 0.65 / 20/90 | 7.72 | 0.59 / 20/78 | → 16.3 c/deg at 8 mo | — |
| 12 months | 7.50 | 0.60 / 20/80 | 9.01 | 0.52 / 20/67 | ~16 c/deg | 20/60 |
| 18 months | 7.89 | 0.58 / 20/76 | 10.44 | 0.46 / 20/57 | — | — |
| 24 months | 9.23 | 0.51 / 20/65 | 12.05 | 0.40 / 20/50 | — | 20/20 (milestone table) |
| 36 months | 13.83 | 0.34 / 20/43 | 15.80 | 0.28 / 20/38 | — | TAC "20/20 at 36 months" (EyeWiki, citing Mayer) |
| 4 years+ | — | — | — | — | — | ATS-HOTV mean 0.13 logMAR (<36 mo) → −0.01 logMAR (66–<72 mo) ✅ [Leone 2014](https://doi.org/10.1111/aos.12366) |

Independent cross-checks of the derived curve:

- Sydney study, measured monocular TAC II: **5.7 c/deg (0.72 logMAR) at 6–<9 months**, 12.4 c/deg (0.38 logMAR) at 30–<33 months ✅ [Leone 2014](https://doi.org/10.1111/aos.12366) — vs. derived 5.7 c/deg at 7.5 months and 11.7 c/deg at 31 months. Excellent agreement.
- EyeWiki, citing Mayer 1995: Teller acuities range from **6/240 (20/800) in the newborn to 6/60 (20/200) at 3 months** ✅ — matches derived binocular 20/570–20/200 at those ages.
- ⚠️ **Known discrepancy at 24–36 months:** the derived TAC II mean (≈20/38–20/50 binocular) is well below EyeWiki's "20/20 at 36 months". Likely causes: the meta-analysis subtracts 0.3 octave from TAC I data to align with TAC II, includes unstaged clinical testing, and grating-vs-recognition differences. For a simulator, anything in the 20/40–20/20 range for age 3 is defensible; the TAC II meta-analysis values are the more conservative, more recent synthesis.

### 1.3 Raw meta-analysis table (for implementing the curve)

🔎 Values as published (linear c/deg, 95% prediction limits, [Neijzen 2025 Appendix A](https://europepmc.org/articles/PMC12069961)); geometric mean = √(lower×upper):

| Age (mo) | Mono lower | Mono upper | Age (mo) | Bino lower | Bino upper |
|---|---|---|---|---|---|
| 1.000 | 0.353 | 1.351 | 0.500 | 0.241 | 1.173 |
| 1.169 | 0.414 | 1.587 | 0.602 | 0.291 | 1.403 |
| 1.366 | 0.485 | 1.864 | 0.725 | 0.352 | 1.677 |
| 1.596 | 0.568 | 2.191 | 0.873 | 0.424 | 2.004 |
| 1.865 | 0.666 | 2.576 | 1.052 | 0.511 | 2.392 |
| 2.179 | 0.781 | 3.032 | 1.267 | 0.616 | 2.853 |
| 2.547 | 0.917 | 3.572 | 1.526 | 0.741 | 3.400 |
| 2.976 | 1.078 | 4.212 | 1.838 | 0.890 | 4.045 |
| 3.478 | 1.269 | 4.973 | 2.213 | 1.067 | 4.805 |
| 4.064 | 1.496 | 5.881 | 2.665 | 1.277 | 5.697 |
| 4.750 | 1.767 | 6.967 | 3.210 | 1.526 | 6.740 |
| 5.550 | 2.090 | 8.268 | 3.866 | 1.818 | 7.956 |
| 6.486 | 2.473 | 9.812 | 4.656 | 2.161 | 9.368 |
| 7.580 | 2.891 | 11.506 | 5.607 | 2.562 | 10.999 |
| 8.858 | 3.292 | 13.144 | 6.753 | 3.023 | 12.853 |
| 10.351 | 3.600 | 14.416 | 8.133 | 3.518 | 14.819 |
| 12.096 | 3.749 | 15.061 | 9.796 | 4.000 | 16.687 |
| 14.135 | 3.795 | 15.293 | 11.797 | 4.403 | 18.195 |
| 16.519 | 3.839 | 15.516 | 14.208 | 4.735 | 19.379 |
| 19.304 | 3.988 | 16.170 | 17.112 | 5.072 | 20.562 |
| 22.558 | 4.347 | 17.679 | 20.608 | 5.519 | 22.164 |
| 26.362 | 4.937 | 20.143 | 24.820 | 6.156 | 24.486 |
| 30.806 | 5.765 | 23.592 | 29.892 | 6.986 | 27.525 |
| 36.000 | 6.824 | 28.015 | 36.000 | 7.998 | 31.210 |

⚠️ Caveats stated by the authors: data are sparse below 3 months (knots placed at 5.6/10.4/19.3 months to avoid overfitting); no monocular data points below 1 month; TAC I values were corrected down 0.3 octave to TAC II equivalence.

### 1.4 Newborn (week 0) acuity — primary data

- ✅ Median acuity of healthy in-hospital newborns (fixation–refixation card procedure, descending method of limits): **0.783 c/deg = logMAR 1.558 = 20/766**; pilot (method of constant stimuli): 1.204 c/deg = 20/498. Peak newborn contrast sensitivity estimated at ~0.22 c/deg. [Brown, Opoku & Stenger 2018, *Transl Vis Sci Technol* 7(3):18](https://europepmc.org/articles/PMC6016435)
- ✅ OKN-based estimate in newborns: "at least 6/120 (20/400)" (Gorman et al. 1957, cited in [AAO EyeWiki](https://eyewiki.aao.org/Visual_Acuity_Assessment_in_Children)).
- ✅ Sweep VEP: grating acuity ~**5 c/deg during the first month** (cortical threshold — deliberately higher than behavioral; do not use for "what baby sees" rendering). [Norcia, Tyler & Hamer 1990](https://europepmc.org/article/MED/2247957)
- ⚠️ Practical rendering value for week 0: **~0.7–1.2 c/deg (≈20/400–20/800)**.

### 1.5 Weekly resolution

- **No weekly-resolution normative acuity dataset was found.** The Teller literature reports in month-scale age bins (Mayer 1995: 12 age groups 1 month–4 years, N=460 ✅ [abstract](https://europepmc.org/article/MED/7890497); Neijzen 2025 meta-analysis: continuous spline over 0.5–36 months but sparse <3 months).
- Closest to weekly resolution: **Norcia et al. 1990** sweep VEP sampled 2–40 weeks (e.g., contrast threshold "7% at 2–3 weeks", low-frequency asymptote "0.5% at 9 weeks") ✅ — fine-grained in early weeks but electrophysiological.
- The **TinyEyes** model (§6) uses hand-tuned anchors at weeks 0/4/8/12/24 — a precedent for weekly-style interpolation between monthly anchors.
- ⚠️ Recommendation: interpolate the TAC II meta-analysis curve continuously by week (it is a smooth regression, so any age can be evaluated), and label weeks 0–4 as extrapolation anchored on the newborn values above.

---

## 2. Contrast sensitivity development

All contrast values are Michelson contrast; sensitivity = 1/threshold.

| Age | Contrast threshold (peak / low spatial frequency) | Source |
|---|---|---|
| Newborn (in-hospital) | ✅ **~0.46 (46%)** at 0.083 c/deg (median, dLIM); ~0.33 (MCS pilot); estimated CSF peak ~0.31 threshold (sensitivity 3.15) at ~0.22 c/deg | [Brown et al. 2018](https://europepmc.org/articles/PMC6016435) |
| Newborn (earlier report, reanalyzed) | ✅ sensitivity ≈ 2.0 → threshold ≈ 0.497 (49.7%) at 0.10 c/deg | Brown et al., cited in same paper |
| 2–3 weeks | ✅ **7%** at low spatial frequencies (sweep VEP) | [Norcia et al. 1990](https://europepmc.org/article/MED/2247957) |
| 9 weeks | ✅ low-SF threshold reaches an **asymptote of 0.5%** | [Norcia et al. 1990](https://europepmc.org/article/MED/2247957) |
| Adults | ✅ **0.32–0.22%** at low SF (same sweep-VEP setup) | [Norcia et al. 1990](https://europepmc.org/article/MED/2247957) |

Key developmental facts (all ✅ [Norcia, Tyler & Hamer 1990](https://europepmc.org/article/MED/2247957), sweep VEP, 48 infants 2–40 weeks + 10 adults):

- **Two phases:** between 4 and 9 weeks, overall contrast sensitivity increases **4–5× at all spatial frequencies**; beyond 9 weeks, low-SF sensitivity stays constant while high-SF sensitivity keeps improving.
- Grating acuity (VEP) rose from ~5 c/deg (first month) to 16.3 c/deg at 8 months vs. 31.9 c/deg adult mean.
- Behavioral confirmation that young infants need high contrast and benefit from motion: [Atkinson, Braddick & Moar 1977](https://doi.org/10.1016/0042-6989(77)90008-6) (classic FPL study of moving vs static gratings; infants' sensitivity to moving patterns exceeds static).
- **When does it reach adult levels?** Contrast sensitivity does **not** fully mature until somewhere between **8 and 19 years** (review of studies comparing children to adults; visual acuity matures between 5 years and mid-teens). ✅ [Leat, Yadav & Irving 2009, *J Optom* 2(1):19–26](https://doi.org/10.3921/joptom.2009.19) ([open access](https://europepmc.org/articles/PMC3972638))

🔎 Interpretation for the simulator: the biggest perceptual contrast change happens in weeks 2–9 (threshold falls 46% → 7% → ~0.5%); after ~2 months, low-frequency contrast is essentially adult-like and remaining immaturity is confined to fine detail (high spatial frequencies), which is already captured by the blur.

---

## 3. Color vision development

Timeline (all ✅ unless flagged):

- **Newborn (days–weeks):** color vision is real but very limited. With a luminance-controlled card procedure, **74% of newborns discriminated a large (10.5° × 17.5°) saturated red patch from all luminances of grey, but only 14% discriminated blue, 36% green, 25% yellow**; at 1 month, still only red was clearly discriminated. [Adams, Courage & Mercer 1994, *Vision Res* 34(13):1691–1701](https://doi.org/10.1016/0042-6989(94)90127-9)
- **Red–green (L–M) mechanism develops first; blue–yellow (S-cone) mechanism ~4–8 weeks later; infants are trichromatic (both cone-opponent mechanisms active) by ~3 months.** Converging psychophysical + VEP evidence reviewed in [Teller 1998] and restated in [Skelton, Maule & Franklin 2022, *Child Dev Perspect* 16(2):90–95](https://doi.org/10.1111/cdep.12447) ([open access](https://europepmc.org/articles/PMC9314692)).
- Direct tritan (blue–yellow, S-cone) test: **most 2-month-olds and "older" 1-month-olds made the tritan discrimination; most of the youngest 1-month-olds failed** → functional S-cones not behaviorally reliable until ~4–8 weeks. [Varner, Cook, Schneck, McDonald & Teller 1985, *Vision Res* 25:821–831](https://doi.org/10.1016/0042-6989(85)90190-7)
- **By ~4 months:** categorical hue perception — infants treat the physical continuum as the categories blue/green/yellow/red. [Bornstein, Kessen & Weiskopf 1976, *Science* 191:201–202](https://doi.org/10.1126/science.1246610); age of the classic 4-month findings per [Skelton et al. 2022](https://europepmc.org/articles/PMC9314692).
- **Saturation discrimination stays immature long after:** saturation thresholds do not reach adult levels until **late adolescence** (Knoblauch et al. 2001, cited in [Skelton et al. 2022](https://europepmc.org/articles/PMC9314692)).
- Why early color vision is poor: **"The overall insensitivity of infants to contrast is likely to provide a satisfactory explanation of the poor color vision of infants"** — i.e., it is largely a contrast-threshold problem, not absent cone machinery. [Brown AM 1990, *Vision Res* 30(8):1159–1188, critical review](https://doi.org/10.1016/0042-6989(90)90173-i) (same review: color vision improves greatly over the first 3 postnatal months; most normal 3-month-olds have at least some color vision).

### Defensible simplification for rendering

- ✅ **Not full grayscale.** "Contrary to the common view that infants see only in black and white, even neonates can detect some color" — specifically large, highly saturated, long-wavelength (red) stimuli ([Skelton et al. 2022](https://europepmc.org/articles/PMC9314692); [Adams et al. 1994](https://doi.org/10.1016/0042-6989(94)90127-9)).
- ⚠️ **Recommended rendering model (approximation grounded in the above):**
  - Weeks 0–~4: near-grayscale with strongly muted reds preserved (L−M channel attenuated, S channel ~zero).
  - Weeks ~4–8: red–green discrimination progressively comes in; blue–yellow still ~absent (Varner 1985).
  - Weeks ~8–12: blue–yellow comes in (trichromatic by ~3 months).
  - Months 3+: full hue range but desaturated colors still poorly discriminated — keep a mild saturation penalty through toddlerhood (saturation thresholds adult only in adolescence).

  This is exactly the structure used by the TinyEyes prior-art model (§6): opponent-channel blur sigmas with chromatic channels blurred 100–1000× more than luminance at week 0, converging to adult values by week 24.

---

## 4. Visual field extent in young infants (brief)

- ✅ **Newborn horizontal visual field extent ≈ 30°** of visual angle (measured with a 99%-contrast stimulus; the source notes it widens for lower-contrast assumptions). [Brown et al. 2018](https://europepmc.org/articles/PMC6016435), citing Mohn & van Hof-van Duin.
- ✅ The monocular field **expands from the center outward** during infancy, and **nasal field development lags temporal** (static perimetry, birth–6 months, 3°/6° flashing targets out to 120°). [Lewis & Maurer 1992, *Vision Res* 32(5):903–911](https://doi.org/10.1016/0042-6989(92)90033-F)
- ✅ Measured fields approach adult levels around **17 months** with kinetic perimetry, but only around **30 months** with static perimetry (180 children 3.5–30 months, double-arc LED perimeter). [Dobson, Brown, Harvey & Narter 1998, *Vision Res* 38(18):2743–2760](https://doi.org/10.1016/S0042-6989(97)00437-9)
- ⚠️ Relevance to a flat 2D camera view: minor. A fixed camera already discards head/eye movement; the main defensible use is an optional **vignette** (soft peripheral falloff) in the first ~2–3 months, since the central-vs-peripheral acuity gradient plus the small field both concentrate effective vision near the fovea. This is a rendering judgment, not a measured 2D projection.

---

## 5. Two specific papers (abstracts)

### 5.1 MIMo: A Multi-Modal Infant Model for Studying Cognitive Development

[Mattern, Schumacher, López, Raabe, Ernst, Aubret & Triesch — arXiv:2312.04318 (Dec 2023), submitted to IEEE TCDS; extends a prior ICDL version](https://arxiv.org/abs/2312.04318). Code: [github.com/trieschlab/MIMo](https://github.com/trieschlab/MIMo).

**What it contains:** an open-source *embodied simulation* platform for cognitive-development research. The body is modeled after an 18-month-old child with detailed five-fingered hands; it perceives via **binocular vision, a vestibular system, proprioception, and full-body virtual touch skin**, with two actuation models. Purpose: letting researchers run self-determined, embodied sensorimotor learning experiments (contrast with passively trained LLMs).

**Relevance to a rendering simulator: low.** MIMo is an ML/robotics research environment for modeling cognition, not a perceptual rendering model — it contains no age-parameterized acuity/contrast/color transfer function for producing "what the baby sees" images. Its interest here is contextual (the embodiment framing), and possibly as a citation for why infant models matter.

### 5.2 The development of coarse and fine feature tuning in infant visual cortex

[Dineen, O'Doherty, Truzzi, Kravchenko, Wade, King, D'Arcy, Byrne, Tarrant, Foran, Molloy & Cusack — bioRxiv preprint, posted 2026-10-16, DOI 10.64898/2026.10.14.758935](https://www.biorxiv.org/content/10.64898/2026.10.14.758935) ([abstract mirror](https://preprints.epiforecasts.io/paper/10.64898/2026.10.14.758935)).

**What it contains:** awake-infant fMRI combined with developmentally inspired deep neural networks trained/tested at different blur levels, probing cortical tuning to coarse vs fine visual features. Findings: **V1 showed mature tuning to coarse and fine features by 2 months**; **extrastriate cortex (V2–V4) followed a protracted trajectory, biased toward coarse object features relative to adults**, a bias persisting at 9 months and not readily explained by developing acuity. In the DNNs, low-spatial-frequency representations took longest to converge with visual cortex.

**Relevance to a rendering simulator: indirect but conceptually supportive.** It is neuroscience, not a rendering pipeline — but it *validates the blur metaphor*: even when the infant's optics/acuity allow fine detail, the cortex beyond V1 privileges coarse structure for many months. For the simulator this supports (a) heavy blur early, and (b) keeping a residual "coarse-feature bias" (mild extra smoothing of fine detail) well past the point where acuity alone would predict adult-like input. Note: first author A. T. Dineen (Trinity College Dublin) appears to be the same researcher credited with the PyTorch port of the TinyEyes simulator ([vischeck.com/about.html](https://www.vischeck.com/about.html)) — a nice sign that this research group connects infant-vision neuroscience with practical simulators (unverified beyond the name/affiliation match).

---

## 6. Prior art: existing "baby vision" simulators

### 6.1 TinyEyes (the key scientific prior art) — open source

- Web tool: [vischeck.com/tinyeyes.html](https://www.vischeck.com/tinyeyes.html); source: [github.com/wadelab/VischeckTinyeyes](https://github.com/wadelab/VischeckTinyeyes) (GPL-3.0). Original Vischeck launched 2000 by Robert Dougherty & Alex Wade (then Stanford postdocs); current team includes Heidi Baseler (York); PyTorch implementation by Áine Dineen (TCD). Self-described as an **"opponent-space blur model for infant visual development (age-dependent channel blur)"**.
- **Model (from `tinyeyes.js` / `TinyEyesTransform.py`):** RGB → LMS → opponent channels (luminance L+M, red–green L−M, blue–yellow S), each blurred by an age-keyed Gaussian; sigma values are in **degrees of visual angle**, scaled by pixels-per-degree computed from *display width* and *viewing distance* inputs:
  - `week0: [0.6821, 100, 1000]`, `week4: [0.48, 4.77, 100]`, `week8: [0.24, 2.4, 4]`, `week12: [0.1, 0.53, 2]`, `week24: [0.04, 0.12, 1]`, `adult: [0.01, 0.015, 0.02]` (order: luminance, L−M, S).
  - Code comment: "Values estimated by Prof Alex Wade and colleagues from developmental literature."
  - Effect: at week 0 the chromatic sigmas (100°/1000°) exceed any image → chroma is effectively averaged out (near-grayscale), while week 24 is near-adult. This is a direct precedent for the "reduced chromatic sensitivity, not full grayscale" approach, ramping by weeks 0/4/8/12/24.
- Inputs are **weeks** (0, 4, 8, 12, 24) — the closest existing tool to weekly resolution, though with only 6 age anchors.

### 6.2 BabySee (iOS app, Rebion + Boston Children's Hospital)

- [App Store page](https://apps.apple.com/us/app/babysee/id656222340). Real-time camera simulation: "Real-time video image simulates visual clarity, color, and contrast at your child's given age"; baby profiles with name/date-of-birth; adult-vs-baby comparison; photo import; EyeQ educational library. Developed by Rebion® with David G. Hunter, MD, PhD (Chief of Ophthalmology, Boston Children's Hospital). Age curve/parameters are proprietary and not published on the store page.

### 6.3 Vision Direct "vision development tool" (web, 2016)

- Announcement: [AOP Optometry Today, 3 Mar 2016](https://www.aop.org.uk/ot/news/2016/03/03/vision-direct-launches-vision-development-tool); Italian blog counterpart: [visiondirect.it](https://www.visiondirect.it/blog/come-vede-tuo-figlio). Interactive slider covering the **first year**: enter a child's age; "as the slider moves, colour and objects also become sharper"; includes depth-perception and color-awareness notes. Created "by opticians" (Head Optician Brendan O'Brien). No published parameterization.

### 6.4 Other tools

- **vinbis Baby Vision Simulator** (2026): free web tool, **real-time smartphone camera**, explicitly research-grounded and educational ("not a clinical tool"); [project page](https://www.vinbis.com/baby-vision-simulator-progetto-vista-neonati/), [app](https://www.vinbis.com/baby-vision-simulator/). Closest concept to the proposed project.
- **Calgary Vision Centre blog** "Through Your Baby's Eyes: From Blur to 20/20" (Aug 2026): static illustrative images by age; [URL](https://calgaryvisioncentre.com/blog/2026/8/20/what-can-your-baby-actually-see).
- **Baby Vision Simulator** (iOS app): [App Store](https://apps.apple.com/tw/app/baby-vision-simulator/id6753857476) — parameters not documented on page.
- **Baby Vision: Newborn Sight** (Android app, `com.exame.babyvision`): [Play Store listing via Apptopia](https://apptopia.com/google-play/app/com.exame.babyvision/about).
- **Dentsu "Child's Perspective Lab"**: experiential installation (not a parameterized tool); [dentsu-ho.com/en/articles/9123](https://dentsu-ho.com/en/articles/9123).
- Patient-facing milestone narratives (useful for copy, not numbers): [All About Vision infant vision guide](https://www.allaboutvision.com/eye-care/parents-kids/infant-vision/) (birth 20/200–20/400; "full color" by 5–6 months; depth perception from ~5 months).

**Gap the new simulator can fill:** no found tool combines (a) live camera, (b) week-level age resolution in the first 3 months, and (c) openly documented parameters tied to published TAC II / CSF / color-vision data. TinyEyes is the only open-source scientific model, and it has only 6 age anchors and no explicit contrast attenuation.

---

## 7. Synthesis: suggested parameterization (⚠️ interpretation section)

Grounded composite for a week-keyed filter pipeline (all "which curve" choices below are judgments; the anchor values are from the cited sources above):

1. **Blur (acuity):** convert target acuity A(age) in c/deg to a blur scale. A principled link: for a Gaussian PSF, the cutoff spatial frequency ~1/(π·σ), so σ ≈ 1/(π·A) degrees of visual angle. Examples 🔎: A=0.78 c/deg (newborn) → σ≈0.41°; A=3 c/deg (3 mo) → σ≈0.11°; A=5.6 c/deg (6 mo) → σ≈0.06°. Multiply by pixels-per-degree from the camera FOV. Use the TAC II binocular curve (§1.2) for months 0.5–36, anchored at 0.7–1.2 c/deg for week 0.
2. **Contrast:** apply a luminance-contrast ceiling per age: week 0 ≈ 40–50% threshold (Brown 2018) — i.e., compress image contrast toward its mean by roughly the infant:adult threshold ratio; weeks 2–9 rapidly approach low-SF adult-like (~2× adult by 9 weeks per Norcia); after week 9 keep only the high-frequency penalty (already in the blur). ⚠️ A simple, defensible approximation: contrast gain = adult_threshold/infant_threshold(age), interpolated log-linearly between the anchors in §2.
3. **Color:** opponent-space attenuation (TinyEyes precedent, §6.1): keep luminance; attenuate/blur L−M from ~5% at week 0 → ~full by weeks 8–12; S channel from ~0% at weeks 0–4 → ~full by weeks 10–12 (Adams 1994, Varner 1985, Teller 1998 timeline). Residual desaturation penalty (e.g., mild saturation reduction) through toddlerhood is defensible (Knoblauch 2001 via Skelton 2022).
4. **Optional vignette** for weeks 0–12 (visual field §4) — cosmetic, label as such.

---

## Source index

1. Neijzen CM, de Wit FM, Hettinga YM, de Boer JH, van Genderen MM, de Wit GC. *Reference values for the Teller Acuity Cards II (TAC II) in infants and preverbal children, a meta-analysis.* Acta Ophthalmol 2025;103(4):479–485. https://europepmc.org/articles/PMC12069961 (DOI 10.1111/aos.17447)
2. Mayer DL, Beiser AS, Warner AF, Pratt EM, Raye KN, Lang JM. *Monocular acuity norms for the Teller Acuity Cards between ages one month and four years.* Invest Ophthalmol Vis Sci 1995;36(3):671–685. https://europepmc.org/article/MED/7890497
3. Brown AM, Opoku FO, Stenger MR. *Neonatal Contrast Sensitivity and Visual Acuity: Basic Psychophysics.* Transl Vis Sci Technol 2018;7(3):18. https://europepmc.org/articles/PMC6016435 (DOI 10.1167/tvst.7.3.18)
4. Norcia AM, Tyler CW, Hamer RD. *Development of contrast sensitivity in the human infant.* Vision Res 1990;30(10):1475–1486. https://europepmc.org/article/MED/2247957 (DOI 10.1016/0042-6989(90)90028-J)
5. Atkinson J, Braddick O, Moar K. *Contrast sensitivity of the human infant for moving and static patterns.* Vision Res 1977;17(9):1045–1047. https://doi.org/10.1016/0042-6989(77)90008-6
6. Leat SJ, Yadav NK, Irving EL. *Development of Visual Acuity and Contrast Sensitivity in Children.* J Optom 2009;2(1):19–26. https://doi.org/10.3921/joptom.2009.19 (open access: https://europepmc.org/articles/PMC3972638)
7. Leone JF, Mitchell P, Kifley A, Rose KA. *Normative visual acuity in infants and preschool-aged children in Sydney.* Acta Ophthalmol 2014;92(7):e521–e529. https://doi.org/10.1111/aos.12366
8. Skelton AE, Maule J, Franklin A. *Infant colour perception: Insight into perceptual development.* Child Dev Perspect 2022;16(2):90–95. https://doi.org/10.1111/cdep.12447 (open access: https://europepmc.org/articles/PMC9314692)
9. Adams RJ, Courage ML, Mercer ME. *Systematic measurement of human neonatal color vision.* Vision Res 1994;34(13):1691–1701. https://doi.org/10.1016/0042-6989(94)90127-9
10. Varner D, Cook JE, Schneck ME, McDonald MA, Teller DY. *Tritan discriminations by 1- and 2-month-old human infants.* Vision Res 1985;25(6):821–831. https://doi.org/10.1016/0042-6989(85)90190-7
11. Bornstein MH, Kessen W, Weiskopf S. *The categories of hue in infancy.* Science 1976;191(4223):201–202. https://doi.org/10.1126/science.1246610
12. Brown AM. *Development of visual sensitivity to light and color vision in human infants: a critical review.* Vision Res 1990;30(8):1159–1188. https://doi.org/10.1016/0042-6989(90)90173-I
13. Lewis TL, Maurer D. *The development of the temporal and nasal visual fields during infancy.* Vision Res 1992;32(5):903–911. https://doi.org/10.1016/0042-6989(92)90033-F
14. Dobson V, Brown AM, Harvey EM, Narter DB. *Visual field extent in children 3.5–30 months of age tested with a double-arc LED perimeter.* Vision Res 1998;38(18):2743–2760. https://doi.org/10.1016/S0042-6989(97)00437-9
15. AAO EyeWiki. *Visual Acuity Assessment in Children* (reviewed up to date June 2026). https://eyewiki.aao.org/Visual_Acuity_Assessment_in_Children
16. Mattern D, Schumacher P, López FM, Raabe MC, Ernst MR, Aubret A, Triesch J. *MIMo: A Multi-Modal Infant Model for Studying Cognitive Development.* arXiv:2312.04318 (2023). https://arxiv.org/abs/2312.04318 — code https://github.com/trieschlab/MIMo
17. Dineen AT, et al. *The development of coarse and fine feature tuning in infant visual cortex.* bioRxiv 2026.10.14.758935 (2026). https://www.biorxiv.org/content/10.64898/2026.10.14.758935
18. Dougherty R, Wade A, Baseler H. *Vischeck / TinyEyes* (incl. source). https://www.vischeck.com/tinyeyes.html — https://github.com/wadelab/VischeckTinyeyes
19. Rebion / Boston Children's Hospital. *BabySee* (iOS app). https://apps.apple.com/us/app/babysee/id656222340
20. AOP Optometry Today. *Vision Direct launches vision development tool* (2016). https://www.aop.org.uk/ot/news/2016/03/03/vision-direct-launches-vision-development-tool
21. Bisceglie V. *Baby Vision Simulator* (2026). https://www.vinbis.com/baby-vision-simulator-progetto-vista-neonati/
22. Calgary Vision Centre. *Through Your Baby's Eyes: From Blur to 20/20* (2026). https://calgaryvisioncentre.com/blog/2026/8/20/what-can-your-baby-actually-see
23. All About Vision. *Your baby's vision: How it develops and what to expect.* https://www.allaboutvision.com/eye-care/parents-kids/infant-vision/
