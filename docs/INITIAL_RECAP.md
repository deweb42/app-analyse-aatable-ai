# Spécification Technique Complète — Online Health Grade App

## Document destiné à : 1 Dev Frontend · 1 Dev Backend · 1 Designer

---

## TABLE DES MATIÈRES

1. [Vue d'ensemble de l'application](#1-vue-densemble)
2. [Architecture des données & Système de notation](#2-architecture-des-données--système-de-notation)
3. [Layout global](#3-layout-global)
4. [SIDEBAR GAUCHE — Score Panel (fixe)](#4-sidebar-gauche--score-panel)
5. [ZONE PRINCIPALE — Section Hero (3 cartes)](#5-zone-principale--section-hero)
6. [ZONE PRINCIPALE — "This is how you're doing online" (Keyword Rankings)](#6-keyword-rankings)
7. [ZONE PRINCIPALE — Audit détaillé "40 things reviewed"](#7-audit-détaillé)
8. [Section 1 : Search Results (28/40)](#8-section-1--search-results)
9. [Section 2 : Guest Experience (9/40)](#9-section-2--guest-experience)
10. [Section 3 : Local Listings (16/20)](#10-section-3--local-listings)
11. [Bannière CTA finale](#11-bannière-cta-finale)
12. [Résumé complet des critères & système de notation](#12-résumé-complet-des-critères)
13. [Notes pour le Designer](#13-notes-designer)
14. [Notes pour le Dev Backend](#14-notes-backend)
15. [Notes pour le Dev Frontend](#15-notes-frontend)

---

## 1. VUE D'ENSEMBLE

L'application est un **audit de santé en ligne pour restaurants**. Elle analyse le site web, le SEO, l'expérience utilisateur et les fiches locales (Google Business Profile) d'un restaurant, puis attribue un score global sur 100 avec un détail par catégorie.

**URL analysée dans l'exemple** : `feastbuffetrenton.com` (Feast Buffet, Renton WA)

**Score global** : 53/100 — Grade "Poor"

**Décomposition** :
- Search Results : 28/40 (Fair)
- Guest Experience (appelé "Website Experience" dans la sidebar) : 9/40 (Poor)
- Local Listings : 16/20 (Fair)

---

## 2. ARCHITECTURE DES DONNÉES & SYSTÈME DE NOTATION

### 2.1 Score global

| Champ | Valeur |
|-------|--------|
| Score total | Somme des 3 sous-scores |
| Maximum | 100 |
| Formule | `search_results + guest_experience + local_listings` |

### 2.2 Grades

| Plage de score | Grade | Couleur |
|----------------|-------|---------|
| 0–39 | Poor | Rouge (#E53935 ou similaire) |
| 40–69 | Fair | Orange (#F9A825 ou similaire) |
| 70–89 | Good | Vert clair (à définir) |
| 90–100 | Excellent | Vert foncé (à définir) |

> **Note** : Les seuils exacts pour Good/Excellent ne sont pas visibles dans les screenshots (le score est 53). Le Designer doit définir les seuils précis.

### 2.3 Sous-scores

| Section | Max | Nombre de critères | 1 critère = X points |
|---------|-----|-------------------|----------------------|
| Search Results | 40 | 40 critères | 1 point par critère |
| Guest Experience | 40 | 40 critères | 1 point par critère |
| Local Listings | 20 | 20 critères | 1 point par critère |
| **TOTAL** | **100** | **100 critères** | — |

### 2.4 États possibles par critère

Chaque critère a exactement **un** des états suivants :

| État | Icône | Couleur | Score | Signification |
|------|-------|---------|-------|---------------|
| Pass | ✅ Cercle coché | Bleu/Vert (#4CAF50) | +1 point | Le critère est satisfait |
| Fail | ❌ Cercle croix | Rouge (#E53935) | +0 point | Le critère n'est PAS satisfait |
| Warning/Loading | 🟡 Cercle jaune | Jaune/Orange (#FFC107) | +0 point (en attente) | "Working on finding this data..." |

### 2.5 Structure de données d'un critère (Backend)

```json
{
  "id": "using_custom_domain",
  "section": "search_results",
  "subsection": "domain",
  "label": "Using custom domain",
  "description": "The business has and controls its own domain name instead of linking to a third-party website",
  "status": "pass",           // "pass" | "fail" | "loading"
  "what_we_found": "http://feastbuffetrenton.com",
  "what_we_were_looking_for": ["doordash.com", "ubereats.com", ...],
  "expandable": true,
  "expanded_by_default": false
}
```

---

## 3. LAYOUT GLOBAL

```
┌──────────────┬──────────────────────────────────────────────┐
│              │                                              │
│   SIDEBAR    │            ZONE PRINCIPALE                   │
│   (fixe,     │            (scrollable)                      │
│   ~260px)    │                                              │
│              │  ┌─────────┬──────────┬──────────┐           │
│  Score 53    │  │ Perte $ │ Compétit.│ Carrousel│  ← Hero   │
│  /100        │  └─────────┴──────────┴──────────┘           │
│  Poor        │                                              │
│              │  ── "This is how you're doing online" ──     │
│              │                                              │
│  28/40       │  [Keyword 1] [Keyword 2] ... [Keyword 9]    │
│  9/40        │                                              │
│  16/20       │  ── "40 things reviewed, 7 need work" ──    │
│              │                                              │
│  [Fix btn]   │  Section 1: Search Results (28/40)           │
│              │  Section 2: Guest Experience (9/40)           │
│              │  Section 3: Local Listings (16/20)            │
│              │                                              │
│              │  [Bannière CTA]                              │
└──────────────┴──────────────────────────────────────────────┘
```

---

## 4. SIDEBAR GAUCHE — Score Panel

### 4.1 Conteneur

- **Largeur** : ~260px fixe
- **Fond** : Rose très pâle / blanc cassé (#FFF5F5 ou #FEF0F0)
- **Position** : `position: sticky; top: 0; height: 100vh;`
- **Scroll** : Pas de scroll, la sidebar est fixe

### 4.2 Score circulaire (centré)

- **Type** : Arc de cercle SVG ou Canvas
- **Diamètre** : ~180px
- **Track de fond** : Gris clair (#E0E0E0), cercle complet, ~8px d'épaisseur
- **Arc de progression** : Dégradé rouge → orange, épaisseur ~8px, `stroke-linecap: round`
- **Point de départ** : 12h (en haut), sens horaire
- **Pourcentage rempli** : `score / 100` (ici 53%)
- **Texte au centre** :
  - "53" — Noir, bold, ~48-56px
  - "/ 100" — Gris (#9E9E9E), ~14px, juste en dessous
- **Sous le cercle** :
  - "Online health grade" — Gris (#757575), ~12px, centré
  - "Poor" — Noir, bold, ~18px, centré

### 4.3 Sous-scores (3 items empilés)

Position : en bas de la sidebar, au-dessus du bouton CTA.

Chaque item :
```
┌──────────────────────────────────────┐
│  (○)  Search Results          28/40  │
│       Fair                           │
└──────────────────────────────────────┘
```

- **Icône gauche** : Petit cercle (~24px) avec mini arc de progression (même style que le grand cercle mais en miniature)
- **Texte principal** : "Search Results" — Noir, ~14px, semibold
- **Grade** : "Fair" — Couleur orange ou "Poor" en rouge, ~12px
- **Score** : "28/40" — Noir, ~14px, aligné à droite

Les 3 sous-scores :

| Label sidebar | Score | Grade | Couleur grade |
|---------------|-------|-------|---------------|
| Search Results | 28/40 | Fair | Orange |
| Website Experience | 9/40 | Poor | Rouge |
| Local Listings | 16/20 | Fair | Orange |

### 4.4 Bouton CTA

- **Texte** : "Fix in 35 seconds"
- **Icône** : Sparkle/étoile ✨ à gauche du texte
- **Style** : Fond noir, texte blanc, pleine largeur (~240px), coins arrondis (~8px), padding ~12px 16px
- **Position** : Tout en bas de la sidebar, avec un petit margin-bottom

---

## 5. ZONE PRINCIPALE — Section Hero (3 cartes en ligne)

### 5.1 Layout

3 cartes côte à côte, même hauteur, gap ~16px entre elles.

### 5.2 Carte 1 — Alerte perte de revenus

```
┌────────────────────────────────────┐
│                                    │
│  You could be losing               │
│  ~$1,615/month due to 1 problem   │
│                                    │
│  (avatar)  Feast Buffet            │
│            feastbuffetrenton.com    │
│                                    │
│  ⚠️ Website is missing a           │
│     compelling story               │
└────────────────────────────────────┘
```

- **Fond** : Blanc
- **Coins** : Arrondis ~12px
- **Ombre** : Box-shadow légère
- **Titre** : "You could be losing ~$1,615/month due to 1 problem" — Noir, bold, ~18-20px
- **Info restaurant** :
  - Avatar/logo circulaire (~48px)
  - Nom "Feast Buffet" — bold, ~14px
  - URL "feastbuffetrenton.com" — gris, ~12px
- **Alerte** : Icône ⚠️ triangle rouge/orange + texte "Website is missing a compelling story" — rouge/orange, ~13px

### 5.3 Carte 2 — Classement concurrents

```
┌────────────────────────────────────┐
│  You're ranking below 8            │
│  competitors                       │
│                                    │
│  🍴 Din Tai Fung 鼎泰豐  4.6⭐ 1st│
│  🍴 MR. DIM SUM         4.1⭐ 2nd│
│  🍴 PHO BOX              4.7⭐ 3rd│
│  🍴 Seatango/Spice Brid  4.7⭐ 4th│
│  🍴 P.F. Chang's - SEA   4.8⭐ 5th│
│  ... (scroll pour voir 6-8)        │
│                                    │
│  🔴 Feast Buffet          4.1  9th │
└────────────────────────────────────┘
```

- **Titre** : "You're ranking below 8 competitors" — Noir, bold, ~18px
- **Liste des concurrents** (scrollable verticalement dans la carte) :

| # | Nom | Note | Rang |
|---|-----|------|------|
| 1 | Din Tai Fung 鼎泰豐 | 4.6 ⭐ | 1st |
| 2 | MR. DIM SUM | 4.1 ⭐ | 2nd |
| 3 | PHO BOX | 4.7 ⭐ | 3rd |
| 4 | Seatango/Spice Bridge | 4.7 ⭐ | 4th |
| 5 | P. F. Chang's - SEA | 4.8 ⭐ | 5th |
| 6 | The Lemongrass | 4.3 ⭐ | 6th |
| 7 | Supreme Dumplings (Bellevue) | 4.6 ⭐ | 7th |
| 8 | Dim Sum House | 4.4 ⭐ | 8th |
| **9** | **Feast Buffet** | **4.1** | **9th** |

- Chaque ligne : icône couverts (gris/violet) + nom + note avec étoile jaune + rang aligné à droite
- La ligne du restaurant audité (Feast Buffet, 9th) est visuellement distincte (surlignée ou séparée)

### 5.4 Carte 3 — Carrousel "Why fix these?"

- **Type** : Carrousel avec pagination par dots
- **Fond** : Image plein cadre (photo du restaurant success story)
- **Overlay** : Dégradé sombre semi-transparent pour lisibilité
- **Titre** : "Why fix these?" — Blanc, bold, ~16px, en haut
- **Texte success story** : Blanc, ~14px

Les 3 slides :

| Slide | Texte |
|-------|-------|
| 1 | "Cyclo Noodles had a health score of 37. They grew direct online sales by 7X by increasing their score to 92." |
| 2 | "Talkin' Tacos had a 46 health score. By improving their score to 95, they drove $120,000/month in sales." |
| 3 | "Saffron had a health score of 43. They grew online sales by $171,400/month by increasing their score to 96." |

- **Pagination** : Dots blancs en bas, dot actif plus large ou plus opaque
- **Navigation** : Auto-slide ou swipe/click

---

## 6. KEYWORD RANKINGS — "This is how you're doing online"

### 6.1 En-tête

- **Titre** : "This is how you're doing online" — Noir, bold, ~22px
- **Sous-titre** : "Where you are showing up when customers search you, next to your competitors" — Gris, ~14px

### 6.2 Structure par mot-clé

Il y a **9 mots-clés** au total. Chacun est un bloc collapsible/expandable.

**Liste complète des 9 mots-clés** :

| # | Mot-clé | #1 (winner) | Statut Map Pack | Statut Organic |
|---|---------|-------------|-----------------|----------------|
| 1 | Best asian food in Renton | Wild Ginger Teriyaki | Unranked | Unranked |
| 2 | Best asian food in Tukwila | Din Tai Fung 鼎泰豐 | Unranked | Unranked |
| 3 | Best asian food in SeaTac | P. F. Chang's - SEA | Unranked | Unranked |
| 4 | Best dim sum in Renton | Din Tai Fung 鼎泰豐 | Unranked | Unranked |
| 5 | Best dim sum in Tukwila | MR. DIM SUM | Unranked | Unranked |
| 6 | Best dim sum in SeaTac | Din Tai Fung 鼎泰豐 | Unranked | Unranked |
| 7 | Best soup in Renton | PHO BOX | Unranked | Unranked |
| 8 | Best soup in Tukwila | Juba Restaurant & Café | Unranked | Unranked |
| 9 | Best soup in SeaTac | Aunt Becky's Deli | Unranked | Unranked |

### 6.3 Ligne de résumé par mot-clé (état collapsé)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  🔍  Best asian food in Renton    🏆 #1: Wild Ginger Teriyaki           │
│                                   [Unranked map pack] [Unranked organic] │
│                                                                    ▼     │
└──────────────────────────────────────────────────────────────────────────┘
```

- **Icône Google** : Logo Google "G" multicolore à gauche
- **Mot-clé** : Texte noir bold, ~16px
- **Winner** : 🏆 "#1: [nom du restaurant]" — Texte gris/noir, ~13px
- **Badges** :
  - "Unranked map pack" — Badge fond bleu (#2196F3), texte blanc, coins arrondis, ~11px
  - "Unranked organic" — Badge fond rouge/orange (#F44336), texte blanc, coins arrondis, ~11px
- **Chevron** : Icône ▼ ou ▲ pour expand/collapse, alignée à droite

### 6.4 Contenu expandé par mot-clé (2 colonnes)

```
┌──────────────────────────────┬──────────────────────────────┐
│  Google Maps results          │  Google Search results        │
│  These results get the most   │  You are Unranked             │
│  clicks                       │                               │
│                               │  🔴 www.yelp.com              │
│  ┌────────────┐ Top 3 map     │     TOP 10 BEST Asian...      │
│  │            │ results       │  🟢 www.tripadvisor.com        │
│  │  (Google   │               │     THE 10 BEST Asian...       │
│  │   Map)     │ 🍴 Wild Gin.. │  🔵 www.facebook.com           │
│  │            │  ⭐ 1st        │     Best chinese rest...        │
│  │            │ 🍴 Ocha Thai  │  dtf.com                       │
│  │            │  ⭐ 2nd        │     Bellevue Restaurant         │
│  │            │ 🍴 PHO BOX    │  ...                            │
│  └────────────┘  ⭐ 3rd        │                               │
└──────────────────────────────┴──────────────────────────────┘
```

**Colonne gauche — Google Maps results** :

- **Titre** : "Google Maps results" — Noir, bold, ~16px
- **Sous-titre** : "These results get the most clicks" — Gris, ~12px
- **Carte Google Maps** : Image statique ou embed, ~200x180px, fond bleu clair avec watermark "Google"
- **"Top 3 map results"** : Label gris, ~12px
- **Liste** : 3 résultats avec icône couverts + nom + ⭐ + rang (1st, 2nd, 3rd)

**Colonne droite — Google Search results** :

- **Titre** : "Google Search results" — Noir, bold, ~16px
- **Sous-titre** : "You are Unranked" — Gris/rouge, ~12px
- **Liste de résultats organiques** : Chaque résultat a :
  - Favicon du site (petite icône ~16px)
  - URL du domaine en gris (~11px)
  - Titre de la page en noir/bleu (~13px)
- Nombre variable de résultats (5 à 9 par mot-clé)

### 6.5 Données complètes par mot-clé

**(Mot-clé 1) Best asian food in Renton**

Top 3 Maps : Wild Ginger Teriyaki (1st), Ocha Thai Kitchen and Bar (2nd), PHO BOX (3rd)

Résultats organiques :
1. www.yelp.com — "TOP 10 BEST Asian Food in Renton, WA - Updated 2026"
2. www.tripadvisor.com — "THE 10 BEST Asian Restaurants in Renton (Updated 2026)"
3. www.facebook.com — "Best chinese restaurants near Renton?"
4. dtf.com — "Bellevue Restaurant"
5. www.tripadvisor.com — "LITTLE PEKING, Renton - Restaurant Reviews, Photos & ..."

**(Mot-clé 2) Best asian food in Tukwila**

Top 3 Maps : Din Tai Fung 鼎泰豐 (1st), Seatango/Spice Bridge (2nd), Shinya Shokudō (3rd)

Résultats organiques :
1. www.yelp.com — "TOP 10 BEST Asian Restaurants in Tukwila, WA"
2. www.tripadvisor.com — "THE 10 BEST Asian Restaurants in Tukwila (Updated 2026)"
3. wanderlog.com — "The 25 best Asian food in Tukwila"
4. seattle.eater.com — "The Best Chinese and Taiwanese Restaurants in Seattle"
5. www.opentable.com — "22 Best Asian Restaurants In Seattle"
6. www.quora.com — "What are some of the best Asian restaurants in Seattle?"
7. www.reddit.com — "Any good Asian Food courts in the Eastside?"
8. www.yelp.com — "MAYFLOWER OF CHINA RESTAURANT - Chinese"

**(Mot-clé 3) Best asian food in SeaTac**

Top 3 Maps : P. F. Chang's - SEA (1st), Din Tai Fung 鼎泰豐 (2nd), Angkor Bar & Grill (3rd)

Résultats organiques :
1. www.yelp.com — "TOP 10 BEST Asian Food in Seatac, WA - Updated 2026"
2. www.tripadvisor.com — "THE 5 BEST Asian Restaurants in SeaTac (Updated 2026)"
3. www.reddit.com — "Best new Asian or interesting restaurants : r/Seattle"
4. www.opentable.com — "22 Best Asian Restaurants In Seattle"
5. seattle.eater.com — "The 14 Best Asian Restaurants Where Bellevue Meets ..."
6. www.fodors.com — "Any suggestions for really good Asian food in Seattle?"
7. dtf.com — "Bellevue Restaurant"

**(Mot-clé 4) Best dim sum in Renton**

Top 3 Maps : Din Tai Fung 鼎泰豐 (1st), MR. DIM SUM (2nd), Supreme Dumplings (Bellevue) (3rd)

Résultats organiques :
1. www.yelp.com — "THE BEST 10 DIM SUM RESTAURANTS in RENTON, WA"
2. www.yelp.com — "Triumph Valley - Restaurant Reviews"
3. www.tripadvisor.com — "THE BEST Dim Sum in Renton (Updated November 2025)"
4. www.reddit.com — "Best dim sum in the greater Seattle area?"
5. dtf.com — "Din Tai Fung - Tukwila Restaurant"
6. www.tripadvisor.com — "TRIUMPH VALLEY, Renton - Photos & Restaurant Reviews"
7. www.doughzonedumplinghouse.com — "Dough Zone Dumpling House | Washington, Oregon ..."
8. www.quora.com — "Where is the best dim sum in Seattle?"

**(Mot-clé 5) Best dim sum in Tukwila**

Top 3 Maps : MR. DIM SUM (1st), Din Tai Fung 鼎泰豐 (2nd), Dim Sum House (3rd)

Résultats organiques :
1. www.yelp.com — "THE BEST 10 DIM SUM RESTAURANTS in TUKWILA, WA"
2. www.tripadvisor.com — "THE BEST Dim Sum in Tukwila (Updated February 2026)"
3. eat-mds.com — "Mr Dim Sum"
4. www.reddit.com — "Best dim sum in the greater Seattle area?"
5. www.seattleschild.com — "The best dim sum for families in the Seattle area"
6. www.yelp.com — "MR. DIM SUM - 973 Southcenter Mall, Tukwila, Washington"
7. seattle.eater.com — "The Best Dim Sum in the Seattle Area"
8. dtf.com — "Bellevue Restaurant"

**(Mot-clé 6) Best dim sum in SeaTac**

Top 3 Maps : Din Tai Fung 鼎泰豐 (1st), MR. DIM SUM (2nd), Jade Garden Restaurant (3rd)

Résultats organiques :
1. www.yelp.com — "The Best 10 Dim Sum Restaurants near SeaTac/Airport ..."
2. seattle.eater.com — "The Best Dim Sum in the Seattle Area"
3. www.reddit.com — "Best dim sum in the greater Seattle area?"
4. www.seattleschild.com — "The best dim sum for families in the Seattle area"
5. www.tripadvisor.com — "THE BEST Dim Sum in Seattle (Updated February 2026)"
6. www.yelp.com — "MR. DIM SUM - 973 Southcenter Mall, Tukwila, Washington"
7. www.facebook.com — "I am looking for a real Chinese restaurant that has dim sum ..."
8. www.theinfatuation.com — "The Best Dim Sum In Seattle"

**(Mot-clé 7) Best soup in Renton**

Top 3 Maps : PHO BOX (1st), The Lemongrass (2nd), Renton Bistro (3rd)

Résultats organiques :
1. www.tripadvisor.com — "THE BEST Soup in Renton (Updated 2025)"
2. www.yelp.com — "TOP 10 BEST Soup in Renton, WA - Updated 2026"
3. www.grubhub.com — "15 Best Soup Delivery Restaurants in Renton"
4. www.yelp.com — "THE BEST 10 SOUP SPOTS in RENTON, WA"
5. www.reddit.com — "Where is the best soup in Seattle?"
6. www.emeraldpalate.com — "21 Best Soup in Seattle with Soul-Satisfying Comfort"
7. www.ubereats.com — "THE 10 BEST SOUP DELIVERY in Seattle 2025"
8. www.reddit.com — "Favorite takeout soup? : r/eastside"
9. www.doordash.com — "Food delivery in Renton, WA"

**(Mot-clé 8) Best soup in Tukwila**

Top 3 Maps : Juba Restaurant & Café (1st), Seatango/Spice Bridge (2nd), Panera Bread (3rd)

Résultats organiques :
1. www.yelp.com — "TOP 10 BEST Soup in Tukwila, WA - Updated 2026"
2. www.tripadvisor.com — "THE BEST Soup in Tukwila (Updated 2026)"
3. www.emeraldpalate.com — "21 Best Soup in Seattle with Soul-Satisfying Comfort"
4. www.reddit.com — "Where is the best soup in Seattle?"
5. www.ubereats.com — "THE 10 BEST SOUP DELIVERY in Seattle 2026"
6. seattle.eater.com — "The Best Soups and Stews at Seattle Restaurants"
7. www.doordash.com — "Food delivery in Tukwila, WA"
8. www.doughzonedumplinghouse.com — "Dough Zone Dumpling House | Washington, Oregon ..."

**(Mot-clé 9) Best soup in SeaTac**

Top 3 Maps : Aunt Becky's Deli (1st), P. F. Chang's - SEA (2nd), Floret - By Cafe Flora (3rd)

Résultats organiques :
1. www.yelp.com — "THE BEST 10 SOUP SPOTS in SEATAC, WA - Updated 2026"
2. www.emeraldpalate.com — "21 Best Soup in Seattle with Soul-Satisfying Comfort"
3. www.reddit.com — "Where is the best soup in Seattle?"
4. www.tripadvisor.com — "THE BEST Soup in Renton (Updated 2026)"
5. seattle.eater.com — "The Best Soups and Stews at Seattle Restaurants"
6. www.ubereats.com — "THE 10 BEST SOUP DELIVERY in Seattle 2026"
7. www.tripadvisor.com — "THE BEST Soup in SeaTac (Updated 2026)"
8. www.doughzonedumplinghouse.com — "Dough Zone Dumpling House | Washington, Oregon ..."
9. www.reddit.com — "Favorite takeout soup? : r/eastside"

---

## 7. AUDIT DÉTAILLÉ — "40 things reviewed"

### 7.1 En-tête

- **Titre** : "40 things reviewed, 7 need work" — Noir, bold, ~24px
- **Sous-titre** : "See what's wrong and how to improve" — Gris, ~14px

> **Note Backend** : Le "40" correspond au nombre total de critères évalués (pas forcément 40 — c'est dynamique). Le "7 need work" = nombre de critères en statut "fail".

### 7.2 Structure de chaque section d'audit

```
┌──────────────────────────────────────────────────────────────┐
│  1.                                                    28/40 │
│  Search Results                                        (○)   │
│  Get your website to the top of Google                       │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  What's SEO?                                           │ │
│  │  It means improving your website so search engines...  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  Domain                                                      │
│  ────                                                        │
│  ✅ Using custom domain                                    ▼ │
│  ✅ Only one domain                                        ▼ │
│                                                              │
│  Headline (H1)                                               │
│  ────                                                        │
│  🟡 Includes the service area                              ▼ │
│  🟡 Includes relevant keywords                             ▼ │
│  ...                                                         │
└──────────────────────────────────────────────────────────────┘
```

- **Numéro** : "1." — Gris clair, ~14px
- **Titre section** : "Search Results" — Noir, bold, ~20px
- **Sous-titre** : "Get your website to the top of Google" — Gris, ~14px
- **Score** : "28/40" — Orange (si Fair), à droite, avec mini cercle de progression
- **Encadré info** (optionnel) : Fond gris très clair, coins arrondis, contient un titre bold + texte explicatif
- **Sous-sections** : Titre en bold (~14px), séparateur, puis liste de critères

---

## 8. SECTION 1 : SEARCH RESULTS (28/40)

### En-tête

- Numéro : "1."
- Titre : "Search Results"
- Sous-titre : "Get your website to the top of Google"
- Score : 28/40 (orange, Fair)

### Encadré info

- Titre : "What's SEO?"
- Texte : "It means improving your website so search engines like Google can find it, rank it higher, and help more people see it."

### Sous-section : Domain (2 critères)

**Critère 1 : Using custom domain** ✅ PASS
- Description : "The business has and controls its own domain name instead of linking to a third-party website"
- Expandable : OUI
- What we found : `http://feastbuffetrenton.com`
- What we were looking for : doordash.com, ubereats.com, toasttab.com, clover.com, chownow.com, grubhub.com, squareup.com, square.site, seamless.com, order.online, yammii.com, ezcater.com, order.thanx.com, spotapps.co, dine.online, menus.fyi, mealkeyway.com, heartland.us, facebook.com, instagram.com

**Critère 2 : Only one domain** ✅ PASS
- Description : "Fracturing your web presence across multiple domains hurts Google rankings"
- Expandable : OUI
- What we found : "0.0% of traffic is routed away from your brand"
- We found the following competing domains : "Nothing found."

### Sous-section : Headline (H1) (3 critères)

**Critère 3 : Includes the service area** 🟡 LOADING
- Description : "Mentioning your service area in the headline helps with local SEO."
- Status text : "Working on finding this data..."

**Critère 4 : Includes relevant keywords** 🟡 LOADING
- Description : "Including relevant keywords in your headline improves search visibility."
- Status text : "Working on finding this data..."

**Critère 5 : Exists** 🟡 LOADING
- Description : "An H1 tag is crucial for SEO and helps structure your content hierarchy."
- Status text : "Working on finding this data..."

### Sous-section : Metadata (12 critères)

**Critère 6 : Images have "alt tags"** 🟡 LOADING
- Description : "Google looks at alt tags to understand what images are on your site."

**Critère 7 : Description length** 🟡 LOADING
- Description : "A sufficiently long meta description provides more context in search results."

**Critère 8 : Description includes the service area** 🟡 LOADING
- Description : "Mentioning your service area in the meta description aids local SEO efforts."

**Critère 9 : Description includes relevant keywords** 🟡 LOADING
- Description : "Including relevant keywords in your meta description can improve click-through rates from search results."

**Critère 10 : Open Graph title** 🟡 LOADING
- Description : "Open Graph title metadata (og:title) is essential for proper social sharing on Facebook, WhatsApp, LinkedIn, and other platforms."

**Critère 11 : Open Graph description** 🟡 LOADING
- Description : "Open Graph description metadata (og:description) provides a preview description when your website is shared on social platforms."

**Critère 12 : Open Graph image** 🟡 LOADING
- Description : "Open Graph image metadata (og:image) is critical for visual social sharing previews. Posts with images get significantly more engagement."

**Critère 13 : Twitter card** 🟡 LOADING
- Description : "Twitter card metadata enables rich previews when your website is shared on Twitter/X, increasing engagement and click-through rates."

**Critère 14 : Page title matches Google Business Profile** 🟡 LOADING
- Description : "Matching your page title with your Google listing provides consistency across platforms."

**Critère 15 : Page title includes the service area** 🟡 LOADING
- Description : "Including your service area in the page title helps with local search visibility."

**Critère 16 : Page title includes a relevant keyword** 🟡 LOADING
- Description : "Having a relevant keyword in your page title can improve search engine rankings."

> **Note** : Les critères 3-16 sont tous en état "Loading" dans les screenshots. Le score est 28/40, donc 28 critères sur 40 sont en statut PASS dans cette section lorsque le chargement est terminé. Les 12 critères restants dans cette section ne sont pas tous visibles — le document texte liste 16 critères pour Search Results, mais il peut y en avoir d'autres non visibles pour arriver à 40.

---

## 9. SECTION 2 : GUEST EXPERIENCE (9/40)

### En-tête

- Numéro : "2."
- Titre : "Guest Experience" (⚠️ dans la sidebar c'est appelé "Website Experience")
- Sous-titre : "Improve the experience on your website"
- Score : 9/40 (rouge, Poor)

### Encadré info

- Titre : "Your site"
- Texte : "Your site content and experience drive conversion and sales"

### Sous-section : Content (9 critères)

**Critère 1 : No off-site ordering** 🟡 LOADING
- Description : "Off-site ordering links can lead to a disjointed user experience and lost revenue."

**Critère 2 : Effective CTA for online ordering** 🟡 LOADING
- Description : "A clear call-to-action for online ordering can significantly increase conversions."

**Critère 3 : Sufficient text content** 🟡 LOADING
- Description : "Content about the restaurant helps Google understand your business."

**Critère 4 : Phone number** 🟡 LOADING
- Description : "Listing a phone number increases the number of ways people can place orders."

**Critère 5 : Favicon** 🟡 LOADING
- Description : "Including a favicon on your site improves the legitimacy of your site."

**Critère 6 : Social media links on website** 🟡 LOADING
- Description : (pas de description supplémentaire visible)

**Critère 7 : Operating hours** — État non visible (probablement PASS ou FAIL)
- Description : "Including operating hours on your website helps guests plan their visits."

**Critère 8 : Address on website** — État non visible
- Description : "Listing your business address on your website helps customers locate and visit your establishment."

**Critère 9 : Page content includes relevant keywords** 🟡 LOADING
- Description : "Including relevant keywords in your website content helps search engines understand what your business offers."

### Sous-section : Appearance (5 critères)

**Critère 10 : Compelling About Us section** ❌ FAIL
- Description : "A compelling story helps create an emotional connection with your customers."

**Critère 11 : Readable text** ✅ PASS
- Description : (aucune description additionnelle)

**Critère 12 : 3 customer reviews** ❌ FAIL
- Description : "A good number of reviews builds trust and credibility with potential customers."
- Expandable : OUI
- "We were looking for at least:" → "3 reviews"

**Critère 13 : FAQ section** ❌ FAIL
- Description : "Including an FAQ section on your website can provide more information for search engines to understand your business."

**Critère 14 : Explain benefits of direct ordering** ❌ FAIL
- Description : "Guests are more likely to order directly if they understand the benefits."

> **Note** : 14 critères visibles ici. Les 26 restants (pour arriver à 40) ne sont pas visibles dans les screenshots — soit masqués, soit en loading. Le Backend doit prévoir 40 critères au total pour cette section.

---

## 10. SECTION 3 : LOCAL LISTINGS (16/20)

### En-tête

- Numéro : "3."
- Titre : "Local Listings"
- Sous-titre : "Make your restaurant easy to find"
- Score : 16/20 (orange, Fair)

### Google Business Profile — En-tête

- Icône Google Business Profile (~32px)
- "Google Business Profile" — bold, ~16px
- Note : "4.1" + ⭐ + "5807 reviews"

### Sous-section : Profile content (10 critères)

**Critère 1 : First-party website** ✅ PASS
- Valeur trouvée : "feastbuffetrenton.com"

**Critère 2 : Description** ✅ PASS
- Valeur trouvée : "Spacious, contemporary restaurant offering all-you-can-eat Asian fare from dim sum to sushi."

**Critère 3 : Business hours** ✅ PASS
- Description : "Displaying business hours helps customers plan their visits and reduces inquiries."

**Critère 4 : Phone number** ✅ PASS
- Valeur trouvée : "(425) 235-1888"

**Critère 5 : Price range** ✅ PASS
- Valeur trouvée : "$$"

**Critère 6 : Service options** ❌ FAIL
- Description : "Listing service options helps customers understand how they can interact with your business."

**Critère 7 : Social media links** ✅ PASS
- Description : "Social media links extend your reach and provide additional ways for customers to engage."

**Critère 8 : Description includes relevant keywords** ✅ PASS
- Mots-clés trouvés : "asian food, dim sum, soup, baked chicken, banh mi, basmati rice, beef chow mein, beef satay, beef stir fry, bibimbap, bubble tea, asian"

**Critère 9 : Categories match keywords** ✅ PASS
- Expandable : OUI
- What we found (catégories) : "Buffet restaurant, Asian restaurant, Chinese restaurant, Restaurant"
- We checked for categories that match your keywords : "asian food, dim sum, soup, baked chicken, banh mi, basmati rice, beef chow mein, beef satay, beef stir fry, bibimbap, bubble tea, asian"

### Sous-section : User-submitted content (1 critère)

**Critère 10 : Quality reviews** ✅ PASS
- Valeur trouvée : "5 807 reviews"

> **Note** : 10 critères visibles. Les 10 restants (pour arriver à 20) ne sont pas visibles. Possiblement masqués en scroll ou non chargés. Le Backend doit prévoir 20 critères au total.

---

## 11. BANNIÈRE CTA FINALE

Position : Tout en bas de la page, après la Section 3.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  (Image de fond : nourriture asiatique, floutée)             │
│                                                              │
│  Owner AI Website                                            │
│  Improve your website with AI in 35 seconds.                 │
│                                                              │
│  [Improve your website →]                                    │
│                                                              │
│                          ┌──────────────┐                    │
│                          │  Preview UI  │                    │
│                          │  "Savor      │                    │
│                          │   every bite"│                    │
│                          └──────────────┘                    │
└──────────────────────────────────────────────────────────────┘
```

- **Fond** : Image de nourriture asiatique en arrière-plan
- **Titre** : "Owner AI Website" — blanc ou sombre, ~14px
- **Sous-titre** : "Improve your website with AI in 35 seconds." — blanc, bold, ~20px
- **Bouton** : "Improve your website →" — fond noir ou sombre, texte blanc, coins arrondis
- **Aperçu UI** : Petite carte flottante (~160x200px) montrant un preview de site web avec texte "Savor every bite" et un bouton

---

## 12. RÉSUMÉ COMPLET DES CRITÈRES

### Section 1 : Search Results (40 critères, score /40)

| # | Sous-section | Critère | Description |
|---|-------------|---------|-------------|
| 1 | Domain | Using custom domain | The business has and controls its own domain name instead of linking to a third-party website |
| 2 | Domain | Only one domain | Fracturing your web presence across multiple domains hurts Google rankings |
| 3 | Headline (H1) | Includes the service area | Mentioning your service area in the headline helps with local SEO |
| 4 | Headline (H1) | Includes relevant keywords | Including relevant keywords in your headline improves search visibility |
| 5 | Headline (H1) | Exists | An H1 tag is crucial for SEO and helps structure your content hierarchy |
| 6 | Metadata | Images have "alt tags" | Google looks at alt tags to understand what images are on your site |
| 7 | Metadata | Description length | A sufficiently long meta description provides more context in search results |
| 8 | Metadata | Description includes the service area | Mentioning your service area in the meta description aids local SEO efforts |
| 9 | Metadata | Description includes relevant keywords | Including relevant keywords in your meta description can improve click-through rates |
| 10 | Metadata | Open Graph title | og:title is essential for proper social sharing on Facebook, WhatsApp, LinkedIn |
| 11 | Metadata | Open Graph description | og:description provides a preview description when shared on social platforms |
| 12 | Metadata | Open Graph image | og:image is critical for visual social sharing previews |
| 13 | Metadata | Twitter card | Twitter card metadata enables rich previews on Twitter/X |
| 14 | Metadata | Page title matches Google Business Profile | Matching your page title with your Google listing provides consistency |
| 15 | Metadata | Page title includes the service area | Including your service area in the page title helps local search visibility |
| 16 | Metadata | Page title includes a relevant keyword | Having a relevant keyword in your page title can improve search rankings |
| 17-40 | — | NON VISIBLES | 24 critères supplémentaires non visibles dans les screenshots. Le Backend doit les définir pour arriver à 40. |

### Section 2 : Guest Experience (40 critères, score /40)

| # | Sous-section | Critère | Description |
|---|-------------|---------|-------------|
| 1 | Content | No off-site ordering | Off-site ordering links can lead to a disjointed user experience and lost revenue |
| 2 | Content | Effective CTA for online ordering | A clear call-to-action for online ordering can significantly increase conversions |
| 3 | Content | Sufficient text content | Content about the restaurant helps Google understand your business |
| 4 | Content | Phone number | Listing a phone number increases the number of ways people can place orders |
| 5 | Content | Favicon | Including a favicon improves the legitimacy of your site |
| 6 | Content | Social media links on website | (pas de description) |
| 7 | Content | Operating hours | Including operating hours helps guests plan their visits |
| 8 | Content | Address on website | Listing your business address helps customers locate and visit your establishment |
| 9 | Content | Page content includes relevant keywords | Including relevant keywords helps search engines understand what your business offers |
| 10 | Appearance | Compelling About Us section | A compelling story helps create an emotional connection with your customers |
| 11 | Appearance | Readable text | (pas de description additionnelle) |
| 12 | Appearance | 3 customer reviews | A good number of reviews builds trust and credibility with potential customers |
| 13 | Appearance | FAQ section | Including an FAQ section can provide more info for search engines |
| 14 | Appearance | Explain benefits of direct ordering | Guests are more likely to order directly if they understand the benefits |
| 15-40 | — | NON VISIBLES | 26 critères supplémentaires non visibles. |

### Section 3 : Local Listings (20 critères, score /20)

| # | Sous-section | Critère | Description |
|---|-------------|---------|-------------|
| 1 | Profile content | First-party website | Lien vers le site propre du restaurant |
| 2 | Profile content | Description | Description du restaurant dans GBP |
| 3 | Profile content | Business hours | Horaires d'ouverture affichées |
| 4 | Profile content | Phone number | Numéro de téléphone |
| 5 | Profile content | Price range | Gamme de prix indiquée |
| 6 | Profile content | Service options | Options de service (livraison, sur place, etc.) |
| 7 | Profile content | Social media links | Liens réseaux sociaux |
| 8 | Profile content | Description includes relevant keywords | Mots-clés pertinents dans la description |
| 9 | Profile content | Categories match keywords | Catégories GBP correspondent aux mots-clés |
| 10 | User-submitted content | Quality reviews | Nombre suffisant d'avis de qualité |
| 11-20 | — | NON VISIBLES | 10 critères supplémentaires non visibles. |

---

## 13. NOTES POUR LE DESIGNER

### Palette de couleurs observée

| Élément | Couleur approximative |
|---------|----------------------|
| Fond sidebar | Rose très pâle (#FFF5F5 / #FEF0F0) |
| Arc de score (poor) | Dégradé rouge → orange |
| Texte "Poor" | Noir |
| Texte "Fair" | Orange (#F9A825) |
| Badge "Unranked map pack" | Bleu (#2196F3) |
| Badge "Unranked organic" | Rouge/corail (#F44336) |
| Icône Pass ✅ | Bleu/vert (#1E88E5 ou #43A047) |
| Icône Fail ❌ | Rouge (#E53935) |
| Icône Loading 🟡 | Jaune/ambre (#FFC107) |
| Bouton CTA | Noir avec texte blanc |
| Fond cartes | Blanc avec ombre |
| Fond info box | Gris très clair (#F5F5F5) |

### Typographie

- Titres principaux : ~20-24px, bold
- Sous-titres : ~14px, regular, gris
- Corps de texte : ~13-14px, regular, noir
- Labels petits : ~11-12px, gris

### Breakpoints

- Desktop : Layout sidebar + main (comme les screenshots)
- Mobile : Sidebar probablement collapse en header fixe avec le score, puis contenu principal en pleine largeur

### Animations suggérées

- Arc de progression du score : animation de remplissage au chargement
- Critères en loading (🟡) : léger pulse/shimmer
- Expand/collapse des critères : transition smooth (height + opacity)
- Carrousel : slide horizontal avec transition

---

## 14. NOTES POUR LE DEV BACKEND

### API endpoints nécessaires

1. **GET /api/audit/{restaurant_id}** → Retourne tout l'audit complet (score, sous-scores, tous les critères, keyword rankings)
2. **GET /api/audit/{restaurant_id}/keywords** → Retourne les résultats de ranking par mot-clé
3. **GET /api/competitors/{restaurant_id}** → Retourne la liste des concurrents avec leurs scores

### Données à scraper / collecter

- **Site web du restaurant** : H1, meta tags, OG tags, Twitter cards, alt tags, contenu texte, favicon, liens sociaux, CTA, avis, FAQ, about, etc.
- **Google Business Profile** : Description, heures, téléphone, prix, catégories, avis, service options, social links
- **Google Search** : Résultats organiques pour chaque mot-clé
- **Google Maps** : Top 3 résultats pour chaque mot-clé

### Logique de scoring

```
score_section = nombre de critères avec status "pass" dans la section
score_total = search_results_score + guest_experience_score + local_listings_score
grade = "Poor" si score < 40, "Fair" si < 70, "Good" si < 90, "Excellent" si >= 90
```

### Calcul de la perte estimée

La carte "You could be losing ~$1,615/month" nécessite un algorithme de calcul basé sur le nombre de problèmes identifiés, la position dans les résultats de recherche, et le trafic estimé perdu.

---

## 15. NOTES POUR LE DEV FRONTEND

### Stack suggéré

- React/Next.js
- Tailwind CSS ou CSS Modules
- Framer Motion pour les animations
- Chart.js ou SVG custom pour l'arc de score
- Google Maps Embed API ou image statique

### Composants principaux à créer

1. **ScoreCircle** — Composant SVG réutilisable (grand + mini)
2. **Sidebar** — Panel fixe avec score + sous-scores + CTA
3. **HeroCards** — 3 cartes (revenue loss, competitors, carousel)
4. **CompetitorList** — Liste scrollable avec icônes et rangs
5. **SuccessCarousel** — Carrousel avec dots de pagination
6. **KeywordRankingBlock** — Bloc collapsible par mot-clé
7. **GoogleMapsResults** — Colonne gauche avec map + top 3
8. **GoogleSearchResults** — Colonne droite avec résultats organiques
9. **AuditSection** — Conteneur pour chaque section (1, 2, 3)
10. **AuditCriteria** — Ligne individuelle de critère (expandable)
11. **StatusIcon** — Icône pass/fail/loading
12. **Badge** — Composant badge (Unranked map pack, etc.)
13. **InfoBox** — Encadré d'information (What's SEO?, etc.)
14. **CTABanner** — Bannière finale

### Gestion des états de chargement

Beaucoup de critères affichent "Working on finding this data..." — cela implique un **chargement progressif**. Le frontend doit :
- Afficher immédiatement les critères déjà calculés (avec leur état pass/fail)
- Afficher un état loading (icône jaune + texte) pour les critères en cours
- Mettre à jour en temps réel via WebSocket ou polling quand les résultats arrivent
- Recalculer le score dynamiquement à chaque mise à jour

### Accessibilité

- Tous les arcs SVG doivent avoir des `aria-label`
- Les badges de couleur doivent avoir du texte lisible (pas uniquement la couleur)
- Les blocs expandables doivent utiliser `aria-expanded`
- Contraste suffisant entre texte et fond

---

*Document généré le 23 février 2026 — Version 1.0*