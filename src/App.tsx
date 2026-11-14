import { useEffect, useMemo, useState } from 'react';
import { Bot } from 'lucide-react';
import { DATASETS } from './data/maeSaiData';
import { DatasetItem, PageRoute } from './types/hub';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { DemoNoticeBanner } from './components/DemoNoticeBanner';
import { AiAnalystPanel } from './components/AiAnalystPanel';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { DatasetDetailPage } from './pages/DatasetDetailPage';
import { InsightsPage } from './pages/InsightsPage';
import { ContributePage } from './pages/ContributePage';
import { ExploreMapPage } from './pages/ExploreMapPage';

interface NoticeState {
  message: string;
  variant: 'info' | 'success';
}

function parseHashRoute(): { page: PageRoute; datasetId: string } {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash.startsWith('dataset/')) {
    const id = hash.slice('dataset/'.length);
    return { page: 'detail', datasetId: id || DATASETS[0].id };
  }
  if (
    hash === 'catalog' ||
    hash === 'insights' ||
    hash === 'contribute' ||
    hash === 'explore-map' ||
    hash === 'home'
  ) {
    return { page: hash, datasetId: DATASETS[0].id };
  }
  return { page: 'home', datasetId: DATASETS[0].id };
}

export default function App() {
  const initial = parseHashRoute();
  const [currentPage, setCurrentPage] = useState<PageRoute>(initial.page);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(
    initial.datasetId
  );
  const [selectedInsightId, setSelectedInsightId] = useState<string | null>(
    null
  );
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [analystOpen, setAnalystOpen] = useState(false);
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');
  const [contributedDatasets, setContributedDatasets] = useState<DatasetItem[]>(
    []
  );

  useEffect(() => {
    const onHashChange = () => {
      const parsed = parseHashRoute();
      setCurrentPage(parsed.page);
      setSelectedDatasetId(parsed.datasetId);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    fetch('/api/contributions')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.items)) {
          setContributedDatasets(data.items as DatasetItem[]);
        }
      })
      .catch(() => {
        // Ignore transient startup errors
      });
  }, []);

  const allDatasets = useMemo(
    () => [...contributedDatasets, ...DATASETS],
    [contributedDatasets]
  );

  const navigateTo = (page: PageRoute) => {
    setCurrentPage(page);
    if (page !== 'insights') {
      setSelectedInsightId(null);
    }
    if (page !== 'catalog') {
      setCatalogSearchQuery('');
    }
    window.location.hash = page === 'home' ? 'home' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const searchCatalog = (query: string) => {
    setCatalogSearchQuery(query);
    setCurrentPage('catalog');
    window.location.hash = 'catalog';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDataset = (datasetId: string) => {
    setSelectedDatasetId(datasetId);
    setCurrentPage('detail');
    window.location.hash = `dataset/${datasetId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openInsight = (insightId: string) => {
    setSelectedInsightId(insightId);
    setCurrentPage('insights');
    window.location.hash = 'insights';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showDemoFeedback = (
    message: string,
    variant: 'info' | 'success' = 'info'
  ) => {
    setNotice({ message, variant });
  };

  const handleContributionCreated = (dataset: DatasetItem) => {
    setContributedDatasets((prev) => [
      dataset,
      ...prev.filter((d) => d.id !== dataset.id),
    ]);
    showDemoFeedback(
      `API contribution "${dataset.title}" added to the session Data Catalog.`,
      'success'
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EBF0EC] text-[#243329]">
      <SiteHeader
        currentPage={currentPage}
        datasets={allDatasets}
        onNavigate={navigateTo}
        onSearchCatalog={searchCatalog}
        onSelectDataset={openDataset}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            datasets={allDatasets}
            onNavigate={navigateTo}
            onSearchCatalog={searchCatalog}
            onSelectDataset={openDataset}
            onSelectInsight={openInsight}
          />
        )}

        {currentPage === 'catalog' && (
          <CatalogPage
            datasets={allDatasets}
            initialSearchQuery={catalogSearchQuery}
            onSelectDataset={openDataset}
          />
        )}

        {currentPage === 'detail' && (
          <DatasetDetailPage
            datasetId={selectedDatasetId}
            datasets={allDatasets}
            onBackToCatalog={() => navigateTo('catalog')}
            onSelectDataset={openDataset}
            onDemoFeedback={showDemoFeedback}
          />
        )}

        {currentPage === 'insights' && (
          <InsightsPage
            initialInsightId={selectedInsightId}
            activePage={currentPage}
            datasets={allDatasets}
            onSelectDataset={openDataset}
          />
        )}

        {currentPage === 'contribute' && (
          <ContributePage
            contributedDatasets={contributedDatasets}
            onContributionCreated={handleContributionCreated}
            onSelectDataset={openDataset}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'explore-map' && (
          <ExploreMapPage onSelectDataset={openDataset} />
        )}
      </main>

      <SiteFooter onNavigate={navigateTo} />

      {/* Circular Floating Launcher for AI Data Analyst */}
      {!analystOpen && (
        <button
          type="button"
          onClick={() => setAnalystOpen(true)}
          aria-label="Ask Data Analyst"
          title="Ask Data Analyst"
          className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-[#406246] hover:bg-[#335038] text-white flex items-center justify-center shadow-md transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#406246]"
        >
          <Bot className="w-5 h-5" aria-hidden="true" />
        </button>
      )}

      {/* Slide-over AI Data Analyst Drawer */}
      {analystOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#243329]/45 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Together Mae Sai AI Data Analyst"
        >
          <div className="w-full max-w-lg h-full bg-white border-l border-[#E3E6DF] shadow-xl">
            <AiAnalystPanel
              activePage={currentPage}
              activeDatasetId={selectedDatasetId}
              datasets={allDatasets}
              onSelectDataset={openDataset}
              variant="drawer"
              onCloseDrawer={() => setAnalystOpen(false)}
            />
          </div>
        </div>
      )}

      {notice && (
        <DemoNoticeBanner
          message={notice.message}
          variant={notice.variant}
          onDismiss={() => setNotice(null)}
        />
      )}
    </div>
  );
}
