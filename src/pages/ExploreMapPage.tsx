import { useMemo, useState } from 'react';
import { ArrowRight, Clock, Database, MapPin } from 'lucide-react';
import { MAE_SAI_MAP_LOCATIONS } from '../data/maeSaiData';
import { MaeSaiMapLocation } from '../types/hub';

interface ExploreMapPageProps {
  onSelectDataset: (datasetId: string) => void;
}

export function ExploreMapPage({ onSelectDataset }: ExploreMapPageProps) {
  const categories = [
    'All',
    'Market & Border',
    'Cultural Heritage',
    'Nature & Trail',
    'Community & Coffee',
  ] as const;

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocationId, setSelectedLocationId] = useState<string>(
    MAE_SAI_MAP_LOCATIONS[0].id
  );

  const visibleLocations = useMemo(() => {
    if (selectedCategory === 'All') return MAE_SAI_MAP_LOCATIONS;
    return MAE_SAI_MAP_LOCATIONS.filter((l) => l.category === selectedCategory);
  }, [selectedCategory]);

  const activeLocation: MaeSaiMapLocation =
    visibleLocations.find((l) => l.id === selectedLocationId) ||
    visibleLocations[0] ||
    MAE_SAI_MAP_LOCATIONS[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-7">
      <div className="border-b border-[#E3E6DF] pb-5 space-y-1.5">
        <div className="text-xs font-semibold text-[#406246]">
          Data Product · District Directory
        </div>
        <h1 className="font-display text-3xl font-bold text-[#243329]">
          Explore Mae Sai
        </h1>
        <p className="text-sm sm:text-base text-[#66736A] max-w-2xl">
          Browse Mae Sai landmarks, hours, and local corridors linked back to their source datasets.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter locations by category">
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                const nextList =
                  cat === 'All'
                    ? MAE_SAI_MAP_LOCATIONS
                    : MAE_SAI_MAP_LOCATIONS.filter((l) => l.category === cat);
                if (nextList.length > 0 && !nextList.some((l) => l.id === selectedLocationId)) {
                  setSelectedLocationId(nextList[0].id);
                }
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-[#406246] text-white'
                  : 'bg-white text-[#66736A] hover:text-[#243329] border border-[#E3E6DF]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white border border-[#E3E6DF] rounded-lg p-5 space-y-4">
          <div className="relative w-full aspect-[4/3] bg-[#F7F8F5] border border-[#E3E6DF] rounded-md overflow-hidden">
            <svg
              viewBox="0 0 100 75"
              className="w-full h-full"
              role="img"
              aria-label="Map of Mae Sai district sub-districts and key locations"
            >
              <path d="M0 0 L42 0 L38 35 L46 75 L0 75 Z" fill="#EBEFE6" />
              <path
                d="M15 9 Q40 6 58 11 T95 14"
                fill="none"
                stroke="#85A38C"
                strokeWidth="1.4"
              />
              <text x="64" y="8.5" fontSize="2.6" fill="#66736A">
                Sai River
              </text>
              <path
                d="M56 11 L52 38 L46 75"
                fill="none"
                stroke="#D6CEB0"
                strokeWidth="1.6"
                strokeDasharray="2 1.5"
              />
              <text x="53.5" y="54" fontSize="2.4" fill="#66736A">
                Route 1
              </text>
              <text x="12" y="25" fontSize="2.7" fill="#66736A" fontWeight="600">
                PONG PHA
              </text>
              <text x="68" y="34" fontSize="2.7" fill="#66736A" fontWeight="600">
                KO CHANG
              </text>
            </svg>

            {visibleLocations.map((loc, idx) => {
              const isSelected = loc.id === activeLocation.id;
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setSelectedLocationId(loc.id)}
                  style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-transform cursor-pointer focus-visible:outline-2 focus-visible:outline-[#406246] ${
                    isSelected
                      ? 'bg-[#406246] text-white scale-110 z-20 shadow-sm'
                      : 'bg-white text-[#243329] border border-[#406246] hover:bg-[#f5f0de] z-10'
                  }`}
                  aria-label={`Select ${loc.name}`}
                >
                  <span className="font-mono tabular-nums">{idx + 1}</span>
                </button>
              );
            })}
          </div>

          <div className="bg-[#f5f0de] border border-[#E2D9BA] rounded-md p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#66736A]">
              <span className="font-semibold text-[#406246]">
                {activeLocation.category} · {activeLocation.subDistrict}
              </span>
              <span className="font-mono tabular-nums">
                Updated {activeLocation.lastUpdated}
              </span>
            </div>

            <div>
              <h2 className="font-display text-lg font-bold text-[#243329]">
                {activeLocation.name}
              </h2>
              <div className="text-xs text-[#66736A]">{activeLocation.thaiName}</div>
            </div>

            <p className="text-sm text-[#243329] leading-relaxed">
              {activeLocation.summary}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#DFD5B5] text-xs">
              <div className="flex items-center gap-1.5 text-[#243329]">
                <Clock className="w-3.5 h-3.5 text-[#406246]" aria-hidden="true" />
                <span>{activeLocation.hours}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#66736A]">
                <Database className="w-3.5 h-3.5 text-[#406246]" aria-hidden="true" />
                <span>{activeLocation.sourceLabel}</span>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => onSelectDataset(activeLocation.linkedDatasetId)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#406246] hover:underline cursor-pointer"
              >
                <span>Open source dataset</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-[#E3E6DF] rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#ECEFE9]">
            <h2 className="font-display text-base font-bold text-[#243329]">
              Locations ({visibleLocations.length})
            </h2>
          </div>

          <div className="divide-y divide-[#ECEFE9]">
            {visibleLocations.map((loc, idx) => {
              const isSelected = loc.id === activeLocation.id;
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setSelectedLocationId(loc.id)}
                  className={`w-full text-left py-3.5 px-3 rounded-md transition-colors flex items-start gap-3 cursor-pointer ${
                    isSelected ? 'bg-[#f5f0de]' : 'hover:bg-[#F7F8F5]'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-sm text-xs font-mono font-semibold tabular-nums flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-[#406246] text-white'
                        : 'bg-[#F7F8F5] text-[#406246] border border-[#D7DDD3]'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="space-y-1 min-w-0">
                    <div className="text-sm font-semibold text-[#243329] leading-snug">
                      {loc.name}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#66736A]">
                      <MapPin className="w-3 h-3 text-[#406246]" aria-hidden="true" />
                      <span>{loc.subDistrict}</span>
                      <span aria-hidden="true">·</span>
                      <span>{loc.category}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
