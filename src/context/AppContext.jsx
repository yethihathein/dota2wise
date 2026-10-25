import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  CURATED_HEROES,
  CURATED_ITEMS,
  LORE_ENTRIES,
  MAP_POIS,
  RELATIONSHIP_GRAPH,
  QUIZ_QUESTIONS,
  FEATURED_BANNERS,
} from '../data/dotaDatabase.js';
import { fetchAndMergeOpenDotaData } from '../services/opendota.js';
import { TRANSLATIONS, BURMESE_CONTENT } from '../i18n/translations.js';

const AppContext = createContext(null);

const FAVORITES_STORAGE_KEY = 'dota2_dark_mylist_v1';
const LANG_STORAGE_KEY = 'dota2_dark_lang_v1';
const THEME_STORAGE_KEY = 'dota2_liquid_theme_v1';

try {
  localStorage.removeItem('cineglass_os_media_v1');
  localStorage.removeItem('cineglass_os_theme_v1');
} catch {}

const ATTR_MY = {
  str: 'ခွန်အား (Strength)',
  agi: 'လျင်မြန်မှု (Agility)',
  int: 'ဉာဏ်ပညာ (Intelligence)',
  all: 'ဘက်စုံ (Universal)',
};

export function AppProvider({ children }) {
  const [rawHeroes, setRawHeroes] = useState(CURATED_HEROES);
  const [rawItems, setRawItems] = useState(CURATED_ITEMS);
  const [rawLore] = useState(LORE_ENTRIES);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('Loading OpenDota Constants...');
  const [apiError, setApiError] = useState(null);

  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem(LANG_STORAGE_KEY) || 'en';
    } catch {
      return 'en';
    }
  });

  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    const rootEl = document.documentElement;
    if (theme === 'light') {
      rootEl.classList.remove('dark');
      rootEl.classList.add('light');
    } else {
      rootEl.classList.remove('light');
      rootEl.classList.add('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved
        ? JSON.parse(saved).filter((f) => f.type !== 'lore')
        : [
            { type: 'hero', id: 'invoker' },
            { type: 'item', id: 'blink' },
            { type: 'hero', id: 'juggernaut' },
          ];
    } catch {
      return [];
    }
  });

  const [activeModal, setActiveModal] = useState(null);
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchAndMergeOpenDotaData().then((res) => {
      if (!mounted) return;
      setRawHeroes(res.heroes);
      setRawItems(res.items);
      setDataSource(res.source);
      setApiError(res.error);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const setLang = useCallback((code) => {
    setLangState(code);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, code);
    } catch {}
  }, []);

  const toggleBurmese = useCallback(() => {
    setLang(lang === 'my' ? 'en' : 'my');
  }, [lang, setLang]);

  // Localize Heroes, Items, Lore, and Featured Banners when Burmese ('my') is active
  const heroes = useMemo(() => {
    if (lang !== 'my') return rawHeroes;
    return rawHeroes.map((h) => {
      const myHero = BURMESE_CONTENT.heroes[h.id];
      return {
        ...h,
        attrLabel: ATTR_MY[h.attr] || h.attrLabel,
        title: myHero?.title || `${h.name} — ရှေးဟောင်းကျောက်တိုင်ကြီးများ၏ သူရဲကောင်း`,
        lore: {
          ...h.lore,
          biography:
            myHero?.biography ||
            `${h.name} သည် Mad Moon ပေါက်ကွဲပြီးနောက် Radiant နှင့် Dire တို့၏ ထာဝရစစ်ပွဲကြီးအတွင်းသို့ ဝင်ရောက်လာခဲ့သော ${ATTR_MY[h.attr] || ''} သူရဲကောင်းတစ်ဦးဖြစ်သည်။`,
          origin: myHero?.origin || h.lore?.origin,
          personality: myHero?.personality || h.lore?.personality,
          relationships: myHero?.relationships || h.lore?.relationships,
        },
      };
    });
  }, [rawHeroes, lang]);

  const items = useMemo(() => {
    if (lang !== 'my') return rawItems;
    return rawItems.map((it) => {
      const myItem = BURMESE_CONTENT.items[it.id] || BURMESE_CONTENT.items[it.key];
      return {
        ...it,
        lore:
          myItem?.lore ||
          it.lore ||
          'လျှို့ဝှက်ဆိုင်တော် (Secret Shop) မှ သွန်းလုပ်ထားသော အစွမ်းထက် စစ်ပွဲဝင်ရတနာဖြစ်သည်။',
        tips:
          myItem?.tips ||
          'Recipe Tree မှ ပစ္စည်းတစ်ခုချင်းစီကို နှိပ်၍ ပါဝင်သောပစ္စည်းများနှင့် အဆင့်မြှင့်တင်မှုများကို ကြည့်ရှုနိုင်ပါသည်။',
        whenToBuild: myItem?.whenToBuild || it.whenToBuild,
      };
    });
  }, [rawItems, lang]);

  const lore = useMemo(() => {
    if (lang !== 'my') return rawLore;
    return rawLore.map((l) => {
      const myLore = BURMESE_CONTENT.lore[l.id];
      if (!myLore) return l;
      return {
        ...l,
        title: myLore.title || l.title,
        era: myLore.era || l.era,
        subtitle: myLore.subtitle || l.subtitle,
        summary: myLore.summary || l.summary,
        fullText: myLore.fullText || l.fullText,
      };
    });
  }, [rawLore, lang]);

  const featuredBanners = useMemo(() => {
    if (lang !== 'my') return FEATURED_BANNERS;
    return FEATURED_BANNERS.map((b) => {
      const myB = BURMESE_CONTENT.banners[b.id];
      if (!myB) return b;
      return {
        ...b,
        badge: myB.badge,
        title: myB.title,
        subtitle: myB.subtitle,
        description: myB.description,
        tags: myB.tags,
      };
    });
  }, [lang]);

  const toggleFavorite = useCallback((type, id) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.type === type && f.id === id);
      const next = exists
        ? prev.filter((f) => !(f.type === type && f.id === id))
        : [...prev, { type, id }];
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (type, id) => favorites.some((f) => f.type === type && f.id === id),
    [favorites]
  );

  const getHeroById = useCallback(
    (id) =>
      heroes.find(
        (h) => h.id === id || h.shortName === id || h.npcName === `npc_dota_hero_${id}`
      ),
    [heroes]
  );

  const getItemById = useCallback(
    (id) => items.find((i) => i.id === id || i.key === id),
    [items]
  );

  const getLoreById = useCallback(
    (id) => lore.find((l) => l.id === id),
    [lore]
  );

  const openEntity = useCallback((type, id) => {
    if (!type || !id) return;
    setActiveModal({ type, id });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const surpriseMe = useCallback(() => {
    const pools = [
      ...CURATED_HEROES.map((h) => ({ type: 'hero', id: h.id })),
      ...CURATED_ITEMS.map((i) => ({ type: 'item', id: i.id })),
    ];
    const randomPick = pools[Math.floor(Math.random() * pools.length)];
    if (randomPick) {
      setActiveModal(randomPick);
    }
  }, []);

  const t = useMemo(() => TRANSLATIONS[lang] || TRANSLATIONS.en, [lang]);

  const value = useMemo(
    () => ({
      heroes,
      items,
      lore,
      mapPois: MAP_POIS,
      relationshipGraph: RELATIONSHIP_GRAPH,
      quizQuestions: QUIZ_QUESTIONS,
      featuredBanners,
      loading,
      dataSource,
      apiError,
      lang,
      setLang,
      toggleBurmese,
      theme,
      toggleTheme,
      t,
      favorites,
      toggleFavorite,
      isFavorite,
      getHeroById,
      getItemById,
      getLoreById,
      activeModal,
      openEntity,
      closeModal,
      quizOpen,
      setQuizOpen,
      surpriseMe,
    }),
    [
      heroes,
      items,
      lore,
      featuredBanners,
      loading,
      dataSource,
      apiError,
      lang,
      setLang,
      toggleBurmese,
      theme,
      toggleTheme,
      t,
      favorites,
      toggleFavorite,
      isFavorite,
      getHeroById,
      getItemById,
      getLoreById,
      activeModal,
      openEntity,
      closeModal,
      quizOpen,
      surpriseMe,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
