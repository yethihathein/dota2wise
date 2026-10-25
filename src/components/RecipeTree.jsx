import React from 'react';
import { ArrowDown, Coins, Sparkles, GitCommit } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { getItemImage } from '../data/dotaDatabase.js';

export default function RecipeTree({ item, onSelectItem }) {
  const { getItemById, openEntity, t } = useApp();

  if (!item) return null;

  const handleNavigate = (itemKey) => {
    if (!itemKey || itemKey.startsWith('recipe_')) return;
    if (onSelectItem) {
      onSelectItem(itemKey);
    } else {
      openEntity('item', itemKey);
    }
  };

  const componentNodes = (item.components || []).map((compKey) => {
    if (compKey.startsWith('recipe_')) {
      return {
        id: compKey,
        name: 'Recipe Scroll',
        cost: 600,
        img: getItemImage('recipe'),
        isRecipe: true,
      };
    }
    const found = getItemById(compKey);
    return (
      found || {
        id: compKey,
        name: compKey.replace(/_/g, ' '),
        cost: 0,
        img: getItemImage(compKey),
        isRecipe: false,
      }
    );
  });

  const upgradeNodes = (item.upgradesTo || []).map((upKey) => {
    const found = getItemById(upKey);
    return (
      found || {
        id: upKey,
        name: upKey.replace(/_/g, ' '),
        cost: 0,
        img: getItemImage(upKey),
      }
    );
  });

  return (
    <div className="bg-[#141414] border border-white/10 rounded-lg p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <div>
          <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-[#E50914]" />
            <span>{t.detail.recipeTree}: {item.name}</span>
          </h4>
          <p className="text-xs text-[#a3a3a3]">
            Click any component or upgrade node to traverse the item build hierarchy.
          </p>
        </div>

        {/* Quick Preset Switcher for Iconic Trees */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['blink', 'ultimate_scepter', 'black_king_bar', 'yasha', 'manta', 'rapier'].map((presetKey) => {
            const p = getItemById(presetKey);
            if (!p) return null;
            return (
              <button
                key={presetKey}
                type="button"
                onClick={() => handleNavigate(presetKey)}
                className={`text-[10px] font-semibold px-2.5 py-1 rounded border transition-colors ${
                  item.key === presetKey
                    ? 'bg-[#E50914] border-[#E50914] text-white'
                    : 'bg-[#1f1f1f] border-white/15 text-[#a3a3a3] hover:text-white'
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4">
        {/* TIER 1: COMPONENTS ("Built From") */}
        <div className="w-full">
          <div className="text-center text-[11px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-3">
            {t.detail.components} ({componentNodes.length})
          </div>

          {componentNodes.length === 0 ? (
            <div className="text-center py-2.5 px-4 rounded bg-white/5 border border-dashed border-white/10 text-xs text-[#a3a3a3] max-w-md mx-auto">
              Base Component / Direct Drop — Requires no prerequisite items.
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {componentNodes.map((comp, idx) => (
                <button
                  key={`${comp.id}-${idx}`}
                  type="button"
                  disabled={comp.isRecipe}
                  onClick={() => handleNavigate(comp.id)}
                  className={`group flex items-center gap-2.5 p-2.5 rounded-md border text-left transition-all ${
                    comp.isRecipe
                      ? 'bg-[#1a1a1a] border-white/10 cursor-default opacity-80'
                      : 'bg-[#1f1f1f] border-white/15 hover:border-[#E50914] hover:scale-105 cursor-pointer shadow-md'
                  }`}
                >
                  <img
                    src={comp.img}
                    alt={comp.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getItemImage('branches');
                    }}
                    className="w-11 h-8 object-contain rounded bg-black p-0.5 border border-white/10"
                  />
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-[#E50914] capitalize">
                      {comp.name}
                    </div>
                    <div className="text-[10px] text-[#d4af37] font-semibold flex items-center gap-1">
                      <Coins className="w-2.5 h-2.5" />
                      {comp.cost > 0 ? `${comp.cost.toLocaleString()}g` : 'Scroll'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Connector Arrow Down */}
        <div className="flex flex-col items-center text-[#E50914]">
          <div className="w-0.5 h-5 bg-gradient-to-b from-white/20 to-[#E50914]" />
          <ArrowDown className="w-4 h-4 -mt-1" />
        </div>

        {/* TIER 2: CURRENT SELECTED ITEM */}
        <div className="relative bg-gradient-to-b from-[#261415] to-[#1a1a1a] border-2 border-[#E50914] rounded-lg p-4 shadow-xl shadow-[#E50914]/20 min-w-[240px] max-w-sm text-center">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#E50914] mb-1">
            <Sparkles className="w-3 h-3" /> {t.detail.currentItem}
          </span>
          <div className="flex items-center justify-center gap-3.5 mt-1">
            <img
              src={item.img}
              alt={item.name}
              className="w-16 h-12 object-contain rounded bg-black p-1 border border-[#E50914]/50"
            />
            <div className="text-left">
              <div className="text-base font-black text-white">{item.name}</div>
              <div className="text-xs font-bold text-[#d4af37] flex items-center gap-1">
                <Coins className="w-3 h-3" />
                {item.cost > 0 ? `${item.cost.toLocaleString()} Gold` : item.tier || 'Special Drop'}
              </div>
              <div className="text-[10px] text-[#a3a3a3]">{item.category}</div>
            </div>
          </div>
        </div>

        {/* Connector Arrow Down */}
        <div className="flex flex-col items-center text-[#d4af37]">
          <div className="w-0.5 h-5 bg-gradient-to-b from-[#E50914] to-[#d4af37]" />
          <ArrowDown className="w-4 h-4 -mt-1" />
        </div>

        {/* TIER 3: UPGRADES INTO */}
        <div className="w-full">
          <div className="text-center text-[11px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-3">
            {t.detail.upgradesTo} ({upgradeNodes.length})
          </div>

          {upgradeNodes.length === 0 ? (
            <div className="text-center py-2.5 px-4 rounded bg-white/5 border border-dashed border-white/10 text-xs text-[#a3a3a3] max-w-md mx-auto">
              Final Tier Artifact — Does not upgrade into higher items.
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {upgradeNodes.map((up, idx) => (
                <button
                  key={`${up.id}-${idx}`}
                  type="button"
                  onClick={() => handleNavigate(up.id)}
                  className="group flex items-center gap-2.5 p-2.5 rounded-md bg-[#1f1f1f] border border-white/15 hover:border-[#d4af37] hover:scale-105 cursor-pointer transition-all text-left shadow-md"
                >
                  <img
                    src={up.img}
                    alt={up.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getItemImage('blink');
                    }}
                    className="w-11 h-8 object-contain rounded bg-black p-0.5 border border-white/10"
                  />
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-[#d4af37] capitalize">
                      {up.name}
                    </div>
                    <div className="text-[10px] text-[#d4af37] font-semibold flex items-center gap-1">
                      <Coins className="w-2.5 h-2.5" />
                      {up.cost > 0 ? `${up.cost.toLocaleString()}g` : 'Apex Upgrade'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
