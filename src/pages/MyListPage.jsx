import React, { useMemo } from 'react';
import { Bookmark, Shuffle } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import Card from '../components/Card.jsx';

export default function MyListPage() {
  const { favorites, getHeroById, getItemById, getLoreById, surpriseMe, t } = useApp();

  const savedEntities = useMemo(() => {
    return favorites
      .map((f) => {
        if (f.type === 'hero') {
          const h = getHeroById(f.id);
          return h ? { entity: h, type: 'hero' } : null;
        }
        if (f.type === 'item') {
          const i = getItemById(f.id);
          return i ? { entity: i, type: 'item' } : null;
        }
        return null;
      })
      .filter(Boolean);
  }, [favorites, getHeroById, getItemById]);

  return (
    <div className="min-h-screen liquid-page pt-24 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-8">
        <div className="liquid-panel rounded-2xl p-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#E50914] flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5" /> PERSONAL ARCHIVE
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
              {t.rows.myList} ({savedEntities.length})
            </h1>
            <p className="text-xs sm:text-sm text-[#a3a3a3] mt-1">
              Saved locally in your browser via localStorage. Click the + / ✓ button on any card to manage your list.
            </p>
          </div>

          <button
            type="button"
            onClick={surpriseMe}
            className="inline-flex items-center gap-2 bg-[#E50914] hover:bg-[#f40612] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg shadow-[#E50914]/30"
          >
            <Shuffle className="w-4 h-4" />
            <span>{t.nav.surpriseMe}</span>
          </button>
        </div>

        {savedEntities.length === 0 ? (
          <div className="liquid-panel rounded-2xl p-12 text-center space-y-3">
            <p className="text-base font-bold text-white">Your List is currently empty</p>
            <p className="text-xs text-[#a3a3a3]">
              Click the + icon on any Hero, Item, or Lore card across the encyclopedia to bookmark it here.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {savedEntities.map(({ entity, type }) => (
              <Card key={`${type}-${entity.id}`} entity={entity} type={type} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
