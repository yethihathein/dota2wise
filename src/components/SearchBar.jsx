import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Sparkles, Sword, Shield, BookOpen, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function SearchBar() {
  const { heroes, items, lore, openEntity, t } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setExpanded(true);
        setTimeout(() => inputRef.current?.focus(), 40);
      } else if (e.key === 'Escape') {
        setExpanded(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (!query) setExpanded(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [query]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { heroes: [], items: [], spells: [], lore: [] };

    const matchedHeroes = heroes
      .filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          (h.realName && h.realName.toLowerCase().includes(q)) ||
          (h.roles || []).some((r) => r.toLowerCase().includes(q))
      )
      .slice(0, 4);

    const matchedItems = items
      .filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.category && i.category.toLowerCase().includes(q)) ||
          (i.lore && i.lore.toLowerCase().includes(q))
      )
      .slice(0, 4);

    const matchedSpells = [];
    for (const h of heroes) {
      for (const sp of h.spells || []) {
        if (
          sp.name.toLowerCase().includes(q) ||
          (sp.description && sp.description.toLowerCase().includes(q))
        ) {
          matchedSpells.push({ ...sp, heroId: h.id, heroName: h.name });
          if (matchedSpells.length >= 3) break;
        }
      }
      if (matchedSpells.length >= 3) break;
    }

    const matchedLore = lore
      .filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.summary.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q)
      )
      .slice(0, 3);

    return {
      heroes: matchedHeroes,
      items: matchedItems,
      spells: matchedSpells,
      lore: [],
    };
  }, [query, heroes, items]);

  const totalCount =
    suggestions.heroes.length +
    suggestions.items.length +
    suggestions.spells.length +
    suggestions.lore.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={containerRef} className="relative flex items-center">
      {expanded ? (
        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-black/90 border border-[#E50914] px-3 py-1.5 rounded-sm w-56 sm:w-72 transition-all duration-200"
        >
          <Search className="w-4 h-4 text-[#E50914] mr-2 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.nav.searchPlaceholder}
            aria-label="Global search across heroes, items, spells and lore"
            className="bg-transparent text-xs sm:text-sm text-white placeholder-[#a3a3a3] focus:outline-none w-full"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="text-[#a3a3a3] hover:text-white ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      ) : (
        <button
          type="button"
          onClick={() => {
            setExpanded(true);
            setTimeout(() => inputRef.current?.focus(), 40);
          }}
          aria-label="Open global search"
          className="flex items-center gap-1.5 text-white/90 hover:text-[#E50914] p-2 transition-colors"
        >
          <Search className="w-5 h-5" />
          <span className="hidden xl:inline text-xs text-[#a3a3a3] border border-white/15 px-1.5 py-0.5 rounded">
            Ctrl+K
          </span>
        </button>
      )}

      {/* Live Suggestions Dropdown */}
      {expanded && query.trim().length > 0 && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#181818] border border-white/15 rounded-md shadow-2xl overflow-hidden z-50 max-h-[75vh] overflow-y-auto">
          {totalCount === 0 ? (
            <div className="p-4 text-center text-xs text-[#a3a3a3]">
              No matches found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {suggestions.heroes.length > 0 && (
                <div className="p-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#E50914] px-2 mb-1.5">
                    <Shield className="w-3 h-3" /> Heroes
                  </div>
                  {suggestions.heroes.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => {
                        openEntity('hero', h.id);
                        setExpanded(false);
                      }}
                      className="w-full flex items-center gap-3 p-1.5 hover:bg-white/10 rounded text-left transition-colors"
                    >
                      <img
                        src={h.img}
                        alt={h.name}
                        loading="lazy"
                        className="w-11 h-6 object-cover rounded border border-white/15 bg-black"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-white truncate">{h.name}</div>
                        <div className="text-[10px] text-[#a3a3a3] truncate">
                          {h.attrLabel} • {(h.roles || []).slice(0, 2).join(', ')}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {suggestions.items.length > 0 && (
                <div className="p-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#d4af37] px-2 mb-1.5">
                    <Sword className="w-3 h-3" /> Items & Artifacts
                  </div>
                  {suggestions.items.map((it) => (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => {
                        openEntity('item', it.id);
                        setExpanded(false);
                      }}
                      className="w-full flex items-center gap-3 p-1.5 hover:bg-white/10 rounded text-left transition-colors"
                    >
                      <img
                        src={it.img}
                        alt={it.name}
                        loading="lazy"
                        className="w-9 h-6 object-cover rounded border border-white/15 bg-black"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-white truncate">{it.name}</div>
                        <div className="text-[10px] text-[#d4af37] truncate">
                          {it.cost > 0 ? `${it.cost.toLocaleString()}g` : it.tier || 'Special Drop'} • {it.category}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {suggestions.spells.length > 0 && (
                <div className="p-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sky-400 px-2 mb-1.5">
                    <Zap className="w-3 h-3" /> Spells & Abilities
                  </div>
                  {suggestions.spells.map((sp) => (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => {
                        openEntity('hero', sp.heroId);
                        setExpanded(false);
                      }}
                      className="w-full flex items-center gap-3 p-1.5 hover:bg-white/10 rounded text-left transition-colors"
                    >
                      <img
                        src={sp.img}
                        alt={sp.name}
                        loading="lazy"
                        className="w-7 h-7 object-cover rounded border border-white/15 bg-black"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-white truncate">{sp.name}</div>
                        <div className="text-[10px] text-[#a3a3a3] truncate">
                          {sp.heroName} • CD: {sp.cooldown}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {suggestions.lore.length > 0 && (
                <div className="p-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-400 px-2 mb-1.5">
                    <BookOpen className="w-3 h-3" /> World Lore & Chronicles
                  </div>
                  {suggestions.lore.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => {
                        openEntity('lore', l.id);
                        setExpanded(false);
                      }}
                      className="w-full flex items-center gap-3 p-1.5 hover:bg-white/10 rounded text-left transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-white truncate">{l.title}</div>
                        <div className="text-[10px] text-[#a3a3a3] truncate">
                          {l.era} • {l.category}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                  setExpanded(false);
                }}
                className="w-full py-2 text-center text-xs font-semibold text-[#E50914] hover:bg-white/5 transition-colors"
              >
                View all search results for &ldquo;{query}&rdquo; →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
