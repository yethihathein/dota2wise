import {
  CURATED_HEROES,
  CURATED_ITEMS,
  getHeroImage,
  getHeroIcon,
  getHeroRender,
  getItemImage,
  getAbilityImage,
} from '../data/dotaDatabase.js';

const OPENDOTA_BASE = 'https://api.opendota.com/api/constants';
const CACHE_KEY = 'dota2_dark_archive_opendota_cache_v1';
const CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

const ATTR_MAP = {
  str: 'Strength',
  agi: 'Agility',
  int: 'Intelligence',
  all: 'Universal',
};

export async function fetchAndMergeOpenDotaData() {
  // Check localStorage cache first
  try {
    const rawCache = localStorage.getItem(CACHE_KEY);
    if (rawCache) {
      const parsed = JSON.parse(rawCache);
      if (parsed && parsed.timestamp && Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        return {
          heroes: parsed.heroes,
          items: parsed.items,
          source: 'OpenDota API (Cached)',
          error: null,
        };
      }
    }
  } catch (e) {
    // Ignore storage parse error
  }

  try {
    const [heroesRes, itemsRes, heroLoreRes] = await Promise.all([
      fetch(`${OPENDOTA_BASE}/heroes`),
      fetch(`${OPENDOTA_BASE}/items`),
      fetch(`${OPENDOTA_BASE}/hero_lore`),
    ]);

    if (!heroesRes.ok || !itemsRes.ok) {
      throw new Error('OpenDota API returned non-200 status');
    }

    const [rawHeroes, rawItems, rawHeroLore] = await Promise.all([
      heroesRes.json(),
      itemsRes.json(),
      heroLoreRes.ok ? heroLoreRes.json() : Promise.resolve({}),
    ]);

    const mergedHeroes = mergeHeroes(rawHeroes, rawHeroLore);
    const mergedItems = mergeItems(rawItems);

    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          heroes: mergedHeroes,
          items: mergedItems,
        })
      );
    } catch (storageErr) {
      // Quota exceeded or private mode; safe to ignore
    }

    return {
      heroes: mergedHeroes,
      items: mergedItems,
      source: 'OpenDota Live API + Curated Lore',
      error: null,
    };
  } catch (err) {
    return {
      heroes: CURATED_HEROES,
      items: CURATED_ITEMS,
      source: 'Curated Archive Fallback',
      error: err.message || 'Using offline curated dataset',
    };
  }
}

function mergeHeroes(rawHeroes, rawHeroLore) {
  const curatedByShort = new Map();
  CURATED_HEROES.forEach((h) => {
    curatedByShort.set(h.shortName, h);
    curatedByShort.set(h.id, h);
  });

  const result = [...CURATED_HEROES];
  const existingShortNames = new Set(CURATED_HEROES.map((h) => h.shortName));

  Object.values(rawHeroes || {}).forEach((h) => {
    const shortName = (h.name || '').replace('npc_dota_hero_', '');
    if (!shortName) return;

    const loreBio = rawHeroLore?.[shortName] || '';

    if (existingShortNames.has(shortName)) {
      const idx = result.findIndex((item) => item.shortName === shortName);
      if (idx !== -1 && loreBio && !result[idx].lore.biography) {
        result[idx].lore.biography = loreBio;
      }
      return;
    }

    const attr = h.primary_attr || 'all';
    const baseStr = h.base_str || 20;
    const baseAgi = h.base_agi || 20;
    const baseInt = h.base_int || 20;

    result.push({
      id: shortName,
      opendotaId: h.id,
      npcName: h.name,
      shortName,
      name: h.localized_name || shortName,
      realName: h.localized_name || shortName,
      title: `${(h.roles || ['Hero'])[0]} of the Ancients`,
      attr,
      attrLabel: ATTR_MAP[attr] || 'Universal',
      attackType: h.attack_type || 'Melee',
      complexity: h.legs === 0 ? 2 : Math.min(3, Math.max(1, ((h.id || 1) % 3) + 1)),
      roles: h.roles || ['Carry', 'Disabler'],
      img: getHeroImage(shortName),
      icon: getHeroIcon(shortName),
      render: getHeroRender(shortName),
      baseStats: {
        hp: (h.base_health || 120) + baseStr * 22,
        mana: (h.base_mana || 75) + baseInt * 12,
        str: baseStr,
        strGain: h.str_gain || 2.4,
        agi: baseAgi,
        agiGain: h.agi_gain || 2.2,
        int: baseInt,
        intGain: h.int_gain || 2.1,
        armor: Number(((h.base_armor || 0) + baseAgi * 0.167).toFixed(1)),
        moveSpeed: h.move_speed || 300,
        attackRange: h.attack_range || 150,
        bat: h.attack_rate || 1.7,
      },
      talents: [
        { level: 25, left: '+25 All Attributes / Signature Mastery', right: '-20% Ultimate Cooldown' },
        { level: 20, left: '+15% Spell Amplification', right: '+40 Attack Speed' },
        { level: 15, left: '+300 Health', right: '+25 Movement Speed' },
        { level: 10, left: '+8 Primary Attribute', right: '+1.75 Mana Regen' },
      ],
      spells: [
        {
          id: `${shortName}_signature`,
          name: `${h.localized_name} Innate & Signature Arts`,
          img: getHeroImage(shortName),
          description: `Harnesses ${ATTR_MAP[attr] || 'Universal'} mastery as a ${h.attack_type || 'Melee'} ${(h.roles || []).join(', ')} combatant in the War of the Ancients.`,
          cooldown: '12s',
          manaCost: '90',
          scepter: 'Upgrades ultimate effectiveness and unlocks new tactical scaling with Aghanim’s Scepter.',
          shard: 'Grants an additional combat sub-ability or utility enhancement via Aghanim’s Shard.',
          notes: 'Cross-linked with standard role itemization and the War of the Ancients lore.',
        },
      ],
      lore: {
        biography:
          loreBio ||
          `${h.localized_name} was drawn into the eternal conflict between Radinthul and Diruulth after the shattering of the Mad Moon, wielding ${(h.roles || ['ancient']).join(' and ')} prowess across the river lands.`,
        origin: 'The Contested Planes of the Ancients',
        personality: 'Battle-hardened champion bound to the Nemestice cycle.',
        relationships: 'Connected to the champions of the Radiant and Dire.',
        voiceLines: [
          `"${h.localized_name} enters the fray!"`,
          '"The Ancients call, and I answer."',
          '"Victory is written in Direstone and Radiant Ore."',
        ],
      },
      recommendedItems:
        attr === 'str'
          ? ['blink', 'black_king_bar', 'overwhelming_blink', 'ultimate_scepter']
          : attr === 'agi'
          ? ['manta', 'swift_blink', 'skadi', 'black_king_bar']
          : ['blink', 'ultimate_scepter', 'sheepstick', 'arcane_blink'],
      relatedHeroes: [
        { id: 'axe', relation: 'Frontline Counterpart', note: 'Often clashes in the river objectives and Roshan pit.' },
        { id: 'invoker', relation: 'Arcane Contemporary', note: 'Shares the battlefield under the shattered Mad Moon.' },
        { id: 'rubick', relation: 'Spell Steal Target', note: 'Rubick covets their signature abilities in teamfights.' },
      ],
      connectedLore: ['lore-mad-moon', 'lore-secret-shop'],
    });
  });

  return result;
}

