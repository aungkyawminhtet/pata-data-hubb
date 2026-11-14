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
  onSearchCatalog?: (query: string) => void;
  onSelectDataset: (datasetId: string) => void;
  onSelectInsight: (insightId: string) => void;
}

interface HeroSlide {
  id: string;
  image: string;
  label: string;
  datasetId: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'tham-luang',
    image: imgThamLuang,
    label: 'Tham Luang Cave & Park',
    datasetId: 'ms-tham-luang-seasonal-notes',
  },
  {
    id: 'pha-hee',
    image: imgPhaHee,
    label: 'Doi Pha Hee Coffee Village',
    datasetId: 'ms-doi-pha-hee-trail-log',
  },
  {
    id: 'doi-wao',
    image: imgDoiWao,
    label: 'Wat Phra That Doi Wao',
    datasetId: 'ms-border-town-footfall-sample',
  },
  {
    id: 'ko-chang',
    image: imgKoChang,
    label: 'Ko Chang Cycling Trails',
    datasetId: 'ms-business-services-directory',
  },
];

const MARQUEE_HIGHLIGHTS = [
  {
    title: 'Mae Sai Border Market',
    subtitle: 'Cross-Border Footfall & Trade Logs',
    datasetId: 'ms-border-town-footfall-sample',
  },
  {
    title: 'Tham Luang & Khun Nam Nang Non',
    subtitle: 'Seasonal Trail & Access Records',
    datasetId: 'ms-tham-luang-seasonal-notes',
  },
  {
    title: 'Doi Pha Hee Highlands',
    subtitle: 'Coffee Trail Demand & Homestay Data',
    datasetId: 'ms-doi-pha-hee-trail-log',
  },
  {
    title: 'Local Business Directory',
    subtitle: 'Opening Hours, Transit & QR Readiness',
    datasetId: 'ms-business-services-directory',
  },
  {
    title: 'Wat Phra That Doi Wao',
    subtitle: 'Cultural Heritage & Viewpoint Records',
    datasetId: 'ms-historical-border-trade-summary',
  },
  {
    title: 'Ko Chang Rural Loops',
    subtitle: 'Lowland Cycling & Artisan Catalog',
    datasetId: 'ms-artisan-craft-catalog',
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
      {/* Full-Bleed Left-Aligned Hero with Automatic Background Carousel */}
      <section
        className="relative min-h-[540px] lg:min-h-[640px] bg-[#1B2820] flex flex-col justify-between overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-label="Mae Sai Tourism Intelligence Hero"
      >
        {/* Sliding Background Image Track */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            className="flex h-full w-full transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {HERO_SLIDES.map((slide) => (
              <div key={slide.id} className="w-full h-full shrink-0 relative">
                <img
                  src={slide.image}
                  alt={slide.label}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-[#1B2820]/55" />
        </div>

        {/* Left-Aligned Enlarged Hero Content occupying balanced vertical proportion */}
        <div className="relative z-10 flex-1 flex flex-col justify-center w-full px-6 sm:px-10 lg:px-16 pt-12 pb-6 lg:pt-14 lg:pb-8">
          <div className="max-w-3xl space-y-6 sm:space-y-7 text-left">
            <div className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-white/90">
              MAE SAI DISTRICT · CHIANG RAI, NORTHERN THAILAND
            </div>

            <h1 className="font-editorial text-4xl sm:text-6xl lg:text-[72px] font-normal text-white leading-[1.06] tracking-tight">
              Shared Tourism Intelligence for Mae Sai
            </h1>

            <p className="text-base sm:text-xl lg:text-[22px] text-white/90 leading-relaxed max-w-2xl">
              Access verified visitor statistics, local business directories, seasonal trail status, and community insights across four Mae Sai sub-districts.
            </p>

            {/* Enlarged Primary Data-Hub Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('catalog')}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#406246] hover:bg-[#335038] text-white text-base font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Explore Data</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('insights')}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white hover:bg-[#f5f0de] text-[#243329] text-base font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>View Insights</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom-Right Compact Carousel Pill */}
        <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 pb-6 flex justify-end">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#16231B]/80 border border-white/20 text-xs text-white">
            <button
              type="button"
              onClick={handlePrevSlide}
              aria-label="Previous slide"
              className="text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1.5" role="tablist" aria-label="Hero slides">
              {HERO_SLIDES.map((slide, idx) => {
                const active = idx === activeSlide;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={slide.label}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      active ? 'w-6 bg-white' : 'w-1.5 bg-white/45 hover:bg-white/75'
                    }`}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleNextSlide}
              aria-label="Next slide"
              className="text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <span className="text-white/30" aria-hidden="true">
              |
            </span>

            <button
              type="button"
              onClick={() => onSelectDataset(currentSlide.datasetId)}
              className="font-medium text-white/95 hover:text-[#f5f0de] transition-colors whitespace-nowrap cursor-pointer"
            >
              {currentSlide.label}
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Automatic Scrolling Corridor Ticker Strip */}
      <div className="bg-[#16231B] border-b border-[#243329] py-3.5 overflow-hidden">
        <div className="animate-marquee items-center">
          {[...MARQUEE_HIGHLIGHTS, ...MARQUEE_HIGHLIGHTS].map((item, idx) => (
            <button
              key={`${item.title}-${idx}`}
              type="button"
              onClick={() => onSelectDataset(item.datasetId)}
              className="inline-flex items-center gap-2 px-7 text-xs sm:text-sm whitespace-nowrap shrink-0 group cursor-pointer"
            >
              <span className="text-[#8FA895]" aria-hidden="true">
                ✦
              </span>
              <span className="font-semibold text-white group-hover:text-[#f5f0de] transition-colors">
                {item.title}
              </span>
              <span className="text-white/60">· {item.subtitle}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4-Column Headline Metrics Strip */}
      <section className="bg-white border-b border-[#E3E6DF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7">
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

      {/* Featured Datasets */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-6">
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

      {/* Four-Layer Architecture */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-2xl space-y-1 mb-6">
          <div className="text-xs font-semibold text-[#406246]">Architecture</div>
          <h2 className="font-display text-2xl font-bold text-[#243329]">
            From scattered sources to local action
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FOUR_LAYERS.map((layer, index) => {
            const Icon = layerIcons[index];
            return (
              <div
                key={layer.step}
                className="bg-white border border-[#E3E6DF] rounded-lg p-5 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-[#406246] tabular-nums">
                    {layer.step}
                  </span>
                  <Icon className="w-4 h-4 text-[#406246]" aria-hidden="true" />
                </div>
                <h3 className="font-display text-base font-semibold text-[#243329]">
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

      {/* Insights & District Map Row */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-12">
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
                <span>Verified Directory</span>
              </div>
              <h2 className="font-display text-xl font-bold text-[#243329]">
                Explore Mae Sai
              </h2>
              <p className="text-sm text-[#243329] leading-relaxed">
                Discover 24 verified landmarks, mountain coffee viewpoints, local eateries, homestays, and community artisans.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('explore-map')}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#406246] hover:bg-[#335038] text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
            >
              <span>Explore Mae Sai</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
