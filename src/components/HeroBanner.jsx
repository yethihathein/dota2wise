import React, { useState, useEffect } from 'react';
import { Play, Info, Sparkles, GitBranch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function HeroBanner() {
  const { featuredBanners, openEntity, t } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredBanners.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [featuredBanners.length]);

  const banner = featuredBanners[activeIndex] || featuredBanners[0];

  return (
    <section
      aria-label="Featured Dota 2 Spotlight"
      className="relative w-full min-h-[580px] lg:min-h-[680px] flex items-end pb-14 sm:pb-20 pt-28 overflow-hidden"
    >
      {/* Background Art & Atmospheric Liquid Glass Overlays */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <img
          src={banner.heroPortrait}
          alt={banner.title}
          className="w-full h-full object-cover object-center opacity-35 scale-105 blur-[3px] transition-all duration-700"
        />
        <img
          src={banner.heroRender}
          alt=""
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
          className="hidden md:block absolute right-4 lg:right-16 bottom-0 h-[88%] object-contain opacity-90 drop-shadow-[0_20px_50px_rgba(229,9,20,0.35)] transition-all duration-700"
        />
        <div className="absolute inset-0 nf-hero-gradient-left" />
        <div className="absolute inset-0 nf-hero-gradient-bottom" />
      </div>

      {/* Foreground Liquid Glass Hero Panel */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 w-full">
        <div className="max-w-2xl liquid-panel rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="inline-flex items-center gap-2 liquid-pill border-[#E50914]/50 px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.15em] uppercase text-[#E50914]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{banner.badge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15] drop-shadow-sm">
            {banner.title}
          </h1>

          <p className="text-sm sm:text-base font-semibold text-[#d4af37] tracking-wide">
            {banner.subtitle}
          </p>

          <p className="text-xs sm:text-sm lg:text-base text-[#a3a3a3] leading-relaxed">
            {banner.description}
          </p>

          {/* Metadata Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {banner.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-semibold px-3 py-1 rounded-full liquid-pill"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA Buttons: Explore & More Info */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => openEntity(banner.primaryEntityType, banner.primaryEntityId)}
              className="flex items-center gap-2.5 bg-[#E50914] hover:bg-[#f40612] text-always-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-[#E50914]/35 transition-all transform hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{t.heroBanner.explore}</span>
            </button>

            <button
              type="button"
              onClick={() => openEntity(banner.secondaryEntityType, banner.secondaryEntityId)}
              className="flex items-center gap-2.5 liquid-pill hover:border-[#E50914]/60 font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all"
            >
              <Info className="w-4 h-4" />
              <span>{t.heroBanner.moreInfo}</span>
            </button>
          </div>
        </div>

        {/* Banner Switcher Indicators */}
        <div className="flex items-center gap-2 mt-6 ml-2">
          {featuredBanners.map((b, idx) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Select spotlight ${b.title}`}
              className={`h-2 rounded-full transition-all ${
                idx === activeIndex ? 'w-10 bg-[#E50914]' : 'w-4 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
