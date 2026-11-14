export type SubDistrictId = 'pong-pha' | 'wiang-phang-kham' | 'mae-sai' | 'ko-chang';
export type SeasonId = 'cool' | 'hot' | 'green';
export type BusinessTypeId = 'cafe' | 'homestay' | 'craft' | 'community';

export interface ScenarioInput {
  subDistrict: SubDistrictId;
  season: SeasonId;
  businessType: BusinessTypeId;
  shiftPercent: number;
}

export interface TimeSlotScore {
  window: string;
  baselineLoad: number;
  adjustedLoad: number;
  status: 'Low' | 'Balanced' | 'High Load';
}

export interface ScenarioAnalysisResult {
  peakLoadScore: number;
  adjustedPeakScore: number;
  peakReductionPct: number;
  afternoonOpportunityScore: number;
  seasonalRiskLabel: string;
  timeSlots: TimeSlotScore[];
  primaryPriority: string;
  recommendedAction: string;
  corridorNote: string;
  methodologyNote: string;
  formulaSummary: string;
}

const SUBDISTRICT_CONFIG: Record<
  SubDistrictId,
  {
    label: string;
    baseIndex: number;
    slotWeights: [number, number, number, number];
    corridorNote: string;
  }
> = {
  'pong-pha': {
    label: 'Pong Pha (Pha Hee & Tham Luang)',
    baseIndex: 82,
    slotWeights: [0.68, 1.0, 0.78, 0.44],
    corridorNote: 'Hillside access roads concentrate parking demand before noon.',
  },
  'wiang-phang-kham': {
    label: 'Wiang Phang Kham (Town, Doi Wao & Pha Mi)',
    baseIndex: 76,
    slotWeights: [0.62, 0.88, 0.84, 0.66],
    corridorNote: 'Central town transit balances daytime stops with sunset viewpoints.',
  },
  'mae-sai': {
    label: 'Mae Sai (Border Gate & Market)',
    baseIndex: 88,
    slotWeights: [0.58, 0.94, 0.96, 0.62],
    corridorNote: 'Daytime market footfall tapers before late-afternoon closing.',
  },
  'ko-chang': {
    label: 'Ko Chang (Lowlands & Cycling)',
    baseIndex: 48,
    slotWeights: [0.85, 0.72, 0.46, 0.78],
    corridorNote: 'Cool morning and late-afternoon windows suit flatland cycling.',
  },
};

const SEASON_MULTIPLIER: Record<
  SeasonId,
  { label: string; factor: number; riskLabel: string }
> = {
  cool: {
    label: 'Cool Season (Nov–Feb)',
    factor: 1.05,
    riskLabel: 'Peak Season · High Morning Demand',
  },
  hot: {
    label: 'Hot / Songkran (Mar–May)',
    factor: 0.76,
    riskLabel: 'Moderate Demand · Midday Dip',
  },
  green: {
    label: 'Green / Monsoon (Jun–Oct)',
    factor: 0.56,
    riskLabel: 'Weather-Sensitive · Trail Advisories',
  },
};

const TIME_LABELS = [
  '07:00 – 09:00',
  '09:00 – 11:00',
  '11:00 – 14:00',
  '14:00 – 17:30',
];

function classifyLoad(score: number): 'Low' | 'Balanced' | 'High Load' {
  if (score >= 75) return 'High Load';
  if (score >= 45) return 'Balanced';
  return 'Low';
}