function mergeItems(rawItems) {
  const curatedById = new Map();
  CURATED_ITEMS.forEach((it) => {
    curatedById.set(it.id, it);
    curatedById.set(it.key, it);
  });

  const result = [...CURATED_ITEMS];
  const existingKeys = new Set(CURATED_ITEMS.map((i) => i.key));

  // Build reverse upgradesTo map from OpenDota rawItems
  const upgradesMap = {};
  Object.entries(rawItems || {}).forEach(([key, item]) => {
    if (key.startsWith('recipe_') || !item.dname) return;
    (item.components || []).forEach((comp) => {
      if (!upgradesMap[comp]) upgradesMap[comp] = new Set();
      upgradesMap[comp].add(key);
    });
  });

  Object.entries(rawItems || {}).forEach(([key, item]) => {
    if (!item || !item.dname || key.startsWith('recipe_')) return;
    if (existingKeys.has(key)) {
      // Enrich upgradesTo if OpenDota has additional upgrades
      const existing = result.find((r) => r.key === key);
      if (existing && upgradesMap[key]) {
        const mergedUpgrades = new Set([...(existing.upgradesTo || []), ...upgradesMap[key]]);
        existing.upgradesTo = Array.from(mergedUpgrades);
      }
      return;
    }

    const isNeutral = item.tier !== undefined && item.tier !== null;
    const category = isNeutral
      ? 'Neutral Items'
      : item.qual === 'consumable'
      ? 'Consumables'
      : (item.components && item.components.length > 0)
      ? 'Upgrades'
      : item.qual === 'secret_shop' || (item.cost || 0) >= 4500
      ? 'Artifacts'
      : 'Basic';

    const stats = (item.attrib || [])
      .filter((a) => a.header || a.footer)
      .slice(0, 5)
      .map((a) => `${a.header || ''} ${Array.isArray(a.value) ? a.value.join('/') : a.value || ''} ${a.footer || ''}`.trim());

    const activeAbility =
      item.abilities && item.abilities.length > 0
        ? {
            name: item.abilities[0].title || 'Item Ability',
            description: item.abilities[0].description || item.hint?.[0] || 'Grants passive and active battlefield bonuses.',
            cooldown: item.cd ? `${item.cd}s` : 'Passive',
            manaCost: item.mc ? `${item.mc}` : '0',
          }
        : item.hint && item.hint.length > 0
        ? {
            name: 'Item Effect',
            description: item.hint.join(' '),
            cooldown: item.cd ? `${item.cd}s` : 'Passive',
            manaCost: item.mc ? `${item.mc}` : '0',
          }
        : null;

    result.push({
      id: key,
      key,
      name: item.dname,
      cost: item.cost || 0,
      category,
      tier: isNeutral ? `Tier ${item.tier}` : null,
      attributes: stats.some((s) => s.toLowerCase().includes('str'))
        ? ['Strength']
        : stats.some((s) => s.toLowerCase().includes('agi'))
        ? ['Agility']
        : stats.some((s) => s.toLowerCase().includes('int') || s.toLowerCase().includes('mana'))
        ? ['Intelligence']
        : ['Utility'],
      img: getItemImage(key),
      stats,
      active: activeAbility,
      lore: item.lore || `Forged by the artisans of the Secret Shop for champions of the Ancients.`,
      tips: item.notes || 'Click any node in the Recipe Tree to inspect components or higher-tier upgrades.',
      whenToBuild: isNeutral
        ? `Available from Neutral Tokens (${ `Tier ${item.tier}` }).`
        : `Situational or core pickup costing ${(item.cost || 0).toLocaleString()} gold.`,
      components: (item.components || []).filter(Boolean),
      upgradesTo: upgradesMap[key] ? Array.from(upgradesMap[key]) : [],
      heroesWhoBuild: ['axe', 'juggernaut', 'invoker', 'rubick'],
      spellInteractions: [],
      connectedLore: ['lore-secret-shop', 'lore-mad-moon'],
    });
  });

  return result;
}
