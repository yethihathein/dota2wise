import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Shield, Sword, BookOpen, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import Card from '../components/Card.jsx';

export default function SearchPage() {
  const { heroes, items, lore, openEntity } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const qParam = searchParams.get('q');
    if (qParam !== null && qParam !== query) {
      setQuery(qParam);
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setSearchParams(val ? { q: val } : {});
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        heroes: heroes.slice(0, 8),
        items: items.slice(0, 8),
        spells: [],
        lore: lore.slice(0, 6),
      };
    }

    const matchedHeroes = heroes.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        (h.realName && h.realName.toLowerCase().includes(q)) ||
        (h.roles || []).some((r) => r.toLowerCase().includes(q)) ||
        (h.lore?.biography && h.lore.biography.toLowerCase().includes(q))
    );

    const matchedItems = items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        (i.category && i.category.toLowerCase().includes(q)) ||
        (i.lore && i.lore.toLowerCase().includes(q))
    );

    const matchedSpells = [];
    heroes.forEach((h) => {
      (h.spells || []).forEach((sp) => {
        if (
          sp.name.toLowerCase().includes(q) ||
          (sp.description && sp.description.toLowerCase().includes(q))
        ) {
          matchedSpells.push({ ...sp, heroId: h.id, heroName: h.name });
        }
      });
    });

    const matchedLore = lore.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.summary.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q)
    );

    return {
      heroes: matchedHeroes,
      items: matchedItems,
      spells: matchedSpells,
      lore: matchedLore,
    };
  }, [query, heroes, items, lore]);

  return (
    <div className="min-h-screen liquid-page pt-24 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-8">
        {/* Search Input Header */}
        <div className="liquid-panel rounded-2xl p-6 space-y-4">
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Global Dota 2 Archive Search
          </h1>
          <div className="relative">
            <Search className="w-5 h-5 text-[#E50914] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search across all 124+ Heroes, 200+ Items, Spells, Talents, Factions & Lore..."
              className="w-full liquid-input rounded-xl pl-12 pr-4 py-3.5 text-sm sm:text-base text-white placeholder-[#737373] focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-[#a3a3a3]">
            <span>Popular searches:</span>
            {['Blink', 'Invoker', 'Aghanim', 'Roshan', 'Skadi', 'Omnislash', 'Mad Moon'].map(
              (term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setQuery(term);
                    setSearchParams({ q: term });
                  }}
                  className="px-2.5 py-0.5 rounded-full liquid-pill hover:bg-[#E50914] text-white transition-colors"
                >
                  {term}
                </button>
              )
            )}
          </div>
        </div>

        {/* Heroes Results */}
        {results.heroes.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#E50914]" />
              <span>Heroes ({results.heroes.length})</span>
            </h2>
            <div className="flex flex-wrap gap-4">
              {results.heroes.slice(0, 16).map((h) => (
                <Card key={h.id} entity={h} type="hero" />
              ))}
            </div>
          </div>
        )}

        {/* Items Results */}
        {results.items.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sword className="w-4 h-4 text-[#d4af37]" />
              <span>Items & Artifacts ({results.items.length})</span>
            </h2>
            <div className="flex flex-wrap gap-4">
              {results.items.slice(0, 16).map((it) => (
                <Card key={it.id} entity={it} type="item" />
              ))}
            </div>
          </div>
        )}

        {/* Spells Results */}
        {results.spells.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-sky-400" />
              <span>Matching Spells & Abilities ({results.spells.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {results.spells.map((sp) => (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => openEntity('hero', sp.heroId)}
                  className="flex items-start gap-3 p-3.5 rounded-lg bg-[#181818] hover:bg-[#1f1f1f] border border-white/10 hover:border-sky-400 text-left transition-all"
                >
                  <img
                    src={sp.img}
                    alt={sp.name}
                    className="w-12 h-12 rounded border border-white/15 bg-black shrink-0"
                  />
                  <div>
                    <div className="text-sm font-bold text-white">{sp.name}</div>
                    <div className="text-[11px] text-sky-400 font-semibold">
                      {sp.heroName} • CD: {sp.cooldown}
                    </div>
                    <p className="text-xs text-[#a3a3a3] line-clamp-2 mt-1">
                      {sp.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