export function analyzeScenario(input: ScenarioInput): ScenarioAnalysisResult {
  const zone = SUBDISTRICT_CONFIG[input.subDistrict];
  const season = SEASON_MULTIPLIER[input.season];
  const shiftRatio = Math.max(0, Math.min(0.35, input.shiftPercent / 100));

  const rawBaseline = zone.slotWeights.map((w) =>
    Math.min(100, Math.round(zone.baseIndex * season.factor * w))
  );

  const shiftedUnits = Math.round(rawBaseline[1] * shiftRatio);
  const adjusted = [
    rawBaseline[0],
    Math.max(15, rawBaseline[1] - shiftedUnits),
    rawBaseline[2],
    Math.min(100, rawBaseline[3] + Math.round(shiftedUnits * 0.85)),
  ];

  const timeSlots: TimeSlotScore[] = TIME_LABELS.map((window, i) => ({
    window,
    baselineLoad: rawBaseline[i],
    adjustedLoad: adjusted[i],
    status: classifyLoad(adjusted[i]),
  }));

  const peakLoadScore = Math.max(...rawBaseline);
  const adjustedPeakScore = Math.max(...adjusted);
  const peakReductionPct =
    peakLoadScore > 0
      ? Math.max(0, Math.round(((peakLoadScore - adjustedPeakScore) / peakLoadScore) * 100))
      : 0;

  const afternoonOpportunityScore = Math.max(0, 100 - adjusted[3]);

  let primaryPriority = '';
  let recommendedAction = '';

  if (input.season === 'green') {
    primaryPriority = 'Publish seasonal trail status and indoor options';
    recommendedAction =
      input.businessType === 'cafe'
        ? 'Offer sheltered coffee-roasting sessions or tasting flights and keep wet-season hours updated in the directory.'
        : input.businessType === 'homestay'
        ? 'Brief guests on morning trail conditions before departure and pair rainy afternoons with town craft stops.'
        : 'Post weekly trail and road readiness updates so visitors do not turn back unexpectedly.';
  } else if (input.subDistrict === 'ko-chang') {
    primaryPriority = 'Channel overflow town visitors into slow-travel loops';
    recommendedAction =
      input.businessType === 'craft'
        ? 'Pair morning cycling maps with village craft workshops between 07:30–10:00 and 15:30–17:30.'
        : 'Share flatland cycling loops with town guesthouses so repeat visitors explore Ko Chang.';
  } else if (adjusted[1] >= 75) {
    primaryPriority = 'Relieve 09:00–11:00 crowding and grow afternoon visits';
    recommendedAction =
      input.businessType === 'cafe'
        ? 'Promote a 14:30–17:00 Sunset & Roast menu and mark overflow songthaew pickup points clearly.'
        : input.businessType === 'homestay'
        ? 'Suggest afternoon hillside visits for guests arriving after 13:00 to avoid mid-morning parking bottlenecks.'
        : 'Coordinate shared shuttle pickup windows and split morning-town / afternoon-hillside itineraries.';
  } else {
    primaryPriority = 'Keep opening hours, transit notes, and payment tags current';
    recommendedAction =
      'Confirm opening hours, Thai QR or card acceptance, and directional notes in the Local Business Directory.';
  }

  return {
    peakLoadScore,
    adjustedPeakScore,
    peakReductionPct,
    afternoonOpportunityScore,
    seasonalRiskLabel: season.riskLabel,
    timeSlots,
    primaryPriority,
    recommendedAction,
    corridorNote: zone.corridorNote,
    methodologyNote: `${zone.label} baseline index ${zone.baseIndex}/100 · ${season.label} factor ×${season.factor} · ${input.shiftPercent}% morning-to-afternoon shift (0.85 transfer weight).`,
    formulaSummary: `Base(${zone.baseIndex}) × Season(${season.factor}) × SlotWeight − Shift(${input.shiftPercent}%)`,
  };
}

export interface FeedbackAnalysisResult {
  detectedSubDistrict: string;
  primaryTheme: string;
  matchedThemes: Array<{
    theme: string;
    score: number;
    matchedKeywords: string[];
  }>;
  urgency: 'High' | 'Medium' | 'Low';
  suggestedAction: string;
  linkedDatasetId: string;
  linkedDatasetTitle: string;
}

interface ThemeRule {
  theme: string;
  keywords: string[];
  action: string;
  datasetId: string;
  datasetTitle: string;
}

const THEME_RULES: ThemeRule[] = [
  {
    theme: 'Local Transit & Parking',
    keywords: [
      'songthaew',
      'bus',
      'shuttle',
      'parking',
      'park',
      'traffic',
      'road',
      'steep',
      'pickup',
      'van',
      'drive',
      'congestion',
      'transport',
      'รถสองแถว',
      'ที่จอดรถ',
    ],
    action:
      'Add clear songthaew pickup times, steep-road notes, and overflow parking markers to the shared directory.',
    datasetId: 'ms-doi-pha-hee-trail-log',
    datasetTitle: 'Highland Coffee Trail Footfall Log',
  },
  {
    theme: 'Opening Hours & Closures',
    keywords: [
      'closed',
      'close',
      'open',
      'hours',
      'hour',
      'time',
      'schedule',
      'outdated',
      'holiday',
      'morning',
      'evening',
      'เวลาเปิด',
      'ปิด',
    ],
    action:
      'Confirm quarterly opening hours and weekly closing days in the Local Business Services Directory.',
    datasetId: 'ms-business-services-directory',
    datasetTitle: 'Local Business Services Directory',
  },
  {
    theme: 'Payment & QR Clarity',
    keywords: [
      'qr',
      'cash',
      'card',
      'promptpay',
      'pay',
      'payment',
      'atm',
      'baht',
      'credit',
      'scan',
      'เงินสด',
      'สแกน',
    ],
    action:
      'Display accepted payment methods (Thai QR, cash, international card) upfront on directory listings.',
    datasetId: 'ms-visitor-accessibility-notes',
    datasetTitle: 'Visitor Wayfinding & Language Feedback Log',
  },
  {
    theme: 'Seasonal Trail & Weather Safety',
    keywords: [
      'rain',
      'flood',
      'monsoon',
      'cave',
      'water',
      'mud',
      'slippery',
      'trail',
      'wet',
      'safety',
      'river',
      'น้ำท่วม',
      'ฝน',
    ],
    action:
      'Update seasonal trail access and safe indoor alternatives in the Tham Luang & Seasonal Recovery logs.',
    datasetId: 'ms-tham-luang-seasonal-notes',
    datasetTitle: 'Tham Luang & Nature Park Seasonal Access',
  },
  {
    theme: 'Bilingual Signage & Wayfinding',
    keywords: [
      'sign',
      'signage',
      'english',
      'thai',
      'language',
      'menu',
      'map',
      'direction',
      'lost',
      'confusing',
      'junction',
      'ป้าย',
    ],
    action:
      'Flag junction for bilingual Thai/English directional markers or printable QR route cards.',
    datasetId: 'ms-local-experience-video',
    datasetTitle: 'Mae Sai Local Experience Video',
  },
];

