import { FormEvent, useState } from 'react';
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Code2,
  Compass,
  Copy,
  Landmark,
  Loader2,
  Send,
  ShieldAlert,
  Users,
  X,
} from 'lucide-react';
import { STAKEHOLDER_PATHWAYS } from '../data/maeSaiData';
import {
  AccessLevel,
  DatasetItem,
  DataType,
  PageRoute,
  StakeholderId,
  StakeholderPathway,
} from '../types/hub';
import { AccessBadge } from '../components/AccessBadge';

interface ContributePageProps {
  contributedDatasets: DatasetItem[];
  onContributionCreated: (dataset: DatasetItem) => void;
  onSelectDataset: (datasetId: string) => void;
  onNavigate: (page: PageRoute) => void;
}

const API_PRESETS = [
  {
    id: 'business-hours',
    label: 'Business Hours',
    payload: {
      pathway: 'Local Businesses',
      title: 'Pha Mi & Doi Wao Weekend Café Hours',
      subDistrict: 'Wiang Phang Kham',
      dataType: 'Directory data',
      format: 'JSON',
      accessLevel: 'Open',
      sourceLabel: 'Participating Cafés Network',
      ownerContributor: 'Wiang Phang Kham Business Group',
      summary:
        'Weekend opening hours, Thai QR payment readiness, and English menu availability.',
      sampleRows: [
        {
          'Business Name': 'Doi Wao Terrace Brew',
          'Hours': '07:30 – 17:30',
          'Payment': 'Thai QR, Cash',
          'Languages': 'TH, EN',
        },
        {
          'Business Name': 'Pha Mi Ridge Roasters',
          'Hours': '08:00 – 17:00',
          'Payment': 'Thai QR, Card',
          'Languages': 'TH, EN',
        },
      ],
      consentAccepted: true,
    },
  },
  {
    id: 'trail-stats',
    label: 'Trail Footfall',
    payload: {
      pathway: 'Government & Public Agencies',
      title: 'Pong Pha Trailhead Morning Arrival Count',
      subDistrict: 'Pong Pha',
      dataType: 'Statistics',
      format: 'JSON',
      accessLevel: 'Open',
      sourceLabel: 'Park Gate Counter Feed',
      ownerContributor: 'Pong Pha Trail Monitoring Desk',
      summary:
        'Hourly morning gate arrival counts for trailhead capacity planning.',
      sampleRows: [
        { 'Window': '07:00 – 09:00', 'Visitors': 48, 'Trail Status': 'Open' },
        { 'Window': '09:00 – 11:00', 'Visitors': 112, 'Trail Status': 'High Load' },
        { 'Window': '14:00 – 16:00', 'Visitors': 39, 'Trail Status': 'Open' },
      ],
      consentAccepted: true,
    },
  },
  {
    id: 'community-event',
    label: 'Community Event',
    payload: {
      pathway: 'Community Groups',
      title: 'Ko Chang Harvest & Craft Morning Schedule',
      subDistrict: 'Ko Chang',
      dataType: 'Text & Feedback',
      format: 'JSON',
      accessLevel: 'Members only',
      sourceLabel: 'Ko Chang Village Calendar',
      ownerContributor: 'Ko Chang Community Coordinator',
      summary:
        'Draft morning market and cycling stop schedule for local guesthouses.',
      consentAccepted: true,
    },
  },
];

