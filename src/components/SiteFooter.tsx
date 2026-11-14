import { PageRoute } from '../types/hub';

interface SiteFooterProps {
  onNavigate: (page: PageRoute) => void;
}

export function SiteFooter({ onNavigate }: SiteFooterProps) {
  return (
    <footer className="bg-[#243329] text-[#E6ECE8] border-t-4 border-[#406246]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#384D3E]">
          <div className="md:col-span-5 space-y-2.5">
            <div className="font-display text-lg font-bold text-[#f5f0de]">
              Together Mae Sai
            </div>
            <p className="text-sm text-[#C7D3CA] leading-relaxed max-w-sm">
              A shared tourism data hub connecting Mae Sai statistics, directories, local knowledge, and community insights in one place.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <h3 className="text-sm font-semibold text-[#f5f0de]">Explore</h3>
            <ul className="space-y-2 text-sm text-[#C7D3CA]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#f5f0de] transition-colors cursor-pointer"
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-[#f5f0de] transition-colors cursor-pointer"
                >
                  Data Catalog
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('insights')}
                  className="hover:text-[#f5f0de] transition-colors cursor-pointer"
                >
                  Insights &amp; Models
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contribute')}
                  className="hover:text-[#f5f0de] transition-colors cursor-pointer"
                >
                  Contribute &amp; API
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('explore-map')}
                  className="hover:text-[#f5f0de] transition-colors cursor-pointer"
                >
                  Explore Mae Sai Map
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2.5">
            <h3 className="text-sm font-semibold text-[#f5f0de]">Governance &amp; Privacy</h3>
            <p className="text-xs text-[#C7D3CA] leading-relaxed">
              Contributions follow permission, attribution, and minimal-data principles aligned with Thailand&apos;s PDPA. Sensitive records use Members only or Restricted access controls.
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#A9B9AD]">
          <span>Together Mae Sai · Chiang Rai District Data Hub</span>
          <span>Illustrative sample dataset collection</span>
        </div>
      </div>
    </footer>
  );
}
