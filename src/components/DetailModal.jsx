import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Check,
  Shield,
  Sword,
  BookOpen,
  Sparkles,
  Coins,
  Volume2,
  GitBranch,
  Zap,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import RecipeTree from './RecipeTree.jsx';

export default function DetailModal() {
  const {
    activeModal,
    closeModal,
    openEntity,
    getHeroById,
    getItemById,
    getLoreById,
    heroes,
    items,
    lore,
    toggleFavorite,
    isFavorite,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview');
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(null);

  useEffect(() => {
    setActiveTab('overview');
    setActiveQuoteIndex(null);
  }, [activeModal?.type, activeModal?.id]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && activeModal) {
        closeModal();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeModal, closeModal]);

  if (!activeModal) return null;

  const { type, id } = activeModal;
  const entity =
    type === 'hero'
      ? getHeroById(id)
      : type === 'item'
      ? getItemById(id)
      : getLoreById(id);

  if (!entity) return null;

  const saved = isFavorite(type, entity.id);
  const title = entity.name || entity.title;

  // Compute "More Like This"
  const moreLikeThis =
    type === 'hero'
      ? heroes.filter((h) => h.id !== entity.id && h.attr === entity.attr).slice(0, 4)
      : type === 'item'
      ? items.filter((i) => i.id !== entity.id && i.category === entity.category).slice(0, 4)
      : lore.filter((l) => l.id !== entity.id).slice(0, 4);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-6 overflow-y-auto"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${title}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="nf-modal-animate relative w-full max-w-5xl bg-[#181818] border border-white/15 rounded-xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeModal}
          aria-label="Close detail modal"
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/80 hover:bg-[#E50914] text-white flex items-center justify-center border border-white/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto flex-1">
          {/* Top Backdrop Header */}
          <div className="relative h-64 sm:h-80 w-full bg-[#141414] overflow-hidden flex items-end p-6 sm:p-8">
            <img
              src={entity.img}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover opacity-35 blur-[2px] scale-105"
            />
            <div className="absolute inset-0 nf-hero-gradient-left" />
            <div className="absolute inset-0 nf-hero-gradient-bottom" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between w-full gap-4">
              <div className="flex items-center gap-4 sm:gap-5">
                <img
                  src={entity.img}
                  alt={title}
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-lg border-2 border-[#E50914] shadow-xl bg-black ${
                    type === 'item' ? 'object-contain p-2' : 'object-cover'
                  }`}
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#E50914] text-white">
                      {type === 'hero'
                        ? `${entity.attrLabel} Hero`
                        : type === 'item'
                        ? entity.category
                        : entity.category}
                    </span>
                    {type === 'hero' && (
                      <span className="text-xs text-[#d4af37] font-semibold">
                        {entity.attackType} • Complexity {'◆'.repeat(entity.complexity || 1)}
                      </span>
                    )}
                    {type === 'item' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#d4af37]">
                        <Coins className="w-3.5 h-3.5" />
                        {entity.cost > 0 ? `${entity.cost.toLocaleString()} Gold` : entity.tier || 'Special Drop'}
                      </span>
                    )}
                    {type === 'lore' && (
                      <span className="text-xs text-[#d4af37] font-semibold">{entity.era}</span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#a3a3a3] mt-0.5">
                    {entity.title || entity.subtitle || (entity.roles || []).join(' • ')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleFavorite(type, entity.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded font-bold text-xs sm:text-sm border transition-all shrink-0 ${
                  saved
                    ? 'bg-[#E50914] border-[#E50914] text-white'
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                }`}
              >
                {saved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{saved ? t.detail.inMyList : t.detail.addToMyList}</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs inside Modal */}
          <div className="px-6 sm:px-8 border-b border-white/10 bg-[#141414] flex flex-wrap items-center gap-4 sm:gap-7">
            {type === 'hero' && (
              <>
                {[
                  { id: 'overview', label: t.detail.overview },
                  { id: 'abilities', label: t.detail.abilities },
                  { id: 'lore', label: t.detail.loreVoice },
                  { id: 'connections', label: t.detail.connections },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-[#E50914] text-white'
                        : 'border-transparent text-[#a3a3a3] hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </>
            )}

            {type === 'item' && (
              <>
                {[
                  { id: 'overview', label: `${t.detail.overview} & ${t.detail.recipeTree}` },
                  { id: 'connections', label: t.detail.connections },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-[#E50914] text-white'
                        : 'border-transparent text-[#a3a3a3] hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </>
            )}

            {type === 'lore' && (
              <>
                {[
                  { id: 'overview', label: 'Chronicle & Lore Analysis' },
                  { id: 'connections', label: t.detail.connections },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-[#E50914] text-white'
                        : 'border-transparent text-[#a3a3a3] hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Modal Body Content */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* ==================== HERO CONTENT ==================== */}
            {type === 'hero' && activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Base Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#141414] border border-white/10 p-3.5 rounded-lg">
                    <div className="text-[10px] uppercase text-[#a3a3a3]">Health & Mana</div>
                    <div className="text-sm font-bold text-emerald-400 mt-1">
                      {entity.baseStats?.hp} HP <span className="text-white/40">/</span>{' '}
                      <span className="text-sky-400">{entity.baseStats?.mana} MP</span>
                    </div>
                  </div>
                  <div className="bg-[#141414] border border-white/10 p-3.5 rounded-lg">
                    <div className="text-[10px] uppercase text-[#a3a3a3]">STR / AGI / INT</div>
                    <div className="text-xs font-bold text-white mt-1">
                      <span className="text-red-400">{entity.baseStats?.str} (+{entity.baseStats?.strGain})</span> •{' '}
                      <span className="text-emerald-400">{entity.baseStats?.agi} (+{entity.baseStats?.agiGain})</span> •{' '}
                      <span className="text-sky-400">{entity.baseStats?.int} (+{entity.baseStats?.intGain})</span>
                    </div>
                  </div>
                  <div className="bg-[#141414] border border-white/10 p-3.5 rounded-lg">
                    <div className="text-[10px] uppercase text-[#a3a3a3]">Armor & Move Speed</div>
                    <div className="text-sm font-bold text-white mt-1">
                      {entity.baseStats?.armor} Armor • {entity.baseStats?.moveSpeed} MS
                    </div>
                  </div>
                  <div className="bg-[#141414] border border-white/10 p-3.5 rounded-lg">
                    <div className="text-[10px] uppercase text-[#a3a3a3]">Attack Range & BAT</div>
                    <div className="text-sm font-bold text-white mt-1">
                      {entity.baseStats?.attackRange} Range • {entity.baseStats?.bat}s BAT
                    </div>
                  </div>
                </div>

                {/* Talent Tree */}
                <div className="bg-[#141414] border border-white/10 rounded-lg p-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#d4af37] mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4" /> Hero Talent Tree (Levels 10 — 25)
                  </h3>
                  <div className="space-y-2.5">
                    {(entity.talents || []).map((row) => (
                      <div
                        key={row.level}
                        className="grid grid-cols-11 items-center gap-2 text-xs"
                      >
                        <div className="col-span-5 bg-[#1f1f1f] border border-white/10 p-2.5 rounded text-right font-medium text-white">
                          {row.left}
                        </div>
                        <div className="col-span-1 flex items-center justify-center">
                          <span className="w-8 h-8 rounded-full bg-[#E50914] text-white font-black flex items-center justify-center text-xs shadow">
                            {row.level}
                          </span>
                        </div>
                        <div className="col-span-5 bg-[#1f1f1f] border border-white/10 p-2.5 rounded text-left font-medium text-white">
                          {row.right}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Recommended Items Row */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-3">
                    {t.detail.recommendedItems}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {(entity.recommendedItems || []).map((itemKey) => {
                      const itemObj = getItemById(itemKey);
                      if (!itemObj) return null;
                      return (
                        <button
                          key={itemKey}
                          type="button"
                          onClick={() => openEntity('item', itemObj.id)}
                          className="group bg-[#141414] hover:bg-[#1f1f1f] border border-white/10 hover:border-[#E50914] rounded-lg p-2.5 text-center transition-all"
                        >
                          <img
                            src={itemObj.img}
                            alt={itemObj.name}
                            className="w-14 h-10 object-contain mx-auto rounded bg-black p-1"
                          />
                          <div className="text-xs font-bold text-white group-hover:text-[#E50914] truncate mt-1.5">
                            {itemObj.name}
                          </div>
                          <div className="text-[10px] text-[#d4af37]">
                            {itemObj.cost > 0 ? `${itemObj.cost}g` : 'Special'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {type === 'hero' && activeTab === 'abilities' && (
              <div className="space-y-4">
                {(entity.spells || []).map((sp) => (
                  <div
                    key={sp.id}
                    className="bg-[#141414] border border-white/10 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row gap-4"
                  >
                    <img
                      src={sp.img}
                      alt={sp.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = entity.img;
                      }}
                      className="w-16 h-16 rounded-lg border border-white/20 object-cover shrink-0 bg-black"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-base font-bold text-white">{sp.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-[#a3a3a3]">
                          <span>⏱ CD: <strong className="text-white">{sp.cooldown}</strong></span>
                          <span>💧 Mana: <strong className="text-sky-400">{sp.manaCost}</strong></span>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-[#a3a3a3] leading-relaxed">
                        {sp.description}
                      </p>

                      {(sp.scepter || sp.shard) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                          {sp.scepter && (
                            <div className="bg-sky-950/40 border border-sky-500/40 rounded p-2.5 text-xs">
                              <div className="font-bold text-sky-400 flex items-center gap-1 mb-0.5">
                                <Zap className="w-3.5 h-3.5" /> Aghanim&rsquo;s Scepter Upgrade
                              </div>
                              <p className="text-white/90">{sp.scepter}</p>
                            </div>
                          )}
                          {sp.shard && (
                            <div className="bg-purple-950/40 border border-purple-500/40 rounded p-2.5 text-xs">
                              <div className="font-bold text-purple-300 flex items-center gap-1 mb-0.5">
                                <Sparkles className="w-3.5 h-3.5" /> Aghanim&rsquo;s Shard Upgrade
                              </div>
                              <p className="text-white/90">{sp.shard}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {sp.notes && (
                        <div className="text-[11px] text-[#d4af37] pt-1">
                          ★ Tactical Note: {sp.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {type === 'hero' && activeTab === 'lore' && (
              <div className="space-y-6">
                <div className="bg-[#141414] border border-white/10 rounded-lg p-5 space-y-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#E50914]" /> Biography & Origin
                  </h3>
                  <p className="text-xs sm:text-sm text-[#d4d4d4] leading-relaxed">
                    {entity.lore?.biography}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs">
                    <div>
                      <span className="text-[#a3a3a3] block">Origin Realm:</span>
                      <strong className="text-white">{entity.lore?.origin}</strong>
                    </div>
                    <div>
                      <span className="text-[#a3a3a3] block">Personality:</span>
                      <strong className="text-white">{entity.lore?.personality}</strong>
                    </div>
                    <div>
                      <span className="text-[#a3a3a3] block">Rivalries & Ties:</span>
                      <strong className="text-white">{entity.lore?.relationships}</strong>
                    </div>
                  </div>
                </div>

                {/* In-Game Voice Line Quotes */}
                <div className="bg-[#141414] border border-white/10 rounded-lg p-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#d4af37] mb-3 flex items-center gap-2">
                    <Volume2 className="w-4 h-4" /> Iconic In-Game Voice Lines
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(entity.lore?.voiceLines || []).map((line, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveQuoteIndex(idx)}
                        className={`flex items-center justify-between gap-3 p-3 rounded border text-left transition-all ${
                          activeQuoteIndex === idx
                            ? 'bg-[#E50914]/20 border-[#E50914] text-white'
                            : 'bg-[#1f1f1f] border-white/10 text-[#d4d4d4] hover:border-white/30'
                        }`}
                      >
                        <span className="text-xs italic">{line}</span>
                        <Volume2
                          className={`w-4 h-4 shrink-0 ${
                            activeQuoteIndex === idx ? 'text-[#E50914] animate-pulse' : 'text-[#a3a3a3]'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ==================== ITEM CONTENT ==================== */}
            {type === 'item' && activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Item Stats, Active/Passive & Lore */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#141414] border border-white/10 rounded-lg p-5 space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#d4af37]">
                      Attributes & Bonuses
                    </h3>
                    {(entity.stats || []).length > 0 ? (
                      <ul className="space-y-1.5 text-xs sm:text-sm font-semibold text-white">
                        {entity.stats.map((st, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
                            {st}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-[#a3a3a3]">Utility / Active Artifact</p>
                    )}

                    {entity.active && (
                      <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#E50914] uppercase">
                            {entity.active.name}
                          </span>
                          <span className="text-[#a3a3a3]">
                            CD: <strong className="text-white">{entity.active.cooldown}</strong> • Mana:{' '}
                            <strong className="text-sky-400">{entity.active.manaCost}</strong>
                          </span>
                        </div>
                        <p className="text-xs text-[#d4d4d4] leading-relaxed">
                          {entity.active.description}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-[#141414] border border-white/10 rounded-lg p-5 space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      Lore, Tips & When to Build
                    </h3>
                    <p className="text-xs italic text-[#a3a3a3] border-l-2 border-[#E50914] pl-3">
                      &ldquo;{entity.lore}&rdquo;
                    </p>
                    <div className="text-xs space-y-1.5 pt-1">
                      <div>
                        <strong className="text-[#d4af37]">Pro Tip:</strong>{' '}
                        <span className="text-[#d4d4d4]">{entity.tips}</span>
                      </div>
                      <div>
                        <strong className="text-emerald-400">When to Build:</strong>{' '}
                        <span className="text-[#d4d4d4]">{entity.whenToBuild}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Recipe Tree */}
                <RecipeTree
                  item={entity}
                  onSelectItem={(newKey) => openEntity('item', newKey)}
                />
              </div>
            )}

            {/* ==================== LORE CONTENT ==================== */}
            {type === 'lore' && activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-[#141414] border border-white/10 rounded-lg p-6 space-y-4">
                  <div className="text-xs font-bold uppercase tracking-widest text-[#E50914]">
                    {entity.era} • {entity.category}
                  </div>
                  <h3 className="text-xl font-bold text-white">{entity.subtitle}</h3>
                  <p className="text-sm text-[#d4d4d4] leading-relaxed">{entity.summary}</p>
                  <p className="text-sm text-[#a3a3a3] leading-relaxed pt-2 border-t border-white/10">
                    {entity.fullText}
                  </p>
                </div>
              </div>
            )}

            {/* ==================== CONNECTIONS EVERYWHERE SECTION ==================== */}
            {(activeTab === 'connections' || type === 'item' || type === 'lore') && (
              <div className="space-y-6 pt-2 border-t border-white/10">
                <h3 className="text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-[#E50914]" />
                  <span>Cross-Linked Encyclopedia Connections</span>
                </h3>

                {/* 1. Heroes Related / Heroes Who Build This */}
                {((type === 'hero' && entity.relatedHeroes?.length > 0) ||
                  (type === 'item' && entity.heroesWhoBuild?.length > 0) ||
                  (type === 'lore' && entity.connectedHeroes?.length > 0)) && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#a3a3a3] mb-3">
                      {type === 'hero'
                        ? t.detail.relatedHeroes
                        : type === 'item'
                        ? t.detail.heroesWhoBuild
                        : 'Connected Heroes'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {type === 'hero' &&
                        (entity.relatedHeroes || []).map((rel) => {
                          const hObj = getHeroById(rel.id);
                          if (!hObj) return null;
                          return (
                            <button
                              key={rel.id}
                              type="button"
                              onClick={() => openEntity('hero', hObj.id)}
                              className="flex items-start gap-3 p-3 rounded-lg bg-[#141414] hover:bg-[#1f1f1f] border border-white/10 hover:border-[#E50914] text-left transition-all"
                            >
                              <img
                                src={hObj.img}
                                alt={hObj.name}
                                className="w-14 h-9 object-cover rounded border border-white/15 shrink-0"
                              />
                              <div>
                                <div className="text-xs font-bold text-white">{hObj.name}</div>
                                <div className="text-[10px] font-semibold text-[#E50914]">
                                  {rel.relation}
                                </div>
                                <p className="text-[11px] text-[#a3a3a3] mt-0.5">{rel.note}</p>
                              </div>
                            </button>
                          );
                        })}

                      {type !== 'hero' &&
                        (entity.heroesWhoBuild || entity.connectedHeroes || []).map((hId) => {
                          const hObj = getHeroById(hId);
                          if (!hObj) return null;
                          return (
                            <button
                              key={hId}
                              type="button"
                              onClick={() => openEntity('hero', hObj.id)}
                              className="flex items-center gap-3 p-3 rounded-lg bg-[#141414] hover:bg-[#1f1f1f] border border-white/10 hover:border-[#E50914] text-left transition-all"
                            >
                              <img
                                src={hObj.img}
                                alt={hObj.name}
                                className="w-14 h-9 object-cover rounded border border-white/15 shrink-0"
                              />
                              <div>
                                <div className="text-xs font-bold text-white">{hObj.name}</div>
                                <div className="text-[10px] text-[#a3a3a3]">
                                  {hObj.attrLabel} • {(hObj.roles || []).slice(0, 2).join(', ')}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* 2. Spell Interactions (For Items) */}
                {type === 'item' && (entity.spellInteractions || []).length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-3">
                      {t.detail.spellInteractions}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {entity.spellInteractions.map((inter, idx) => {
                        const hObj = getHeroById(inter.heroId);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => hObj && openEntity('hero', hObj.id)}
                            className="p-3 rounded-lg bg-[#141414] hover:bg-[#1f1f1f] border border-white/10 hover:border-sky-400 text-left transition-all"
                          >
                            <div className="text-xs font-bold text-white">
                              {hObj?.name}: <span className="text-sky-400">{inter.spellName}</span>
                            </div>
                            <p className="text-xs text-[#a3a3a3] mt-1">{inter.note}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Connected Items (For Lore or Heroes) */}
                {(type === 'lore' || type === 'hero') && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] mb-3">
                      {type === 'hero' ? t.detail.recommendedItems : 'Connected Artifacts & Items'}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {(entity.recommendedItems || entity.connectedItems || []).map((iKey) => {
                        const itemObj = getItemById(iKey);
                        if (!itemObj) return null;
                        return (
                          <button
                            key={iKey}
                            type="button"
                            onClick={() => openEntity('item', itemObj.id)}
                            className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#141414] hover:bg-[#1f1f1f] border border-white/10 hover:border-[#d4af37] text-left transition-all"
                          >
                            <img
                              src={itemObj.img}
                              alt={itemObj.name}
                              className="w-11 h-8 object-contain rounded bg-black p-0.5"
                            />
                            <div>
                              <div className="text-xs font-bold text-white">{itemObj.name}</div>
                              <div className="text-[10px] text-[#d4af37]">
                                {itemObj.cost > 0 ? `${itemObj.cost}g` : itemObj.category}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5. More Like This Row */}
                {moreLikeThis.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#a3a3a3] mb-3">
                      {t.detail.moreLikeThis}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {moreLikeThis.map((sim) => (
                        <button
                          key={sim.id}
                          type="button"
                          onClick={() => openEntity(type, sim.id)}
                          className="group bg-[#141414] hover:bg-[#1f1f1f] border border-white/10 hover:border-[#E50914] rounded-lg overflow-hidden text-left transition-all"
                        >
                          <img
                            src={sim.img}
                            alt={sim.name || sim.title}
                            className={`w-full h-24 ${
                              type === 'item' ? 'object-contain p-2 bg-black' : 'object-cover'
                            }`}
                          />
                          <div className="p-2.5">
                            <div className="text-xs font-bold text-white group-hover:text-[#E50914] truncate">
                              {sim.name || sim.title}
                            </div>
                            <div className="text-[10px] text-[#a3a3a3] truncate">
                              {sim.attrLabel || sim.category}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