const SUBDISTRICT_KEYWORDS: Array<{ name: string; terms: string[] }> = [
  { name: 'Pong Pha (Pha Hee / Tham Luang)', terms: ['pha hee', 'ผาฮี้', 'tham luang', 'ถ้ำหลวง', 'pong pha', 'khun nam', 'cave'] },
  { name: 'Wiang Phang Kham (Town / Doi Wao / Pha Mi)', terms: ['wiang phang kham', 'doi wao', 'ดอยเวา', 'pha mi', 'ผาหมี', 'terminal', 'bus station'] },
  { name: 'Mae Sai (Border Gate & Market)', terms: ['border', 'sai river', 'bridge', 'sai lom joy', 'market', 'ด่านแม่สาย'] },
  { name: 'Ko Chang (Cycling & Rural Trails)', terms: ['ko chang', 'เกาะช้าง', 'cycling', 'bike', 'paddy', 'orchard'] },
];

export const SAMPLE_VISITOR_COMMENTS = [
  {
    id: 'sample-1',
    label: 'Pha Hee Transit & Parking',
    text: 'Arrived at Pha Hee around 10 AM and parking on the narrow curve was very crowded. We also did not know where the songthaew pickup time back to town was posted.',
  },
  {
    id: 'sample-2',
    label: 'Café Hours & QR Payment',
    text: 'Walked to a coffee shop near Wiang Phang Kham shown open online, but it was closed on Tuesday. Also helpful to know which stalls take international cards vs Thai QR or cash only.',
  },
  {
    id: 'sample-3',
    label: 'Monsoon Cave Trail Status',
    text: 'Drove out toward Tham Luang during heavy rain in August and was unsure whether the inner cave zone and forest trail were open until arriving at the gate.',
  },
  {
    id: 'sample-4',
    label: 'Ko Chang Cycling Signage',
    text: 'Loved the morning bike loop in Ko Chang rice paddies, though an English and Thai directional sign at the highway junction would help first-time riders find the trail start.',
  },
];

export function analyzeFeedbackText(rawText: string): FeedbackAnalysisResult {
  const normalized = rawText.toLowerCase();

  let detectedSubDistrict = 'District-wide (Mae Sai)';
  for (const area of SUBDISTRICT_KEYWORDS) {
    if (area.terms.some((term) => normalized.includes(term))) {
      detectedSubDistrict = area.name;
      break;
    }
  }

  const scoredThemes = THEME_RULES.map((rule) => {
    const matched = rule.keywords.filter((kw) => normalized.includes(kw));
    const score = matched.length === 0 ? 0 : Math.min(98, 45 + matched.length * 16);
    return {
      rule,
      score,
      matchedKeywords: matched,
    };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scoredThemes.length === 0) {
    return {
      detectedSubDistrict,
      primaryTheme: 'General Visitor Experience',
      matchedThemes: [],
      urgency: 'Low',
      suggestedAction:
        'Log this observation in the Visitor Wayfinding & Language Feedback Log with capture date and sub-district tag.',
      linkedDatasetId: 'ms-visitor-accessibility-notes',
      linkedDatasetTitle: 'Visitor Wayfinding & Language Feedback Log',
    };
  }

  const top = scoredThemes[0];
  const urgency: 'High' | 'Medium' | 'Low' =
    scoredThemes.length >= 2 || top.matchedKeywords.length >= 3
      ? 'High'
      : top.matchedKeywords.length >= 2
      ? 'Medium'
      : 'Low';

  return {
    detectedSubDistrict,
    primaryTheme: top.rule.theme,
    matchedThemes: scoredThemes.map((s) => ({
      theme: s.rule.theme,
      score: s.score,
      matchedKeywords: s.matchedKeywords,
    })),
    urgency,
    suggestedAction: top.rule.action,
    linkedDatasetId: top.rule.datasetId,
    linkedDatasetTitle: top.rule.datasetTitle,
  };
}
