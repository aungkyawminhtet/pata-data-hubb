export type PageRoute =
  | 'home'
  | 'catalog'
  | 'detail'
  | 'insights'
  | 'contribute'
  | 'explore-map';

export enum AccessLevel {
  OPEN = 'Open',
  MEMBERS_ONLY = 'Members only',
  RESTRICTED = 'Restricted',
}

export enum DataType {
  STATISTICS = 'Statistics',
  PHOTOS = 'Photos',
  VIDEO = 'Video',
  TEXT_FEEDBACK = 'Text & Feedback',
  DIRECTORY = 'Directory data',
  REPORT = 'Report / document',
}

export enum SourceCategory {
  PUBLIC_AGENCY = 'Public agency source',
  COMMUNITY = 'Community contribution',
  BUSINESS = 'Business contribution',
  VISITOR = 'Visitor contribution',
  ILLUSTRATIVE = 'Illustrative sample',
}

export enum StakeholderId {
  GOVERNMENT = 'government',
  BUSINESSES = 'businesses',
  COMMUNITIES = 'communities',
  VISITORS = 'visitors',
}

export interface TableRowSample {
  [key: string]: string | number;
}

export interface PhotoSampleItem {
  id: string;
  title: string;
  location: string;
  caption: string;
  contributor: string;
  capturedDate: string;
  motif: 'mountain' | 'temple' | 'border' | 'cave';
}

export interface VideoSampleMeta {
  title: string;
  duration: string;
  creator: string;
  location: string;
  transcriptSnippet: string;
  chapters: Array<{ time: string; label: string }>;
}

export interface TextExcerptSample {
  id: string;
  date: string;
  area: string;
  note: string;
  contributorType: string;
}

export interface DatasetItem {
  id: string;
  title: string;
  shortSummary: string;
  fullDescription: string;
  category: string;
  dataType: DataType;
  sourceLabel: string;
  sourceCategory: SourceCategory;
  ownerContributor: string;
  collectionMethod: string;
  collectedDate: string;
  lastUpdated: string;
  verificationDate: string;
  verificationNote: string;
  accessLevel: AccessLevel;
  permittedUse: string;
  howToUse: string;
  usageNotes: string;
  recordCountLabel: string;
  subDistrict: string;
  relatedIds: string[];
  featured?: boolean;
  tablePreview?: {
    columns: string[];
    rows: TableRowSample[];
  };
  photoPreview?: PhotoSampleItem[];
  videoPreview?: VideoSampleMeta;
  textPreview?: TextExcerptSample[];
}

export interface InsightItem {
  id: string;
  title: string;
  category: string;
  timeContext: string;
  whatSampleShows: string;
  whyItMatters: string;
  possibleAction: string;
  evidenceLabel: string;
  stakeholderFocus: string;
  relatedDatasetIds: string[];
  detailSummary: string;
}

export interface ChartSeriesOption {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  unit: string;
  timeWindow: string;
  demoLabel: string;
  data: Array<{
    label: string;
    primaryValue: number;
    secondaryValue?: number;
    note: string;
  }>;
  primaryLegend: string;
  secondaryLegend?: string;
}

export interface StakeholderPathway {
  id: StakeholderId;
  title: string;
  subtitle: string;
  whatYouContribute: string[];
  whatYouGet: string[];
  exampleFormats: string;
  ctaLabel: string;
  formPrompt: string;
  suggestedFields: {
    datasetTitlePlaceholder: string;
    formatOptions: string[];
  };
}

export interface MaeSaiMapLocation {
  id: string;
  name: string;
  thaiName: string;
  subDistrict: string;
  category: 'Cultural Heritage' | 'Nature & Trail' | 'Market & Border' | 'Community & Coffee';
  x: number;
  y: number;
  hours: string;
  summary: string;
  linkedDatasetId: string;
  sourceLabel: string;
  lastUpdated: string;
}
