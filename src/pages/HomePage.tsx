import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Database,
  Layers,
  LineChart,
  MapPin,
} from 'lucide-react';
import {
  DATASETS,
  FOUR_LAYERS,
  HEADLINE_METRICS,
  INSIGHTS,
} from '../data/maeSaiData';
import { DatasetItem, PageRoute } from '../types/hub';
import { AccessBadge } from '../components/AccessBadge';

import imgPhaHee from '../assets/images/mae_sai_pha_hee_highlands_1794657312472.jpg';
import imgThamLuang from '../assets/images/mae_sai_tham_luang_lagoon_1794657314769.jpg';
import imgDoiWao from '../assets/images/mae_sai_doi_wao_town_1794657316314.jpg';
import imgKoChang from '../assets/images/mae_sai_ko_chang_cycling_1794657316463.jpg';

interface HomePageProps {
  datasets?: DatasetItem[];
  onNavigate: (page: PageRoute) => void;
  onSelectDataset: (datasetId: string) => void;
  onSelectInsight: (insightId: string) => void;
}

interface HeroSlide {
  id: string;
  image: string;
  subDistrict: string;
  title: string;
  caption: string;
  metric: string;
  datasetId: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'pha-hee',
    image: imgPhaHee,
    subDistrict: 'Pong Pha Sub-district',
    title: 'Doi Pha Hee Highland Coffee Corridor',
    caption: 'Shade-grown Arabica terraces, Akha homestays, and morning ridge viewpoints.',
    metric: '09:00–11:00 Peak Window',
    datasetId: 'ms-doi-pha-hee-trail-log',
  },
  {
    id: 'tham-luang',
    image: imgThamLuang,
    subDistrict: 'Pong Pha Sub-district',
    title: 'Tham Luang & Khun Nam Nang Non Park',
    caption: 'Emerald mineral lagoons, limestone karst trails, and seasonal park access tracking.',
    metric: '100% Open Trail Status (Nov–Feb)',
    datasetId: 'ms-tham-luang-seasonal-notes',
  },
  {
    id: 'doi-wao',
    image: imgDoiWao,
    subDistrict: 'Wiang Phang Kham & Mae Sai',
    title: 'Wat Phra That Doi Wao & Border Town',
    caption: 'Historic northern gateway, Sai Lom Joy market, and cross-town transit links.',
    metric: '92 Peak Weekend Footfall Index',
    datasetId: 'ms-border-town-footfall-sample',
  },
  {
    id: 'ko-chang',
    image: imgKoChang,
    subDistrict: 'Ko Chang Sub-district',
    title: 'Ko Chang Lowland Cycling & Craft Villages',
    caption: 'Quiet rural routes winding through rice paddies, orchards, and weaving cooperatives.',
    metric: 'Slow-Travel Overflow Corridor',
    datasetId: 'ms-business-services-directory',
  },
];

