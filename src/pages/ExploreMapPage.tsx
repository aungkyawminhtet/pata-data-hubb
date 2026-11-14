import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  Database,
  Globe,
  MapPin,
  Navigation,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Wallet,
} from 'lucide-react';
import {
  BudgetTier,
  EXPLORE_MAE_SAI_PLACES,
  ExplorePlaceItem,
  PLACE_CATEGORIES,
  PlaceCategory,
} from '../data/explorePlacesData';

interface ExploreMapPageProps {
  onSelectDataset: (datasetId: string) => void;
}

const BUDGET_OPTIONS: Array<'All' | BudgetTier> = [
  'All',
  'Free',
  'Low (<150฿)',
  'Mid (150–500฿)',
  'High (>500฿)',
];

const SUBDISTRICTS = [
  'all',
  'Wiang Phang Kham',
  'Pong Pha',
  'Pong Ngam',
  'Ko Chang',
] as const;

type SortOption = 'recommended' | 'nearest' | 'recently-checked';

export function ExploreMapPage({ onSelectDataset }: ExploreMapPageProps) {
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [selectedCategory, setSelectedCategory] = useState<'All' | PlaceCategory>('All');
  const [selectedBudget, setSelectedBudget] = useState<'All' | BudgetTier>('All');
  const [openNowOnly, setOpenNowOnly] = useState<boolean>(false);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

  const activeFilterCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedBudget !== 'All' ? 1 : 0) +
    (openNowOnly ? 1 : 0);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: EXPLORE_MAE_SAI_PLACES.length,
    };
    for (const cat of PLACE_CATEGORIES) {
      counts[cat] = EXPLORE_MAE_SAI_PLACES.filter((p) => p.category === cat).length;
    }
    return counts;
  }, []);

  const filteredPlaces = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = EXPLORE_MAE_SAI_PLACES.filter((place) => {
      const matchesQuery =
        q.length === 0 ||
        place.name.toLowerCase().includes(q) ||
        place.thaiName.toLowerCase().includes(q) ||
        place.subDistrict.toLowerCase().includes(q) ||
        place.category.toLowerCase().includes(q) ||
        place.shortDescription.toLowerCase().includes(q);

      const matchesSubDistrict =
        selectedSubDistrict === 'all' || place.subDistrict === selectedSubDistrict;

      const matchesCategory =
        selectedCategory === 'All' || place.category === selectedCategory;

      const matchesBudget =
        selectedBudget === 'All' || place.budgetTier === selectedBudget;

      const matchesOpen = !openNowOnly || place.openNow;

      return (
        matchesQuery &&
        matchesSubDistrict &&
        matchesCategory &&
        matchesBudget &&
        matchesOpen
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'nearest') {
        return a.distanceKm - b.distanceKm;
      }
      if (sortBy === 'recently-checked') {
        return b.checkedDate.localeCompare(a.checkedDate);
      }
      return a.recommendedRank - b.recommendedRank;
    });
  }, [
    searchQuery,
    selectedSubDistrict,
    sortBy,
    selectedCategory,
    selectedBudget,
    openNowOnly,
  ]);

  const activePlace: ExplorePlaceItem | null = useMemo(() => {
    if (!selectedPlaceId) return null;
    return EXPLORE_MAE_SAI_PLACES.find((p) => p.id === selectedPlaceId) || null;
  }, [selectedPlaceId]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedSubDistrict('all');
    setSortBy('recommended');
    setSelectedCategory('All');
    setSelectedBudget('All');
    setOpenNowOnly(false);
  };

  const openPlaceDetail = (placeId: string) => {
    setSelectedPlaceId(placeId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // DETAIL PAGE VIEW
  if (activePlace) {
    const relatedPlaces = EXPLORE_MAE_SAI_PLACES.filter(
      (p) => p.id !== activePlace.id && p.subDistrict === activePlace.subDistrict
    ).slice(0, 3);

    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setSelectedPlaceId(null)}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#406246] hover:text-[#243329] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Explore Mae Sai</span>
          </button>

          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#406246]">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            <span>Verified Record · Checked {activePlace.checkedDate}</span>
          </div>
        </div>

        {/* Hero Banner Card */}
        <div className="bg-white border border-[#E3E6DF] rounded-2xl overflow-hidden">
          <div className="relative h-64 sm:h-80 lg:h-96 bg-[#1B2820]">
            <img
              src={activePlace.image}
              alt={activePlace.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-[#1B2820]/30" />

            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-md bg-[#1B2820]/85 text-white text-xs font-medium">
                {activePlace.category}
              </span>
              <span className="px-3 py-1 rounded-md bg-[#1B2820]/85 text-white text-xs font-mono tabular-nums">
                {activePlace.distanceKm.toFixed(2)} km from Mae Sai center
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-[#ECEFE9] pb-6">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#66736A]">
                  <span className="inline-flex items-center gap-1 font-medium text-[#406246]">
                    <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                    {activePlace.subDistrict} Subdistrict
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Mae Sai, Chiang Rai</span>
                </div>
                <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-[#243329]">
                  {activePlace.name}
                </h1>
                <div className="text-sm text-[#8C968E]">{activePlace.thaiName}</div>
              </div>

              <div className="flex flex-wrap items-center gap-3 self-start">
                <div className="px-4 py-2 bg-[#F7F8F5] border border-[#E3E6DF] rounded-xl text-right">
                  <div className="text-[11px] text-[#66736A]">Typical Spend</div>
                  <div className="text-sm font-bold text-[#243329] tabular-nums">
                    {activePlace.priceRange}
                  </div>
                </div>
                <div className="px-4 py-2 bg-[#f5f0de] border border-[#E2D9BA] rounded-xl">
                  <div className="text-[11px] text-[#66736A]">Budget Tier</div>
                  <div className="text-sm font-semibold text-[#406246]">
                    {activePlace.budgetTier}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Detail Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left 7 Cols: Overview & Highlights */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2.5">
                  <h2 className="font-display text-lg font-bold text-[#243329]">
                    Place Overview
                  </h2>
                  <p className="text-sm sm:text-base text-[#3D4B41] leading-relaxed">
                    {activePlace.fullOverview}
                  </p>
                </div>

                <div className="space-y-3">
                  <h2 className="font-display text-lg font-bold text-[#243329]">
                    Key Highlights &amp; Local Offerings
                  </h2>
                  <ul className="space-y-2.5">
                    {activePlace.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-[#243329] bg-[#F7F8F5] border border-[#E3E6DF] rounded-xl p-3.5"
                      >
                        <CheckCircle2
                          className="w-4 h-4 text-[#406246] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#f5f0de] border border-[#E2D9BA] rounded-xl p-5 space-y-2">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#406246]">
                    <Navigation className="w-4 h-4" aria-hidden="true" />
                    <span>Access, Road &amp; Transit Notes</span>
                  </div>
                  <p className="text-sm text-[#243329] leading-relaxed">
                    {activePlace.accessAndTransit}
                  </p>
                </div>
              </div>

              {/* Right 5 Cols: Practical Info & Linked Source Dataset */}
              <div className="lg:col-span-5 space-y-5">
                <div className="bg-[#F7F8F5] border border-[#E3E6DF] rounded-xl p-5 space-y-4">
                  <h2 className="font-display text-base font-bold text-[#243329] border-b border-[#E3E6DF] pb-2.5">
                    Verified Visitor Information
                  </h2>

                  <dl className="space-y-3.5 text-sm">
                    <div className="flex items-start gap-3">
                      <Clock
                        className="w-4 h-4 text-[#406246] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <div>
                        <dt className="text-xs text-[#66736A]">Opening Hours</dt>
                        <dd className="font-semibold text-[#243329]">
                          {activePlace.openingHours}
                        </dd>
                        <dd className="text-xs text-[#406246] mt-0.5">
                          Best window: {activePlace.bestTimeWindow}
                        </dd>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CreditCard
                        className="w-4 h-4 text-[#406246] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <div>
                        <dt className="text-xs text-[#66736A]">Payment Accepted</dt>
                        <dd className="font-medium text-[#243329]">
                          {activePlace.paymentMethods}
                        </dd>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Globe
                        className="w-4 h-4 text-[#406246] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <div>
                        <dt className="text-xs text-[#66736A]">
                          Languages &amp; Signage
                        </dt>
                        <dd className="font-medium text-[#243329]">
                          {activePlace.languagesSpoken}
                        </dd>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Wallet
                        className="w-4 h-4 text-[#406246] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <div>
                        <dt className="text-xs text-[#66736A]">Record Steward</dt>
                        <dd className="font-medium text-[#243329]">
                          {activePlace.contactNote}
                        </dd>
                      </div>
                    </div>
                  </dl>
                </div>

                {/* Source Dataset Card */}
                <div className="bg-white border border-[#E3E6DF] rounded-xl p-5 space-y-3">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#406246]">
                    <Database className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Linked Hub Dataset</span>
                  </div>
                  <div className="font-display text-base font-bold text-[#243329]">
                    {activePlace.linkedDatasetTitle}
                  </div>
                  <p className="text-xs text-[#66736A] leading-relaxed">
                    Inspect the underlying dataset table, contributor provenance, and governance metadata for this location.
                  </p>
                  <button
                    type="button"
                    onClick={() => onSelectDataset(activePlace.linkedDatasetId)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#406246] hover:bg-[#335038] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Inspect Source Dataset</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Places in the Same Subdistrict */}
        {relatedPlaces.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-editorial text-2xl font-bold text-[#243329]">
              More in {activePlace.subDistrict}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPlaces.map((place) => (
                <article
                  key={place.id}
                  className="bg-white border border-[#E3E6DF] rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
                >
                  <button
                    type="button"
                    onClick={() => openPlaceDetail(place.id)}
                    className="relative h-44 w-full text-left overflow-hidden bg-[#1B2820] cursor-pointer"
                  >
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover object-center"
                    />
                    <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-[#1B2820]/80 text-white text-[11px] font-medium">
                      {place.category}
                    </span>
                    <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md bg-[#1B2820]/80 text-white text-[11px] font-mono tabular-nums">
                      {place.distanceKm.toFixed(2)} km
                    </span>
                  </button>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-[#66736A]">
                        <span>{place.subDistrict}</span>
                        <span className="font-semibold text-[#243329] tabular-nums">
                          {place.priceRange}
                        </span>
                      </div>
                      <h3 className="font-editorial text-base font-bold text-[#243329] leading-snug">
                        {place.name}
                      </h3>
                      <div className="text-xs text-[#8C968E]">{place.thaiName}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openPlaceDetail(place.id)}
                      className="w-full py-2 bg-[#406246] hover:bg-[#335038] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // DIRECTORY GRID VIEW (100% matching screenshot without Map toggle or Add to Trip)
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* Page Title & Subtitle */}
      <div className="space-y-2">
        <h1 className="font-editorial text-4xl sm:text-[44px] font-bold text-[#243329] tracking-tight">
          Explore Mae Sai
        </h1>
        <p className="text-sm sm:text-base text-[#66736A] max-w-xl leading-relaxed">
          Discover verified cultural landmarks, mountain coffee viewpoints, local eateries, homestays, and community artisans.
        </p>
      </div>

      {/* Filter Bar Card */}
      <div className="bg-white border border-[#E3E6DF] rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
        {/* Single Row: Search + Subdistrict + Sort + Filters Button */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <label htmlFor="explore-search-input" className="sr-only">
              Search by name, local dish, village, or keyword
            </label>
            <Search
              className="w-4 h-4 text-[#8C968E] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="explore-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, local dish, village, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F7F8F5] border border-[#E3E6DF] rounded-full text-[#243329] placeholder:text-[#8C968E] focus:outline-none focus:border-[#406246] focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <label htmlFor="explore-subdistrict-select" className="sr-only">
                Subdistrict
              </label>
              <MapPin
                className="w-3.5 h-3.5 text-[#406246] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <select
                id="explore-subdistrict-select"
                value={selectedSubDistrict}
                onChange={(e) => setSelectedSubDistrict(e.target.value)}
                className="pl-8 pr-8 py-2 text-xs font-medium bg-[#F7F8F5] border border-[#E3E6DF] rounded-full text-[#243329] focus:outline-none focus:border-[#406246] cursor-pointer"
              >
                {SUBDISTRICTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="explore-sort-select" className="sr-only">
                Sort places
              </label>
              <select
                id="explore-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 text-xs font-medium bg-[#F7F8F5] border border-[#E3E6DF] rounded-full text-[#243329] focus:outline-none focus:border-[#406246] cursor-pointer"
              >
                <option value="recommended">recommended</option>
                <option value="nearest">nearest</option>
                <option value="recently-checked">recently checked</option>
              </select>
            </div>

            {/* Combined Filters Toggle Button beside recommended */}
            <button
              type="button"
              onClick={() => setFiltersOpen((prev) => !prev)}
              aria-expanded={filtersOpen}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-full border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filtersOpen || activeFilterCount > 0
                  ? 'bg-[#406246] text-white border-[#406246]'
                  : 'bg-[#F7F8F5] text-[#243329] border-[#E3E6DF] hover:border-[#406246]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-white text-[#406246] tabular-nums">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Combined Filters Panel */}
        {filtersOpen && (
          <div className="pt-4 border-t border-[#ECEFE9] space-y-4">
            {/* Categories */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#243329]">
                  Category
                </span>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#406246] hover:underline cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" aria-hidden="true" />
                    <span>Clear filters</span>
                  </button>
                )}
              </div>

              <div
                className="flex flex-wrap items-center gap-2"
                role="group"
                aria-label="Filter by place category"
              >
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-full border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === 'All'
                      ? 'bg-[#406246] text-white border-[#406246]'
                      : 'bg-white text-[#243329] border-[#E3E6DF] hover:border-[#406246]'
                  }`}
                >
                  All Places ({categoryCounts.All})
                </button>

                {PLACE_CATEGORIES.map((category) => {
                  const active = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-full border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-[#406246] text-white border-[#406246]'
                          : 'bg-white text-[#243329] border-[#E3E6DF] hover:border-[#406246]'
                      }`}
                    >
                      {category} ({categoryCounts[category] || 0})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget + Open Now */}
            <div className="pt-3 border-t border-[#F0F2ED] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-[#243329] mr-1">
                  Budget:
                </span>
                {BUDGET_OPTIONS.map((budget) => {
                  const active = selectedBudget === budget;
                  return (
                    <button
                      key={budget}
                      type="button"
                      onClick={() => setSelectedBudget(budget)}
                      className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-[#243329] text-white border-[#243329]'
                          : 'bg-white text-[#556259] border-[#E3E6DF] hover:border-[#243329]'
                      }`}
                    >
                      {budget}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setOpenNowOnly((prev) => !prev)}
                aria-pressed={openNowOnly}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-medium rounded-full border transition-colors cursor-pointer ${
                  openNowOnly
                    ? 'bg-[#406246] text-white border-[#406246]'
                    : 'bg-white text-[#556259] border-[#E3E6DF] hover:border-[#406246]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    openNowOnly ? 'bg-white' : 'bg-[#8C968E]'
                  }`}
                  aria-hidden="true"
                />
                <span>Open Now</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Showing Count */}
      <div className="text-xs text-[#66736A]">
        Showing <strong className="text-[#243329]">{filteredPlaces.length}</strong> places
      </div>

      {/* Places Grid */}
      {filteredPlaces.length === 0 ? (
        <div className="bg-white border border-[#E3E6DF] rounded-2xl p-12 text-center space-y-4">
          <div className="font-editorial text-xl font-bold text-[#243329]">
            No places match your current filters
          </div>
          <p className="text-sm text-[#66736A] max-w-md mx-auto">
            Try clearing your search keyword or switching back to All Places.
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#406246] hover:bg-[#335038] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <article
              key={place.id}
              className="bg-white border border-[#E3E6DF] rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow"
            >
              {/* Top Image with Category & Distance Overlays */}
              <button
                type="button"
                onClick={() => openPlaceDetail(place.id)}
                className="relative h-52 w-full text-left overflow-hidden bg-[#1B2820] group cursor-pointer"
              >
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-[#1B2820]/80 text-white text-[11px] font-medium">
                  {place.category}
                </span>
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-[#1B2820]/80 text-white text-[11px] font-mono tabular-nums">
                  {place.distanceKm.toFixed(2)} km
                </span>
              </button>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  {/* Subdistrict & Price Range */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 text-[#66736A]">
                      <MapPin className="w-3.5 h-3.5 text-[#406246]" aria-hidden="true" />
                      <span>{place.subDistrict}</span>
                    </span>
                    <span className="font-semibold text-[#243329] tabular-nums">
                      {place.priceRange}
                    </span>
                  </div>

                  {/* English & Thai Titles */}
                  <div>
                    <button
                      type="button"
                      onClick={() => openPlaceDetail(place.id)}
                      className="text-left font-editorial text-lg font-bold text-[#243329] hover:text-[#406246] leading-snug transition-colors cursor-pointer"
                    >
                      {place.name}
                    </button>
                    <div className="text-xs text-[#8C968E] mt-0.5">
                      {place.thaiName}
                    </div>
                  </div>

                  {/* 2-Line Description */}
                  <p className="text-xs sm:text-[13px] text-[#556259] leading-relaxed line-clamp-2">
                    {place.shortDescription}
                  </p>
                </div>

                {/* Footer: Verified Status + Single View Details Button */}
                <div className="pt-3.5 border-t border-[#ECEFE9] space-y-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#406246]">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Verified Record</span>
                    </span>
                    <span className="text-[#8C968E] tabular-nums">
                      Checked {place.checkedDate}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => openPlaceDetail(place.id)}
                    className="w-full py-2.5 bg-[#406246] hover:bg-[#335038] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
