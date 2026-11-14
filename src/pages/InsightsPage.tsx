import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Bot,
  ChevronDown,
  ChevronUp,
  MessageSquareText,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { CHART_SERIES_OPTIONS, DATASETS, INSIGHTS } from '../data/maeSaiData';
import { DatasetItem, InsightItem, PageRoute } from '../types/hub';
import { AiAnalystPanel } from '../components/AiAnalystPanel';
import {
  analyzeFeedbackText,
  analyzeScenario,
  BusinessTypeId,
  SAMPLE_VISITOR_COMMENTS,
  SeasonId,
  SubDistrictId,
} from '../utils/analysisModel';

interface InsightsPageProps {
  initialInsightId?: string | null;
  activePage?: PageRoute;
  datasets?: DatasetItem[];
  onSelectDataset: (datasetId: string) => void;
}

type InsightsWorkspaceTab =
  | 'overview'
  | 'scenario-model'
  | 'feedback-analyzer'
  | 'ai-analyst';

export function InsightsPage({
  initialInsightId,
  activePage = 'insights',
  datasets = DATASETS,
  onSelectDataset,
}: InsightsPageProps) {
  const [workspaceTab, setWorkspaceTab] =
    useState<InsightsWorkspaceTab>('overview');
  const [selectedChartId, setSelectedChartId] = useState<string>(
    CHART_SERIES_OPTIONS[0].id
  );
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activeInsight, setActiveInsight] = useState<InsightItem | null>(() => {
    if (!initialInsightId) return null;
    return INSIGHTS.find((i) => i.id === initialInsightId) || null;
  });

  const [subDistrict, setSubDistrict] = useState<SubDistrictId>('pong-pha');
  const [season, setSeason] = useState<SeasonId>('cool');
  const [businessType, setBusinessType] = useState<BusinessTypeId>('cafe');
  const [shiftPercent, setShiftPercent] = useState<number>(15);
  const [showMethodology, setShowMethodology] = useState<boolean>(false);

  const scenarioResult = useMemo(
    () =>
      analyzeScenario({
        subDistrict,
        season,
        businessType,
        shiftPercent,
      }),
    [subDistrict, season, businessType, shiftPercent]
  );

  const [feedbackInput, setFeedbackInput] = useState<string>(
    SAMPLE_VISITOR_COMMENTS[0].text
  );

  const feedbackResult = useMemo(
    () => analyzeFeedbackText(feedbackInput),
    [feedbackInput]
  );

  const currentChart =
    CHART_SERIES_OPTIONS.find((c) => c.id === selectedChartId) ||
    CHART_SERIES_OPTIONS[0];

  const maxVal = Math.max(
    100,
    ...currentChart.data.flatMap((d) => [d.primaryValue, d.secondaryValue || 0])
  );

  return (
    <div>
      {/* Primary Forest Green Page Header */}
      <div className="bg-[#243329] text-white border-b border-[#406246]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-5">
          <div className="space-y-1.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#f5f0de]">
              Insights &amp; Analysis
            </div>
            <h1 className="font-display text-3xl font-bold text-white">
              Mae Sai Tourism Insights
            </h1>
            <p className="text-sm sm:text-base text-[#D2DDD5] max-w-2xl">
              Explore seasonal demand patterns, model arrival shifts, analyze visitor feedback, or query the AI Data Analyst.
            </p>
          </div>

          {/* Workspace Mode Selector */}
          <div
            className="inline-flex flex-wrap items-center gap-1 bg-[#FAFAF8] border border-[#E3E6DF] rounded-lg p-1"
            role="tablist"
            aria-label="Insights and analysis sections"
          >
            <button
              type="button"
              role="tab"
              aria-selected={workspaceTab === 'overview'}
              onClick={() => setWorkspaceTab('overview')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                workspaceTab === 'overview'
                  ? 'bg-[#406246] text-white'
                  : 'text-[#243329] hover:bg-[#ECEFE9]'
              }`}
            >
              <BarChart3 className="w-4 h-4" aria-hidden="true" />
              <span>Trends &amp; Insights</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={workspaceTab === 'scenario-model'}
              onClick={() => setWorkspaceTab('scenario-model')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                workspaceTab === 'scenario-model'
                  ? 'bg-[#406246] text-white'
                  : 'text-[#243329] hover:bg-[#ECEFE9]'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
              <span>Demand Planner</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={workspaceTab === 'feedback-analyzer'}
              onClick={() => setWorkspaceTab('feedback-analyzer')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                workspaceTab === 'feedback-analyzer'
                  ? 'bg-[#406246] text-white'
                  : 'text-[#243329] hover:bg-[#ECEFE9]'
              }`}
            >
              <MessageSquareText className="w-4 h-4" aria-hidden="true" />
              <span>Feedback Analyzer</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={workspaceTab === 'ai-analyst'}
              onClick={() => setWorkspaceTab('ai-analyst')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                workspaceTab === 'ai-analyst'
                  ? 'bg-[#406246] text-white'
                  : 'text-[#243329] hover:bg-[#ECEFE9]'
              }`}
            >
              <Bot className="w-4 h-4" aria-hidden="true" />
              <span>AI Analyst</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* TAB 1: Charts & Insights */}
      {workspaceTab === 'overview' && (
        <div className="space-y-10">
          <section className="bg-[#FAFAF8] border border-[#E3E6DF] rounded-lg p-6 sm:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#243329]">
                  {currentChart.title}
                </h2>
                <p className="text-sm text-[#66736A]">
                  {currentChart.subtitle}
                </p>
              </div>

              <div
                className="flex flex-wrap items-center gap-1 bg-[#F7F8F5] border border-[#E3E6DF] rounded-md p-1 self-start"
                role="group"
                aria-label="Select chart view"
              >
                {CHART_SERIES_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setSelectedChartId(option.id);
                      setHoveredIdx(null);
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      option.id === currentChart.id
                        ? 'bg-[#406246] text-white'
                        : 'text-[#66736A] hover:text-[#243329]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#66736A] pb-2 border-b border-[#ECEFE9]">
              <div className="flex flex-wrap items-center gap-6 text-[#243329]">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 bg-[#406246] rounded-xs" aria-hidden="true" />
                  <span>{currentChart.primaryLegend}</span>
                </div>
                {currentChart.secondaryLegend && (
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-[#B5A982] rounded-xs" aria-hidden="true" />
                    <span>{currentChart.secondaryLegend}</span>
                  </div>
                )}
              </div>
              <span className="font-mono tabular-nums">
                {currentChart.timeWindow} · {currentChart.unit}
              </span>
            </div>

            <div className="space-y-3" role="region" aria-label={currentChart.title}>
              {currentChart.data.map((row, idx) => {
                const primaryPct = Math.round((row.primaryValue / maxVal) * 100);
                const secondaryPct =
                  row.secondaryValue !== undefined
                    ? Math.round((row.secondaryValue / maxVal) * 100)
                    : null;
                const isHighlighted = hoveredIdx === idx;

                return (
                  <div
                    key={row.label}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className={`p-3 rounded-md border transition-colors ${
                      isHighlighted
                        ? 'bg-[#F4F6F3] border-[#CFD5CB]'
                        : 'bg-[#FAFAF8] border-transparent'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <span className="text-sm font-semibold text-[#243329]">
                        {row.label}
                      </span>
                      <span className="text-xs text-[#66736A]">{row.note}</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-5 bg-[#F0F2ED] rounded-sm overflow-hidden">
                          <div
                            className="h-full bg-[#406246] transition-all duration-200"
                            style={{ width: `${primaryPct}%` }}
                          />
                        </div>
                        <span className="w-12 text-right font-mono text-xs font-semibold tabular-nums text-[#243329]">
                          {row.primaryValue}
                        </span>
                      </div>

                      {secondaryPct !== null && (
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-4 bg-[#F0F2ED] rounded-sm overflow-hidden">
                            <div
                              className="h-full bg-[#B5A982] transition-all duration-200"
                              style={{ width: `${secondaryPct}%` }}
                            />
                          </div>
                          <span className="w-12 text-right font-mono text-xs tabular-nums text-[#66736A]">
                            {row.secondaryValue}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Actionable Insight Cards */}
          <section className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <h2 className="font-display text-2xl font-bold text-[#243329]">
                Key Findings
              </h2>
              <button
                type="button"
                onClick={() => setWorkspaceTab('scenario-model')}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#406246] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Open Demand Planner →</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {INSIGHTS.map((insight) => (
                <article
                  key={insight.id}
                  className="bg-[#FAFAF8] border border-[#E3E6DF] rounded-lg overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="bg-[#F4F6F3] border-b border-[#ECEFE9] px-5 py-3.5 space-y-1">
                      <div className="text-xs font-medium text-[#406246]">
                        {insight.category} · {insight.timeContext}
                      </div>
                      <h3 className="font-display text-base font-bold text-[#243329] leading-snug">
                        {insight.title}
                      </h3>
                    </div>

                    <div className="p-5 space-y-3 text-sm">
                      <div>
                        <div className="text-xs font-semibold text-[#406246]">
                          Finding
                        </div>
                        <p className="text-[#243329] leading-relaxed mt-0.5">
                          {insight.whatSampleShows}
                        </p>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-[#406246]">
                          Why it matters
                        </div>
                        <p className="text-[#56635A] leading-relaxed mt-0.5">
                          {insight.whyItMatters}
                        </p>
                      </div>

                      <div className="bg-[#F4F6F3] border border-[#E3E6DF] rounded-md p-3">
                        <div className="text-xs font-semibold text-[#406246]">
                          Recommended action
                        </div>
                        <p className="text-xs text-[#243329] leading-relaxed mt-1">
                          {insight.possibleAction}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-5">
                    <button
                      type="button"
                      onClick={() => setActiveInsight(insight)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#406246] hover:bg-[#335038] text-white text-xs font-medium rounded-md transition-colors cursor-pointer"
                    >
                      <span>View source datasets</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: Demand Planner */}
      {workspaceTab === 'scenario-model' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <section className="lg:col-span-5 bg-[#FAFAF8] border border-[#E3E6DF] rounded-lg p-6 space-y-5">
            <div className="space-y-1">
              <h2 className="font-display text-xl font-bold text-[#243329]">
                Demand &amp; Congestion Planner
              </h2>
              <p className="text-xs text-[#66736A] leading-relaxed">
                Simulate arrival pressure across sub-districts, seasons, and afternoon schedule shifts.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="model-subdistrict"
                  className="block text-xs font-semibold text-[#243329]"
                >
                  Sub-district
                </label>
                <select
                  id="model-subdistrict"
                  value={subDistrict}
                  onChange={(e) => setSubDistrict(e.target.value as SubDistrictId)}
                  className="w-full px-3 py-2.5 text-sm bg-[#F7F8F5] border border-[#D7DDD3] rounded-md text-[#243329] focus:outline-none focus:border-[#406246] focus:bg-white cursor-pointer"
                >
                  <option value="pong-pha">Pong Pha (Pha Hee &amp; Tham Luang)</option>
                  <option value="wiang-phang-kham">Wiang Phang Kham (Town, Doi Wao &amp; Pha Mi)</option>
                  <option value="mae-sai">Mae Sai (Border Gate &amp; Market)</option>
                  <option value="ko-chang">Ko Chang (Lowlands &amp; Cycling)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="model-season"
                  className="block text-xs font-semibold text-[#243329]"
                >
                  Season
                </label>
                <select
                  id="model-season"
                  value={season}
                  onChange={(e) => setSeason(e.target.value as SeasonId)}
                  className="w-full px-3 py-2.5 text-sm bg-[#F7F8F5] border border-[#D7DDD3] rounded-md text-[#243329] focus:outline-none focus:border-[#406246] focus:bg-white cursor-pointer"
                >
                  <option value="cool">Cool Season (Nov–Feb)</option>
                  <option value="hot">Hot / Songkran (Mar–May)</option>
                  <option value="green">Green / Monsoon (Jun–Oct)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="model-business"
                  className="block text-xs font-semibold text-[#243329]"
                >
                  Stakeholder Role
                </label>
                <select
                  id="model-business"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value as BusinessTypeId)}
                  className="w-full px-3 py-2.5 text-sm bg-[#F7F8F5] border border-[#D7DDD3] rounded-md text-[#243329] focus:outline-none focus:border-[#406246] focus:bg-white cursor-pointer"
                >
                  <option value="cafe">Café &amp; Coffee Roastery</option>
                  <option value="homestay">Homestay &amp; Guesthouse</option>
                  <option value="craft">Local Craft &amp; Market Stall</option>
                  <option value="community">Community Coordinator</option>
                </select>
              </div>

              <div className="pt-2 border-t border-[#ECEFE9] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="model-shift" className="font-semibold text-[#243329]">
                    Shift morning arrivals to afternoon
                  </label>
                  <span className="font-mono tabular-nums font-semibold text-[#406246]">
                    {shiftPercent}%
                  </span>
                </div>
                <input
                  id="model-shift"
                  type="range"
                  min={0}
                  max={35}
                  step={5}
                  value={shiftPercent}
                  onChange={(e) => setShiftPercent(Number(e.target.value))}
                  className="w-full accent-[#406246] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#66736A] font-mono tabular-nums">
                  <span>0%</span>
                  <span>35%</span>
                </div>
              </div>
            </div>
          </section>

          <section className="lg:col-span-7 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#FAFAF8] border border-[#E3E6DF] rounded-lg p-4">
                <div className="text-xs text-[#66736A]">Peak Load</div>
                <div className="font-display text-2xl font-bold text-[#243329] tabular-nums mt-1">
                  {scenarioResult.adjustedPeakScore}
                  <span className="text-sm font-normal text-[#66736A]"> / 100</span>
                </div>
                <div className="text-xs text-[#406246] mt-0.5 tabular-nums">
                  -{scenarioResult.peakReductionPct}% from baseline
                </div>
              </div>

              <div className="bg-[#FAFAF8] border border-[#E3E6DF] rounded-lg p-4">
                <div className="text-xs text-[#66736A]">Afternoon Headroom</div>
                <div className="font-display text-2xl font-bold text-[#406246] tabular-nums mt-1">
                  {scenarioResult.afternoonOpportunityScore}
                  <span className="text-sm font-normal text-[#66736A]"> pts</span>
                </div>
                <div className="text-xs text-[#66736A] mt-0.5">
                  14:00–17:30 availability
                </div>
              </div>

              <div className="bg-[#FAFAF8] border border-[#E3E6DF] rounded-lg p-4">
                <div className="text-xs text-[#406246] font-semibold">
                  Season Profile
                </div>
                <div className="text-sm font-semibold text-[#243329] mt-1 leading-snug">
                  {scenarioResult.seasonalRiskLabel}
                </div>
              </div>
            </div>

            <div className="bg-[#FAFAF8] border border-[#E3E6DF] rounded-lg p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-base font-bold text-[#243329]">
                  Hourly Load Distribution
                </h3>
                <span className="text-xs text-[#66736A]">
                  Tan = baseline · Green = adjusted
                </span>
              </div>

              <div className="space-y-3.5">
                {scenarioResult.timeSlots.map((slot) => (
                  <div key={slot.window} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono tabular-nums font-medium text-[#243329]">
                        {slot.window}
                      </span>
                      <span className="text-[#66736A] tabular-nums">
                        {slot.status} · <strong className="text-[#243329]">{slot.adjustedLoad}</strong>
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 bg-[#ECEFE9] rounded-sm overflow-hidden">
                        <div
                          className="h-full bg-[#B5A982]"
                          style={{ width: `${slot.baselineLoad}%` }}
                        />
                      </div>
                      <div className="h-3 bg-[#ECEFE9] rounded-sm overflow-hidden">
                        <div
                          className="h-full bg-[#406246] transition-all duration-200"
                          style={{ width: `${slot.adjustedLoad}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#FAFAF8] border border-[#E3E6DF] rounded-lg p-6 space-y-3">
              <div className="text-xs font-semibold text-[#406246]">
                Recommended Action
              </div>
              <div className="font-display text-base font-bold text-[#243329]">
                {scenarioResult.primaryPriority}
              </div>
              <p className="text-sm text-[#243329] leading-relaxed">
                {scenarioResult.recommendedAction}
              </p>
              <div className="pt-3 border-t border-[#ECEFE9] space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-[#66736A]">
                    {scenarioResult.corridorNote}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowMethodology((prev) => !prev)}
                    aria-expanded={showMethodology}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#406246] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Methodology</span>
                    {showMethodology ? (
                      <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                  </button>
                </div>

                {showMethodology && (
                  <div className="bg-[#F7F8F5] border border-[#E3E6DF] rounded-md p-3 space-y-1 text-xs text-[#66736A]">
                    <div>{scenarioResult.methodologyNote}</div>
                    <div className="font-mono text-[11px] text-[#243329] tabular-nums">
                      {scenarioResult.formulaSummary}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* TAB 3: Feedback Analyzer */}
      {workspaceTab === 'feedback-analyzer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <section className="lg:col-span-6 bg-[#FAFAF8] border border-[#E3E6DF] rounded-lg p-6 space-y-5">
            <div className="space-y-1">
              <h2 className="font-display text-xl font-bold text-[#243329]">
                Visitor Feedback Analyzer
              </h2>
              <p className="text-xs text-[#66736A] leading-relaxed">
                Classify visitor comments by sub-district, operational friction theme, and recommended action.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-[#243329]">
                Quick Examples
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_VISITOR_COMMENTS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => setFeedbackInput(sample.text)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                      feedbackInput === sample.text
                        ? 'bg-[#406246] text-white border-[#406246]'
                        : 'bg-[#F4F6F3] text-[#243329] border-[#D7DDD3] hover:bg-white'
                    }`}
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="feedback-analyzer-input"
                className="block text-xs font-semibold text-[#243329]"
              >
                Visitor Note or Review
              </label>
              <textarea
                id="feedback-analyzer-input"
                rows={5}
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                placeholder="Paste a visitor note about Mae Sai transit, opening hours, QR payment, or trails..."
                className="w-full px-3.5 py-2.5 text-sm bg-[#F4F6F3] border border-[#D7DDD3] rounded-md text-[#243329] focus:outline-none focus:border-[#406246] focus:bg-white"
              />
            </div>
          </section>

          <section className="lg:col-span-6 bg-[#FAFAF8] border border-[#E3E6DF] rounded-lg p-6 space-y-5">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#ECEFE9]">
              <h3 className="font-display text-lg font-bold text-[#243329]">
                Classification Result
              </h3>
              <span className="text-xs text-[#66736A]">
                Priority: <strong className="text-[#243329]">{feedbackResult.urgency}</strong>
              </span>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-[#F7F8F5] border border-[#E3E6DF] rounded-md p-3.5">
                <dt className="text-xs text-[#66736A]">Sub-district</dt>
                <dd className="font-semibold text-[#243329] mt-1">
                  {feedbackResult.detectedSubDistrict}
                </dd>
              </div>
              <div className="bg-[#F7F8F5] border border-[#E3E6DF] rounded-md p-3.5">
                <dt className="text-xs text-[#66736A]">Primary Theme</dt>
                <dd className="font-semibold text-[#406246] mt-1">
                  {feedbackResult.primaryTheme}
                </dd>
              </div>
            </dl>

            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-[#243329]">
                Topic Signals
              </div>
              {feedbackResult.matchedThemes.length === 0 ? (
                <div className="text-xs text-[#66736A] bg-[#F7F8F5] p-3 rounded-md">
                  Mention parking, songthaew, closed hours, QR payment, rain, or signage to match specific operational themes.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {feedbackResult.matchedThemes.map((m) => (
                    <div key={m.theme} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#243329]">
                          {m.theme}
                        </span>
                        <span className="font-mono tabular-nums text-[#66736A]">
                          {m.score}% ({m.matchedKeywords.join(', ')})
                        </span>
                      </div>
                      <div className="h-2 bg-[#ECEFE9] rounded-sm overflow-hidden">
                        <div
                          className="h-full bg-[#406246]"
                          style={{ width: `${m.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#F4F6F3] border border-[#E3E6DF] rounded-md p-4 space-y-2">
              <div className="text-xs font-semibold text-[#406246]">
                Suggested Action
              </div>
              <p className="text-sm text-[#243329] leading-relaxed">
                {feedbackResult.suggestedAction}
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => onSelectDataset(feedbackResult.linkedDatasetId)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#406246] hover:underline cursor-pointer"
                >
                  <span>Open {feedbackResult.linkedDatasetTitle}</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* TAB 4: AI Analyst */}
      {workspaceTab === 'ai-analyst' && (
        <AiAnalystPanel
          activePage={activePage}
          datasets={datasets}
          onSelectDataset={onSelectDataset}
          variant="embedded"
        />
      )}

      {/* Insight Detail Modal */}
      {activeInsight && (
        <div
          className="fixed inset-0 z-50 bg-[#243329]/50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="insight-modal-title"
        >
          <div className="bg-[#FAFAF8] border border-[#E3E6DF] rounded-lg max-w-xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-[#406246]">
                  {activeInsight.category} · {activeInsight.timeContext}
                </div>
                <h3
                  id="insight-modal-title"
                  className="font-display text-xl font-bold text-[#243329]"
                >
                  {activeInsight.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveInsight(null)}
                className="p-1.5 text-[#66736A] hover:text-[#243329] rounded-md cursor-pointer"
                aria-label="Close insight details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-[#243329] leading-relaxed">
              {activeInsight.detailSummary}
            </p>

            <div className="bg-[#F4F6F3] border border-[#E3E6DF] rounded-md p-4 space-y-1">
              <div className="text-xs font-semibold text-[#406246]">
                Stakeholder Focus
              </div>
              <div className="text-sm text-[#243329]">
                {activeInsight.stakeholderFocus}
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-[#243329]">
                Source Datasets
              </div>
              <div className="space-y-2">
                {activeInsight.relatedDatasetIds.map((dsId) => {
                  const ds = datasets.find((d) => d.id === dsId);
                  if (!ds) return null;
                  return (
                    <button
                      key={ds.id}
                      type="button"
                      onClick={() => {
                        setActiveInsight(null);
                        onSelectDataset(ds.id);
                      }}
                      className="w-full text-left p-3 bg-[#F4F6F3] hover:bg-white border border-[#E3E6DF] rounded-md flex items-center justify-between gap-3 transition-colors cursor-pointer"
                    >
                      <div>
                        <div className="text-sm font-semibold text-[#243329]">
                          {ds.title}
                        </div>
                        <div className="text-xs text-[#66736A] mt-0.5">
                          {ds.dataType} · {ds.sourceLabel}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#406246] shrink-0" aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveInsight(null)}
                className="px-4 py-2 bg-[#406246] hover:bg-[#335038] text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