export function HomePage({
  datasets = DATASETS,
  onNavigate,
  onSelectDataset,
  onSelectInsight,
}: HomePageProps) {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const featuredDatasets = datasets.filter((d) => d.featured).slice(0, 3);
  const featuredInsights = INSIGHTS.slice(0, 2);

  const layerIcons = [BookOpen, Database, Layers, LineChart];
  const currentSlide = HERO_SLIDES[activeSlide];

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <div>
      {/* Hero Section with Automatic Background Carousel */}
      <section
        className="relative bg-[#243329] border-b border-[#E3E6DF] overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-label="Mae Sai Tourism Intelligence Hero and Corridor Showcase"
      >
        {/* Automatic Scrolling Background Image Track */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            className="flex h-full w-full transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {HERO_SLIDES.map((slide) => (
              <div key={slide.id} className="w-full h-full shrink-0 relative">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))}
          </div>
          {/* Solid dark green-charcoal scrim for high contrast without gradients */}
          <div className="absolute inset-0 bg-[#1B2820]/65" />
        </div>

        {/* Hero Foreground Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-10 lg:pt-16 lg:pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Column: Primary Headline & Actions */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f5f0de] text-[#243329] text-xs font-semibold rounded-md">
                  <span>Mae Sai District · Chiang Rai</span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold text-white leading-[1.12] tracking-tight max-w-2xl [text-wrap:balance]">
                  Shared tourism intelligence for Mae Sai.
                </h1>

                <p className="text-base sm:text-lg text-[#F0F2ED] leading-relaxed max-w-xl">
                  One open civic hub organizing Mae Sai statistics, business directories, community knowledge, and visitor insights with clear source provenance.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('catalog')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f5f0de] hover:bg-white text-[#243329] text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <span>Explore Data</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('insights')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#406246] hover:bg-[#335038] text-white border border-white/25 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <span>See Insights</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('contribute')}
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-[#f5f0de] hover:text-white hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Contribute</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Active Background Slide Caption & Controls */}
              <div className="bg-[#243329]/90 border border-white/20 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-[#f5f0de]">
                    <span className="font-mono tabular-nums font-semibold">
                      0{activeSlide + 1} / 0{HERO_SLIDES.length}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium">{currentSlide.subDistrict}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-[11px] text-white/80">
                      {currentSlide.metric}
                    </span>
                  </div>
                  <div className="font-display text-sm sm:text-base font-semibold text-white truncate">
                    {currentSlide.title}
                  </div>
                  <p className="text-xs text-white/80 line-clamp-1">
                    {currentSlide.caption}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onSelectDataset(currentSlide.datasetId)}
                    className="px-3 py-1.5 bg-[#406246] hover:bg-[#335038] text-white text-xs font-medium rounded border border-white/20 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    View Dataset
                  </button>
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    aria-label="Previous corridor slide"
                    className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded border border-white/20 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    aria-label="Next corridor slide"
                    className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded border border-white/20 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: District Coverage Card */}
            <div className="lg:col-span-5 bg-[#f5f0de] border border-[#E2D9BA] rounded-lg p-6 flex flex-col justify-between space-y-5 shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#66736A]">
                  <span className="font-semibold text-[#406246]">District Coverage</span>
                  <span className="font-mono tabular-nums">Updated Nov 2025</span>
                </div>
                <h2 className="font-display text-lg font-bold text-[#243329]">
                  Four Mae Sai Corridors in One Index
                </h2>
                <p className="text-sm text-[#243329] leading-relaxed">
                  Select a corridor below to preview its landscape and inspect verified local records across town, border, highland, and rural zones.
                </p>
              </div>

              {/* Interactive Corridor Selector synced with Carousel */}
              <div className="border-t border-[#DFD5B5] pt-3 space-y-1.5">
                {HERO_SLIDES.map((slide, idx) => {
                  const isCurrent = idx === activeSlide;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setActiveSlide(idx)}
                      className={`w-full text-left px-3 py-2 rounded-md border transition-colors flex items-center justify-between gap-2 text-xs cursor-pointer ${
                        isCurrent
                          ? 'bg-[#406246] text-white border-[#406246]'
                          : 'bg-white/75 hover:bg-white text-[#243329] border-[#E2D9BA]'
                      }`}
                    >
                      <span className="font-semibold truncate">{slide.title}</span>
                      <span
                        className={`font-mono text-[11px] shrink-0 ${
                          isCurrent ? 'text-[#f5f0de]' : 'text-[#66736A]'
                        }`}
                      >
                        {slide.subDistrict.replace(' Sub-district', '')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Column Headline Metrics Strip */}
      <section className="bg-white border-b border-[#E3E6DF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {HEADLINE_METRICS.map((metric, idx) => (
              <div
                key={metric.label}
                className="bg-[#F7F8F5] border border-[#E3E6DF] rounded-lg p-4 sm:p-5"
              >
                <div className="font-display text-2xl sm:text-3xl font-bold text-[#406246] tabular-nums">
                  {idx === 0 ? datasets.length : metric.value}
                </div>
                <div className="text-sm font-semibold text-[#243329] mt-1">
                  {metric.label}
                </div>
                <div className="text-xs text-[#66736A] mt-0.5">
                  {metric.sublabel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Four-Layer Architecture */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-2xl space-y-1.5 mb-7">
          <div className="text-xs font-semibold text-[#406246]">Architecture</div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#243329]">
            From scattered sources to local action
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FOUR_LAYERS.map((layer, index) => {
            const Icon = layerIcons[index];
            return (
              <div
                key={layer.step}
                className="bg-white border border-[#E3E6DF] rounded-lg p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-[#406246] tabular-nums">
                    {layer.step}
                  </span>
                  <Icon className="w-4 h-4 text-[#406246]" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg font-semibold text-[#243329]">
                  {layer.name}
                </h3>
                <p className="text-sm text-[#66736A] leading-relaxed">
                  {layer.summary}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Datasets */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[#406246]">Data Catalog</div>
            <h2 className="font-display text-2xl font-bold text-[#243329]">
              Featured Datasets
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('catalog')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#406246] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Browse all {datasets.length} datasets</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredDatasets.map((dataset) => (
            <button
              key={dataset.id}
              type="button"
              onClick={() => onSelectDataset(dataset.id)}
              className="text-left bg-white border border-[#E3E6DF] hover:border-[#406246] rounded-lg p-5 transition-colors flex flex-col justify-between space-y-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#406246]"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 text-xs text-[#66736A]">
                  <span>{dataset.dataType}</span>
                  <AccessBadge level={dataset.accessLevel} />
                </div>
                <h3 className="font-display text-base font-semibold text-[#243329] leading-snug">
                  {dataset.title}
                </h3>
                <p className="text-sm text-[#66736A] leading-relaxed">
                  {dataset.shortSummary}
                </p>
              </div>

              <div className="pt-3 border-t border-[#ECEFE9] flex items-center justify-between text-xs text-[#66736A]">
                <span className="truncate pr-2">{dataset.sourceLabel}</span>
                <span className="font-mono tabular-nums shrink-0">{dataset.lastUpdated}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Insights & District Map Row */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white border border-[#E3E6DF] rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-xs font-semibold text-[#406246]">Insights</div>
                <h2 className="font-display text-xl font-bold text-[#243329]">
                  Recent Findings
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('insights')}
                className="text-sm font-medium text-[#406246] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                All insights →
              </button>
            </div>

            <div className="divide-y divide-[#ECEFE9]">
              {featuredInsights.map((insight) => (
                <div key={insight.id} className="py-4 first:pt-1 last:pb-0 space-y-1.5">
                  <div className="text-xs text-[#66736A]">
                    <span className="font-medium text-[#406246]">{insight.category}</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span>{insight.timeContext}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectInsight(insight.id)}
                    className="block text-left font-display text-base font-semibold text-[#243329] hover:text-[#406246] transition-colors cursor-pointer"
                  >
                    {insight.title}
                  </button>
                  <p className="text-sm text-[#66736A] leading-relaxed">
                    {insight.whatSampleShows}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#f5f0de] border border-[#E2D9BA] rounded-lg p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#406246]">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                <span>Data Product</span>
              </div>
              <h2 className="font-display text-xl font-bold text-[#243329]">
                Explore Mae Sai Map
              </h2>
              <p className="text-sm text-[#243329] leading-relaxed">
                Browse key Mae Sai landmarks, hours, and corridors linked directly to their source datasets.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('explore-map')}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#406246] hover:bg-[#335038] text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
            >
              <span>Open District Map</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
