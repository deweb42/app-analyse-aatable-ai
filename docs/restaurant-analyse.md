# Manuel Opérationnel — Analyse Restaurant Automatisée

> Ce document est un **mode d'emploi complet** destiné à une IA agent (Claude Skill).
> Il décrit EXACTEMENT comment analyser un restaurant et produire un fichier JSON `HealthReport`.
> L'IA qui lit ce document doit pouvoir reproduire le processus pour n'importe quel restaurant sans intervention humaine.

---

## TABLE DES MATIÈRES

1. [Entrées requises](#1-entrées-requises)
2. [Sortie attendue](#2-sortie-attendue)
3. [Processus complet étape par étape](#3-processus-complet-étape-par-étape)
4. [Retour d'expérience — Les 3 restaurants analysés](#4-retour-dexpérience--les-3-restaurants-analysés)
5. [Les 100 critères d'audit — Liste exhaustive](#5-les-100-critères-daudit--liste-exhaustive)
6. [Formules de calcul](#6-formules-de-calcul)
7. [Règles absolues](#7-règles-absolues)
8. [Template JSON complet](#8-template-json-complet)

---

## 1. Entrées Requises

Tu reçois ces informations en entrée (certaines peuvent être vides) :

```
OBLIGATOIRE :
- restaurant_name    : "Feast Buffet"
- website_url        : "https://feastbuffetrenton.com"

OPTIONNEL :
- owner_name         : "John Doe"
- owner_email        : "john@example.com"
- owner_phone        : "+1-425-235-1888"
- google_maps_url    : "https://maps.google.com/?cid=..." ou le lien Google du restaurant
- city               : "Renton" (si pas fourni, tu le trouves via Google)
- state              : "WA"
- country            : "US" ou "CH" ou "FR" (si pas fourni, tu le déduis de la ville)
- locale             : "en" ou "fr" (langue du rapport)
```

Si des champs sont manquants, tu les trouves toi-même pendant la Phase 1.

---

## 2. Sortie Attendue

Un fichier JSON unique conforme au type `HealthReport` (voir `src/types/report.ts`).

Le fichier doit contenir **exactement 100 critères d'audit** répartis en :
- **Section 1 — Search Results** : 40 critères (7 catégories)
- **Section 2 — Website Experience** : 40 critères (7 catégories)
- **Section 3 — Local Listings** : 20 critères (4 catégories)

Le fichier doit contenir **exactement 6 à 9 keyword cards** (mots-clés × villes).

---

## 3. Processus Complet Étape par Étape

### ÉTAPE 1 — Identification de l'entreprise (5-10 recherches)

**Objectif** : Collecter TOUTES les informations publiques sur le restaurant.

#### 1.1 Recherches à effectuer (EN PARALLÈLE si possible)

```
Recherche 1 : WebSearch("{nom_restaurant} {ville}")
  → Trouver le site officiel, les réseaux sociaux, les avis
  → Noter toutes les URLs trouvées

Recherche 2 : WebSearch("{nom_restaurant} {ville} google maps")
  → Trouver la fiche Google Business
  → Noter : note, nombre d'avis, catégories, description

Recherche 3 : WebSearch("{nom_restaurant} {ville} avis" OU "reviews")
  → Trouver les plateformes de reviews (Yelp, TripAdvisor, TheFork, etc.)
  → Noter les notes et nombre d'avis sur chaque plateforme

Recherche 4 (si Suisse) : WebSearch("{nom_restaurant} site:local.ch")
  → Trouver la fiche local.ch/search.ch
  → Noter : adresse exacte, téléphone, horaires, catégories

Recherche 4 (si US) : WebSearch("{nom_restaurant} {ville} site:yelp.com")
  → Trouver la fiche Yelp
  → Noter : note, nombre d'avis, catégories, gamme de prix
```

#### 1.2 Ce que tu dois avoir à la fin de l'Étape 1

```json
{
  "legalName": "Nom légal complet (si trouvé au registre du commerce)",
  "ownerName": "Nom du propriétaire (si trouvé)",
  "address": "Adresse complète",
  "city": "Ville",
  "state": "Canton/État",
  "postalCode": "Code postal",
  "country": "Pays (US, CH, FR...)",
  "phone": "Téléphone principal",
  "additionalPhones": ["Autres numéros"],
  "email": "Email (si trouvé)",
  "website": "URL principale",
  "additionalWebsites": ["Sous-domaines", "Sites de commande"],
  "description": "Description longue du restaurant",
  "cuisineTypes": ["Type 1", "Type 2"],
  "priceRange": "$" | "$$" | "$$$" | "$$$$",
  "openingHours": { "Lundi": "11:00 – 22:00", ... },
  "socialMedia": { "instagram": "url", "facebook": "url" },
  "platforms": { "googleMaps": "url", "yelp": "url", ... },
  "googleMapsData": { "rating": 4.5, "reviewCount": 164, "categories": [...] },
  "websiteAnalysis": { "hasSsl": true, ... },
  "scrapedAt": "2026-02-25",
  "sources": ["liste de toutes les URLs consultées"]
}
```

**IMPORTANT** : JAMAIS inventer de données. Si tu ne trouves pas une info → `""` ou `null`.

---

### ÉTAPE 2 — Analyse du site web (3-5 WebFetch)

**Objectif** : Évaluer les 40 critères de la section "Website Experience".

#### 2.1 Scraper la page d'accueil

```
WebFetch(
  url: "{website_url}",
  prompt: "Analyse complète de cette page web de restaurant. Extraire :
  1. Le tag <title> exact
  2. La meta description
  3. Le contenu du H1 (s'il existe)
  4. Les meta Open Graph (og:title, og:description, og:image)
  5. Les Twitter card metas
  6. La présence de schema.org (type Restaurant, LocalBusiness, Menu)
  7. Les liens de navigation (quelles pages existent)
  8. Les numéros de téléphone visibles
  9. L'adresse affichée
  10. Les horaires d'ouverture affichés
  11. Les liens vers les réseaux sociaux
  12. Les boutons CTA (Commander, Réserver, etc.)
  13. La présence d'images avec alt text
  14. Le favicon
  15. Si le site est en HTTP ou HTTPS
  16. La quantité de texte (beaucoup, peu, presque rien)
  17. La présence d'une section À propos / histoire
  18. La présence d'avis clients
  19. La présence d'une FAQ
  20. Les couleurs et le design général (moderne, vieillot, etc.)"
)
```

#### 2.2 Scraper la page menu (si elle existe)

```
WebFetch(
  url: "{website_url}/menu" OU l'URL du menu trouvée en navigation,
  prompt: "Analyser cette page menu :
  1. Le menu est en HTML ou PDF ?
  2. Les prix sont-ils affichés ?
  3. Y a-t-il des photos des plats ?
  4. Les descriptions des plats sont-elles détaillées ?
  5. Y a-t-il des options végétariennes/vegan signalées ?
  6. Le menu est-il facile à parcourir ?"
)
```

#### 2.3 Vérifications techniques

```
WebFetch(url: "{website_url}/robots.txt", prompt: "Ce fichier existe-t-il ?")
WebFetch(url: "{website_url}/sitemap.xml", prompt: "Ce fichier existe-t-il ?")
```

#### 2.4 Ce que tu dois noter pour chaque critère

Pour chaque check du site web, tu notes :
- `status`: "pass", "fail", ou "warning"
- `findings`: CE QUE TU AS RÉELLEMENT TROUVÉ (citation, fait vérifiable)
- `expected`: CE QUI DEVRAIT ÊTRE LÀ (seulement pour fail/warning)

---

### ÉTAPE 3 — Analyse Google Business Profile (2-3 recherches)

**Objectif** : Évaluer les 20 critères de la section "Local Listings".

```
WebSearch("{nom_restaurant} {ville} google maps")
```

Ce que tu dois collecter :
- Nom exact affiché sur Google
- Note moyenne (ex: 4.5)
- Nombre d'avis (ex: 164)
- Catégories (ex: "Restaurant de hamburgers", "Fast food")
- Description
- Téléphone affiché
- Site web lié
- Horaires
- Tranche de prix ($, $$, $$$)
- Nombre de photos (estimation)
- Présence de posts récents
- Si le restaurant répond aux avis

---

### ÉTAPE 4 — Recherche de mots-clés et concurrents (5-9 WebSearch)

**Objectif** : Produire les `keywordCards` et `competitorRankings`.

#### 4.1 Choix des mots-clés

Tu dois choisir **3 mots-clés** × **2-3 villes proches** = **6-9 keyword cards**.

**Comment choisir les 3 mots-clés :**

1. Le plat/cuisine PRINCIPALE du restaurant (ex: "burger", "kebab", "asian food", "dim sum")
2. Le plat/cuisine SECONDAIRE (ex: "tacos", "döner", "soup")
3. Un terme générique ou niche (ex: "smash burger", "boucherie halal", "fast food")

**Comment choisir les 2-3 villes :**

1. La ville du restaurant (TOUJOURS)
2. La ville voisine la plus grande (si pertinent)
3. Une 3e ville proche si le restaurant a une zone de chalandise large

**Exemples concrets de ce qu'on a fait :**

| Restaurant | Mots-clés | Villes |
|------------|-----------|--------|
| Feast Buffet (Renton, WA) | asian food, dim sum, soup | Renton, Tukwila, SeaTac |
| Istanbul Kasap Market (Neuchâtel, CH) | kebab, döner, boucherie halal, viande halal, restaurant turc | Neuchâtel, La Chaux-de-Fonds |
| O'QG Burger & Tacos (Neuchâtel, CH) | burger, tacos, smash burger, fast food, livraison burger | Neuchâtel, La Chaux-de-Fonds |

#### 4.2 Pour chaque combinaison mot-clé × ville

Effectuer cette recherche :

```
WebSearch("Best {mot-clé} in {ville}")     // pour EN
WebSearch("Meilleur {mot-clé} à {ville}")  // pour FR
```

Dans les résultats, tu dois identifier :

**A. Google Maps / Local Pack (les 3 premiers résultats Maps)**

```json
"competitors": [
  { "name": "Nom du #1", "rating": 4.7, "mapRank": 1, "organicRank": null },
  { "name": "Nom du #2", "rating": 4.5, "mapRank": 2, "organicRank": null },
  { "name": "Nom du #3", "rating": 4.3, "mapRank": 3, "organicRank": null }
]
```

**B. Résultats organiques Google (les 5-9 premiers liens)**

```json
"organicResults": [
  { "site": "www.yelp.com", "title": "TOP 10 BEST Burger in Neuchâtel" },
  { "site": "www.tripadvisor.com", "title": "THE BEST Burgers in Neuchâtel" },
  ...
]
```

**C. Le rang du restaurant analysé**

- `mapPackRank`: Le rang du restaurant dans le Map Pack (1, 2, 3, ou `null` s'il n'apparaît pas)
- `organicRank`: Le rang dans les résultats organiques (ou `null`)
- `winner`: Le nom du #1 dans le Map Pack

#### 4.3 Construction des competitorRankings

Après avoir analysé TOUS les mots-clés :

1. Lister TOUS les concurrents rencontrés dans les Map Packs
2. Compter combien de fois chaque concurrent apparaît
3. Trier par fréquence d'apparition (puis par note)
4. EXCLURE le restaurant analysé de la liste
5. Garder les TOP 8
6. Assigner un rank de 1 à 8

---

### ÉTAPE 5 — Rédaction des 100 critères d'audit

**C'est l'étape la plus importante.** Tu utilises TOUTES les données collectées aux étapes 1-4 pour remplir les 100 critères.

Voir la [section 5 ci-dessous](#5-les-100-critères-daudit--liste-exhaustive) pour la liste complète.

---

### ÉTAPE 6 — Calcul des scores

```
score_search_results = count(status == "pass") dans section search-results
score_website_experience = count(status == "pass") dans section website-experience
score_local_listings = count(status == "pass") dans section local-listings

overall_score = score_search_results + score_website_experience + score_local_listings
```

**Niveaux de notation :**

```
score_pct = (score_section / max_section) * 100

Si score_pct <= 30% → rating: "Poor",  couleur: "#D65353"
Si score_pct <= 55% → rating: "Poor",  couleur: "#FF0101"
Si score_pct <= 70% → rating: "Fair",  couleur: "#F89412"
Si score_pct <= 85% → rating: "Good",  couleur: "#57AA30"
Si score_pct >  85% → rating: "Excellent", couleur: "#22C55E"
```

---

### ÉTAPE 7 — Assemblage final

Remplir le JSON dans cet ordre :

```
1. restaurant        → Infos de base (name, website, city, state, placeId, imageUrl)
2. overallScore      → Score global calculé
3. subScores         → 3 sous-scores (Search, Experience, Listings)
4. revenueLoss       → amount: (nb_fails × 45 + 500), problems: top 3 problèmes
5. competitorRankings → Top 8 concurrents dédupliqués
6. keywordCards      → 6-9 cartes de mots-clés
7. sections          → 3 sections avec 100 critères
8. auditSummary      → totalReviewed: 100, needsWork: nb_fails + nb_warnings
9. googleProfile     → Profil Google Business
10. caseStudies      → TOUJOURS les mêmes 3 :
    - Cyclo Noodles (37 → 92, "Grew direct online sales by 7X")
    - Talkin' Tacos (46 → 95, "$120,000/month in sales")
    - Saffron (43 → 96, "$171,400/month online sales")
11. ctaText          → "Fix in 35 seconds" / "Corrigez en 35 secondes"
12. ctaBanner        → Standard CTA
13. businessInfo     → Toutes les données brutes collectées
```

---

## 4. Retour d'Expérience — Les 3 Restaurants Analysés

### 4.1 Feast Buffet (Renton, WA, US) — Score 53/100

**Contexte** : Grand buffet asiatique dans la banlieue de Seattle. Site web basique mais fonctionnel.

**Ce qu'on a fait :**

1. **Identification** : WebSearch "Feast Buffet Renton" → trouvé site feastbuffetrenton.com, Google Maps (4.1★, 5807 avis), Yelp, TripAdvisor
2. **Site web** : WebFetch du site → site simple, PAS de commande en ligne, PAS de section À propos, PAS de FAQ, horaires et adresse présents, SSL valide
3. **Google Business** : Fiche bien remplie — description correcte, catégories (Buffet, Asian, Chinese, Restaurant), horaires, téléphone, photos
4. **Mots-clés** : 3 mots-clés (asian food, dim sum, soup) × 3 villes (Renton, Tukwila, SeaTac) = 9 keyword cards
5. **Résultat** : Feast Buffet n'apparaît dans AUCUN Map Pack → tous les mapPackRank sont `null`

**Leçons apprises :**
- Un restaurant peut avoir 5800 avis Google mais NE PAS apparaître dans le Map Pack pour ses mots-clés
- Le choix des villes voisines est important : Renton, Tukwila et SeaTac sont dans le même bassin de vie
- Le site avait beaucoup de "warning" (données non vérifiables) car le site était minimal
- Les concurrents dominants (Din Tai Fung, PHO BOX) sont apparus sur PLUSIEURS mots-clés

**Particularités du JSON :**
- Beaucoup de critères en `"warning"` avec `"findings": "Working on finding this data..."` → c'est parce que le site était trop minimal pour vérifier certains critères SEO
- Le `revenueLoss.amount` est faible (1615$) car il n'y a que 7 `needsWork` — le site est simple mais pas cassé
- Le `overallScore` est 53 car les parties techniques (SSL, mobile, sitemap) passent, mais le contenu et la conversion sont faibles

---

### 4.2 Istanbul Kasap Market (Neuchâtel, CH) — Score 38/100

**Contexte** : Boucherie halal turque qui fait aussi kebab/döner. Double activité = double complexité.

**Ce qu'on a fait :**

1. **Identification** : WebSearch "Istanbul Kasap Market Neuchâtel" → 2 sites trouvés ! boucherie-istanbul.ch (WooCommerce pour la boucherie) + lecointurc.com. Aussi kebab séparé. Google Maps: 4.4★, 12 avis seulement
2. **Site web** : WebFetch de boucherie-istanbul.ch → site WooCommerce avec fiches produit viande, AUCUNE mention du kebab/restaurant, pas d'adresse, pas d'horaires, pas de section À propos, pas de FAQ
3. **Google Business** : 2 fiches séparées (boucherie + kebab) → incohérence NAP. Catégories "Boucherie", "Kebab Döner", "Pizza Take Away"
4. **Mots-clés** : 5 mots-clés (kebab, döner, boucherie halal, viande halal, restaurant turc) × 2 villes (Neuchâtel, La Chaux-de-Fonds) = 6 keyword cards
5. **Résultat** : Classé #1 pour "boucherie halal" et "viande halal" mais ABSENT pour "kebab" et "döner"

**Leçons apprises :**
- Un commerce avec PLUSIEURS activités (boucherie + kebab) est plus complexe à analyser
- Il faut vérifier s'il y a plusieurs fiches Google → ça crée des problèmes de cohérence NAP
- En Suisse, il faut chercher sur local.ch et search.ch en plus de Google
- Le site WooCommerce est techniquement correct (SSL, responsive) mais le contenu est quasi inexistant
- Les `additionalPhones` sont utiles quand le même commerce a plusieurs numéros
- Quand le restaurant est classé #1, le `mapPackRank` est `1` ET le restaurant apparaît dans ses propres `competitors`

**Particularités du JSON :**
- `"locale": "fr"` → tous les titres de critères sont en français
- La section titles est en français : "Résultats de Recherche", "Expérience Client", "Fiches Locales"
- Les catégories sont en français : "Domaine", "Titre principal (H1)", "Métadonnées", etc.
- Le `revenueLoss` cite des problèmes spécifiques au contexte : "Le site ne mentionne pas le kebab/döner"
- 62 critères `needsWork` → score très bas car le site ne représente qu'un aspect du business

---

### 4.3 O'QG Burger & Tacos (Neuchâtel, CH) — Score 48/100

**Contexte** : Restaurant fast-casual burger/tacos avec système de commande en ligne.

**Ce qu'on a fait :**

1. **Identification** : WebSearch "OQG Burger Tacos Neuchâtel" → PLUSIEURS domaines trouvés : oqgburgertacos.ch, neuchatel.oqgburgertacos.ch, oqgburger.com, oqg-burgertacos.shop → problème de fragmentation !
2. **Site web** : WebFetch de oqgburgertacos.ch → site de commande en ligne avec menu complet, MAIS quasi aucun texte, pas de meta description, pas d'alt tags, pas de schema markup, Instagram actif mais pas lié
3. **Google Business** : 4.5★, 164 avis (Restaurant Guru). Catégories : "Restaurant de hamburgers", "Restaurant de tacos", "Fast food"
4. **Mots-clés** : 4 mots-clés (burger, tacos, smash burger, fast food) × 2 villes (Neuchâtel, La Chaux-de-Fonds) + 1 spécial (livraison burger Neuchâtel) = 6 keyword cards
5. **Résultat** : Classé #3 pour "burger", #2 pour "tacos", #1 pour "smash burger" — bonne position sur sa niche !

**Leçons apprises :**
- La fragmentation de domaines est un GROS problème SEO → toujours compter combien de domaines un restaurant utilise
- Un restaurant peut être bien classé sur des termes de niche (smash burger) mais absent sur les termes génériques (fast food)
- Les plateformes de livraison (Uber Eats) apparaissent dans les résultats organiques → noter ces URLs
- Quand le restaurant A un système de commande en ligne, le critère "CTA efficace" passe
- Les sous-domaines par ville (neuchatel.oqgburgertacos.ch) sont un pattern courant en Suisse

**Particularités du JSON :**
- `"additionalWebsites": ["https://oqg-burgers-tacos.orderbox.ch"]` → le système de commande est sur un domaine séparé
- Le nombre d'avis vient de Restaurant Guru (164), pas de Google directement
- Les concurrents incluent des chaînes (McDonald's, Burger King) ET des indépendants (Greasemonkees, Holy Cow!)
- `mapPackRank` varie par mot-clé : 3 pour "burger", 2 pour "tacos", 1 pour "smash burger", null pour "fast food"
- Le mot-clé "livraison burger" a `winner: "Uber Eats"` → c'est une plateforme, pas un restaurant

---

## 5. Les 100 Critères d'Audit — Liste Exhaustive

### Section 1 : Search Results (40 critères)

#### Catégorie "Domain" (2 critères)
```
1.  Utilise un domaine personnalisé
    → pass: Le restaurant a son propre domaine (pas doordash, ubereats, etc.)
    → fail: Le restaurant utilise un domaine tiers comme site principal

2.  Un seul domaine
    → pass: Tout le trafic va vers un seul domaine
    → fail: Plusieurs domaines fragmentent la présence web
```

#### Catégorie "Headline H1" (3 critères)
```
3.  H1 inclut la zone de service (ville)
4.  H1 inclut des mots-clés pertinents
5.  H1 existe sur la page
```

#### Catégorie "Metadata" (11 critères)
```
6.  Images ont des "alt tags" descriptifs
7.  Meta description de longueur suffisante (>120 caractères)
8.  Meta description inclut la zone de service
9.  Meta description inclut des mots-clés pertinents
10. Open Graph title (og:title)
11. Open Graph description (og:description)
12. Open Graph image (og:image)
13. Twitter card configurée
14. Titre de page correspond au nom Google Business
15. Titre de page inclut la zone de service (ville)
16. Titre de page inclut un mot-clé pertinent
```

#### Catégorie "Content" (5 critères)
```
17. Contenu de page unique (pas copié)
18. Nombre de mots suffisant (>300 mots de texte)
19. Structure de liens internes
20. Pas de contenu dupliqué
21. Contenu spécifique à la localisation (ville, quartier mentionnés)
```

#### Catégorie "Technical SEO" (7 critères)
```
22. Certificat SSL (HTTPS)
23. Compatible mobile (responsive)
24. Vitesse de chargement acceptable (<3s)
25. Pas de liens cassés
26. Sitemap XML présent
27. Robots.txt configuré
28. URLs canoniques correctes
```

#### Catégorie "Schema & Structured Data" (5 critères)
```
29. Schema Restaurant (schema.org/Restaurant)
30. Schema LocalBusiness
31. Schema Menu
32. Schema Review/AggregateRating
33. Schema Breadcrumb
```

#### Catégorie "Indexing" (7 critères)
```
34. Pages principales indexées par Google
35. Pas de noindex sur les pages importantes
36. Google Search Console connecté (estimation)
37. Pas d'erreurs de crawl
38. Le site charge sans erreurs JavaScript critiques
39. Tags hreflang corrects (si multilingue)
40. Structure d'URL propre et descriptive
```

### Section 2 : Website Experience (40 critères)

#### Catégorie "Content" (9 critères)
```
41. Pas de commande redirigée hors-site (Uber Eats, DoorDash...)
42. CTA efficace pour la commande en ligne
43. Contenu textuel suffisant sur le restaurant
44. Numéro de téléphone visible
45. Favicon présent
46. Liens vers les réseaux sociaux
47. Horaires d'ouverture affichés
48. Adresse physique affichée
49. Contenu inclut des mots-clés pertinents
```

#### Catégorie "Appearance" (5 critères)
```
50. Section "À propos" convaincante (histoire, storytelling)
51. Texte lisible (contraste, taille)
52. Au moins 3 avis clients affichés
53. Section FAQ présente
54. Explication des avantages de la commande directe
```

#### Catégorie "Accessibility" (5 critères)
```
55. Ratio de contraste des couleurs (WCAG)
56. Alt text sur les images
57. Navigation au clavier
58. Labels sur les formulaires
59. Landmarks ARIA
```

#### Catégorie "Performance" (5 critères)
```
60. Images optimisées (taille, format)
61. Pas de ressources bloquant le rendu
62. Chargement différé des images (lazy loading)
63. CSS et JS minifiés
64. Cache navigateur configuré
```

#### Catégorie "Mobile Experience" (6 critères)
```
65. Layout responsive
66. Boutons adaptés au tactile (>44px)
67. Pas de scroll horizontal
68. Meta viewport tag présent
69. Numéro de téléphone cliquable (tel:)
70. Menu mobile utilisable
```

#### Catégorie "Trust & Security" (5 critères)
```
71. Certificat SSL actif et valide
72. Page politique de confidentialité
73. Pas de contenu mixte (HTTP/HTTPS)
74. Formulaires de commande sécurisés
75. Adresse physique visible (renforce la confiance)
```

#### Catégorie "Navigation" (5 critères)
```
76. Navigation principale claire
77. Page menu accessible facilement
78. Infos de contact en footer
79. Recherche ou filtres fonctionnels
80. Page commande accessible en 2 clics max
```

### Section 3 : Local Listings (20 critères)

#### Catégorie "Profile Content" (9 critères)
```
81. Site web propriétaire lié à la fiche
82. Description remplie
83. Horaires d'ouverture définis
84. Numéro de téléphone affiché
85. Gamme de prix affichée
86. Options de service listées (livraison, sur place, etc.)
87. Liens réseaux sociaux
88. Description inclut des mots-clés pertinents
89. Catégories Google correspondent aux mots-clés de recherche
```

#### Catégorie "User-submitted Content" (1 critère)
```
90. Avis de qualité (note > 4.0 ET nombre > 50)
```

#### Catégorie "Listing Accuracy" (5 critères)
```
91. NAP cohérent sur tous les annuaires (Nom, Adresse, Téléphone)
92. Position correcte sur Google Maps
93. Présent sur Yelp (US) / local.ch (CH) / Pages Jaunes (FR)
94. Présent sur TripAdvisor
95. Présent sur une 5e plateforme : Apple Maps (US) / TheFork (EU) / Uber Eats (universel)
```

#### Catégorie "Photos & Media" (5 critères)
```
96. Photo de profil définie
97. Photo de couverture définie
98. Au moins 10 photos
99. Photos récentes (moins de 6 mois)
100. Photos des plats/menu
```

---

## 6. Formules de Calcul

### Score par section
```
score = COUNT(status == "pass") dans tous les items de la section
maxScore = nombre total d'items dans la section (40, 40, ou 20)
```

### Score global
```
overallScore = score_search + score_experience + score_listings
overallMaxScore = 100
```

### Rating et couleur
```python
pct = (score / maxScore) * 100

if pct <= 30:   rating = "Poor",      strokeColor = "#D65353"
elif pct <= 55: rating = "Poor",      strokeColor = "#FF0101"
elif pct <= 70: rating = "Fair",      strokeColor = "#F89412"
elif pct <= 85: rating = "Good",      strokeColor = "#57AA30"
else:           rating = "Excellent", strokeColor = "#22C55E"
```

### Revenue Loss
```
nb_fails = COUNT(status == "fail") dans TOUTES les sections
amount = nb_fails × 45 + 500
problems = top 3 problèmes les plus impactants (texte libre, pertinent au business)
```

### Audit Summary
```
totalReviewed = 100  (TOUJOURS)
needsWork = COUNT(status == "fail") + COUNT(status == "warning")
subtitle = "{needsWork} à corriger" (FR) / "{needsWork} need work" (EN)
```

---

## 7. Règles Absolues

### Ce que tu ne dois JAMAIS faire

1. **JAMAIS inventer de données** — Si tu ne trouves pas l'info, mets `null` ou `""`
2. **JAMAIS copier-coller les mêmes concurrents pour tous les mots-clés** — Chaque WebSearch donne des résultats différents
3. **JAMAIS mettre `pass` sans avoir vérifié** — Un critère non vérifiable = `warning`
4. **JAMAIS inventer d'URLs** dans les sources — Uniquement des URLs réellement consultées
5. **JAMAIS avoir plus ou moins de 100 critères** — Exactement 40 + 40 + 20
6. **JAMAIS inventer des notes Google** — Toujours les trouver via WebSearch

### Ce que tu dois TOUJOURS faire

1. **TOUJOURS vérifier via WebFetch ou WebSearch** avant de noter un critère
2. **TOUJOURS inclure le restaurant analysé dans ses propres keyword card competitors** s'il apparaît dans le Map Pack
3. **TOUJOURS exclure le restaurant de `competitorRankings`** (c'est la liste de SES concurrents)
4. **TOUJOURS utiliser la bonne langue** pour les titres/descriptions des critères (FR si locale=fr, EN si locale=en)
5. **TOUJOURS avoir des `findings` textuels pour chaque critère** (même pour les pass)
6. **TOUJOURS mettre des `findings` spécifiques au restaurant** (pas des phrases génériques)
7. **TOUJOURS lister toutes les URLs consultées dans `businessInfo.sources`**
8. **TOUJOURS mettre `scrapedAt` à la date du jour au format ISO (YYYY-MM-DD)**

### Conventions de nommage

- `placeId` : slug du restaurant → `slugify(name + "-" + city)` → ex: `"feast-buffet-renton"`
- `imageUrl` : toujours `""` (les images sont gérées côté front)
- `ctaText` : `"Fix in 35 seconds"` (EN) / `"Corrigez en 35 secondes"` (FR)
- `caseStudies` : Toujours les 3 mêmes (Cyclo Noodles, Talkin' Tacos, Saffron), traduits si FR

---

## 8. Template JSON Complet

Utilise ce template comme point de départ. Remplace les `___` par les vraies données.

```json
{
  "restaurant": {
    "name": "___",
    "website": "___",
    "city": "___",
    "state": "___",
    "placeId": "___",
    "imageUrl": ""
  },
  "overallScore": {
    "score": 0,
    "maxScore": 100,
    "rating": "___",
    "strokeColor": "___"
  },
  "subScores": [
    { "name": "Search Results", "score": 0, "maxScore": 40, "rating": "___", "strokeColor": "___" },
    { "name": "Website Experience", "score": 0, "maxScore": 40, "rating": "___", "strokeColor": "___" },
    { "name": "Local Listings", "score": 0, "maxScore": 20, "rating": "___", "strokeColor": "___" }
  ],
  "revenueLoss": {
    "amount": 0,
    "problems": ["___", "___", "___"]
  },
  "competitorRankings": [
    { "name": "___", "rating": 0, "rank": 1 },
    { "name": "___", "rating": 0, "rank": 2 }
  ],
  "keywordCards": [
    {
      "keyword": "___",
      "city": "___",
      "fullKeyword": "Best ___ in ___",
      "mapPackRank": null,
      "organicRank": null,
      "winner": "___",
      "competitors": [
        { "name": "___", "rating": 0, "mapRank": 1, "organicRank": null }
      ],
      "organicResults": [
        { "site": "___", "title": "___" }
      ]
    }
  ],
  "sections": [
    {
      "id": "search-results",
      "number": 1,
      "title": "Search Results",
      "subtitle": "___",
      "score": 0,
      "maxScore": 40,
      "scoreColor": "___",
      "infoBox": { "title": "What's SEO?", "text": "It means improving your website so search engines like Google can find it, rank it higher, and help more people see it." },
      "categories": [
        {
          "name": "Domain",
          "items": [
            { "title": "Using custom domain", "description": "___", "status": "pass", "findings": "___" }
          ]
        }
      ]
    },
    {
      "id": "website-experience",
      "number": 2,
      "title": "Guest Experience",
      "subtitle": "___",
      "score": 0,
      "maxScore": 40,
      "scoreColor": "___",
      "infoBox": { "title": "Your site", "text": "Your site content and experience drive conversion and sales" },
      "categories": []
    },
    {
      "id": "local-listings",
      "number": 3,
      "title": "Local Listings",
      "subtitle": "___",
      "score": 0,
      "maxScore": 20,
      "scoreColor": "___",
      "categories": []
    }
  ],
  "auditSummary": {
    "totalReviewed": 100,
    "needsWork": 0,
    "subtitle": "___"
  },
  "googleProfile": {
    "name": "___",
    "rating": 0,
    "reviewCount": 0,
    "description": "___",
    "phone": "___",
    "website": "___",
    "hasHours": true,
    "hasPhone": true,
    "hasPriceRange": true,
    "categories": []
  },
  "caseStudies": [
    { "name": "Cyclo Noodles", "initialScore": 37, "finalScore": 92, "result": "Grew direct online sales by 7X", "desktopImage": "cyclonoodles-desktop.png", "tabletImage": "cyclonoodles-tablet.png" },
    { "name": "Talkin' Tacos", "initialScore": 46, "finalScore": 95, "result": "$120,000/month in sales", "desktopImage": "talkintacos-desktop.png", "tabletImage": "talkintacos-tablet.png" },
    { "name": "Saffron", "initialScore": 43, "finalScore": 96, "result": "$171,400/month online sales", "desktopImage": "saffron-desktop.png", "tabletImage": "saffron-tablet.png" }
  ],
  "ctaText": "Fix in 35 seconds",
  "ctaBanner": {
    "label": "Owner AI Website",
    "title": "Improve your website with AI in 35 seconds.",
    "buttonText": "Improve your website"
  },
  "businessInfo": {
    "legalName": "___",
    "ownerName": "___",
    "address": "___",
    "city": "___",
    "state": "___",
    "postalCode": "___",
    "country": "___",
    "phone": "___",
    "email": "",
    "website": "___",
    "description": "___",
    "cuisineTypes": [],
    "priceRange": "$$",
    "openingHours": {},
    "socialMedia": {},
    "platforms": {},
    "googleMapsData": {
      "rating": 0,
      "reviewCount": 0,
      "categories": []
    },
    "websiteAnalysis": {
      "hasSsl": true,
      "isMobileResponsive": true,
      "hasOnlineOrdering": false,
      "hasMenu": true,
      "hasReservation": false,
      "technologies": [],
      "loadTimeEstimate": "~3s"
    },
    "scrapedAt": "___",
    "sources": []
  }
}
```

---

## Checklist Finale

Avant de livrer le rapport, vérifie :

- [ ] Le JSON est valide (parseable)
- [ ] Il y a exactement 100 critères (compte : 40 + 40 + 20)
- [ ] Les scores correspondent au nombre de `pass` par section
- [ ] `overallScore.score` = somme des 3 `subScores.score`
- [ ] `auditSummary.totalReviewed` = 100
- [ ] `auditSummary.needsWork` = nombre total de `fail` + `warning`
- [ ] Tous les `competitorRankings` sont DIFFÉRENTS du restaurant analysé
- [ ] Les `keywordCards` ont des résultats réels (pas inventés)
- [ ] `businessInfo.sources` liste toutes les URLs consultées
- [ ] `businessInfo.scrapedAt` est la date du jour
- [ ] La langue est cohérente (tout en FR ou tout en EN)
- [ ] Le `placeId` est un slug valide (lowercase, tirets, pas d'accents)
- [ ] Les `caseStudies` sont les 3 standards
