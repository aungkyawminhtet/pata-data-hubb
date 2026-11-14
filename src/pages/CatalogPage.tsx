import { useMemo, useState } from 'react';
import { LayoutGrid, List, RotateCcw, Search } from 'lucide-react';
import { DATASETS } from '../data/maeSaiData';
import { AccessLevel, DatasetItem, DataType, SourceCategory } from '../types/hub';
import { AccessBadge } from '../components/AccessBadge';

interface CatalogPageProps {
  datasets?: DatasetItem[];
  onSelectDataset: (datasetId: string) => void;
}

export function CatalogPage({ datasets = DATASETS, onSelectDataset }: CatalogPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [selectedAccess, setSelectedAccess] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const dataTypes = ['All', ...Object.values(DataType)];
  const sourceCategories = ['All', ...Object.values(SourceCategory)];
  const accessLevels = ['All', ...Object.values(AccessLevel)];

  const filteredDatasets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return datasets.filter((item) => {
      const matchesSearch =
        q.length === 0 ||
        item.title.toLowerCase().includes(q) ||
        item.shortSummary.toLowerCase().includes(q) ||
        item.sourceLabel.toLowerCase().includes(q) ||
        item.subDistrict.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      const matchesType = selectedType === 'All' || item.dataType === selectedType;
      const matchesSource =
        selectedSource === 'All' || item.sourceCategory === selectedSource;
      const matchesAccess =
        selectedAccess === 'All' || item.accessLevel === selectedAccess;

      return matchesSearch && matchesType && matchesSource && matchesAccess;
    });
  }, [datasets, searchQuery, selectedType, selectedSource, selectedAccess]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedType !== 'All' ||
    selectedSource !== 'All' ||
    selectedAccess !== 'All';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedSource('All');
    setSelectedAccess('All');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-7">
      {/* Page Header */}
      <div className="border-b border-[#E3E6DF] pb-5 space-y-1.5">
        <div className="text-xs font-semibold text-[#406246]">Data Catalog</div>
        <h1 className="font-display text-3xl font-bold text-[#243329]">
          Explore Mae Sai Datasets
        </h1>
        <p className="text-sm sm:text-base text-[#66736A] max-w-2xl">
          Filter statistics, directories, media, and community logs by format, contributor, and access tier.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border border-[#E3E6DF] rounded-lg p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-5 relative">
            <label htmlFor="catalog-search" className="sr-only">
              Search datasets
            </label>
            <Search
              className="w-4 h-4 text-[#66736A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="catalog-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, sub-district, or source..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F7F8F5] border border-[#D7DDD3] rounded-md text-[#243329] placeholder:text-[#66736A] focus:outline-none focus:border-[#406246] focus:bg-white"
            />
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="filter-type" className="sr-only">
                Filter by data type
              </label>
              <select
                id="filter-type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-[#F7F8F5] border border-[#D7DDD3] rounded-md text-[#243329] focus:outline-none focus:border-[#406246] focus:bg-white cursor-pointer"
              >
                {dataTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === 'All' ? 'All types' : type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-source" className="sr-only">
                Filter by source
              </label>
              <select
                id="filter-source"
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-[#F7F8F5] border border-[#D7DDD3] rounded-md text-[#243329] focus:outline-none focus:border-[#406246] focus:bg-white cursor-pointer"
              >
                {sourceCategories.map((src) => (
                  <option key={src} value={src}>
                    {src === 'All' ? 'All sources' : src}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-access" className="sr-only">
                Filter by access level
              </label>
              <select
                id="filter-access"
                value={selectedAccess}
                onChange={(e) => setSelectedAccess(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-[#F7F8F5] border border-[#D7DDD3] rounded-md text-[#243329] focus:outline-none focus:border-[#406246] focus:bg-white cursor-pointer"
              >
                {accessLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl === 'All' ? 'All access' : lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#ECEFE9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Quick access level filter">
            {accessLevels.map((lvl) => {
              const active = selectedAccess === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedAccess(lvl)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#406246] text-white'
                      : 'bg-[#F7F8F5] text-[#66736A] hover:text-[#243329] border border-[#E3E6DF]'
                  }`}
                >
                  {lvl === 'All' ? 'All' : lvl}
                </button>
              );
            })}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#406246] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4">
            <span className="text-xs text-[#66736A] tabular-nums">
              <strong className="text-[#243329]">{filteredDatasets.length}</strong> of {datasets.length} datasets
            </span>

            <div className="inline-flex items-center bg-[#F7F8F5] border border-[#E3E6DF] rounded-md p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#243329] shadow-xs'
                    : 'text-[#66736A] hover:text-[#243329]'
                }`}
                aria-label="Card view"
              >
                <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-[#243329] shadow-xs'
                    : 'text-[#66736A] hover:text-[#243329]'
                }`}
                aria-label="Table view"
              >
                <List className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Table</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredDatasets.length === 0 ? (
        <div className="bg-white border border-[#E3E6DF] rounded-lg p-12 text-center space-y-4">
          <div className="font-display text-lg font-semibold text-[#243329]">
            No matching datasets found
          </div>
          <p className="text-sm text-[#66736A] max-w-md mx-auto">
            Try clearing your search term or selecting a broader filter.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#406246] hover:bg-[#335038] text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Reset filters</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDatasets.map((dataset) => (
            <button
              key={dataset.id}
              type="button"
              onClick={() => onSelectDataset(dataset.id)}
              className="text-left bg-white border border-[#E3E6DF] hover:border-[#406246] rounded-lg p-5 transition-colors flex flex-col justify-between space-y-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#406246]"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[#66736A] truncate">
                    {dataset.dataType} · {dataset.subDistrict}
                  </span>
                  <AccessBadge level={dataset.accessLevel} />
                </div>

                <h2 className="font-display text-base font-semibold text-[#243329] leading-snug">
                  {dataset.title}
                </h2>

                <p className="text-sm text-[#66736A] leading-relaxed">
                  {dataset.shortSummary}
                </p>
              </div>

              <div className="pt-3 border-t border-[#ECEFE9] flex items-center justify-between gap-2 text-xs text-[#66736A]">
                <span className="truncate">{dataset.sourceLabel}</span>
                <span className="font-mono tabular-nums shrink-0">
                  {dataset.lastUpdated}
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#E3E6DF] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F8F5] border-b border-[#E3E6DF] text-xs font-semibold text-[#243329]">
                  <th className="py-3 px-4">Dataset</th>
                  <th className="py-3 px-4 whitespace-nowrap">Type</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4 whitespace-nowrap">Updated</th>
                  <th className="py-3 px-4 whitespace-nowrap">Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEFE9] text-sm">
                {filteredDatasets.map((dataset) => (
                  <tr
                    key={dataset.id}
                    onClick={() => onSelectDataset(dataset.id)}
                    className="hover:bg-[#f5f0de]/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#243329] hover:text-[#406246]">
                        {dataset.title}
                      </div>
                      <div className="text-xs text-[#66736A] mt-0.5 line-clamp-1">
                        {dataset.shortSummary}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#243329] whitespace-nowrap">
                      {dataset.dataType}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#66736A]">
                      {dataset.sourceLabel}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono tabular-nums text-[#66736A] whitespace-nowrap">
                      {dataset.lastUpdated}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <AccessBadge level={dataset.accessLevel} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
