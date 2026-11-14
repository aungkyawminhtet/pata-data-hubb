import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PageRoute } from '../types/hub';

interface SiteHeaderProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
}

export function SiteHeader({ currentPage, onNavigate }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks: Array<{ id: PageRoute; label: string }> = [
    { id: 'home', label: 'Home' },
    { id: 'catalog', label: 'Explore Data' },
    { id: 'insights', label: 'Insights' },
    { id: 'explore-map', label: 'Explore Mae Sai' },
  ];

  const handleNav = (page: PageRoute) => {
    setMobileOpen(false);
    onNavigate(page);
  };

  const isDataActive = currentPage === 'catalog' || currentPage === 'detail';

  return (
    <header className="sticky top-0 z-40 bg-[#f5f0de] border-b border-[#DED4B2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
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

        {/* Zone 2: Concise single-line nav links */}
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

        {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('contribute')}
            className={`hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#406246] ${
              currentPage === 'contribute'
                ? 'bg-[#243329] text-[#f5f0de]'
                : 'bg-[#406246] text-white hover:bg-[#335038]'
            }`}
          >
            Contribute
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-[#243329] hover:bg-[#E8E0C5] focus-visible:outline-2 focus-visible:outline-[#406246]"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

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
          <a
            href="#contribute"
            onClick={(e) => {
              e.preventDefault();
              handleNav('contribute');
            }}
            className={`block px-3 py-2.5 rounded-md text-sm font-medium ${
              currentPage === 'contribute'
                ? 'bg-[#243329] text-[#f5f0de]'
                : 'bg-[#406246] text-white'
            }`}
          >
            Contribute
          </a>
        </div>
      )}
    </header>
  );
}
