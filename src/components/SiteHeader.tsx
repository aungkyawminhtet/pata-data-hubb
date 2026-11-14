import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Database, MapPin, Menu, Search, X } from 'lucide-react';
import { DATASETS } from '../data/maeSaiData';
import { EXPLORE_MAE_SAI_PLACES } from '../data/explorePlacesData';
import { DatasetItem, PageRoute } from '../types/hub';

interface SiteHeaderProps {
  currentPage: PageRoute;
  datasets?: DatasetItem[];
  onNavigate: (page: PageRoute) => void;
  onSearchCatalog?: (query: string) => void;
  onSelectDataset?: (datasetId: string) => void;
}

export function SiteHeader({
  currentPage,
  datasets = DATASETS,
  onNavigate,
  onSearchCatalog,
  onSelectDataset,
}: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navLinks: Array<{ id: PageRoute; label: string }> = [
    { id: 'home', label: 'Home' },
    { id: 'catalog', label: 'Explore Data' },
    { id: 'insights', label: 'Insights' },
    { id: 'explore-map', label: 'Explore Mae Sai' },
    { id: 'contribute', label: 'Contribute' },
  ];

  useEffect(() => {
    if (searchOpen) {
      window.setTimeout(() => searchInputRef.current?.focus(), 40);
    }
  }, [searchOpen]);

  const handleNav = (page: PageRoute) => {
    setMobileOpen(false);
    setSearchOpen(false);
    onNavigate(page);
  };

  const quickResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { datasets: [], places: [] };

    const matchingDatasets = datasets
      .filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.subDistrict.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      )
      .slice(0, 3);

    const matchingPlaces = EXPLORE_MAE_SAI_PLACES.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.thaiName.toLowerCase().includes(q) ||
        p.subDistrict.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    ).slice(0, 3);

    return { datasets: matchingDatasets, places: matchingPlaces };
  }, [datasets, searchQuery]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    setSearchOpen(false);
    setMobileOpen(false);
    if (onSearchCatalog) {
      onSearchCatalog(trimmed);
    } else {
      onNavigate('catalog');
    }
  };

  const isDataActive = currentPage === 'catalog' || currentPage === 'detail';

  return (
    <header className="sticky top-0 z-40 bg-[#f5f0de] border-b border-[#DED4B2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Brand Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNav('home');
          }}
          className="font-display text-lg font-bold tracking-tight text-[#243329] hover:text-[#406246] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#406246]"
        >
          Together Mae Sai
        </a>

        {/* Single-line Navigation Links + Search Icon */}
        <div className="flex items-center gap-3 md:gap-6">
          <nav className="hidden md:flex items-center gap-7" aria-label="Primary navigation">
            {navLinks.map((link) => {
              const active =
                link.id === 'catalog' ? isDataActive : currentPage === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(link.id);
                  }}
                  className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#406246] ${
                    active
                      ? 'text-[#406246] font-semibold'
                      : 'text-[#243329]/75 hover:text-[#243329]'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span
                      className="absolute left-0 right-0 -bottom-[21px] h-[2px] bg-[#406246]"
                      aria-hidden="true"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Search Icon Button */}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              setSearchOpen((prev) => !prev);
            }}
            aria-label={searchOpen ? 'Close search' : 'Search site'}
            aria-expanded={searchOpen}
            className={`inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#406246] ${
              searchOpen
                ? 'bg-[#406246] text-white'
                : 'text-[#243329] hover:bg-[#E8E0C5]'
            }`}
          >
            {searchOpen ? (
              <X className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Search className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => {
              setSearchOpen(false);
              setMobileOpen((prev) => !prev);
            }}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-[#243329] hover:bg-[#E8E0C5] focus-visible:outline-2 focus-visible:outline-[#406246]"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expandable Navbar Search Bar */}
      {searchOpen && (
        <div className="bg-white border-t border-[#DED4B2] shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-3">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search
                  className="w-4 h-4 text-[#66736A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <label htmlFor="navbar-search-input" className="sr-only">
                  Search Mae Sai datasets, places, or topics
                </label>
                <input
                  ref={searchInputRef}
                  id="navbar-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Mae Sai datasets, cafés, Pha Hee, Tham Luang..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F7F8F5] border border-[#D7DDD3] rounded-lg text-[#243329] placeholder:text-[#66736A] focus:outline-none focus:border-[#406246] focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#406246] hover:bg-[#335038] text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                Search Data
              </button>
            </form>

            {searchQuery.trim().length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#ECEFE9]">
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#66736A]">
                    Datasets
                  </div>
                  {quickResults.datasets.length === 0 ? (
                    <div className="text-xs text-[#66736A]">No matching datasets</div>
                  ) : (
                    quickResults.datasets.map((ds) => (
                      <button
                        key={ds.id}
                        type="button"
                        onClick={() => {
                          setSearchOpen(false);
                          if (onSelectDataset) {
                            onSelectDataset(ds.id);
                          } else {
                            onNavigate('catalog');
                          }
                        }}
                        className="w-full text-left p-2 rounded-md hover:bg-[#f5f0de] flex items-center justify-between gap-2 text-xs transition-colors cursor-pointer"
                      >
                        <span className="inline-flex items-center gap-2 font-medium text-[#243329] truncate">
                          <Database className="w-3.5 h-3.5 text-[#406246] shrink-0" aria-hidden="true" />
                          <span className="truncate">{ds.title}</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#406246] shrink-0" aria-hidden="true" />
                      </button>
                    ))
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#66736A]">
                    Explore Mae Sai Places
                  </div>
                  {quickResults.places.length === 0 ? (
                    <div className="text-xs text-[#66736A]">No matching places</div>
                  ) : (
                    quickResults.places.map((place) => (
                      <button
                        key={place.id}
                        type="button"
                        onClick={() => {
                          setSearchOpen(false);
                          onNavigate('explore-map');
                        }}
                        className="w-full text-left p-2 rounded-md hover:bg-[#f5f0de] flex items-center justify-between gap-2 text-xs transition-colors cursor-pointer"
                      >
                        <span className="inline-flex items-center gap-2 font-medium text-[#243329] truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#406246] shrink-0" aria-hidden="true" />
                          <span className="truncate">{place.name}</span>
                        </span>
                        <span className="text-[11px] text-[#66736A] shrink-0">
                          {place.subDistrict}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#f5f0de] border-t border-[#DED4B2] px-4 py-4 space-y-1">
          {navLinks.map((link) => {
            const active =
              link.id === 'catalog' ? isDataActive : currentPage === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(link.id);
                }}
                className={`block px-3 py-2.5 rounded-md text-sm font-medium ${
                  active
                    ? 'bg-[#406246] text-white font-semibold'
                    : 'text-[#243329] hover:bg-[#E8E0C5]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}
