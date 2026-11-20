/**
 * Citation registry for the Baby Vision Simulator.
 *
 * Every numeric anchor in model.ts carries a `sourceId` that must resolve to
 * an entry in this registry. A unit test enforces it, and the article's
 * Sources section is generated from the same registry — so no number can
 * exist in the simulator without a receipt.
 */
export interface Source {
  /** Stable id referenced by anchors in model.ts. */
  id: string;
  /** Full citation line shown in the article's Sources section. */
  citation: string;
  url: string;
  /** What this source grounds in the simulator. */
  usedFor: string;
}

export const SOURCES: Record<string, Source> = {
  brown2018: {
    id: 'brown2018',
    citation:
      'Brown AM, Opoku FO, Stenger MR. "Neonatal Contrast Sensitivity and Visual Acuity: Basic Psychophysics." Transl Vis Sci Technol 2018;7(3):18.',
    url: 'https://europepmc.org/articles/PMC6016435',
    usedFor: 'Week-0 anchors: acuity 0.78 c/deg (behavioral median), contrast threshold ~46% Michelson at low spatial frequency.',
  },
  neijzen2025: {
    id: 'neijzen2025',
    citation:
      'Neijzen CM, de Wit FM, Hettinga YM, de Boer JH, van Genderen MM, de Wit GC. "Reference values for the Teller Acuity Cards II (TAC II) in infants and preverbal children, a meta-analysis." Acta Ophthalmol 2025;103(4):479–485.',
    url: 'https://europepmc.org/articles/PMC12069961',
    usedFor: 'Acuity curve from 1 to 12 months (geometric means derived from the published 95% prediction limits, cross-checked against Leone 2014 and Mayer 1995).',
  },
  mayer1995: {
    id: 'mayer1995',
    citation:
      'Mayer DL, Beiser AS, Warner AF, Pratt EM, Raye KN, Lang JM. "Monocular acuity norms for the Teller Acuity Cards between ages one month and four years." Invest Ophthalmol Vis Sci 1995;36(3):671–685.',
    url: 'https://europepmc.org/article/MED/7890497',
    usedFor: 'Independent cross-check of the acuity curve (also the source of the MIMo v2 acuity table).',
  },
  leone2014: {
    id: 'leone2014',
    citation:
      'Leone JF, Mitchell P, Kifley A, Rose KA. "Normative visual acuity in infants and preschool-aged children in Sydney." Acta Ophthalmol 2014;92(7):e521–e529.',
    url: 'https://doi.org/10.1111/aos.12366',
    usedFor: 'Independent cross-check of the derived acuity curve (measured TAC II values agree within ~0.1 octave).',
  },
  norcia1990: {
    id: 'norcia1990',
    citation:
      'Norcia AM, Tyler CW, Hamer RD. "Development of contrast sensitivity in the human infant." Vision Res 1990;30(10):1475–1486.',
    url: 'https://europepmc.org/article/MED/2247957',
    usedFor: 'Contrast thresholds: ~7% at 2–3 weeks, ~0.5% low-SF asymptote at 9 weeks, adult reference 0.22–0.32%.',
  },
  adams1994: {
    id: 'adams1994',
    citation:
      'Adams RJ, Courage ML, Mercer ME. "Systematic measurement of human neonatal color vision." Vision Res 1994;34(13):1691–1701.',
    url: 'https://doi.org/10.1016/0042-6989(94)90127-9',
    usedFor: 'Newborn color discrimination rates: 74% red, 36% green, 25% yellow, 14% blue — grounds the "near-grayscale with muted reds" week-0 state and the early red–green gain.',
  },
  varner1985: {
    id: 'varner1985',
    citation:
      'Varner D, Cook JE, Schneck ME, McDonald MA, Teller DY. "Tritan discriminations by 1- and 2-month-old human infants." Vision Res 1985;25(6):821–831.',
    url: 'https://doi.org/10.1016/0042-6989(85)90190-7',
    usedFor: 'Blue–yellow (S-cone) timeline: reliable only from ~4–8 weeks — grounds the S-channel gain ramp.',
  },
  skelton2022: {
    id: 'skelton2022',
    citation:
      'Skelton AE, Maule J, Franklin A. "Infant colour perception: Insight into perceptual development." Child Dev Perspect 2022;16(2):90–95.',
    url: 'https://doi.org/10.1111/cdep.12447',
    usedFor: 'Review grounding the color timeline (trichromatic by ~3 months) and the residual saturation deficit that persists beyond the first year.',
  },
  mimo2025: {
    id: 'mimo2025',
    citation:
      'López FM, Lenz M, Fedozzi MG, Aubret A, Triesch J. "MIMo Grows! Simulating Body and Sensory Development in a Multimodal Infant Model." 2025 IEEE International Conference on Development and Learning (ICDL). arXiv:2509.09805.',
    url: 'https://arxiv.org/abs/2509.09805',
    usedFor: 'Method precedent: age-dependent acuity used as a contrast-sensitivity low-pass filter; the Gaussian approximation and age anchors here are independent.',
  },
  cai2026: {
    id: 'cai2026',
    citation:
      'Cai Y, Lin Q, Nunna BS, Zhang M. "Learning to See Through a Baby\'s Eyes: Early Visual Diets Enable Robust Visual Intelligence in Humans and Machines." arXiv:2511.14440 (2026).',
    url: 'https://arxiv.org/abs/2511.14440',
    usedFor: 'Context: feeding AI an infant-like visual diet (blur→sharp, gray→color) improves its robustness — the same curriculum Klara is running.',
  },
  tinyeyes: {
    id: 'tinyeyes',
    citation:
      'Dougherty R, Wade A, Baseler H. "Vischeck / TinyEyes" (open-source opponent-space infant vision simulator, GPL-3).',
    url: 'https://www.vischeck.com/tinyeyes.html',
    usedFor: 'Prior art: opponent-channel infant vision simulation with age-keyed blur; our parameters are derived independently from the studies above.',
  },
  mattern2023: {
    id: 'mattern2023',
    citation:
      'Mattern D, Schumacher P, López FM, Raabe MC, Ernst MR, Aubret A, Triesch J. "MIMo: A Multi-Modal Infant Model for Studying Cognitive Development." arXiv:2312.04318 (2023).',
    url: 'https://arxiv.org/abs/2312.04318',
    usedFor: 'Context only: the embodied-infant-simulator research line that MIMo grows! extends.',
  },
  vaculinova2026: {
    id: 'vaculinova2026',
    citation:
      'Vaculinova N, Hoffmann M. "Infant simulator with an embodied caregiver: Generating infant-perspective touch and vision during social interaction." arXiv:2610.05997 (2026).',
    url: 'https://arxiv.org/abs/2610.05997',
    usedFor: 'Context only: infant-perspective rendering during social interaction (defers vision maturation to MIMo grows!).',
  },
  dineen2026: {
    id: 'dineen2026',
    citation:
      'Dineen AT, et al. "The development of coarse and fine feature tuning in infant visual cortex." bioRxiv 2026.10.14.758935 (2026).',
    url: 'https://www.biorxiv.org/content/10.64898/2026.10.14.758935',
    usedFor: 'Context only: cortex beyond V1 keeps privileging coarse features through 9 months — supports keeping a residual fine-detail penalty after acuity alone would predict sharp vision.',
  },
  haynes1965: {
    id: 'haynes1965',
    citation:
      'Haynes H, White BL, Held R. "Visual accommodation in human infants." Science 1965;148(3669):528–530.',
    url: 'https://doi.org/10.1126/science.148.3669.528',
    usedFor: 'Newborn focus: fixed plane at a median 19 cm (≈5.3 D) regardless of target distance — the anchor of the depth-of-focus model.',
  },
  green1980: {
    id: 'green1980',
    citation:
      'Green DG, Powers MK, Banks MS. "Depth of focus, eye size and visual acuity." Vision Res 1980;20:827–835.',
    url: 'https://doi.org/10.1016/0042-6989(80)90063-2',
    usedFor: 'Blur-circle optics: angular blur ≈ 3.44 × defocus (D) × pupil (mm); also reports Banks\' accommodation slopes by age.',
  },
  banks1980: {
    id: 'banks1980',
    citation:
      'Banks MS. "The development of visual accommodation during early infancy." Child Dev 1980;51(3):646–666.',
    url: 'https://doi.org/10.2307/1129450',
    usedFor: 'Accommodation response slopes (0.41–0.51 at 1 month, 0.75–0.83 by 3 months) and pupil diameters at 1–3 months.',
  },
  braddick1979: {
    id: 'braddick1979',
    citation:
      'Braddick O, Atkinson J, French J, Howland HC. "A photorefractive study of infant accommodation." Vision Res 1979;19:1319–1330.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/9205713/',
    usedFor: 'Consistent focus at the tested 1.5 m distance by 6–8 months (findings as tabulated in Currie & Manny 1997).',
  },
  hainline1992: {
    id: 'hainline1992',
    citation:
      'Hainline L, Riddell P, Grose-Fifer J, Abramov I. "Development of accommodation and convergence in infancy." Behav Brain Res 1992;49(1):33–50.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/1388799/',
    usedFor: 'Young infants typically fixate at around 30 cm — the assumed subject distance for depth-of-focus rendering.',
  },
  isenberg1989: {
    id: 'isenberg1989',
    citation:
      'Isenberg SJ, Dang Y, Jotterand V. "The pupils of term and preterm infants." Am J Ophthalmol 1989;108(1):75–79.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/2750838/',
    usedFor: 'Newborn pupil diameter (3.6–3.8 mm).',
  },
  macLachlan2002: {
    id: 'macLachlan2002',
    citation:
      'MacLachlan C, Howland HC. "Normal values and standard deviations for pupil diameter and interpupillary distance in subjects aged 1 month to 19 years." Ophthalmic Physiol Opt 2002;22(3):175–182.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/12090630/',
    usedFor: 'Pupil diameter norms across infancy (6-month anchor).',
  },
};
