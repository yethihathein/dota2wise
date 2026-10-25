import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner.jsx';
import Row from '../components/Row.jsx';
import RecipeTree from '../components/RecipeTree.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function HomePage() {
  const {
    heroes,
    items,
    lore,
    favorites,
    getHeroById,
    getItemById,
    getLoreById,
    loading,
    t,
  } = useApp();
  const navigate = useNavigate();

  const favoriteEntities = useMemo(() => {
    return favorites
      .map((f) => {
        if (f.type === 'hero') {
          const h = getHeroById(f.id);
          return h ? { ...h, type: 'hero' } : null;
        }
        if (f.type === 'item') {
          const i = getItemById(f.id);
          return i ? { ...i, type: 'item' } : null;
        }
        return null;
      })
      .filter(Boolean);
  }, [favorites, getHeroById, getItemById]);

  const strHeroes = useMemo(() => heroes.filter((h) => h.attr === 'str').slice(0, 18), [heroes]);
  const agiHeroes = useMemo(() => heroes.filter((h) => h.attr === 'agi').slice(0, 18), [heroes]);
  const intUniHeroes = useMemo(
    () => heroes.filter((h) => h.attr === 'int' || h.attr === 'all').slice(0, 18),
    [heroes]
  );

  const coreItems = useMemo(
    () => items.filter((i) => i.category === 'Upgrades' || i.category === 'Artifacts').slice(0, 16),
    [items]
  );
  const roshanAndNeutral = useMemo(
    () =>
      items
        .filter((i) => i.category === 'Roshan Drops' || i.category === 'Neutral Items')
        .slice(0, 16),
    [items]
  );

  const blinkItem = getItemById('blink');

  return (
    <div className="min-h-screen liquid-page">
      <HeroBanner />

      <div className="-mt-10 relative z-20 space-y-2">
        {/* Skeleton Loader Row when fetching live OpenDota constants */}
        {loading && (
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-4">
            <div className="h-5 w-48 nf-skeleton rounded mb-3" />
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="w-60 h-52 nf-skeleton rounded-md shrink-0" />
              ))}
            </div>
          </div>
        )}

        {favoriteEntities.length > 0 && (
          <Row
            title={t.rows.myList}
            subtitle="Your personal bookmarked Heroes, Artifacts, and Lore Chronicles"
            items={favoriteEntities}
            onSeeAll={() => navigate('/my-list')}
          />
        )}

        <Row
          title={t.rows.strHeroes}
          subtitle="High-health initiators, durable frontliners, and brawler warlords"
          items={strHeroes}
          type="hero"
          onSeeAll={() => navigate('/heroes?attr=str')}
        />

        <Row
          title={t.rows.coreItems}
          subtitle="Ascended Secret Shop weapons, Blink upgrades, and game-defining relics"
          items={coreItems}
          type="item"
          onSeeAll={() => navigate('/items')}
        />

        <Row
          title={t.rows.agiHeroes}
          subtitle="Relentless physical damage dealers, elusive assassins, and illusion masters"
          items={agiHeroes}
          type="hero"
          onSeeAll={() => navigate('/heroes?attr=agi')}
        />

        <Row
          title={t.rows.roshanNeutral}
          subtitle="Aegis of the Immortal, Cheese, Refresher Shard, and Tier 5 Neutral artifacts"
          items={roshanAndNeutral}
          type="item"
          onSeeAll={() => navigate('/items?cat=Roshan+Drops')}
        />

        <Row
          title={t.rows.intUniHeroes}
          subtitle="Grand Magi, elemental spellweavers, and Universal tacticians"
          items={intUniHeroes}
          type="hero"
          onSeeAll={() => navigate('/heroes?attr=int')}
        />

        {/* Interactive Recipe Tree Spotlight on Home Page */}
        {blinkItem && (
          <section className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-6 pb-4">
            <RecipeTree item={blinkItem} />
          </section>
        )}
      </div>
    </div>
  );
}
