import { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Download,
  ExternalLink,
  FileText,
  Lock,
  Play,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { DATASETS } from '../data/maeSaiData';
import { AccessLevel, DatasetItem, PhotoSampleItem } from '../types/hub';
import { AccessBadge } from '../components/AccessBadge';

interface DatasetDetailPageProps {
  datasetId: string;
  datasets?: DatasetItem[];
  onBackToCatalog: () => void;
  onSelectDataset: (datasetId: string) => void;
  onDemoFeedback: (message: string, variant?: 'info' | 'success') => void;
}

type DetailTab = 'overview' | 'preview' | 'metadata';

function MaeSaiPhotoPlate({ motif }: { motif: PhotoSampleItem['motif'] }) {
  if (motif === 'mountain') {
    return (
      <svg viewBox="0 0 320 180" className="w-full h-40 bg-[#F7F8F5]" role="img" aria-label="Doi Pha Hee ridge landscape">
        <rect width="320" height="180" fill="#f5f0de" />
        <path d="M0 135 L65 78 L125 112 L195 56 L265 98 L320 72 L320 180 L0 180 Z" fill="#8EA68E" />
        <path d="M0 150 L85 108 L155 132 L235 92 L320 128 L320 180 L0 180 Z" fill="#406246" />
        <circle cx="255" cy="42" r="14" fill="#E3D7B0" />
        <path d="M20 156 Q80 145 160 156 T300 154" stroke="#f5f0de" strokeWidth="2" fill="none" strokeDasharray="4 4" />
      </svg>
    );
  }
  if (motif === 'temple') {
    return (
      <svg viewBox="0 0 320 180" className="w-full h-40 bg-[#F7F8F5]" role="img" aria-label="Wat Phra That Doi Wao silhouette">
        <rect width="320" height="180" fill="#f5f0de" />
        <path d="M0 142 Q90 112 180 130 T320 120 L320 180 L0 180 Z" fill="#6F8C72" />
        <polygon points="160,38 145,78 175,78" fill="#406246" />
        <rect x="140" y="78" width="40" height="36" fill="#406246" />
        <polygon points="128,114 192,114 184,96 136,96" fill="#243329" />
        <rect x="120" y="114" width="80" height="28" fill="#243329" />
      </svg>
    );
  }
  if (motif === 'border') {
    return (
      <svg viewBox="0 0 320 180" className="w-full h-40 bg-[#F7F8F5]" role="img" aria-label="Mae Sai border market lane">
        <rect width="320" height="180" fill="#F7F8F5" />
        <rect x="0" y="118" width="320" height="62" fill="#E2D9BA" />
        <rect x="34" y="68" width="64" height="50" fill="#406246" />
        <polygon points="28,68 104,68 96,52 36,52" fill="#243329" />
        <rect x="128" y="60" width="68" height="58" fill="#6F8C72" />
        <polygon points="122,60 202,60 192,44 132,44" fill="#406246" />
        <rect x="224" y="72" width="64" height="46" fill="#406246" />
        <path d="M0 148 L320 148" stroke="#406246" strokeWidth="3" strokeDasharray="8 6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 320 180" className="w-full h-40 bg-[#F7F8F5]" role="img" aria-label="Khun Nam Nang Non spring and forest trail">
      <rect width="320" height="180" fill="#F7F8F5" />
      <path d="M0 0 L110 0 L80 120 L0 120 Z" fill="#6F8C72" />
      <path d="M210 0 L320 0 L320 120 L240 120 Z" fill="#6F8C72" />
      <ellipse cx="160" cy="138" rx="115" ry="26" fill="#406246" opacity="0.85" />
      <ellipse cx="160" cy="138" rx="75" ry="14" fill="#f5f0de" opacity="0.55" />
      <path d="M100 112 Q160 76 220 112" stroke="#243329" strokeWidth="3" fill="none" />
    </svg>
  );
}

export function DatasetDetailPage({
  datasetId,
  datasets = DATASETS,
  onBackToCatalog,
  onSelectDataset,
  onDemoFeedback,
}: DatasetDetailPageProps) {
  const dataset: DatasetItem =
    datasets.find((d) => d.id === datasetId) || datasets[0];

  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);

  const relatedDatasets = datasets.filter((d) =>
    dataset.relatedIds.includes(d.id)
  );

  const isRestricted = dataset.accessLevel === AccessLevel.RESTRICTED;
  const isMembersOnly = dataset.accessLevel === AccessLevel.MEMBERS_ONLY;

  const handlePrimaryAction = () => {
    if (isRestricted) {
      onDemoFeedback(
        'This dataset is restricted. Only summary metadata and custodian details are publicly visible.',
        'info'
      );
      return;
    }
    if (isMembersOnly) {
      onDemoFeedback(
        `Member access required to download "${dataset.title}".`,
        'info'
      );
      return;
    }

    let content = '';
    let extension = 'json';
    let mimeType = 'application/json;charset=utf-8;';

    if (dataset.tablePreview) {
      const { columns, rows } = dataset.tablePreview;
      const escapeCsv = (val: string | number) =>
        `"${String(val).replace(/"/g, '""')}"`;
      const header = columns.map(escapeCsv).join(',');
      const body = rows
        .map((row) => columns.map((col) => escapeCsv(row[col] ?? '')).join(','))
        .join('\n');
      content = `${header}\n${body}\n`;
      extension = 'csv';
      mimeType = 'text/csv;charset=utf-8;';
    } else {
      content = JSON.stringify(
        {
          id: dataset.id,
          title: dataset.title,
          sourceLabel: dataset.sourceLabel,
          lastUpdated: dataset.lastUpdated,
          accessLevel: dataset.accessLevel,
          records:
            dataset.photoPreview ||
            dataset.videoPreview ||
            dataset.textPreview ||
            dataset.shortSummary,
        },
        null,
        2
      );
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${dataset.id}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onDemoFeedback(
      `Downloaded ${dataset.id}.${extension}.`,
      'success'
    );
  };

  const handleViewSource = () => {
    onDemoFeedback(
      `${dataset.sourceLabel} · ${dataset.collectionMethod}`,
      'info'
    );
  };

  const renderPreviewContent = () => {
    if (isRestricted) {
      return (
        <div className="bg-[#FAF1EE] border border-[#E7CFC6] rounded-lg p-6 sm:p-8 space-y-2.5">
          <div className="flex items-center gap-2 text-[#7C2D12] font-semibold text-base">
            <Lock className="w-5 h-5" aria-hidden="true" />
            <span>Restricted Record — Metadata Only</span>
          </div>
          <p className="text-sm text-[#243329] leading-relaxed max-w-2xl">
            Contents are restricted by the data custodian. Provenance, update dates, and access requirements are listed under Metadata &amp; Governance.
          </p>
        </div>
      );
    }

    if (dataset.tablePreview) {
      return (
        <div className="space-y-3">
          <div className="text-xs text-[#66736A]">
            Preview · {dataset.recordCountLabel}
          </div>
          <div className="border border-[#E3E6DF] rounded-lg overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F7F8F5] border-b border-[#E3E6DF] text-xs font-semibold text-[#243329]">
                    {dataset.tablePreview.columns.map((col) => (
                      <th key={col} className="py-3 px-4 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECEFE9] text-sm">
                  {dataset.tablePreview.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#F7F8F5]/70">
                      {dataset.tablePreview!.columns.map((col, colIdx) => (
                        <td
                          key={col}
                          className={`py-3 px-4 ${
                            colIdx === 0
                              ? 'font-medium text-[#243329] whitespace-nowrap'
                              : 'text-[#66736A] font-mono tabular-nums text-xs sm:text-sm'
                          }`}
                        >
                          {row[col]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (dataset.photoPreview) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dataset.photoPreview.map((photo) => (
            <figure
              key={photo.id}
              className="bg-white border border-[#E3E6DF] rounded-lg overflow-hidden"
            >
              <MaeSaiPhotoPlate motif={photo.motif} />
              <figcaption className="p-4 space-y-1.5">
                <div className="font-semibold text-sm text-[#243329]">
                  {photo.title}
                </div>
                <p className="text-xs text-[#66736A] leading-relaxed">
                  {photo.caption}
                </p>
                <div className="pt-2 border-t border-[#ECEFE9] flex flex-wrap items-center justify-between gap-2 text-xs text-[#66736A]">
                  <span>{photo.location}</span>
                  <span className="font-mono tabular-nums">{photo.capturedDate}</span>
                </div>
                <div className="text-xs text-[#406246]">
                  Credit: {photo.contributor}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      );
    }

    if (dataset.videoPreview) {
      const chapters = dataset.videoPreview.chapters;
      const currentChapter = chapters[activeChapterIdx] || chapters[0];
      return (
        <div className="space-y-4">
          <div className="bg-[#243329] text-white rounded-lg p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#D3DDD5]">
              <span>Indexed Field Clip</span>
              <span className="font-mono tabular-nums">
                {dataset.videoPreview.duration} · {dataset.videoPreview.location}
              </span>
            </div>

            <div className="py-5 border-y border-[#3B4F42] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs text-[#f5f0de]">
                  Chapter {currentChapter.time}
                </div>
                <div className="font-display text-lg font-semibold">
                  {currentChapter.label}
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  onDemoFeedback(
                    `Playing segment: "${currentChapter.label}" (${currentChapter.time})`,
                    'info'
                  )
                }
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#406246] hover:bg-[#335038] text-white text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Play Segment</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {chapters.map((ch, idx) => (
                <button
                  key={ch.time}
                  type="button"
                  onClick={() => setActiveChapterIdx(idx)}
                  className={`text-left px-3 py-2 rounded text-xs transition-colors cursor-pointer ${
                    idx === activeChapterIdx
                      ? 'bg-[#f5f0de] text-[#243329] font-semibold'
                      : 'bg-[#2E4135] text-[#E6ECE7] hover:bg-[#395042]'
                  }`}
                >
                  <span className="font-mono tabular-nums mr-2">{ch.time}</span>
                  <span>{ch.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#f5f0de] border border-[#E2D9BA] rounded-lg p-4 space-y-1">
            <div className="text-xs font-semibold text-[#406246]">
              Transcript · {dataset.videoPreview.creator}
            </div>
            <p className="text-sm text-[#243329] leading-relaxed">
              {dataset.videoPreview.transcriptSnippet}
            </p>
          </div>
        </div>
      );
    }

    if (dataset.textPreview) {
      return (
        <div className="space-y-3">
          {dataset.textPreview.map((entry) => (
            <div
              key={entry.id}
              className="bg-white border border-[#E3E6DF] rounded-lg p-4 space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#66736A]">
                <span className="font-semibold text-[#243329]">{entry.area}</span>
                <span className="font-mono tabular-nums">{entry.date}</span>
              </div>
              <p className="text-sm text-[#243329] leading-relaxed">
                {entry.note}
              </p>
              <div className="text-xs text-[#66736A]">
                {entry.contributorType}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-7">
      <div>
        <button
          type="button"
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#406246] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Data Catalog</span>
        </button>
      </div>

      {/* Dataset Header */}
      <div className="bg-[#FAF7ED] border border-[#D4C9A8] rounded-lg overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#66736A]">
              <span className="font-semibold text-[#406246]">{dataset.category}</span>
              <span aria-hidden="true">·</span>
              <span>{dataset.dataType}</span>
              <span aria-hidden="true">·</span>
              <span>{dataset.subDistrict}</span>
              <span aria-hidden="true">·</span>
              <AccessBadge level={dataset.accessLevel} />
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#243329] leading-tight">
              {dataset.title}
            </h1>

            <p className="text-sm sm:text-base text-[#56635A] leading-relaxed">
              {dataset.fullDescription}
            </p>
          </div>

          <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handlePrimaryAction}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isRestricted
                  ? 'bg-[#FAF1EE] text-[#7C2D12] border border-[#E7CFC6] hover:bg-[#F3E4DF]'
                  : 'bg-[#406246] hover:bg-[#335038] text-white'
              }`}
            >
              {isRestricted ? (
                <>
                  <Lock className="w-4 h-4" aria-hidden="true" />
                  <span>Access Policy</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {isMembersOnly
                      ? 'Request Member Access'
                      : dataset.tablePreview
                      ? 'Download CSV'
                      : 'Download JSON'}
                  </span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleViewSource}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#f5f0de] hover:bg-[#E8E0C5] text-[#243329] border border-[#DED4B2] text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              <span>Source Info</span>
            </button>
          </div>
        </div>

        {/* Provenance & Freshness Strip on Secondary Cream */}
        <div className="bg-[#f5f0de] border-t border-[#DED4B2] px-6 sm:px-8 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <div className="text-[#66736A] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#406246]" aria-hidden="true" />
              <span>Source</span>
            </div>
            <div className="font-medium text-[#243329]">{dataset.sourceLabel}</div>
          </div>

          <div className="space-y-1">
            <div className="text-[#66736A] flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#406246]" aria-hidden="true" />
              <span>Owner / Contributor</span>
            </div>
            <div className="font-medium text-[#243329]">{dataset.ownerContributor}</div>
          </div>

          <div className="space-y-1">
            <div className="text-[#66736A] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#406246]" aria-hidden="true" />
              <span>Collected &amp; Updated</span>
            </div>
            <div className="font-mono tabular-nums font-medium text-[#243329]">
              {dataset.collectedDate} → {dataset.lastUpdated}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[#66736A] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#406246]" aria-hidden="true" />
              <span>Verification</span>
            </div>
            <div className="font-medium text-[#243329]">{dataset.verificationDate}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex items-center gap-1 bg-white border border-[#E3E6DF] rounded-lg p-1 w-fit" role="tablist" aria-label="Dataset detail sections">
          {(
            [
              { id: 'overview', label: 'Overview' },
              { id: 'preview', label: 'Data Preview' },
              { id: 'metadata', label: 'Metadata & Governance' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#406246] text-white'
                  : 'text-[#66736A] hover:text-[#243329]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-[#E3E6DF] rounded-lg p-6 space-y-3">
                <h2 className="font-display text-lg font-semibold text-[#243329]">
                  How to use this dataset
                </h2>
                <p className="text-sm text-[#243329] leading-relaxed">
                  {dataset.howToUse}
                </p>
                <div className="bg-[#f5f0de] border border-[#E2D9BA] rounded-md p-3.5 text-xs text-[#243329] leading-relaxed">
                  {dataset.usageNotes}
                </div>
              </div>

              <div>{renderPreviewContent()}</div>
            </div>

            <aside className="lg:col-span-4 space-y-5">
              <div className="bg-white border border-[#E3E6DF] rounded-lg p-5 space-y-3">
                <h3 className="font-display text-base font-semibold text-[#243329]">
                  Governance &amp; Access
                </h3>
                <div>
                  <AccessBadge level={dataset.accessLevel} />
                </div>
                <p className="text-xs text-[#66736A] leading-relaxed">
                  {dataset.permittedUse}
                </p>
                <div className="pt-2 border-t border-[#ECEFE9] text-xs text-[#66736A]">
                  {dataset.verificationNote}
                </div>
              </div>

              {relatedDatasets.length > 0 && (
                <div className="bg-white border border-[#E3E6DF] rounded-lg p-5 space-y-3">
                  <h3 className="font-display text-base font-semibold text-[#243329]">
                    Related Datasets
                  </h3>
                  <div className="space-y-2.5">
                    {relatedDatasets.map((rel) => (
                      <button
                        key={rel.id}
                        type="button"
                        onClick={() => {
                          setActiveTab('overview');
                          onSelectDataset(rel.id);
                        }}
                        className="w-full text-left p-3 bg-[#F7F8F5] hover:bg-[#f5f0de] border border-[#E3E6DF] rounded-md transition-colors space-y-1 cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-2 text-xs text-[#66736A]">
                          <span>{rel.dataType}</span>
                          <AccessBadge level={rel.accessLevel} />
                        </div>
                        <div className="text-sm font-semibold text-[#243329]">
                          {rel.title}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="space-y-4">{renderPreviewContent()}</div>
        )}

        {activeTab === 'metadata' && (
          <div className="bg-white border border-[#E3E6DF] rounded-lg p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-[#243329] mb-6">
              Metadata &amp; Governance
            </h2>

            <div className="divide-y divide-[#ECEFE9] text-sm">
              <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-3 font-semibold text-[#406246]">Identity</div>
                <dl className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs text-[#66736A]">Dataset Name</dt>
                    <dd className="font-medium text-[#243329] mt-0.5">{dataset.title}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#66736A]">Category &amp; Type</dt>
                    <dd className="font-medium text-[#243329] mt-0.5">
                      {dataset.category} · {dataset.dataType}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-[#66736A]">Summary</dt>
                    <dd className="text-[#243329] mt-0.5">{dataset.shortSummary}</dd>
                  </div>
                </dl>
              </div>

              <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-3 font-semibold text-[#406246]">Provenance</div>
                <dl className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs text-[#66736A]">Source</dt>
                    <dd className="font-medium text-[#243329] mt-0.5">{dataset.sourceLabel}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#66736A]">Owner / Contributor</dt>
                    <dd className="font-medium text-[#243329] mt-0.5">{dataset.ownerContributor}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-[#66736A]">Collection Method</dt>
                    <dd className="text-[#243329] mt-0.5">{dataset.collectionMethod}</dd>
                  </div>
                </dl>
              </div>

              <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-3 font-semibold text-[#406246]">Freshness</div>
                <dl className="md:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <dt className="text-xs text-[#66736A]">Date Collected</dt>
                    <dd className="font-mono tabular-nums font-medium text-[#243329] mt-0.5">
                      {dataset.collectedDate}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#66736A]">Last Updated</dt>
                    <dd className="font-mono tabular-nums font-medium text-[#243329] mt-0.5">
                      {dataset.lastUpdated}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#66736A]">Verification Date</dt>
                    <dd className="font-medium text-[#243329] mt-0.5">
                      {dataset.verificationDate}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-3 font-semibold text-[#406246]">Governance</div>
                <dl className="md:col-span-9 space-y-3">
                  <div>
                    <dt className="text-xs text-[#66736A] mb-1">Access Level</dt>
                    <dd>
                      <AccessBadge level={dataset.accessLevel} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#66736A]">Permitted Use</dt>
                    <dd className="text-[#243329] mt-0.5">{dataset.permittedUse}</dd>
                  </div>
                </dl>
              </div>

              <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-3 font-semibold text-[#406246]">Usage Notes</div>
                <dl className="md:col-span-9 space-y-2">
                  <div>
                    <dt className="text-xs text-[#66736A]">Recommended Use</dt>
                    <dd className="text-[#243329] mt-0.5">{dataset.howToUse}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#66736A]">Notes</dt>
                    <dd className="text-[#66736A] mt-0.5">{dataset.usageNotes}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
