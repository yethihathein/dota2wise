import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function Footer() {
  const { t, dataSource } = useApp();

  return (
    <footer className="bg-[#141414] border-t border-white/10 mt-16 py-12 text-[#a3a3a3]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Link to="/" className="inline-flex items-center group" aria-label="Dota 2 Home">
              <div className="w-10 h-10 rounded-xl bg-black/50 border border-white/15 flex items-center justify-center p-1.5 shadow-lg shadow-[#E50914]/20">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M11 21 L22 9 L36 19 L90 73 L81 90 L66 83 L10 28 Z" fill="#E50914" />
                  <path d="M63 11 L87 13 L89 37 L79 40 L60 21 Z" fill="#E50914" />
                  <path d="M11 63 L21 60 L40 79 L37 89 L13 87 Z" fill="#E50914" />
                </svg>
              </div>
            </Link>
            <p className="text-xs text-[#a3a3a3] max-w-xl">
              {t.footer.disclaimer}
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-xs font-medium">
            <Link to="/" className="hover:text-white transition-colors">
              {t.nav.home}
            </Link>
            <Link to="/heroes" className="hover:text-white transition-colors">
              {t.nav.heroes}
            </Link>
            <Link to="/items" className="hover:text-white transition-colors">
              {t.nav.items}
            </Link>
            <Link to="/my-list" className="hover:text-white transition-colors">
              {t.nav.myList}
            </Link>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-[#737373]">
          <span>
            Fan-made project. Dota 2 and all related assets are trademarks of Valve Corporation. Not affiliated with Valve.
          </span>
          <span>
            {t.footer.dataSource} ({dataSource})
          </span>
        </div>
      </div>
    </footer>
  );
}
