import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Sword, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import Card from '../components/Card.jsx';
import RecipeTree from '../components/RecipeTree.jsx';
import { CURATED_HEROES } from '../data/dotaDatabase.js';

const CATEGORIES = [
  'All',
  'Basic',
  'Upgrades',
  'Artifacts',
  'Neutral Items',
  'Roshan Drops',
  'Consumables',
];

const PRICE_RANGES = [
  { id: 'all', label: 'All Prices' },
  { id: 'free', label: '0g (Roshan / Neutral Drops)' },
  { id: 'under1500', label: 'Under 1,500g' },
  { id: '1500to4000', label: '1,500g – 4,000g' },
  { id: 'over4000', label: '4,000g+ Luxury' },
];

const ATTRIBUTES = ['All', 'Strength', 'Agility', 'Intelligence', 'Damage', 'Mobility'];

export default function ItemsPage() {
  const { items, getItemById, t } = useApp();
  const [searchParams] = useSearchParams();

  const [category, setCategory] = useState(searchParams.get('cat') || 'All');
  const [priceRange, setPriceRange] = useState('all');
  const [attribute, setAttribute] = useState('All');
  const [heroFilter, setHeroFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [treeItemKey, setTreeItemKey] = useState('blink');

  const treeItem = getItemById(treeItemKey) || getItemById('blink') || items[0];

  const filteredItems = useMemo(() => {
    return items.filter((it) => {
      if (category !== 'All' && it.category !== category) return false;

      if (priceRange === 'free' && it.cost > 0) return false;
      if (priceRange === 'under1500' && (it.cost === 0 || it.cost >= 1500)) return false;
      if (priceRange === '1500to4000' && (it.cost < 1500 || it.cost > 4000)) return false;
      if (priceRange === 'over4000' && it.cost <= 4000) return false;

      if (
        attribute !== 'All' &&
        !(it.attributes || []).some((a) => a.toLowerCase() === attribute.toLowerCase()) &&
        !(it.stats || []).some((s) => s.toLowerCase().includes(attribute.toLowerCase()))
      ) {
        return false;
      }

      if (heroFilter !== 'All' && !(it.heroesWhoBuild || []).includes(heroFilter)) {
        return false;
      }

      if (
        searchQuery.trim() &&
        !it.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) &&
        !(it.lore || '').toLowerCase().includes(searchQuery.trim().toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [items, category, priceRange, attribute, heroFilter, searchQuery]);

  const resetFilters = () => {
    setCategory('All');
    setPriceRange('all');
    setAttribute('All');
    setHeroFilter('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen liquid-page pt-24 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-8">
        {/* Page Header */}
        <div className="liquid-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#E50914] flex items-center gap-1.5">
              <Sword className="w-3.5 h-3.5" /> {t.pages?.itemsBadge || 'THE SECRET SHOP & ROSHAN VAULT'}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
              {t.pages?.itemsTitle || 'Items, Artifacts & Interactive Recipe Trees'}
            </h1>
            <p className="text-xs sm:text-sm text-[#a3a3a3] mt-1 max-w-2xl">
              {t.pages?.itemsSubtitle}
            </p>
          </div>
          <div className="text-xs text-[#d4af37] font-semibold">
            {filteredItems.length} / {items.length}
          </div>
        </div>

        {/* Interactive Visual Recipe Tree Section */}
        <RecipeTree
          item={treeItem}
          onSelectItem={(newKey) => setTreeItemKey(newKey)}
        />

        {/* Filter Bar */}
        <div className="liquid-panel rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
              <Filter className="w-4 h-4 text-[#E50914]" />
              <span>{t.filters.category}</span>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs text-[#a3a3a3] hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" /> {t.filters.reset || 'Reset Filters'}
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  category === cat
                    ? 'bg-[#E50914] text-always-white shadow-md shadow-[#E50914]/30'
                    : 'liquid-pill hover:border-[#E50914]/50'
                }`}
              >
                {cat === 'All' ? t.filters.all : cat}
              </button>
            ))}
          </div>

          {/* Secondary Selects: Price, Attribute, Hero Builder, Text Search */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div>
              <label className="block text-[10px] uppercase text-[#a3a3a3] mb-1">
                {t.filters.price}
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full liquid-input rounded-xl px-3 py-2 text-xs"
              >
                {PRICE_RANGES.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#181818] text-white">
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-[#a3a3a3] mb-1">
                {t.filters.attribute}
              </label>
              <select
                value={attribute}
                onChange={(e) => setAttribute(e.target.value)}
                className="w-full liquid-input rounded-xl px-3 py-2 text-xs"
              >
                {ATTRIBUTES.map((a) => (
                  <option key={a} value={a} className="bg-[#181818] text-white">
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-[#a3a3a3] mb-1">
                {t.filters.heroBuilder}
              </label>
              <select
                value={heroFilter}
                onChange={(e) => setHeroFilter(e.target.value)}
                className="w-full liquid-input rounded-xl px-3 py-2 text-xs"
              >
                <option value="All" className="bg-[#181818] text-white">
                  {t.filters.all}
                </option>
                {CURATED_HEROES.map((h) => (
                  <option key={h.id} value={h.id} className="bg-[#181818] text-white">
                    {h.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-[#a3a3a3] mb-1">
                {t.nav.search || 'Search'}
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Blink, Skadi, Aegis, BKB..."
                className="w-full liquid-input rounded-xl px-3 py-2 text-xs placeholder-[#737373]"
              />
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
          {filteredItems.map((it) => (
            <Card key={it.id} entity={it} type="item" />
          ))}
        </div>
      </div>
    </div>
  );
}
