# ANCIENTS.IO — Dota 2 Dark Encyclopedia

A fan-made, all-in-one **Dota 2 Knowledge & Lore Encyclopedia** designed with a Netflix Dark UI (`#141414` background, `#E50914` red accents, and `dark.netflix.io`-inspired interconnected mystery graphs).

---

## ✨ Key Features

1. **Netflix Dark Streaming Catalog UI**
   - Pure dark theme (`#141414`), white typography, muted gray metadata (`#a3a3a3`), and Netflix red (`#E50914`) highlights.
   - Transparent-to-dark top `Navbar` that turns solid on scroll, featuring brand logo, navigation links (`Home`, `Heroes`, `Items`, `Lore`, `Map`, `Search`, `My List`), `"Surprise Me"` randomizer, Shopkeeper's Quiz trigger, i18n language selector (`EN`, `ES`, `RU`, `ZH`), and live global `SearchBar`.
   - Full-width `HeroBanner` with bottom/left vignette fades, rotating spotlights, and `"Explore"` + `"More Info"` CTAs.
   - Horizontal scrolling `Row` carousels where `Card` components scale smoothly (`scale(1.1)`) on hover and reveal a mini info panel.

2. **Items & Interactive Recipe Tree (`/items`)**
   - Covers Basic components, Upgrades, Artifacts, Consumables, Neutral Items (Tier 1–5), and Roshan Drops (`Aegis of the Immortal`, `Cheese`, `Refresher Shard`).
   - **Interactive Visual Recipe Tree (`RecipeTree.jsx`)**: displays `"Built From (Components)"` → `"Selected Item"` → `"Upgrades Into"` (e.g. `Blink Dagger → Overwhelming Blink / Swift Blink / Arcane Blink`). Clicking any node navigates directly to that item.
   - Multi-faceted filters: Category, Gold Price Range, Attribute, and Hero Builder.

3. **Heroes, Spells, Talent Trees & Voice Lines (`/heroes`)**
   - Integrates live with the **OpenDota Constants API** (`/api/constants/heroes`, `/items`, `/hero_lore`) and caches in `localStorage`, merged with rich curated hero profiles.
   - Displays Valve CDN portraits, Primary Attribute (`Strength`, `Agility`, `Intelligence`, `Universal`), Roles, Attack Type, Complexity (`1–3`), Base Stats, and **Level 10 / 15 / 20 / 25 Talent Trees**.
   - Full Spell breakdown with Valve CDN ability icons, cooldowns, mana costs, **Aghanim's Scepter** & **Aghanim's Shard** upgrade badges, biography, relationships, and playable in-game voice-line quotes.

4. **World Lore, Timeline & Relationship Graph (`/lore`)**
   - Chronicles the Primordial Mind, the Four Fundamentals, the Shattering of the Mad Moon (`Radinthul` & `Diruulth`), the Nemestice Storm, the Continuum Vault, the Secret Shop Covenant, Roshan's Curse, Icewrack, Turstarkuri, and the Isle of Masks.
   - **Chronological Timeline (`LoreTimeline.jsx`)** & **Interactive SVG Relationship Graph (`RelationshipGraph.jsx`)** linking `Heroes ↔ Factions ↔ Locations ↔ Artifacts`.

5. **Interactive Tactical & Lore Map (`/map`)**
   - Interactive Radiant vs. Dire battlefield map with clickable Points of Interest (Twin Roshan Pits, Tormentors, Secret Shops, Lotus Pools, Radiant & Dire Ancients) cross-linked to heroes, items, and lore.

6. **Global Features**
   - Live Global Search (`Ctrl+K`) across Heroes, Items, Spells, and Lore.
   - **Favorites ("My List")** persisted in `localStorage`.
   - **"Surprise Me"** random entry explorer.
   - **Interactive Shopkeeper's Quiz** (`QuizModal.jsx`) with streak counter and hints.
   - **i18n-Ready Structure** supporting English (`EN`), Español (`ES`), Русский (`RU`), and 中文 (`ZH`).

---

## 📁 Folder Structure

```text
├── index.html                      # Entry HTML (works both with Vite and standalone in browser)
├── package.json                    # Dependencies & scripts (React 18, React Router v6, Tailwind, Vite)
├── vite.config.js                  # Vite configuration with vendor code-splitting
├── tailwind.config.js              # Tailwind CSS configuration (Netflix Dark palette)
├── README.md                       # Setup instructions & documentation
└── src/
    ├── main.jsx                    # React DOM entry point
    ├── App.jsx                     # Root Router with lazy-loaded routes & global modals
    ├── styles.css                  # Netflix Dark theme variables, gradients & card hover physics
    ├── i18n/
    │   └── translations.js         # Multi-language dictionary (EN, ES, RU, ZH)
    ├── data/
    │   └── dotaDatabase.js         # Curated Heroes, Items, Recipe Trees, Lore, Graph, Map POIs & Quiz
    ├── services/
    │   └── opendota.js             # Live OpenDota API fetcher, merger & localStorage cache
    ├── context/
    │   └── AppContext.jsx          # Global state (OpenDota sync, My List favorites, Modal, i18n)
    ├── components/
    │   ├── Navbar.jsx              # Transparent-to-solid scroll navbar
    │   ├── HeroBanner.jsx          # Full-width hero spotlight banner
    │   ├── Row.jsx                 # Horizontal scrolling Netflix carousel
    │   ├── Card.jsx                # Hover-zoom card with mini info panel
    │   ├── DetailModal.jsx         # Tabbed entity detail modal with cross-links everywhere
    │   ├── RecipeTree.jsx          # Interactive visual item component & upgrade graph
    │   ├── LoreTimeline.jsx        # Chronological Eon timeline
    │   ├── RelationshipGraph.jsx   # Dark.netflix.io-style SVG node relationship network
    │   ├── SearchBar.jsx           # Live global search with categorized suggestions
    │   ├── QuizModal.jsx           # Guess the Hero / Item / Lore trivia game
    │   └── Footer.jsx              # Footer with Valve trademark disclaimer
    └── pages/
        ├── HomePage.jsx            # Streaming catalog home page
        ├── ItemsPage.jsx           # Items catalog + interactive Recipe Tree + filters
        ├── HeroesPage.jsx          # Heroes catalog + attribute/role/complexity filters
        ├── LorePage.jsx            # World lore + Timeline + Relationship Graph
        ├── MapPage.jsx             # Interactive battlefield & lore map
        ├── SearchPage.jsx          # Full-page search results
        └── MyListPage.jsx          # Saved Favorites ("My List")
```

---

## 🚀 Setup & Running Instructions

### Option 1: Standard Vite Development Server (Node.js)
```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Build for production
npm run build
```

### Option 2: Instant Zero-Build Browser Mode
You can also open `index.html` directly in any modern browser (or serve the directory with any static server such as `python -m http.server 8080`).

---

## ⚖️ Disclaimer
Fan-made project. Dota 2 and all related assets are trademarks of Valve Corporation. Not affiliated with Valve.