export function ContributePage({
  contributedDatasets,
  onContributionCreated,
  onSelectDataset,
  onNavigate,
}: ContributePageProps) {
  const [selectedPathway, setSelectedPathway] =
    useState<StakeholderPathway | null>(null);
  const [title, setTitle] = useState('');
  const [subDistrict, setSubDistrict] = useState('Wiang Phang Kham');
  const [format, setFormat] = useState('');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>(AccessLevel.OPEN);
  const [summary, setSummary] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<DatasetItem | null>(
    null
  );

  const [selectedPresetId, setSelectedPresetId] = useState(API_PRESETS[0].id);
  const [jsonPayload, setJsonPayload] = useState(() =>
    JSON.stringify(API_PRESETS[0].payload, null, 2)
  );
  const [apiSubmitting, setApiSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState<{
    status: number;
    body: string;
    ok: boolean;
  } | null>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const pathwayIcons: Record<StakeholderId, typeof Landmark> = {
    [StakeholderId.GOVERNMENT]: Landmark,
    [StakeholderId.BUSINESSES]: Building2,
    [StakeholderId.COMMUNITIES]: Users,
    [StakeholderId.VISITORS]: Compass,
  };

  const openPathwayForm = (pathway: StakeholderPathway) => {
    setSelectedPathway(pathway);
    setTitle('');
    setFormat(pathway.suggestedFields.formatOptions[0]);
    setAccessLevel(
      pathway.id === StakeholderId.COMMUNITIES
        ? AccessLevel.MEMBERS_ONLY
        : AccessLevel.OPEN
    );
    setSummary('');
    setConsentChecked(false);
    setFormError(null);
    setSubmittedRecord(null);
  };

  const inferDataType = (fmt: string, pathwayId: StakeholderId): DataType => {
    const lower = fmt.toLowerCase();
    if (lower.includes('stat') || lower.includes('csv')) return DataType.STATISTICS;
    if (lower.includes('photo')) return DataType.PHOTOS;
    if (lower.includes('video')) return DataType.VIDEO;
    if (lower.includes('restricted') || lower.includes('report'))
      return DataType.REPORT;
    if (lower.includes('directory') || pathwayId === StakeholderId.BUSINESSES)
      return DataType.DIRECTORY;
    return DataType.TEXT_FEEDBACK;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedPathway || !title.trim() || !consentChecked || formSubmitting) {
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pathway: selectedPathway.title,
          title: title.trim(),
          subDistrict,
          dataType: inferDataType(
            format || selectedPathway.suggestedFields.formatOptions[0],
            selectedPathway.id
          ),
          format: format || selectedPathway.suggestedFields.formatOptions[0],
          accessLevel,
          summary: summary.trim(),
          consentAccepted: consentChecked,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data?.error || 'Unable to submit contribution.');
        setFormSubmitting(false);
        return;
      }

      if (data.dataset) {
        onContributionCreated(data.dataset as DatasetItem);
        setSubmittedRecord(data.dataset as DatasetItem);
      }
    } catch {
      setFormError('Network error while submitting to /api/contributions.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleSendApiRequest = async () => {
    if (apiSubmitting) return;
    setApiSubmitting(true);
    setApiResponse(null);

    let parsedBody: unknown;
    try {
      parsedBody = JSON.parse(jsonPayload);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON syntax';
      setApiResponse({
        status: 400,
        ok: false,
        body: JSON.stringify({ error: `Invalid JSON: ${msg}` }, null, 2),
      });
      setApiSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedBody),
      });
      const data = await res.json();
      setApiResponse({
        status: res.status,
        ok: res.ok,
        body: JSON.stringify(data, null, 2),
      });
      if (res.ok && data.dataset) {
        onContributionCreated(data.dataset as DatasetItem);
      }
    } catch {
      setApiResponse({
        status: 500,
        ok: false,
        body: JSON.stringify(
          { error: 'Network error reaching POST /api/contributions' },
          null,
          2
        ),
      });
    } finally {
      setApiSubmitting(false);
    }
  };

  const curlSnippet = `curl -X POST "${window.location.origin}/api/contributions" \\
  -H "Content-Type: application/json" \\
  -d '${jsonPayload.replace(/\n/g, ' ').replace(/\s+/g, ' ')}'`;

  const handleCopyCurl = async () => {
    try {
      await navigator.clipboard.writeText(curlSnippet);
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    } catch {
      setCopiedCurl(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[#E3E6DF] pb-5 space-y-1.5">
        <div className="text-xs font-semibold text-[#406246]">
          Contribute &amp; Connect
        </div>
        <h1 className="font-display text-3xl font-bold text-[#243329]">
          Contribute to Together Mae Sai
        </h1>
        <p className="text-sm sm:text-base text-[#66736A] max-w-2xl">
          Share local data through a stakeholder pathway or integrate directly using the JSON API.
        </p>
      </div>

      {/* Four Stakeholder Pathways */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STAKEHOLDER_PATHWAYS.map((pathway) => {
          const Icon = pathwayIcons[pathway.id];
          return (
            <section
              key={pathway.id}
              className="bg-white border border-[#E3E6DF] rounded-lg p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h2 className="font-display text-xl font-bold text-[#243329]">
                      {pathway.title}
                    </h2>
                    <p className="text-sm text-[#66736A]">{pathway.subtitle}</p>
                  </div>
                  <div className="w-10 h-10 rounded-md bg-[#f5f0de] border border-[#E2D9BA] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#406246]" aria-hidden="true" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#ECEFE9]">
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-semibold text-[#406246]">
                      What you contribute
                    </h3>
                    <ul className="space-y-1.5 text-xs text-[#243329] leading-relaxed">
                      {pathway.whatYouContribute.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="text-[#406246] font-bold" aria-hidden="true">
                            ·
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xs font-semibold text-[#406246]">
                      What you get
                    </h3>
                    <ul className="space-y-1.5 text-xs text-[#243329] leading-relaxed">
                      {pathway.whatYouGet.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="text-[#406246] font-bold" aria-hidden="true">
                            ·
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#ECEFE9] flex items-center justify-between gap-3">
                <span className="text-xs text-[#66736A] truncate">
                  {pathway.exampleFormats}
                </span>
                <button
                  type="button"
                  onClick={() => openPathwayForm(pathway)}
                  className="py-2 px-4 bg-[#406246] hover:bg-[#335038] text-white text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {pathway.ctaLabel}
                </button>
              </div>
            </section>
          );
        })}
      </div>

      {/* API Data Contribution Section */}
      <section className="bg-white border border-[#E3E6DF] rounded-lg p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#ECEFE9] pb-5">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#406246]">
              <Code2 className="w-4 h-4" aria-hidden="true" />
              <span>REST API</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[#243329]">
              Contribute via API
            </h2>
            <p className="text-sm text-[#66736A]">
              Push structured JSON records directly to{' '}
              <code className="font-mono text-xs bg-[#F7F8F5] px-1.5 py-0.5 rounded border border-[#E3E6DF] text-[#243329]">
                POST /api/contributions
              </code>
              . New records appear immediately in the catalog and AI Analyst.
            </p>
          </div>

          <div className="bg-[#F7F8F5] border border-[#E3E6DF] rounded-md px-4 py-2.5 text-xs space-y-1 shrink-0 font-mono">
            <div>
              <span className="font-semibold text-[#406246]">POST</span>{' '}
              <span className="text-[#243329]">/api/contributions</span>
            </div>
            <div>
              <span className="font-semibold text-[#66736A]">GET</span>{' '}
              <span className="text-[#243329]">/api/contributions</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#243329]">
                Payload Presets
              </span>
              <div className="flex flex-wrap gap-1.5">
                {API_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedPresetId(preset.id);
                      setJsonPayload(JSON.stringify(preset.payload, null, 2));
                      setApiResponse(null);
                    }}
                    className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors cursor-pointer ${
                      selectedPresetId === preset.id
                        ? 'bg-[#406246] text-white border-[#406246]'
                        : 'bg-[#F7F8F5] text-[#243329] border-[#D7DDD3] hover:bg-[#f5f0de]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <label htmlFor="api-json-payload" className="sr-only">
              JSON payload for POST /api/contributions
            </label>
            <textarea
              id="api-json-payload"
              rows={12}
              value={jsonPayload}
              onChange={(e) => setJsonPayload(e.target.value)}
              spellCheck={false}
              className="w-full p-4 font-mono text-xs bg-[#243329] text-[#F7F8F5] border border-[#243329] rounded-md leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#406246]"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCopyCurl}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#243329] bg-[#F7F8F5] hover:bg-[#f5f0de] border border-[#D7DDD3] rounded-md transition-colors cursor-pointer"
              >
                {copiedCurl ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#406246]" aria-hidden="true" />
                    <span>Copied cURL</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copy cURL</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSendApiRequest}
                disabled={apiSubmitting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#406246] hover:bg-[#335038] disabled:opacity-60 text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
              >
                {apiSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" aria-hidden="true" />
                    <span>Send Request</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#F7F8F5] border border-[#E3E6DF] rounded-md p-4 space-y-2">
              <div className="text-xs font-semibold text-[#243329]">
                Required Fields
              </div>
              <ul className="space-y-1.5 text-xs text-[#66736A] leading-relaxed">
                <li>
                  <code className="font-mono text-[#243329]">title</code> — Dataset or record title.
                </li>
                <li>
                  <code className="font-mono text-[#243329]">consentAccepted: true</code> — Permission &amp; PDPA confirmation.
                </li>
                <li>
                  <code className="font-mono text-[#243329]">accessLevel</code> —{' '}
                  <code className="font-mono">Open</code>,{' '}
                  <code className="font-mono">Members only</code>, or{' '}
                  <code className="font-mono">Restricted</code>.
                </li>
              </ul>
            </div>

            {apiResponse ? (
              <div className="border border-[#E3E6DF] rounded-md overflow-hidden">
                <div
                  className={`px-4 py-2.5 text-xs font-semibold flex items-center justify-between ${
                    apiResponse.ok
                      ? 'bg-[#f5f0de] text-[#406246] border-b border-[#E2D9BA]'
                      : 'bg-[#FAF1EE] text-[#7C2D12] border-b border-[#E7CFC6]'
                  }`}
                >
                  <span>Response</span>
                  <span className="font-mono tabular-nums">
                    HTTP {apiResponse.status}
                  </span>
                </div>
                <pre className="p-4 text-[11px] font-mono text-[#243329] bg-white overflow-x-auto max-h-64 leading-relaxed">
                  {apiResponse.body}
                </pre>
              </div>
            ) : (
              <div className="bg-[#F7F8F5] border border-[#E3E6DF] rounded-md p-6 text-center text-xs text-[#66736A]">
                Send a request to inspect the server response.
              </div>
            )}
          </div>
        </div>

        {contributedDatasets.length > 0 && (
          <div className="pt-6 border-t border-[#ECEFE9] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-[#243329]">
                Recent Contributions ({contributedDatasets.length})
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('catalog')}
                className="text-xs font-semibold text-[#406246] hover:underline cursor-pointer"
              >
                Open Catalog →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {contributedDatasets.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectDataset(item.id)}
                  className="text-left p-4 bg-[#F7F8F5] hover:bg-[#f5f0de] border border-[#E3E6DF] rounded-md flex items-center justify-between gap-3 transition-colors cursor-pointer"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-[#66736A]">
                      <span>{item.dataType}</span>
                      <span aria-hidden="true">·</span>
                      <AccessBadge level={item.accessLevel} />
                    </div>
                    <div className="text-sm font-semibold text-[#243329] truncate">
                      {item.title}
                    </div>
                    <div className="text-xs text-[#66736A] truncate">
                      {item.sourceLabel} · {item.subDistrict}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#406246] shrink-0" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Governance & PDPA Note */}
      <section className="bg-[#f5f0de] border border-[#E2D9BA] rounded-lg p-6 space-y-3">
        <div className="flex items-center gap-2 text-[#406246] font-display text-base font-bold">
          <ShieldAlert className="w-4 h-4" aria-hidden="true" />
          <span>Data Governance &amp; PDPA Policy</span>
        </div>
        <p className="text-xs sm:text-sm text-[#243329] leading-relaxed">
          Contributors only submit information they have permission to share, include media attribution where applicable, avoid collecting personal identifiers, and assign Open, Members only, or Restricted access tiers in line with Thailand&apos;s PDPA.
        </p>
      </section>

      {/* Stakeholder Contribution Modal */}
      {selectedPathway && (
        <div
          className="fixed inset-0 z-50 bg-[#243329]/50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contribute-modal-title"
        >
          <div className="bg-white border border-[#E3E6DF] rounded-lg max-w-lg w-full p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-[#406246]">
                  Data Submission
                </div>
                <h2
                  id="contribute-modal-title"
                  className="font-display text-xl font-bold text-[#243329]"
                >
                  {selectedPathway.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPathway(null)}
                className="p-1.5 text-[#66736A] hover:text-[#243329] rounded-md cursor-pointer"
                aria-label="Close contribution form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submittedRecord ? (
              <div className="space-y-5">
                <div className="bg-[#f5f0de] border border-[#E2D9BA] rounded-lg p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[#406246] font-semibold text-base">
                    <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                    <span>Submission recorded</span>
                  </div>
                  <div className="bg-white border border-[#E2D9BA] rounded-md p-3.5 text-xs space-y-1.5">
                    <div className="font-semibold text-[#243329]">
                      {submittedRecord.title}
                    </div>
                    <div className="text-[#66736A]">
                      {submittedRecord.subDistrict} · {submittedRecord.dataType} · {submittedRecord.accessLevel}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const createdId = submittedRecord.id;
                      setSelectedPathway(null);
                      onSelectDataset(createdId);
                    }}
                    className="px-4 py-2 text-sm font-medium text-[#406246] border border-[#406246] rounded-md hover:bg-[#F7F8F5] cursor-pointer"
                  >
                    Open Dataset
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPathway(null)}
                    className="px-4 py-2 bg-[#406246] hover:bg-[#335038] text-white text-sm font-medium rounded-md cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-[#66736A]">{selectedPathway.formPrompt}</p>

                {formError && (
                  <div className="bg-[#FAF1EE] border border-[#E7CFC6] text-[#7C2D12] text-xs rounded-md p-3">
                    {formError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label
                    htmlFor="contrib-title"
                    className="block text-xs font-semibold text-[#243329]"
                  >
                    Dataset or Entry Title *
                  </label>
                  <input
                    id="contrib-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={selectedPathway.suggestedFields.datasetTitlePlaceholder}
                    className="w-full px-3 py-2 text-sm bg-[#F7F8F5] border border-[#D7DDD3] rounded-md text-[#243329] focus:outline-none focus:border-[#406246] focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contrib-subdistrict"
                      className="block text-xs font-semibold text-[#243329]"
                    >
                      Sub-district
                    </label>
                    <select
                      id="contrib-subdistrict"
                      value={subDistrict}
                      onChange={(e) => setSubDistrict(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[#F7F8F5] border border-[#D7DDD3] rounded-md text-[#243329] focus:outline-none focus:border-[#406246] focus:bg-white"
                    >
                      <option value="Mae Sai">Mae Sai</option>
                      <option value="Wiang Phang Kham">Wiang Phang Kham</option>
                      <option value="Pong Pha">Pong Pha</option>
                      <option value="Ko Chang">Ko Chang</option>
                      <option value="District-wide">District-wide</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contrib-format"
                      className="block text-xs font-semibold text-[#243329]"
                    >
                      Format
                    </label>
                    <select
                      id="contrib-format"
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[#F7F8F5] border border-[#D7DDD3] rounded-md text-[#243329] focus:outline-none focus:border-[#406246] focus:bg-white"
                    >
                      {selectedPathway.suggestedFields.formatOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="contrib-access"
                    className="block text-xs font-semibold text-[#243329]"
                  >
                    Access Level
                  </label>
                  <select
                    id="contrib-access"
                    value={accessLevel}
                    onChange={(e) => setAccessLevel(e.target.value as AccessLevel)}
                    className="w-full px-3 py-2 text-sm bg-[#F7F8F5] border border-[#D7DDD3] rounded-md text-[#243329] focus:outline-none focus:border-[#406246] focus:bg-white"
                  >
                    <option value={AccessLevel.OPEN}>Open (Publicly viewable)</option>
                    <option value={AccessLevel.MEMBERS_ONLY}>
                      Members only (Participating local groups)
                    </option>
                    <option value={AccessLevel.RESTRICTED}>
                      Restricted (Metadata only)
                    </option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="contrib-summary"
                    className="block text-xs font-semibold text-[#243329]"
                  >
                    Source &amp; Context Note
                  </label>
                  <textarea
                    id="contrib-summary"
                    rows={3}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Briefly describe how this information was collected and who should be credited."
                    className="w-full px-3 py-2 text-sm bg-[#F7F8F5] border border-[#D7DDD3] rounded-md text-[#243329] focus:outline-none focus:border-[#406246] focus:bg-white"
                  />
                </div>

                <label className="flex items-start gap-2.5 text-xs text-[#243329] cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="mt-0.5 accent-[#406246]"
                  />
                  <span>
                    I confirm permission to share this information without unnecessary personal data (PDPA aware).
                  </span>
                </label>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPathway(null)}
                    className="px-4 py-2 text-sm font-medium text-[#66736A] hover:text-[#243329] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="px-4 py-2 bg-[#406246] hover:bg-[#335038] disabled:opacity-60 text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
                  >
                    {formSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
