import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Shuffle, HelpCircle, Globe, Menu, X, Bookmark, Sun, Moon } from 'lucide-react';
import SearchBar from './SearchBar.jsx';
import { useApp } from '../context/AppContext.jsx';
import { LANGUAGES } from '../i18n/translations.js';

export default function Navbar() {
  const {
    t,
    lang,
    setLang,
    toggleBurmese,
    theme,
    toggleTheme,
    surpriseMe,
    setQuizOpen,
    favorites,
    dataSource,
  } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { to: '/', label: t.nav.home, end: true },
    { to: '/heroes', label: t.nav.heroes },
    { to: '/items', label: t.nav.items },
    { to: '/search', label: t.nav.search || 'Search' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'liquid-panel border-b border-white/15 shadow-2xl'
          : 'nf-navbar-gradient'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Left: Dota 2 Game Logo (No Text) & Navigation Links */}
        <div className="flex items-center gap-5 lg:gap-8">
          <Link
            to="/"
            className="flex items-center group focus:outline-none shrink-0"
            aria-label="Dota 2 Home"
            title="Dota 2"
          >
            <div className="w-11 h-11 rounded-xl bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center p-1.5 shadow-lg shadow-[#E50914]/25 group-hover:scale-110 group-hover:border-[#E50914]/60 transition-all duration-200">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full drop-shadow-[0_2px_8px_rgba(229,9,20,0.65)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="dota2LogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff3b2f" />
                    <stop offset="50%" stopColor="#e50914" />
                    <stop offset="100%" stopColor="#8f040b" />
                  </linearGradient>
                </defs>
                {/* Main Diagonal River Slash (Top-Left to Bottom-Right) */}
                <path
                  d="M11 21 L22 9 L36 19 L90 73 L81 90 L66 83 L10 28 Z"
                  fill="url(#dota2LogoGrad)"
                />
                {/* Top-Right Dire Ancient Shard */}
                <path
                  d="M63 11 L87 13 L89 37 L79 40 L60 21 Z"
                  fill="url(#dota2LogoGrad)"
                />
                {/* Bottom-Left Radiant Ancient Shard */}
                <path
                  d="M11 63 L21 60 L40 79 L37 89 L13 87 Z"
                  fill="url(#dota2LogoGrad)"
                />
              </svg>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-5" aria-label="Main Navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `text-xs lg:text-sm font-semibold tracking-wide transition-all relative px-2.5 py-1.5 rounded-lg ${
                    isActive
                      ? 'liquid-pill text-white border-[#E50914]/50 shadow-sm after:content-[""] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-[#E50914]'
                      : 'text-[#a3a3a3] hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/my-list"
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-xs lg:text-sm font-semibold tracking-wide transition-all relative px-2.5 py-1.5 rounded-lg ${
                  isActive
                    ? 'liquid-pill text-white border-[#E50914]/50'
                    : 'text-[#a3a3a3] hover:text-white'
                }`
              }
            >
              <Bookmark className="w-3.5 h-3.5 text-[#E50914]" />
              <span>{t.nav.myList}</span>
              {favorites.length > 0 && (
                <span className="bg-[#E50914] text-always-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {favorites.length}
                </span>
              )}
            </NavLink>
          </nav>
        </div>

        {/* Right: Search, EN ⇄ မြန်မာ Toggle, Light/Dark Liquid Glass Toggle, Surprise Me, Quiz */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <SearchBar />

          {/* Direct Burmese Unicode Toggle Pill (EN ⇄ မြန်မာ) */}
          <button
            type="button"
            onClick={toggleBurmese}
            title="Toggle English / မြန်မာဘာသာ (Burmese Unicode)"
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all border ${
              lang === 'my'
                ? 'bg-[#E50914] text-always-white border-[#E50914] shadow-lg shadow-[#E50914]/30'
                : 'liquid-pill hover:border-[#E50914]/60'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'my' ? 'မြန်မာ ✓' : 'EN / မြန်မာ'}</span>
          </button>

          {/* Liquid Glass Dark / Light Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Light and Dark Liquid Glass Mode"
            title={theme === 'dark' ? 'Switch to Light Liquid Glass' : 'Switch to Dark Liquid Glass'}
            className="liquid-pill hover:border-[#E50914]/60 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">{t.nav.themeLight || 'Light'}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden md:inline">{t.nav.themeDark || 'Dark'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={surpriseMe}
            title={t.nav.surpriseMe}
            className="hidden sm:flex items-center gap-1.5 liquid-pill hover:bg-[#E50914] hover:text-always-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{t.nav.surpriseMe}</span>
          </button>

          <button
            type="button"
            onClick={() => setQuizOpen(true)}
            title="Play Dota 2 Knowledge Quiz"
            className="flex items-center gap-1.5 bg-[#E50914]/15 hover:bg-[#E50914] text-[#E50914] hover:text-always-white border border-[#E50914]/40 text-xs font-semibold px-3 py-1.5 rounded-full transition-all backdrop-blur-md"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{t.nav.quiz}</span>
          </button>

          {/* Full 5-Language Selector Dropdown (EN, မြန်မာ, ES, RU, ZH) */}
          <div className="relative hidden lg:flex items-center">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label="Select interface language"
              className="liquid-pill text-xs px-2.5 py-1.5 rounded-full focus:outline-none cursor-pointer font-semibold"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-[#181818] text-white">
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle mobile navigation menu"
            className="xl:hidden p-2 text-white hover:text-[#E50914]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden liquid-panel border-b border-white/15 px-6 py-4 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-semibold ${
                    isActive ? 'bg-[#E50914] text-always-white' : 'liquid-pill'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/my-list"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-between ${
                  isActive ? 'bg-[#E50914] text-always-white' : 'liquid-pill'
                }`
              }
            >
              <span>{t.nav.myList}</span>
              <span className="text-xs font-bold">{favorites.length}</span>
            </NavLink>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  surpriseMe();
                }}
                className="flex items-center gap-1.5 bg-[#E50914] text-always-white text-xs font-semibold px-3 py-2 rounded-full"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>{t.nav.surpriseMe}</span>
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-1.5 liquid-pill text-xs font-semibold px-3 py-2 rounded-full"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLang(l.code)}
                  className={`px-2.5 py-1 text-xs rounded-full ${
                    lang === l.code ? 'bg-[#E50914] text-always-white font-bold' : 'liquid-pill'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div className="text-[10px] text-[#a3a3a3] pt-1">{dataSource}</div>
        </div>
      )}
    </header>
  );
}
