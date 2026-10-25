import React from 'react';
import { Plus, Check, GitBranch, Coins, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const ATTR_BADGE_COLORS = {
  str: 'bg-red-600/85 text-always-white border-red-400/40',
  agi: 'bg-emerald-600/85 text-always-white border-emerald-400/40',
  int: 'bg-sky-600/85 text-always-white border-sky-400/40',
  all: 'bg-amber-600/85 text-always-white border-amber-400/40',
};

export default function Card({ entity, type }) {
  const { openEntity, toggleFavorite, isFavorite } = useApp();
  if (!entity) return null;

  const saved = isFavorite(type, entity.id);

  const handleCardClick = () => {
    openEntity(type, entity.id);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(type, entity.id);
  };

  const title = entity.name || entity.title;
  const subtitle =
    type === 'hero'
      ? `${entity.attrLabel} • ${entity.attackType}`
      : type === 'item'
      ? entity.category
      : `${entity.era} • ${entity.category}`;

  const connectionCount =
    type === 'hero'
      ? (entity.recommendedItems?.length || 0) + (entity.relatedHeroes?.length || 0) + (entity.connectedLore?.length || 0)
      : type === 'item'
      ? (entity.components?.length || 0) + (entity.upgradesTo?.length || 0) + (entity.heroesWhoBuild?.length || 0)
      : (entity.connectedHeroes?.length || 0) + (entity.connectedItems?.length || 0);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`View details for ${title}`}
      className="group liquid-card relative shrink-0 w-56 sm:w-64 rounded-2xl overflow-hidden cursor-pointer select-none flex flex-col"
    >
      {/* Top Thumbnail Container */}
      <div className="relative h-32 sm:h-36 w-full bg-black/40 overflow-hidden">
        <img
          src={entity.img}
          alt={title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/invoker.png';
          }}
          className={`w-full h-full ${
            type === 'item'
              ? 'object-contain p-4 bg-gradient-to-b from-slate-900/80 to-black/90'
              : 'object-cover'
          } group-hover:scale-105 transition-transform duration-300`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />

        {/* Top-left Attribute / Cost / Era Pill */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {type === 'hero' && (
            <span
              className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full backdrop-blur-md border ${
                ATTR_BADGE_COLORS[entity.attr] || ATTR_BADGE_COLORS.all
              }`}
            >
              {entity.attrLabel}
            </span>
          )}
          {type === 'item' && (
            <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md bg-black/75 text-[#fbbf24] border border-[#fbbf24]/40">
              <Coins className="w-3 h-3" />
              {entity.cost > 0 ? `${entity.cost.toLocaleString()}g` : entity.tier || 'Drop'}
            </span>
          )}
          {type === 'lore' && (
            <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md bg-[#E50914]/90 text-always-white">
              <Sparkles className="w-3 h-3" />
              {entity.category}
            </span>
          )}
        </div>

        {/* Top-right Quick "My List" Favorite Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={saved ? `Remove ${title} from My List` : `Add ${title} to My List`}
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center border backdrop-blur-md transition-colors ${
            saved
              ? 'bg-[#E50914] border-[#E50914] text-always-white'
              : 'bg-black/60 border-white/30 text-always-white hover:border-white'
          }`}
        >
          {saved ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Card Body & Hover Mini Info Panel */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-white truncate group-hover:text-[#E50914] transition-colors">
              {title}
            </h3>
            {type === 'hero' && (
              <span className="text-[10px] text-[#a3a3a3] shrink-0" title="Complexity">
                {'◆'.repeat(entity.complexity || 1)}
                {'◇'.repeat(3 - (entity.complexity || 1))}
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#a3a3a3] truncate mt-0.5">{subtitle}</p>
        </div>

        {/* Mini Info Panel (Roles / Stats / Connections) */}
        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#a3a3a3]">
          <div className="truncate max-w-[140px]">
            {type === 'hero' && (entity.roles || []).slice(0, 2).join(' • ')}
            {type === 'item' &&
              (entity.stats?.[0] ||
                (entity.upgradesTo?.length
                  ? `Upgrades (${entity.upgradesTo.length})`
                  : entity.category))}
            {type === 'lore' && entity.era}
          </div>
          <span className="flex items-center gap-1 text-[#E50914] font-semibold shrink-0">
            <GitBranch className="w-3 h-3" />
            {connectionCount}
          </span>
        </div>
      </div>
    </div>
  );
}
