# Infant accommodation, refraction, pupil size, and depth of focus: quantitative data for the "depth of field" newborn-vision simulator

Research notes collected 2026-11-20. Companion file to [`infant-vision-data.md`](./infant-vision-data.md) (which covers acuity, contrast sensitivity, color, and visual field). This file covers **everything needed to compute defocus blur**: the infant's plane of best focus by age, accommodation accuracy, refractive error, pupil diameter, and depth of focus — each with a primary source.

**The simulation concept this grounds:** a newborn focuses sharply at one distance (measured median ≈ 19 cm); objects at other distances are defocused by a computable number of diopters, and the resulting blur disc size is `pupil diameter × defocus` (angular blur circle, exact paraxial formula in §6).

**Evidence labels used throughout:**

- ✅ **Measured** — number stated directly in a primary study or peer-reviewed review (linked).
- 🔎 **Derived** — computed here from published values (method stated); use as interpretation, not as a citation.
- ⚠️ **Folklore / approximation** — popular claim or defensible simplification, explicitly flagged.

**A citation correction up front:** the frequently cited "Banks (1980), *Vision Research*" is actually **Banks, M. S. (1980). "The development of visual accommodation during early infancy." *Child Development* 51(3):646–666** ([PubMed 7418504](https://pubmed.ncbi.nlm.nih.gov/7418504/), [doi:10.2307/1129450](https://doi.org/10.2307/1129450)). Banks did publish a *separate* 1980 review of infant refraction and accommodation — in *International Ophthalmology Clinics* 20(1):205–232 ([PubMed 7399818](https://pubmed.ncbi.nlm.nih.gov/7399818/), [doi:10.1097/00004397-198002010-00010](https://doi.org/10.1097/00004397-198002010-00010)). Neither is in *Vision Research*; the classic infant-accommodation papers in *Vision Research* from that group are Green, Powers & Banks (1980, depth of focus) and Braddick, Atkinson, French & Howland (1979, photorefraction).

---

## 1. Resting / preferred focus in newborns and young infants — and the "8–12 inches" claim

### 1.1 The founding measurement (Haynes, White & Held 1965)

> "By the technique of dynamic retinoscopy, we found that the alert newborn infant can focus his eye on targets only at a particular distance (**median, 19 centimeters**). Images of targets nearer or farther away are proportionately blurred. However, during the first few postnatal months the range of flexible accommodation increases and approximates adult performance by the 4th month." — [Haynes, White & Held 1965, *Science* 148(3669):528–530](https://doi.org/10.1126/science.148.3669.528) ([PubMed 14263778](https://pubmed.ncbi.nlm.nih.gov/14263778/)) ✅

Key numbers:

| Quantity | Value | Source |
|---|---|---|
| Alert newborn's fixed plane of focus | **median 19 cm ≈ 5.3 D** (1/0.19 m) | ✅ Haynes et al. 1965 (abstract, quoted above) |
| Accommodation response 0–1 month, per the Currie & Manny review of Haynes et al. | **≈ 5 D at all target distances** (8–100 cm tested; i.e., fixed focus) | ✅ reported in [Currie & Manny 1997, *Vision Research* 37(11):1525–1533](https://pubmed.ncbi.nlm.nih.gov/9205713/), Table of accommodation-development findings (table reproduced in [Reed 1994 thesis](https://commons.pacificu.edu/opt/1143), ch. 2) |
| Sleeping vs. alert newborns (<1 month) | sleeping infants showed **on average 5 D less accommodation** than when awake and alert | ✅ Haynes et al., as summarized in [Candy 2010, *J Behavioral Optometry* 21(4):95–98](https://www.oepf.org/wp-content/uploads/2021/08/21-420Candy1.pdf) |
| When adult-like flexibility is reached | "approximates adult performance by the **4th month**" | ✅ Haynes et al. 1965 (abstract) |

This is exactly the "one sharp distance, computable defocus elsewhere" behavior the simulator needs: the newborn's eye sits at ≈ 5 diopters of accommodation; a target at distance *d* (in diopters, = 1/*d* in m) is defocused by roughly **|5.3 − d⁻¹| diopters** 🔎 (derived from the 19-cm median).

### 1.2 Replications and the modern consensus

- **Banks 1980 (Child Development):** dynamic retinoscopy at 25, 50, and 100 cm (+4, +2, +1 D) in 1- to 3-month-olds, 4 experiments; experiment 4 measured **pupil diameter by infrared photography**. Conclusion: better accommodative capability from 1 to 3 months than Haynes et al. originally reported; age-related **changes in depth of focus** (from pupil size and acuity) "are largely responsible for growth in accommodation." ✅ [Banks 1980, *Child Development* 51(3):646–666](https://pubmed.ncbi.nlm.nih.gov/7418504/)
- **Braddick, Atkinson, French & Howland 1979** (isotropic photorefraction, targets at 0.75 and 1.5 m): infants **<9 days focused at ≈ 0.75 m distance**; at 2–3 months, consistent focus at 1.5 m in 60–70% of infants; by **6–8 months, consistent focus at 1.5 m in all infants**. ✅ [Braddick et al. 1979, *Vision Research* 19:1319–1330](https://pubmed.ncbi.nlm.nih.gov/?term=Braddick+Atkinson+French+Howland+photorefractive+infant+accommodation), findings as tabulated in [Currie & Manny 1997](https://pubmed.ncbi.nlm.nih.gov/9205713/)
  - ⚠️ Note the discrepancy vs. Haynes: photorefraction placed the very young infant's focus farther away (~0.75 m) than retinoscopy did (19 cm). Absolute diopter values differ across techniques by up to ~1 D because of the retinal-reflection-plane problem (see §3.4). Both agree the response is nearly **fixed** in the first weeks.
- **Hainline, Riddell, Grose-Fifer & Abramov 1992:** "a number of infants less than two months of age typically focused at around **30 cm**." ✅ as summarized in [Candy 2010](https://www.oepf.org/wp-content/uploads/2021/08/21-420Candy1.pdf) (original: [Hainline et al. 1992, *Behavioural Brain Research* 49(1):33–50](https://pubmed.ncbi.nlm.nih.gov/?term=Hainline+Riddell+Grose-Fifer+Abramov+accommodation+convergence+infancy))
- **Candy's 2010 review consensus:** infants **< ~2 months** "tend to over-accommodate for distant targets and under-accommodate for very close ones. They tend to maintain their focus around an intermediate distance even though they are typically hyperopic." ✅ [Candy 2010](https://www.oepf.org/wp-content/uploads/2021/08/21-420Candy1.pdf)
- **Modern (PowerRefractor) work:** "The gains of accommodation and vergence in binocular naturalistic conditions can be almost adult-like at three months of age." ✅ [Bharadwaj & Candy 2009, *Journal of Vision* 8(16):14, 1–16](https://pmc.ncbi.nlm.nih.gov/articles/PMC2643357/) ([doi:10.1167/8.16.14](https://doi.org/10.1167/8.16.14))

### 1.3 Where "babies see best at 8–12 inches (20–30 cm)" comes from

⚠️ **Folklore with a measured core.** No primary paper states "8–12 inches." The measured fixed-focus / preferred-focus distances in the primary literature are **19 cm (≈7.5 in; Haynes et al. 1965)** and **≈30 cm (≈12 in; Hainline et al. 1992)**. The popular "8–12 inches (20–30 cm)" phrase is a rounded bracket spanning those two measurements; it circulates in parenting and pop-science sources essentially without citation (e.g., [ScienceInsights 2026](https://scienceinsights.org/how-far-can-a-newborn-baby-see-about-8-12-inches/) offers the 8–12-inch claim with no primary source, pairing it with the (separate) folklore-grade acuity figure 20/400). ⚠️ If the simulator wants a defensible number, use **19 cm ≈ 5.3 D** (median, dynamic retinoscopy, alert newborns) as the anchor and treat "8–12 in" as the popularization.

Also note what the claim conflates: 19–30 cm is the newborn's **plane of best focus**, not the distance of "best vision" in general — because the newborn's depth of focus is ±1.5–2.4 D (§5), acuity is nearly constant across a wide range of distances in the first month ([Salapatek, Bechtold & Bushnell 1976](https://pubmed.ncbi.nlm.nih.gov/?term=Salapatek+infant+visual+acuity+viewing+distance): 1-month-olds' acuity averaged 1.5 c/deg unchanged for target distances 30–150 cm, a 2.6-D range; as reported in [Green, Powers & Banks 1980](https://doi.org/10.1016/0042-6989(80)90063-2)). ✅

---

## 2. Refractive error of the newborn and its change over the first year

### 2.1 Refractive status at birth (cycloplegic retinoscopy)

| Study | N | Technique | Mean (D) | Spread (D) | Source |
|---|---|---|---|---|---|
| Cook & Glasscock 1951 | 1000 eyes (500 newborns) | retinoscopy, atropine cycloplegia | **+1.80** | SD ≈ 1.31; 74.9% hyperopic, 25.1% myopic; >50% of hyperopes in <+1.00 to +3.00 D | ✅ [Cook & Glasscock 1951, *Am J Ophthalmology* 34:1407–1419](http://www.sciencedirect.com/sdfe/pdf/download/eid/1-s2.0-0002939451904813/first-page-pdf) (values as compiled in Banks 1980's review table and [Reed 1994](https://commons.pacificu.edu/opt/1143)) |
| Goldschmidt 1969 | 356 infants, 2–10 days | retinoscopy, atropine | **+0.62** | SD ≈ 2.2; 24.2% myopic | ✅ as compiled in Banks 1980 review table / [Reed 1994](https://commons.pacificu.edu/opt/1143) |
| Hosaka 1971 | 280, 0–1 days | retinoscopy | **+2.20** | SD ≈ 1.8 | ✅ same compilation |
| Zonis & Miller 1974 | 300, 2–3 days | retinoscopy + cycloplegia | **+1.10** | SD ≈ 1.6 | ✅ same compilation |
| **Banks 1980 synthesis** | — | summary of ~8 studies 1892–1974 | **≈ +2.00** | **SD ≈ 2.00** ("normally distributed, bell-shaped, mean about +2.00 D, SD 2.00 D") | ✅ [Banks 1980, *Int Ophthalmol Clin* 20(1):205–232](https://pubmed.ncbi.nlm.nih.gov/7399818/), as characterized in [Green et al. 1980](https://doi.org/10.1016/0042-6989(80)90063-2) ("the +2 D spherical error typical of newborn humans") and reproduced in [Reed 1994](https://commons.pacificu.edu/opt/1143) |
| Mohindra & Held 1981 | 400 babies, birth–5 y | **non-cycloplegic** near retinoscopy | (wide, technique-shifted) | range **−14.00 to +12.00 D** at <4 weeks; ~50% myopic at birth → 15% at 2.5–5 y | ✅ [Mohindra & Held 1981, "Refraction in humans from birth to five years"](https://link.springer.com/chapter/10.1007/978-94-009-8662-6_4), as summarized in [Reed 1994](https://commons.pacificu.edu/opt/1143) |

**Working anchor for the simulator:** a typical term newborn is **~+2 D hyperopic, SD ~2 D** ✅ (Banks 1980 synthesis), i.e., roughly two-thirds of newborns fall between plano and +4 D, with a substantial myopic tail (~20–25% in cycloplegic studies; ~50% in non-cycloplegic near retinoscopy, which over-reads myopia). ⚠️ The between-study spread (+0.6 to +2.4 D means) is real: it tracks cycloplegia, technique, and gestational age — prematurity sharply increases myopia at birth (e.g., Mukherji et al.: 76.5% myopic at 36 weeks gestation vs 6.5% at 40 weeks; via [Reed 1994](https://commons.pacificu.edu/opt/1143)).

### 2.2 Change over the first year (emmetropization)

| Age | Mean spherical equivalent | Source |
|---|---|---|
| Birth–early weeks | **+0.94 ± 1.63 D** (their youngest bin, incl. preterm from 32 wk GA) | ✅ [Yu et al. 2017, *Int J Ophthalmol* 10(8):1290–1294](https://pubmed.ncbi.nlm.nih.gov/28861357/), n = 1258 babies (2516 eyes), cycloplegic retinoscopy |
| **1–2 months (peak hyperopia)** | **+2.43 ± 1.46 D** | ✅ Yu et al. 2017 |
| 1 year | **+0.59 ± 1.41 D** | ✅ Yu et al. 2017 |
| 1–48 months (trend) | hyperopia and its variability both **decline significantly** with age; astigmatism ≥1 D in 25% (highest in infancy); myopia 3%, anisometropia 1% | ✅ [Mayer et al. 2001, *Arch Ophthalmol* 119(11):1625–1628](https://pubmed.ncbi.nlm.nih.gov/11709012/), 514 healthy term children, cycloplegic retinoscopy, 300 aged ≤12 months |
| ~1 year (mode) | mode +0.50 to +0.75 D; majority plano to +2.50 D | ✅ [Ingram 1979](https://pubmed.ncbi.nlm.nih.gov/?term=Ingram+refraction+one+year+atropine), as summarized in [Reed 1994](https://commons.pacificu.edu/opt/1143) |
| 9–11 months (tail) | **significant hyperopia (≥+4 D) in ~5%** of the population | ✅ [Atkinson et al. 2007, *Optom Vis Sci* 84(2):84–96](https://pubmed.ncbi.nlm.nih.gov/17299337/), n = 8308 infants, Cambridge screening programs |

🔎 **Interpretation for the simulator:** the newborn starts ~+2 D hyperopic; mean hyperopia *increases* to a peak near +2.4 D at 1–2 months (the eye's axial growth lags its focal length early on), then emmetropizes to ~+0.6 D by 12 months with the spread narrowing. Because a hyperope must accommodate R more than the target demand to see sharply, the typical infant's *effective* near-work demand is ~1–2.5 D above target distance — one reason a fixed intermediate focus is a reasonable immature strategy ([Aslin & Jackson 1979](https://pubmed.ncbi.nlm.nih.gov/?term=Aslin+Jackson+accommodation+vergence+infants), discussed in [Bharadwaj & Candy 2009](https://pmc.ncbi.nlm.nih.gov/articles/PMC2643357/)).

---

## 3. Accuracy of accommodation by age

### 3.1 Slopes of the accommodation function (Banks 1980, via Green et al. 1980)

Stimuli at 25, 50, 100 cm (+4, +2, +1 D); "accommodative response" regression slope vs stimulus demand — **1.0 = perfect**: ✅ all from [Green, Powers & Banks 1980, *Vision Research* 20:827–835](https://doi.org/10.1016/0042-6989(80)90063-2) ([open-access PDF](https://web.archive.org/web/2013id_/http://deepblue.lib.umich.edu:80/bitstream/2027.42/23426/1/0000374.pdf)), reporting Banks' (1980) two experiments:

| Age | Slope (exp. 1, exp. 2) |
|---|---|
| 1 month | **0.51, 0.41** |
| 2 months | **0.75, 0.79** |
| 3 months | **0.83, 0.78** |
| Adults | **0.94, 0.95** |

### 3.2 Concrete error values by age

- **Newborn (0–4 weeks):** essentially fixed focus at **≈5 D (median 19 cm)**; error at target distance *d* ≈ |5.3 − 1/d[m]| D. Examples 🔎: target at 1 m → ~4.3 D error; 50 cm → ~3.3 D; 30 cm → ~2.0 D; 19 cm → ~0; 10 cm → ~4.7 D. ✅ anchor from [Haynes et al. 1965](https://doi.org/10.1126/science.148.3669.528)
- **5 weeks (one infant, Banks' retinoscopy data):** held **1.75–2.75 D** of focus for stimuli between 1 D and 4 D (i.e., barely changed focus). ✅ [Candy 2010](https://www.oepf.org/wp-content/uploads/2021/08/21-420Candy1.pdf) describing [Banks 1980](https://pubmed.ncbi.nlm.nih.gov/7418504/)
- **9 weeks (same infant):** followed the stimuli with **measured lag < 0.5 D** at each distance. ✅ same source
- **2–3 months:** slopes 0.75–0.83 (table above) → errors at the extremes of the 1–4 D range typically ≤1–1.5 D; "almost adult-like" gain in binocular naturalistic viewing. ✅ [Green et al. 1980](https://doi.org/10.1016/0042-6989(80)90063-2); [Bharadwaj & Candy 2009](https://pmc.ncbi.nlm.nih.gov/articles/PMC2643357/)
- **3–4 months:** "relative accuracy is almost adult-like by three or four months"; typical **lag 0.5–1 D**, achievable "by four months of age." Accommodative sensitivity (smallest detectable demand change) of the 3-month-old: **≥0.5 D binocular, ≥0.75 D monocular** (adults ≥0.25 D). ✅ [Candy 2010](https://www.oepf.org/wp-content/uploads/2021/08/21-420Candy1.pdf); sensitivity from [Wang & Candy 2010] as reported in [Bharadwaj, Wang & Candy 2011, *J Vision* 11(4):6](https://pmc.ncbi.nlm.nih.gov/articles/PMC3971874/)
- **6–8 months:** consistent focus at 1.5 m in **all** tested infants (photorefraction). ✅ [Braddick et al. 1979] via [Currie & Manny 1997](https://pubmed.ncbi.nlm.nih.gov/9205713/). By 10 months, accommodation "like the adult eye" in dynamic photorefraction. ✅ [Howland, Dobson & Sayles 1987, *Vision Research* 27:2141–2152] via [Currie & Manny 1997](https://pubmed.ncbi.nlm.nih.gov/9205713/)
- **Steady-state fluctuations:** infants 8–30 weeks show accommodation microfluctuations with **RMS ≈ 0.35 D**, vs **adults ≈ 0.15 D** (same temporal characteristics, twice the amplitude). ✅ [Candy & Bharadwaj 2007, *J Vision* 7(11):4](https://doi.org/10.1167/7.11.4), as summarized in [Candy 2010](https://www.oepf.org/wp-content/uploads/2021/08/21-420Candy1.pdf)
- **Response dynamics:** at 8 weeks, >half of accommodative responses have latencies <0.5 s; 4.5- and 9-month-olds complete a response within ~1 s of a stimulus change. ✅ [Tondel & Candy 2008, *Vision Research* 48:564–576](https://doi.org/10.1016/j.visres.2007.11.016); [Howland et al. 1987] via [Candy 2010](https://www.oepf.org/wp-content/uploads/2021/08/21-420Candy1.pdf)

### 3.3 Summary: when does focusing become "accurate"?

✅ Consensus across [Haynes et al. 1965](https://doi.org/10.1126/science.148.3669.528), [Banks 1980](https://pubmed.ncbi.nlm.nih.gov/7418504/), [Brookman 1983](https://pubmed.ncbi.nlm.nih.gov/?term=Brookman+ocular+accommodation+human+infants) (*Am J Optom Physiol Opt* 60:91–99: accommodation <4 D at 2–12 weeks, >4 D by 12–16 weeks), [Braddick et al. 1979], and [Candy 2010](https://www.oepf.org/wp-content/uploads/2021/08/21-420Candy1.pdf):

- **Birth–4 weeks:** fixed focus (~19 cm / ~5 D); large errors (multi-diopter) for anything not near that distance.
- **4–9 weeks:** focus starts to move with target distance, poorly.
- **~2–3 months:** large improvement; slope ~0.75–0.8; lag <0.5 D in good subjects.
- **3–4 months:** "almost adult-like" static accuracy; typical lag 0.5–1 D.
- **6–8 months:** consistent accurate focus across tested distances for essentially all infants.

### 3.4 Measurement caveat (matters for honesty of a diopter-based simulator)

Retinoscopy and photorefraction estimate defocus from the plane of **retinal reflection**, not the photoreceptor plane. In an adult eye, 1 mm of retinal depth ≈ 3 D; with a ~250-μm retina this could bias estimates by **up to ~0.75 D in adults and a little over 1 D in infants** (infant eye ≈ 2/3 of adult length) — likely an upper bound, since reflection comes from deeper layers. ✅ [Candy 2010](https://www.oepf.org/wp-content/uploads/2021/08/21-420Candy1.pdf), building on [Glickstein & Millodot 1970, "Retinoscopy and eye size," *Science* 168:605–606](https://pubmed.ncbi.nlm.nih.gov/?term=Glickstein+Millodot+retinoscopy+eye+size). So: individual absolute diopter values for infants carry ~±1 D of methodological uncertainty; developmental *trends* and within-subject changes are much more trustworthy than absolute offsets.

---

## 4. Pupil diameter by age (for computing the blur circle)

| Age | Pupil diameter (mean ± SD) | Conditions | Source |
|---|---|---|---|
| Newborn (term & preterm, 26.5–46 wk PCA, n = 100) | **3.6 ± 0.9 mm** | dim room ("<10 foot-candles") | ✅ [Isenberg, Dang & Jotterand 1989, *Am J Ophthalmol* 108(1):75–79](https://pubmed.ncbi.nlm.nih.gov/2750838/) |
| Healthy newborns (n = 88) | **3.8 ± 0.8 mm** (photographic; anisocoria 21%, never >1 mm) | ambient (photographs) | ✅ [Roarty & Keltner 1990, *Arch Ophthalmol* 108(1):94–95](https://pubmed.ncbi.nlm.nih.gov/2297339/) |
| 1 month | **4.2 mm** | 8 cd/m² stimulus, IR photography, while viewing accommodation targets | ✅ [Banks 1980], reported in [Green et al. 1980](https://doi.org/10.1016/0042-6989(80)90063-2) |
| 2 months | **4.6 mm** | same | ✅ same |
| 3 months | **4.6 mm** | same | ✅ same |
| Adults (comparison) | **5.2 mm** | same (8 cd/m²) | ✅ same |
| Infants 2.8–9.9 months (n = 20) | **5.43 ± 0.61 mm** | ~4 cd/m² target, dark surround, PowerRefractor, 80 cm fixation | ✅ [Bharadwaj, Wang & Candy 2011, *J Vision* 11(4):6](https://pmc.ncbi.nlm.nih.gov/articles/PMC3971874/) |
| 6–9 months | **≈ 5.5–5.7 mm** | ambient/mesopic | ✅ [MacLachlan & Howland 2002, *Ophthalmic Physiol Opt* 22(3):175–182](https://pubmed.ncbi.nlm.nih.gov/12090630/), n = 1311 subjects aged 1 month–19 years at 15.9 lux (values as quoted in [Bharadwaj et al. 2011](https://pmc.ncbi.nlm.nih.gov/articles/PMC3971874/)) |
| 2–4 years | 5.57 ± 0.8 mm | ~4 cd/m², dark surround | ✅ [Bharadwaj et al. 2011](https://pmc.ncbi.nlm.nih.gov/articles/PMC3971874/) |
| 3 y 1 m (n = 1219, Japanese, screening) | 5.57 ± 0.79 mm (median 5.60) | Spot Vision Screener, indoors | ✅ [Tatara et al. 2019, *Sci Rep* 9:15622](https://doi.org/10.1038/s41598-019-51993-1) |
| Adults | 6.8–7.5 mm reached only by 9–10 years; pupils **grow** through childhood | mesopic | ✅ [MacLachlan & Howland 2002](https://pubmed.ncbi.nlm.nih.gov/12090630/) (male regression: 5.83 + 0.181·age − 0.0053·age² mm) |

🔎 **Pattern (derived):** the pupil grows steeply through the first year — ~3.6–3.8 mm at birth → ~4.2–4.6 mm at 1–3 months → ~5.4–5.7 mm by 6–9 months — then slowly toward the childhood maximum (~7 mm by 9–10 y). ⚠️ Luminance matters (~1 mm between 8 cd/m² and dim conditions); the simulator should treat pupil as a function of both age and scene luminance, interpolating between the tabulated anchors.

---

## 5. Depth of focus / depth of field of the infant eye

### 5.1 The Green–Powers–Banks (1980) model

[Green, Powers & Banks 1980, "Depth of focus, eye size and visual acuity," *Vision Research* 20:827–835](https://doi.org/10.1016/0042-6989(80)90063-2) ([open-access PDF](https://web.archive.org/web/2013id_/http://deepblue.lib.umich.edu:80/bitstream/2027.42/23426/1/0000374.pdf)) derived the paraxial depth-of-focus relations:

- **Eq. (8):** ΔD = 17.45 · φ / p — depth of focus (D) from the angular subtense φ (degrees) of the just-detectable blur circle and pupil diameter p (mm). Check: 1′ blur with a 3-mm pupil → ±0.097 D ≈ ±0.1 D, their adult example. ✅
- **Eq. (9):** ΔD = 7.03 / (p · v) — same thing with v = cutoff acuity in c/deg (just-detectable blur = 0.8 × half-period of the cutoff grating). ✅
- Key theoretical result: depth of focus is **inversely proportional to pupil diameter and to acuity** (and inversely to the square of axial length at fixed blur-circle size); "small eyes with low acuity should have large depths of focus." ✅
- Validation: predicted slopes of the accommodation function from depth of focus alone match Banks' (1980) observed slopes for 1-, 2-, 3-month-olds and adults "excellent[ly]" — i.e., **infants accommodate only as accurately as their blur sensitivity requires.** ✅

**Published value:** for 1-month-olds (acuity 1.5 c/deg, pupil 4.2 mm), depth of focus = **±1.4 D**. ✅ [Green et al. 1980], who also show (their Fig. 3) the shrinking of depth of focus with age from these inputs.

### 5.2 Depth-of-focus values by age

Inputs (all ✅ from [Green et al. 1980](https://doi.org/10.1016/0042-6989(80)90063-2) unless noted): pupil from Banks 1980 (8 cd/m²) for 1–3 months and adults, from [Isenberg 1989](https://pubmed.ncbi.nlm.nih.gov/2750838/)/[Roarty 1990](https://pubmed.ncbi.nlm.nih.gov/2297339/) for newborns; acuity from Atkinson et al. 1977, Banks & Salapatek 1978, Allen 1979 as tabulated by Green et al. (1 mo: 0.6–2.4 c/deg; 2 mo: 2.7–3.0; 3 mo: 4.0–4.5); newborn acuity ~1–1.5 c/deg from the 1-month FPL range (Salapatek et al. 1976: 1.5 c/deg average at 1 month) 🔎.

🔎 **Computed with ΔD = 17.45/(2·p·v)** (same criterion that reproduces Green et al.'s published 1-month value of ±1.4 D: just-detectable blur = half the grating period):

| Age | Pupil (mm) | Acuity (c/deg) | Depth of focus ±ΔD | Notes |
|---|---|---|---|---|
| Newborn | 3.6–3.8 | ~1–1.5 | **±1.6–2.4 D** | 🔎 computed; consistent with newborns' fixed focus not harming acuity over a ±2 D band |
| 1 month | 4.2 | 1.5 (0.6–2.4) | **±1.4 D** (±0.9–3.5 across the acuity range) | ✅ published value, [Green et al. 1980] |
| 2 months | 4.6 | 2.7–3.0 | **±0.63–0.70 D** | 🔎 computed |
| 3 months | 4.6 | 4.0–4.5 | **±0.42–0.47 D** | 🔎 computed |
| Adult | 5.2 | ~30 | ±0.06 D idealized (model omits aberrations/diffraction) | 🔎; empirical adult values are **±0.3–0.5 D**: Campbell 1957 ±0.43 D; Green & Campbell 1965 ±0.25 D; Charman & Whitefoot 1977 ±0.16 D (75% criterion) to ±0.47 D (98%) ✅ (all as tabulated in [Green et al. 1980](https://doi.org/10.1016/0042-6989(80)90063-2)) |

🔎 **Why this matters for the simulator:** the newborn's optical world is *tolerant* — all target distances whose dioptric vergence lies within 5.3 ± 2 D (i.e., roughly **14–30 cm**, the reciprocal range of 7.3 D down to 3.3 D) are *within depth of focus*: not detectably blurred for the infant even though an adult would notice. Defocus beyond that band is detectable. This is the honest quantitative core of the "depth of field" simulation.

### 5.3 Photoreceptor spacing (anatomical limit)

- Foveolar cone diameter: **7.5 μm at 5 days postnatal → 2 μm by 45 months**; foveolar cone packing: **18 cones/100 μm at 1 week → 42 cones/100 μm in adults** (i.e., center-to-center spacing ≈ 5.6 μm → 2.4 μm, ~2.3× coarser at birth); foveola rod-free zone >1000 μm before birth, narrowing to the adult 650–700 μm by 45 months; outer-segment length and packing density still only half adult values at 45 months. ✅ [Yuodelis & Hendrickson 1986, *Vision Research* 26(6):847–855](https://pubmed.ncbi.nlm.nih.gov/3750868/) ([doi:10.1016/0042-6989(86)90143-4](https://doi.org/10.1016/0042-6989(86)90143-4)); companion morphological paper: [Hendrickson & Yuodelis 1984, *Ophthalmology* 91(6):603–612](https://pubmed.ncbi.nlm.nih.gov/6462623/)
- 🔎 Derived: combining cone spacing (2.3× coarser) with the infant eye's shorter posterior nodal distance (infant eye ≈ 2/3 adult length ✅ [Candy 2010]), the newborn fovea's *anatomical* sampling Nyquist limit is on the order of 3–4× coarser than the adult's — yet still several times finer than the newborn's ~1–2 c/deg *behavioral* acuity. Conclusion (consistent with the ideal-observer analysis of [Banks & Bennett 1988, *JOSA A* 5(12):2059–2079](https://pubmed.ncbi.nlm.nih.gov/3068345/)): **cone sampling is not the bottleneck at birth; neural immaturity is.** For the blur computation this justifies using *behavioral* acuity (as Green et al. did) as the blur-detection criterion rather than photoreceptor spacing.
- [Banks & Bennett 1988](https://pubmed.ncbi.nlm.nih.gov/3068345/) built ideal observers incorporating neonatal optics, pupil, and foveal cone spacing/efficiency: "many, but not all, of the differences between neonatal and adult contrast sensitivities and grating acuities can be explained by these preneural factors." ✅
- Higher-order aberrations of the infant eye exist but are modest: [Wang & Candy 2005, *J Vision* 5(6):6, 543–555](https://doi.org/10.1167/5.6.6). ✅

---

## 6. The blur computation for the simulator (pupil × diopters → angular blur circle)

### 6.1 Formula (elementary paraxial optics, from Green et al. 1980 eq. 8 inverted)

**Angular diameter of the retinal blur circle:**

> **φ = ΔD · p / 17.45** (degrees), i.e., **φ ≈ 3.44 · ΔD · p** arcmin, with ΔD = defocus in diopters and p = pupil diameter in mm.

Equivalent statements: φ (mrad) ≈ ΔD · p(mm) (since 1° = 17.45 mrad); a full reduced-eye treatment with ocular refractive index n = 4/3 shifts this by ~25% (φ = 0.75·ΔD·p), which is the same order as the spread in the empirical adult depth-of-focus literature. Blur-circle diameter on the retina s = p · ΔD · f/n (f = posterior focal length). This is the standard geometric (thin-lens) defocus relation, exact for paraxial rays, diffraction negligible at these pupil sizes and acuities (diffraction only inflates depth of focus for small pupils / high frequencies — [Green et al. 1980, Fig. 5](https://doi.org/10.1016/0042-6989(80)90063-2)). ✅/🔎 (formula from the cited paper; the simulator implementation is derived).

### 6.2 Worked examples (🔎 derived from the ✅ anchors above)

**Newborn, pupil 3.8 mm, fixed focus 5.3 D (19 cm):**

| Target distance | Demand (D) | Defocus ΔD (D) | Blur circle φ (arcmin) | Visible to the infant? (blur vs ~20–30′ resolution limit at 1–1.5 c/deg) |
|---|---|---|---|---|
| 19 cm | 5.3 | 0 | 0′ | sharp |
| 25 cm | 4.0 | 1.3 | ~17′ | borderline (≈ within ±1.6–2.4 D depth of focus) |
| 33 cm | 3.0 | 2.3 | ~30′ | just detectably blurred |
| 50 cm | 2.0 | 3.3 | ~43′ | clearly blurred |
| 1 m | 1.0 | 4.3 | ~56′ | strongly blurred |
| 10 cm | 10.0 | 4.7 | ~61′ | strongly blurred (too close) |

**1-month-old, pupil 4.2 mm, depth of focus ±1.4 D:** a 1-D error → ~14′ blur (invisible); a 2-D error → ~29′ (at/above threshold); a 3-D error → ~43′ (clearly visible). ✅ anchors; 🔎 arithmetic.

**3-month-old, pupil 4.6 mm, depth of focus ~±0.45 D:** a 1-D error → ~16′ blur — now *detectable*, which is exactly why accommodation tightens at this age (Green et al.'s validated account). 🔎

**Adult, pupil 5.2 mm, empirical depth of focus ~±0.4 D:** a 1-D error → ~18′ — visible, hence adults accommodate accurately. ✅/🔎

### 6.3 How to combine refraction and accommodation (sign conventions, stated honestly)

The simulator's cleanest variable is the **eye's plane of best focus in diopters** D_focus(t, age): for a newborn set it ≈ **5.3 D (19 cm), essentially fixed** (Haynes et al. 1965); for older infants move it toward the target demand with the age-dependent slope/gain from §3 (slope ~0.4 at 1 mo, ~0.75–0.8 at 2–3 mo, ~0.95 adult-like after 3–4 mo), plus a typical lag of 0.5–1 D. **Defocus for a target at distance d = |D_focus − 1/d|**. The newborn's ~+2 D hyperopia (§2) is already embedded in the *measured* 5.3-D focus (retinoscopy measures the net focus of the uncorrected eye), so the simulator should NOT add hyperopia on top of it — that would double-count. ⚠️ If instead you simulate a *specific* infant's optics from first principles (refraction R + accommodative response A), then required sharp-focus demand is (1/d + R) and defocus = A − (1/d + R); this path inherits the ±1 D reflection-plane measurement uncertainty (§3.4).

---

## 7. Master anchor table for the simulator

| Age | Plane of best focus / accommodative behavior | Accommodation error vs target | Pupil (mm) | Acuity (c/deg) | Depth of focus | Key citations |
|---|---|---|---|---|---|---|
| **Birth (0–4 wk)** | Fixed focus, **median 19 cm ≈ 5.3 D**; ≈5 D at all distances; sleeping: ~5 D less | ~0 at 19 cm; ≈2 D at 30 cm; ≈3.3 D at 50 cm; ≈4.3 D at 1 m (🔎 from the 19-cm anchor) | **3.6–3.8** (dim/ambient) | ~1–1.5 (🔎 1-mo FPL range) | **±1.6–2.4 D** (🔎) | Haynes et al. 1965; Currie & Manny 1997; Isenberg 1989; Roarty & Keltner 1990; Green et al. 1980 |
| **1 month** | Focus still near-fixed around an intermediate distance (~19–30 cm) | Slope **0.41–0.51**; example infant at 5 wk held 1.75–2.75 D for 1–4 D stimuli | **4.2** (8 cd/m²) | 1.5 avg (0.6–2.4) | **±1.4 D** (✅ published) | Banks 1980 via Green et al. 1980; Candy 2010; Hainline et al. 1992 via Candy 2010 |
| **2 months** | Begins tracking target distance | Slope **0.75–0.79**; errors ≲1–1.5 D at range extremes | **4.6** | 2.7–3.0 | **±0.63–0.70 D** (🔎) | Banks 1980 via Green et al. 1980 |
| **3 months** | Nearly adult-like gain (binocular, naturalistic) | Slope **0.78–0.83**; lag <0.5 D in good infants; sensitivity 0.5 D | **4.6** | 4.0–4.5 | **±0.42–0.47 D** (🔎) | Banks 1980 via Green et al. 1980; Candy 2010; Wang & Candy 2010 via Bharadwaj et al. 2011 |
| **4 months** | "Almost adult-like by three or four months" (Haynes: adult performance ~4th month) | Typical **lag 0.5–1 D** | ~4.6–5.4 (🔎 interpolation) | ~5–6 (🔎) | ~±0.35–0.4 D (🔎) | Haynes et al. 1965; Candy 2010 |
| **6 months** | Consistent accurate focus at all tested distances | Lag **0.5–1 D**; fluctuations RMS 0.35 D | **5.4–5.7** (4 cd/m² / ambient) | ~6–8 (🔎) | ~±0.3 D (🔎) | Braddick et al. 1979 via Currie & Manny 1997; Candy 2010; Bharadwaj et al. 2011; MacLachlan & Howland 2002 |
| **Adult (reference)** | Accurate | Slope 0.94–0.95; lag ~0.3–0.5 D; fluctuations RMS 0.15 D | 5.2 (8 cd/m²) – 5.7 (4 cd/m²) | ~30 | **±0.3–0.5 D** (empirical) | Green et al. 1980; Campbell 1957; Candy & Bharadwaj 2007 |

---

## 8. Honest assessment: can we compute defocus blur from this?

**Verdict: yes — the pupil × diopters → angular-blur-circle computation is solidly grounded.** Specifically:

**Solid (measured, replicated):**

1. **Newborn fixed focus at ≈19 cm / ≈5 D** — the founding result (Haynes et al. 1965, *Science*), replicated in kind by Banks 1980, Braddick et al. 1979, Hainline et al. 1992 (≈30 cm), with the technique differences understood. The qualitative claim "newborns focus at one distance; other distances are defocused proportionately" is a direct quote from the primary literature.
2. **Pupil diameters by age** — multiple independent studies with consistent values at each age (3.6–3.8 mm at birth; 4.2–4.6 mm at 1–3 months; 5.4–5.7 mm at 6–9 months; adults 5.2–5.7 mm depending on luminance). This input is essentially audit-proof.
3. **The blur-circle formula** — elementary paraxial optics, published in exactly this form by Green, Powers & Banks 1980 (eq. 8) and validated against infant accommodation data. Pupil × diopters → arcmin is defensible to within a few percent (before aberrations, which are second-order at these acuities).
4. **Depth-of-focus model** — Green et al. 1980's ΔD(p, acuity) predictions match Banks' observed accommodation development; the model explains *why* newborns tolerate a fixed focus.
5. **Developmental timeline** — every source agrees: gross inaccuracy at birth → adult-like static accuracy at 3–4 months → fully consistent by 6–8 months.

**Weak points to disclose in the simulator's UI/docs:**

1. **Absolute diopters carry ~±1 D methodological uncertainty** (retinal-reflection-plane problem; Glickstein & Millodot 1970; Candy 2010). Don't render differences smaller than ~0.5–1 D as meaningful.
2. **Cross-sectional, small-N classics** — the 1965–1980 studies measured modest samples (tens of infants per age); inter-individual variation in newborn focus distance is substantial (Haynes et al. report a *median*, implying a wide distribution; Hainline's infants "typically" ~30 cm).
3. **Refraction at birth is technique-dependent** (+0.6 to +2.4 D means across cycloplegic studies; ~+2 D ± 2 D is the defensible synthesis — Banks 1980). Non-cycloplegic methods shift myopic.
4. **Newborn-specific gaps:** no direct measurement of newborn depth of focus (only of 1-month-olds and up — the newborn value is my computation from their formula); pupil luminance-dependence coarsely sampled at birth.
5. **The "8–12 inches" claim is folklore-shaped**: the measured anchors are 19 cm and ~30 cm; no primary source states "8–12 inches," and popular articles cite nothing. Present 19 cm (median) as the scientific anchor.

**Recommended simulator formula set** (🔎, all inputs ✅ cited above):

```
D_focus(age)            # plane of best focus, diopters
  birth–6 wk:  5.3 D fixed (Haynes 1965 median, 19 cm)
  6 wk–3 mo:   moves toward demand with slope 0.4→0.8 (Banks 1980)
  >3–4 mo:     demand + lag of 0.5–1 D (Candy 2010)

defocus(d, age)  = |D_focus(age) − 1/d[m]|           # diopters
blur_arcmin      = 3.44 × defocus × pupil_mm(age)     # Green et al. 1980 eq. 8 inverted
visible_blur     = blur_arcmin > ~0.5 × (60/acuity_cpd(age))  # half-period criterion
```

The last line is the honest definition of "detectably blurred for *this* infant": a defocus is visible only when the blur circle exceeds roughly half the period of the finest grating the infant can resolve at that age (the criterion that reproduces Green et al.'s published ±1.4 D at 1 month).

---

## Source index (primary first)

**Founding / classic:**

1. Haynes H, White BL, Held R. *Visual accommodation in human infants.* **Science** 1965;148(3669):528–530. doi:[10.1126/science.148.3669.528](https://doi.org/10.1126/science.148.3669.528) · [PubMed 14263778](https://pubmed.ncbi.nlm.nih.gov/14263778/)
2. Banks MS. *The development of visual accommodation during early infancy.* **Child Development** 1980;51(3):646–666. doi:[10.2307/1129450](https://doi.org/10.2307/1129450) · [PubMed 7418504](https://pubmed.ncbi.nlm.nih.gov/7418504/)
3. Banks MS. *Infant refraction and accommodation.* **Int Ophthalmol Clin** 1980;20(1):205–232. doi:[10.1097/00004397-198002010-00010](https://doi.org/10.1097/00004397-198002010-00010) · [PubMed 7399818](https://pubmed.ncbi.nlm.nih.gov/7399818/)
4. Green DG, Powers MK, Banks MS. *Depth of focus, eye size and visual acuity.* **Vision Research** 1980;20(9):827–835. doi:[10.1016/0042-6989(80)90063-2](https://doi.org/10.1016/0042-6989(80)90063-2) · [open-access PDF (UMich Deep Blue via Wayback)](https://web.archive.org/web/2013id_/http://deepblue.lib.umich.edu:80/bitstream/2027.42/23426/1/0000374.pdf) · [PubMed 7467137](https://pubmed.ncbi.nlm.nih.gov/7467137)
5. Braddick O, Atkinson J, French J, Howland HC. *A photorefractive study of infant accommodation.* **Vision Research** 1979;19:1319–1330. (findings as tabulated in Currie & Manny 1997)
6. Cook RC, Glasscock RE. *Refractive and ocular findings in the newborn.* **Am J Ophthalmol** 1951;34:1407–1419. [ScienceDirect first-page PDF](http://www.sciencedirect.com/sdfe/pdf/download/eid/1-s2.0-0002939451904813/first-page-pdf)
7. Brookman KE. *Ocular accommodation in human infants.* **Am J Optom Physiol Opt** 1983;60(2):91–99.
8. Howland HC, Dobson V, Sayles N. *Accommodation in infants as measured by photorefraction.* **Vision Research** 1987;27:2141–2152.
9. Hainline L, Riddell P, Grose-Fifer J, Abramov I. *Development of accommodation and convergence in infancy.* **Behavioural Brain Research** 1992;49(1):33–50.
10. Mohindra I, Held R. *Refraction in humans from birth to five years.* (Documenta Ophthalmologica Proceedings Series; Springer) [chapter link](https://link.springer.com/chapter/10.1007/978-94-009-8662-6_4)
11. Yuodelis C, Hendrickson A. *A qualitative and quantitative analysis of the human fovea during development.* **Vision Research** 1986;26(6):847–855. doi:[10.1016/0042-6989(86)90143-4](https://doi.org/10.1016/0042-6989(86)90143-4) · [PubMed 3750868](https://pubmed.ncbi.nlm.nih.gov/3750868/)
12. Hendrickson AE, Yuodelis C. *The morphological development of the human fovea.* **Ophthalmology** 1984;91(6):603–612. [PubMed 6462623](https://pubmed.ncbi.nlm.nih.gov/6462623/)
13. Banks MS, Bennett PJ. *Optical and photoreceptor immaturities limit the spatial and chromatic vision of human neonates.* **JOSA A** 1988;5(12):2059–2079. doi:[10.1364/josaa.5.002059](https://doi.org/10.1364/josaa.5.002059) · [PubMed 3068345](https://pubmed.ncbi.nlm.nih.gov/3068345/)
14. Banks MS, Salapatek P. *Acuity and contrast sensitivity in 1-, 2-, and 3-month-old human infants.* **Invest Ophthalmol Vis Sci** 1978;17:361–365. (acuity inputs for the depth-of-focus model)
15. Salapatek P, Bechtold AG, Bushnell EW. *Infant visual acuity as a function of viewing distance.* **Child Development** 1976;47. (1-month acuity 1.5 c/deg, constant across 30–150 cm; as reported in Green et al. 1980)

**Modern reviews and replications:**

16. Candy TR. *The accommodative performance of infants and young children.* **Journal of Behavioral Optometry** 2010;21(4):95–98. [PDF (OEPF)](https://www.oepf.org/wp-content/uploads/2021/08/21-420Candy1.pdf)
17. Currie DC, Manny RE. *The development of accommodation.* **Vision Research** 1997;37(11):1525–1533. doi:10.1016/s0042-6989(97)85022-5 · [PubMed 9205713](https://pubmed.ncbi.nlm.nih.gov/9205713/)
18. Bharadwaj SR, Candy TR. *Cues for the control of ocular accommodation and vergence during postnatal human development.* **Journal of Vision** 2008;8(16):14, 1–16. doi:[10.1167/8.16.14](https://doi.org/10.1167/8.16.14) · [PMC2643357](https://pmc.ncbi.nlm.nih.gov/articles/PMC2643357/)
19. Bharadwaj SR, Wang J, Candy TR. *Pupil responses to near visual demand during human visual development.* **Journal of Vision** 2011;11(4):6. doi:[10.1167/11.4.6](https://doi.org/10.1167/11.4.6) · [PMC3971874](https://pmc.ncbi.nlm.nih.gov/articles/PMC3971874/)
20. Candy TR, Bharadwaj SR. *The stability of steady state accommodation in human infants.* **Journal of Vision** 2007;7(11):4, 1–16. doi:[10.1167/7.11.4](https://doi.org/10.1167/7.11.4)
21. Tondel GM, Candy TR. *Human infants' accommodation responses to dynamic stimuli.* **Invest Ophthalmol Vis Sci** 2007;48:949–956.
22. Tondel GM, Candy TR. *Accommodation and vergence latencies in human infants.* **Vision Research** 2008;48:564–576. doi:[10.1016/j.visres.2007.11.016](https://doi.org/10.1016/j.visres.2007.11.016)
23. Wang J, Candy TR. *Higher order monochromatic aberrations of the human infant eye.* **Journal of Vision** 2005;5(6):6, 543–555. doi:[10.1167/5.6.6](https://doi.org/10.1167/5.6.6)

**Refraction / emmetropization:**

24. Mayer DL, Hansen RM, Moore BD, Kim S, Fulton AB. *Cycloplegic refractions in healthy children aged 1 through 48 months.* **Arch Ophthalmol** 2001;119(11):1625–1628. doi:[10.1001/archopht.119.11.1625](https://doi.org/10.1001/archopht.119.11.1625) · [PubMed 11709012](https://pubmed.ncbi.nlm.nih.gov/11709012/)
25. Yu SJ, Liu GH, Liu Y, Huang J, Han ML, Zhao BJ, Gai ZT. *The evolution of refractive status in Chinese infants during the first year of life and its affected factors.* **Int J Ophthalmol** 2017;10(8):1290–1294. doi:[10.18240/ijo.2017.08.17](https://doi.org/10.18240/ijo.2017.08.17) · [PubMed 28861357](https://pubmed.ncbi.nlm.nih.gov/28861357/)
26. Atkinson J, Braddick O, Nardini M, Anker S. *Infant hyperopia: detection, distribution, changes and correlates — outcomes from the Cambridge infant screening programs.* **Optom Vis Sci** 2007;84(2):84–96. doi:[10.1097/OPX.0b013e318031b69a](https://doi.org/10.1097/OPX.0b013e318031b69a) · [PubMed 17299337](https://pubmed.ncbi.nlm.nih.gov/17299337/)

**Pupil:**

27. Isenberg SJ, Dang Y, Jotterand V. *The pupils of term and preterm infants.* **Am J Ophthalmol** 1989;108(1):75–79. doi:10.1016/s0002-9394(14)73264-7 · [PubMed 2750838](https://pubmed.ncbi.nlm.nih.gov/2750838/)
28. Roarty JD, Keltner JL. *Normal pupil size and anisocoria in newborn infants.* **Arch Ophthalmol** 1990;108(1):94–95. doi:[10.1001/archopht.1990.01070030100037](https://doi.org/10.1001/archopht.1990.01070030100037) · [PubMed 2297339](https://pubmed.ncbi.nlm.nih.gov/2297339/)
29. MacLachlan C, Howland HC. *Normal values and standard deviations for pupil diameter and interpupillary distance in subjects aged 1 month to 19 years.* **Ophthalmic Physiol Opt** 2002;22(3):175–182. doi:[10.1046/j.1475-1313.2002.00023.x](https://doi.org/10.1046/j.1475-1313.2002.00023.x) · [PubMed 12090630](https://pubmed.ncbi.nlm.nih.gov/12090630/)
30. Tatara S, Maeda F, Mizuno N, Noguchi A, Yaoeda K, Abe H. *Refraction and pupil diameter in 3-year- and 1-month-old children as measured by Spot Vision Screener.* **Sci Rep** 2019;9:15622. doi:[10.1038/s41598-019-51993-1](https://doi.org/10.1038/s41598-019-51993-1)

**Adult depth-of-focus (cited within Green et al. 1980):**

31. Campbell FW. *The depth of field of the human eye.* **Optica Acta** 1957;4:157–164. (±0.43 D)
32. Charman WN, Whitefoot H. *Pupil diameter and the depth-of-focus of the human eye as measured by laser speckle.* **Optica Acta** 1977;24:1211–1216. (±0.16–0.47 D by criterion)
33. Glickstein M, Millodot M. *Retinoscopy and eye size.* **Science** 1970;168:605–606.

**Secondary compilations (used for cross-checking, flagged as such in text):**

34. Reed KT. *Prevalence and expectations of congenital myopia.* College of Optometry thesis, Pacific University, 1994. [commons.pacificu.edu/opt/1143](https://commons.pacificu.edu/opt/1143) · [PDF](https://commons.pacificu.edu/downloads/03sv3-2m681/stamped_85d9e4d8-35e0-4394-90a4-03f9c2fbe022.pdf) (reproduces Banks 1980's table of newborn refraction studies; Cook & Glasscock, Goldschmidt, Hosaka, Zonis & Miller, Mohindra & Held, Ingram 1979)
35. Bishop DVM. *Memoir of Oliver Braddick.* **Biographical Memoirs of Fellows of the British Academy** 14 (history of the Cambridge photorefraction program). [PDF](https://www.thebritishacademy.ac.uk/documents/4546/20-Memoirs-14-Braddick.pdf)

**Popular-claim example (folklore, no primary source):**

36. ScienceInsights. *How far can a newborn baby see? About 8–12 inches.* (2026) [link](https://scienceinsights.org/how-far-can-a-newborn-baby-see-about-8-12-inches/)
