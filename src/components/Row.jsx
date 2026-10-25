import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Card from './Card.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function Row({ title, subtitle, items = [], type = 'hero', onSeeAll }) {
  const rowRef = useRef(null);
  const { t } = useApp();

  if (!items || items.length === 0) return null;

  const scroll = (direction) => {
    if (!rowRef.current) return;
    const { scrollLeft, clientWidth } = rowRef.current;
    const offset = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
    rowRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' });
  };

  return (
    <section className="relative py-3 sm:py-4 group/row">
      {/* Row Header */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 mb-2.5 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-5 bg-[#E50914] rounded-full inline-block shadow-[0_0_10px_#E50914]" />
            <h2 className="text-base sm:text-xl font-bold text-white tracking-tight">{title}</h2>
            <span className="text-xs text-[#a3a3a3] font-medium">({items.length})</span>
          </div>
          {subtitle && <p className="text-xs text-[#a3a3a3] mt-0.5 ml-4">{subtitle}</p>}
        </div>

        {onSeeAll && (
          <button
            type="button"
            onClick={onSeeAll}
            className="text-xs font-semibold liquid-pill px-3 py-1 rounded-full hover:border-[#E50914] transition-colors"
          >
            {t.rows.exploreAll || 'Explore All →'}
          </button>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative max-w-[1440px] mx-auto">
        <button
          type="button"
          onClick={() => scroll('left')}
          aria-label={`Scroll ${title} left`}
          className="hidden sm:flex absolute left-1 top-1/2 -translate-y-1/2 z-30 w-10 h-28 items-center justify-center liquid-panel hover:bg-[#E50914] hover:text-always-white text-white rounded-r-xl opacity-0 group-hover/row:opacity-100 transition-all shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div
          ref={rowRef}
          className="flex items-stretch gap-4 overflow-x-auto no-scrollbar px-4 sm:px-8 py-4"
        >
          {items.map((entry) => (
            <Card key={`${entry.type || type}-${entry.id}`} entity={entry} type={entry.type || type} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll('right')}
          aria-label={`Scroll ${title} right`}
          className="hidden sm:flex absolute right-1 top-1/2 -translate-y-1/2 z-30 w-10 h-28 items-center justify-center liquid-panel hover:bg-[#E50914] hover:text-always-white text-white rounded-l-xl opacity-0 group-hover/row:opacity-100 transition-all shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
