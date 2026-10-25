import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Shield, Filter, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import Card from '../components/Card.jsx';

const ATTR_FILTERS = [
  { id: 'all_attrs', label: 'All Attributes' },
  { id: 'str', label: 'Strength' },
  { id: 'agi', label: 'Agility' },
  { id: 'int', label: 'Intelligence' },
  { id: 'all', label: 'Universal' },
];

const ROLES = [
  'All',
  'Carry',
  'Support',
  'Initiator',
  'Disabler',
  'Nuker',
  'Durable',
  'Escape',
  'Pusher',
];

export default function HeroesPage() {
  const { heroes, t } = useApp();
  const [searchParams] = useSearchParams();

  const [attr, setAttr] = useState(searchParams.get('attr') || 'all_attrs');
  const [role, setRole] = useState('All');
  const [attackType, setAttackType] = useState('All');
  const [complexity, setComplexity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHeroes = useMemo(() => {
    return heroes.filter((h) => {
      if (attr !== 'all_attrs' && h.attr !== attr) return false;
      if (role !== 'All' && !(h.roles || []).includes(role)) return false;
      if (attackType !== 'All' && h.attackType !== attackType) return false;
      if (complexity !== 'All' && Number(h.complexity) !== Number(complexity)) return false;
      if (
        searchQuery.trim() &&
        !h.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) &&
        !(h.realName || '').toLowerCase().includes(searchQuery.trim().toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [heroes, attr, role, attackType, complexity, searchQuery]);

  const resetFilters = () => {
    setAttr('all_attrs');
    setRole('All');
    setAttackType('All');
    setComplexity('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen liquid-page pt-24 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-8">
        {/* Header */}
        <div className="liquid-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#E50914] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> {t.pages?.heroesBadge || 'CHAMPIONS OF THE ANCIENTS'}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
              {t.pages?.heroesTitle || 'Heroes, Spells, Talent Trees & Biographies'}
            </h1>
            <p className="text-xs sm:text-sm text-[#a3a3a3] mt-1 max-w-2xl">
              {t.pages?.heroesSubtitle}
            </p>
          </div>
          <div className="text-xs text-[#d4af37] font-semibold">
            {filteredHeroes.length} / {heroes.length}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="liquid-panel rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
              <Filter className="w-4 h-4 text-[#E50914]" />
              <span>{t.filters.attribute}</span>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs text-[#a3a3a3] hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" /> {t.filters.reset || 'Reset Filters'}
            </button>
          </div>

          {/* Primary Attribute Tabs */}
          <div className="flex flex-wrap gap-2">
            {ATTR_FILTERS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAttr(a.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  attr === a.id
                    ? 'bg-[#E50914] text-always-white shadow-md shadow-[#E50914]/30'
                    : 'liquid-pill hover:border-[#E50914]/50'
                }`}
              >
                {a.id === 'all_attrs' ? t.filters.all : a.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div>
              <label className="block text-[10px] uppercase text-[#a3a3a3] mb-1">
                {t.filters.role}
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full liquid-input rounded-xl px-3 py-2 text-xs"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r} className="bg-[#181818] text-white">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-[#a3a3a3] mb-1">
                {t.filters.attackType}
              </label>
              <select
                value={attackType}
                onChange={(e) => setAttackType(e.target.value)}
                className="w-full liquid-input rounded-xl px-3 py-2 text-xs"
              >
                <option value="All" className="bg-[#181818] text-white">{t.filters.all}</option>
                <option value="Melee" className="bg-[#181818] text-white">Melee</option>
                <option value="Ranged" className="bg-[#181818] text-white">Ranged</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-[#a3a3a3] mb-1">
                {t.filters.complexity}
              </label>
              <select
                value={complexity}
                onChange={(e) => setComplexity(e.target.value)}
                className="w-full liquid-input rounded-xl px-3 py-2 text-xs"
              >
                <option value="All" className="bg-[#181818] text-white">{t.filters.all}</option>
                <option value="1" className="bg-[#181818] text-white">◆◇◇ Simple (1)</option>
                <option value="2" className="bg-[#181818] text-white">◆◆◇ Moderate (2)</option>
                <option value="3" className="bg-[#181818] text-white">◆◆◆ High (3)</option>
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
                placeholder="Invoker, Yurnero, Mogul Khan..."
                className="w-full liquid-input rounded-xl px-3 py-2 text-xs placeholder-[#737373]"
              />
            </div>
          </div>
        </div>

        {/* Heroes Catalog Grid */}
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
          {filteredHeroes.map((hero) => (
            <Card key={hero.id} entity={hero} type="hero" />
          ))}
        </div>
      </div>
    </div>
  );
}
