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

> **Principe directeur** : Chaque recherche doit avoir un OBJECTIF PRÉCIS. On ne fait jamais de recherche "pour voir". Chaque WebSearch et WebFetch alimente directement un ou plusieurs champs du JSON final. On maximise les données extraites par requête.

### ÉTAPE 1 — Identification de l'entreprise (4-6 recherches)

**Objectif** : Collecter TOUTES les informations publiques ET déterminer le contexte géographique/sectoriel.

#### 1.1 Détection automatique du pays et de la langue

AVANT toute recherche, détermine le contexte à partir des indices disponibles :

```
SI website se termine par .ch → country = "CH", locale = "fr" (ou "de" si ville germanophone)
SI website se termine par .fr → country = "FR", locale = "fr"
SI website se termine par .com et ville US → country = "US", locale = "en"
SI website se termine par .co.uk → country = "GB", locale = "en"
```

Ce contexte détermine :
- La langue des recherches ("Best" vs "Meilleur")
- Les plateformes à vérifier (Yelp=US, local.ch=CH, PagesJaunes=FR, TheFork=EU)
- Le format des numéros de téléphone et adresses
- Les catégories de noms dans les critères d'audit

#### 1.2 Recherche MAÎTRE — La requête la plus importante

Cette première recherche est CRITIQUE. Elle donne 80% des informations de base.

```
WebSearch('"{nom_restaurant}" {ville} restaurant')
```

**Pourquoi cette requête précise :**
- Les guillemets `"..."` forcent la correspondance exacte du nom → évite les homonymes
- Ajouter `{ville}` filtre géographiquement
- Ajouter `restaurant` force Google à montrer les résultats restaurant/food (pas un magasin, pas une personne)

**Ce que tu extrais de cette SEULE recherche :**
- Le site officiel (premier résultat .ch/.com/.fr qui n'est PAS Yelp/TripAdvisor/Google)
- La fiche Google Maps (snippet avec note ★, nombre d'avis, adresse)
- Les plateformes présentes (Yelp, TripAdvisor, TheFork, Uber Eats dans les résultats)
- Les réseaux sociaux (si Facebook/Instagram apparaissent)
- Les annuaires locaux (local.ch, search.ch, PagesJaunes)
- D'éventuels domaines multiples (signe de fragmentation)

**Arbre de décision après la Recherche MAÎTRE :**

```
SI la fiche Google Maps est visible dans les résultats :
  → Extraire note, avis, catégories, adresse, téléphone
  → PAS BESOIN de Recherche 2

SI la fiche Google Maps N'est PAS visible :
  → Lancer Recherche 2 : WebSearch("{nom_restaurant} {ville} site:google.com/maps")

SI le site officiel N'est PAS clair (plusieurs domaines) :
  → Lancer Recherche 3 : WebSearch("site:{domaine1}" vs "site:{domaine2}")
  → Celui avec le plus de pages indexées est le principal

SI aucun réseau social trouvé :
  → Lancer Recherche 4 : WebSearch("{nom_restaurant} {ville} instagram OR facebook")
```

#### 1.3 Recherche ANNUAIRES — Spécifique au pays

**Suisse :**
```
WebSearch("{nom_restaurant} {ville} site:local.ch OR site:search.ch")
```
Extraire : adresse formatée, téléphone suisse, horaires, catégories local.ch

**USA :**
```
WebSearch("{nom_restaurant} {ville} site:yelp.com")
```
Extraire : note Yelp, nombre d'avis, catégories, gamme de prix ($-$$$$)

**France :**
```
WebSearch("{nom_restaurant} {ville} site:pagesjaunes.fr OR site:tripadvisor.fr")
```
Extraire : note, avis, catégories, adresse

**Pourquoi `site:` ?** : Ça force Google à ne montrer QUE les résultats de cette plateforme → pas de bruit, résultat direct.

#### 1.4 Recherche LÉGALE (optionnelle mais recommandée)

```
Suisse : WebSearch("{nom_restaurant} site:zefix.ch OR site:moneyhouse.ch")
France : WebSearch("{nom_restaurant} {ville} site:societe.com OR site:pappers.fr")
USA    : pas d'équivalent simple → skip
```

Extraire : raison sociale exacte, nom du propriétaire, forme juridique (Sàrl, SAS, LLC)

#### 1.5 Ce que tu DOIS avoir à la fin de l'Étape 1

Remplis ce tableau de vérification. Chaque ligne = un champ `businessInfo` :

```
✅ ou ❌ | Champ              | Source qui l'a fourni
---------|--------------------|--------------------------
  ?      | legalName          | Registre commerce / Google
  ?      | ownerName          | Registre / site web / LinkedIn
  ?      | address            | Google Maps / local.ch / site
  ?      | city               | Google Maps
  ?      | state              | Google Maps
  ?      | postalCode         | Google Maps / local.ch
  ?      | country            | Déduit du domaine/ville
  ?      | phone              | Google Maps / site / local.ch
  ?      | additionalPhones   | Si 2 numéros trouvés sur différentes sources
  ?      | email              | Site web (scraping footer)
  ?      | website            | Recherche MAÎTRE
  ?      | additionalWebsites | Si fragmentation détectée
  ?      | description        | Google Maps snippet
  ?      | cuisineTypes       | Catégories Google + contenu menu
  ?      | priceRange         | Google Maps / Yelp / TheFork
  ?      | openingHours       | Google Maps / site / local.ch
  ?      | socialMedia        | Recherche MAÎTRE ou Recherche 4
  ?      | platforms          | Recherche MAÎTRE (toutes les URLs trouvées)
  ?      | googleMapsData     | Recherche MAÎTRE ou Recherche 2
```

**RÈGLE** : Si après 4-6 recherches un champ est toujours ❌ → `""` ou `null`. JAMAIS inventer.

---

### ÉTAPE 2 — Analyse du site web (3-4 WebFetch)

**Objectif** : Évaluer les 40 critères "Website Experience" + les 19 critères SEO de "Search Results".

**Principe** : On fait LE MINIMUM de WebFetch pour couvrir LE MAXIMUM de critères. Chaque WebFetch a un prompt ultra-précis qui demande des réponses YES/NO avec preuves.

#### 2.1 WebFetch #1 — Page d'accueil (COUVRE 35+ critères)

C'est le WebFetch le plus important. Le prompt doit être STRUCTURÉ pour que la réponse soit directement mappable aux critères.

```
WebFetch(
  url: "{website_url}",
  prompt: "Tu es un auditeur SEO professionnel. Analyse cette page web et réponds à CHAQUE question par YES ou NO suivi de la preuve trouvée.

  === HEAD / META (répondre avec le contenu exact trouvé ou 'ABSENT') ===
  M1. <title> exact ?
  M2. <meta name='description'> contenu exact ?
  M3. <meta property='og:title'> ?
  M4. <meta property='og:description'> ?
  M5. <meta property='og:image'> ?
  M6. <meta name='twitter:card'> ?
  M7. <link rel='icon'> (favicon) ?
  M8. <meta name='viewport'> ?
  M9. <link rel='canonical'> href exact ?

  === STRUCTURE HTML ===
  H1. Contenu du premier <h1> ? (texte exact)
  H2. Le H1 contient-il le nom de la ville ? (YES/NO + ville trouvée)
  H3. Le H1 contient-il un mot-clé restaurant/food ? (YES/NO + mot trouvé)

  === SCHEMA.ORG (chercher dans <script type='application/ld+json'>) ===
  S1. Schema Restaurant ? (YES/NO)
  S2. Schema LocalBusiness ? (YES/NO)
  S3. Schema Menu ? (YES/NO)
  S4. Schema Review ou AggregateRating ? (YES/NO)
  S5. Schema BreadcrumbList ? (YES/NO)

  === CONTENU VISIBLE ===
  C1. Numéro de téléphone visible ? (YES/NO + numéro)
  C2. Adresse physique visible ? (YES/NO + adresse)
  C3. Horaires d'ouverture visibles ? (YES/NO)
  C4. Liens réseaux sociaux ? (YES/NO + lesquels : FB, IG, TikTok...)
  C5. Section 'À propos' / histoire du restaurant ? (YES/NO)
  C6. Avis clients affichés ? (YES/NO + combien)
  C7. Section FAQ ? (YES/NO)
  C8. Bouton CTA 'Commander' / 'Réserver' visible ? (YES/NO + texte du bouton)
  C9. Nom de la ville mentionné dans le texte ? (YES/NO + contexte)
  C10. Estimation du volume de texte : BEAUCOUP (>500 mots) / MOYEN (100-500) / PEU (<100)

  === TECHNIQUE ===
  T1. Le site charge en HTTPS ? (YES/NO)
  T2. Images avec attribut alt rempli ? (YES/NO + exemples)
  T3. Liens de navigation (lister les pages du menu)
  T4. Liens externes vers plateformes de livraison (Uber Eats, DoorDash, etc.) ? (YES/NO + URLs)
  T5. Page politique de confidentialité liée ? (YES/NO)
  T6. Formulaire de commande/contact avec labels ? (YES/NO)
  T7. Technologie détectée ? (WordPress, Shopify, WooCommerce, custom, React, etc.)"
)
```

**Pourquoi ce format ?** Chaque réponse M1-T7 mappe directement à un critère d'audit. Pas d'interprétation nécessaire.

#### 2.2 WebFetch #2 — Vérifications techniques (robots.txt + sitemap)

**Une seule requête pour les deux** en utilisant le robots.txt qui référence souvent le sitemap :

```
WebFetch(
  url: "{website_url}/robots.txt",
  prompt: "1. Ce fichier robots.txt existe-t-il ? (YES/NO)
  2. Contient-il une directive Sitemap ? (YES/NO + URL du sitemap)
  3. Y a-t-il des directives Disallow problématiques ? (YES/NO + lesquelles)"
)
```

Si le sitemap n'est pas référencé dans robots.txt :
```
WebFetch(
  url: "{website_url}/sitemap.xml",
  prompt: "Ce sitemap XML existe-t-il ? (YES/NO). Si oui, combien de pages sont listées ?"
)
```

#### 2.3 WebFetch #3 — Page menu (SEULEMENT si navigation trouvée en 2.1)

```
WebFetch(
  url: "{url_menu_trouvée_en_2.1}",
  prompt: "Analyse cette page menu de restaurant :
  1. Format du menu : HTML interactif / PDF / Image / Texte simple ?
  2. Prix affichés ? (YES/NO)
  3. Photos des plats ? (YES/NO + nombre estimé)
  4. Descriptions détaillées des plats ? (YES/NO)
  5. Options alimentaires signalées (végétarien, vegan, halal, sans gluten) ? (YES/NO)
  6. Le menu est-il commandable directement (ajout au panier) ? (YES/NO)"
)
```

#### 2.4 WebFetch #4 — Page contact/about (SEULEMENT si trouvée en 2.1)

Si une page "À propos" ou "Contact" existe :
```
WebFetch(
  url: "{url_about_ou_contact}",
  prompt: "Extraire :
  1. L'histoire du restaurant (fondateur, année de création, philosophie)
  2. L'adresse complète
  3. Le(s) numéro(s) de téléphone
  4. L'email
  5. Les horaires
  6. Une carte Google Maps intégrée ? (YES/NO)"
)
```

#### 2.5 Matrice de mapping WebFetch → Critères

Utilise cette matrice pour noter chaque critère à partir des résultats :

```
Résultat WebFetch  | Critère mappé                    | Logique de scoring
-------------------|----------------------------------|----------------------------
M1 ≠ ABSENT       | #14 titre correspond Google      | Comparer M1 avec nom Google
M2 ≠ ABSENT       | #7 meta description              | pass si >120 caractères
M2 contient ville  | #8 meta desc + zone service     | pass si ville trouvée
M2 contient keyword| #9 meta desc + mots-clés        | pass si cuisine mentionnée
M3 ≠ ABSENT       | #10 Open Graph title             | pass si présent
M4 ≠ ABSENT       | #11 Open Graph description       | pass si présent
M5 ≠ ABSENT       | #12 Open Graph image             | pass si URL image valide
M6 ≠ ABSENT       | #13 Twitter card                 | pass si présent
M7 ≠ ABSENT       | #45 Favicon                      | pass si présent
M8 ≠ ABSENT       | #68 Meta viewport                | pass si présent
M9 ≠ ABSENT       | #28 URLs canoniques              | pass si présent
H1 ≠ ABSENT       | #5 H1 existe                     | pass si H1 textuel trouvé
H2 = YES          | #3 H1 inclut zone service        | pass si ville dans H1
H3 = YES          | #4 H1 inclut mots-clés           | pass si keyword dans H1
S1 = YES          | #29 Schema Restaurant            | pass
S2 = YES          | #30 Schema LocalBusiness         | pass
S3 = YES          | #31 Schema Menu                  | pass
S4 = YES          | #32 Schema Review                | pass
S5 = YES          | #33 Schema Breadcrumb            | pass
C1 = YES          | #44 Numéro de téléphone          | pass
C2 = YES          | #48 Adresse affichée             | pass + #75 Adresse visible
C3 = YES          | #47 Horaires affichés            | pass
C4 = YES          | #46 Liens réseaux sociaux        | pass
C5 = YES          | #50 Section À propos             | pass
C6 = YES          | #52 3 avis clients               | pass si ≥3 avis
C7 = YES          | #53 Section FAQ                  | pass
C8 = YES          | #42 CTA commande en ligne        | pass
C9 = YES          | #21 Contenu spécifique lieu      | pass
C10 ≥ MOYEN       | #18 Nombre mots suffisant        | pass si MOYEN ou BEAUCOUP
T1 = YES          | #22 SSL + #71 SSL actif          | pass (double)
T2 = YES          | #6 Alt tags + #56 Alt text       | pass (double)
T4 = YES          | #41 Commande hors-site           | FAIL si oui (perte de revenu)
T5 = YES          | #72 Politique confidentialité    | pass
T6 = YES          | #58 Labels formulaires           | pass
```

---

### ÉTAPE 3 — Analyse Google Business Profile (1-2 recherches ciblées)

**Objectif** : Évaluer les 20 critères "Local Listings" + valider les données d'identification.

#### 3.1 Recherche PROFIL — Si pas déjà trouvé en Étape 1

```
WebSearch("{nom_restaurant} {ville} avis google")
```

**Pourquoi `avis google` plutôt que `google maps` ?**
- Google montre le Knowledge Panel avec note + avis + photos quand on cherche "avis"
- On obtient en un seul résultat : note, nb avis, catégories, adresse, horaires, photos, description

#### 3.2 Ce que tu extrais et comment tu scores

```
Donnée Google              | Critère mappé                  | Logique
---------------------------|--------------------------------|-------------------
Site web lié               | #81 Site web propriétaire      | pass si c'est le bon domaine
Description présente       | #82 Description remplie        | pass si >20 mots
Horaires affichés          | #83 Horaires définis           | pass si complets
Téléphone affiché          | #84 Numéro affiché             | pass si présent
Gamme de prix ($-$$$$)     | #85 Gamme de prix              | pass si affichée
Options de service visibles| #86 Options listées            | pass si livraison/sur place
Liens réseaux sociaux      | #87 Liens sociaux              | pass si FB/IG lié
Mots-clés dans description | #88 Description + mots-clés    | pass si cuisine mentionnée
Catégories Google          | #89 Catégories = mots-clés     | pass si concordance
Note > 4.0 ET avis > 50   | #90 Avis de qualité            | pass si les deux
NAP identique partout      | #91 NAP cohérent               | comparer avec site web + annuaire
Pin correctement placé     | #92 Position carte             | pass (sauf erreur évidente)
Présent sur plateforme 3   | #93 Yelp/local.ch/PagesJaunes  | pass si fiche trouvée en Étape 1
Présent sur TripAdvisor    | #94 TripAdvisor                | pass si fiche trouvée
Présent sur plateforme 5   | #95 Apple Maps/TheFork/UberEats| pass si fiche trouvée
Photo profil               | #96 Photo de profil            | pass si visible
Photo couverture           | #97 Photo de couverture        | pass si visible
≥10 photos                 | #98 Au moins 10 photos         | pass si estimé >10
Photos récentes            | #99 Photos récentes            | warning si impossible à vérifier
Photos plats               | #100 Photos des plats          | pass si photos de nourriture visibles
```

#### 3.3 Vérification croisée NAP (Name, Address, Phone)

C'est un critère CRITIQUE. Compare ces 3 sources :
1. Le site web (trouvé en Étape 2)
2. La fiche Google Maps (trouvée en Étape 1 ou 3)
3. L'annuaire local (local.ch, Yelp, PagesJaunes — trouvé en Étape 1)

```
SI le nom est IDENTIQUE sur les 3 → pass
SI l'adresse est IDENTIQUE sur les 3 → pass
SI le téléphone est IDENTIQUE sur les 3 → pass
SI l'un des 3 diffère → fail avec findings expliquant la différence
SI le restaurant a 2 fiches Google → fail automatique
```

---

### ÉTAPE 4 — Recherche de mots-clés et concurrents (6-9 WebSearch)

**Objectif** : Produire les `keywordCards` et `competitorRankings`.

> C'est l'étape qui consomme le plus de requêtes mais qui produit les données les plus précieuses : le classement du restaurant face à ses concurrents.

#### 4.1 Algorithme de sélection des mots-clés

**Input** : `cuisineTypes` de l'Étape 1 + nom du restaurant + catégories Google

**Algorithme :**

```
1. EXTRAIRE les mots-clés candidats :
   a. Chaque élément de cuisineTypes → candidat (ex: "burger", "tacos")
   b. Les catégories Google → candidat (ex: "fast food", "kebab döner")
   c. Le nom du restaurant s'il contient un type de cuisine
      (ex: "O'QG Burger & Tacos" → "burger", "tacos")
   d. Les produits phares trouvés sur le site (ex: "smash burger", "dim sum")

2. DÉDUPLIQUER et PRIORISER :
   a. Supprimer les doublons sémantiques ("hamburger" = "burger")
   b. Garder le terme le plus cherché par les clients
      ("burger" > "hamburger", "kebab" > "kebab döner")
   c. Prioriser par spécificité :
      - HAUTE : terme de niche où le restaurant peut être #1 ("smash burger", "boucherie halal")
      - MOYENNE : cuisine principale ("burger", "kebab", "asian food")
      - BASSE : terme générique ("restaurant", "fast food")

3. SÉLECTIONNER 3 mots-clés :
   Mot-clé 1 : Cuisine PRINCIPALE (le plus évident, ce pour quoi le restaurant est connu)
   Mot-clé 2 : Cuisine SECONDAIRE ou spécialité (un autre produit phare)
   Mot-clé 3 : Terme de NICHE ou GÉNÉRIQUE stratégique
              → Si le restaurant a une niche (smash burger, halal) → niche
              → Si le restaurant est généraliste → générique (fast food, restaurant)
              → Si le restaurant fait de la livraison → "livraison {cuisine}"
```

**Exemples détaillés de l'algorithme appliqué :**

```
FEAST BUFFET (Renton, WA)
  cuisineTypes: Asian, Buffet, Chinese, Japanese, Sushi, Dim Sum, Korean, Vietnamese
  catégories Google: Buffet restaurant, Asian restaurant, Chinese restaurant

  Candidats: asian food, buffet, chinese food, dim sum, sushi, korean food, vietnamese food
  Après priorisation:
    → "asian food"  (PRINCIPALE — terme de recherche le plus large, correspond à "Asian restaurant")
    → "dim sum"     (SECONDAIRE — spécialité différenciante du buffet)
    → "soup"        (NICHE — plat populaire du buffet, moins compétitif)

  ❌ PAS "buffet" → trop générique, inclut des buffets non-restaurant
  ❌ PAS "sushi" → trop de concurrence spécialisée (restaurants sushi dédiés)
  ❌ PAS "chinese food" → trop similaire à "asian food"

ISTANBUL KASAP MARKET (Neuchâtel, CH)
  cuisineTypes: Kebab, Döner, Pizza, Boucherie Halal, Alimentation orientale
  catégories Google: Boucherie, Kebab Döner, Pizza Take Away

  Candidats: kebab, döner, pizza, boucherie halal, viande halal, restaurant turc
  Après priorisation:
    → "kebab"           (PRINCIPALE — c'est le cœur du restaurant)
    → "boucherie halal" (SECONDAIRE — l'autre activité, #1 potentiel)
    → "restaurant turc" (GÉNÉRIQUE — capte la clientèle turque large)

  BONUS ajoutés car business complexe (double activité) :
    → "döner"           (variante du kebab, résultats Maps différents)
    → "viande halal"    (variante de boucherie halal, résultats différents)

O'QG BURGER & TACOS (Neuchâtel, CH)
  cuisineTypes: Burger, Tacos, Fast-casual, Street food
  catégories Google: Restaurant de hamburgers, Restaurant de tacos, Fast food

  Candidats: burger, tacos, smash burger, fast food, livraison burger
  Après priorisation:
    → "burger"       (PRINCIPALE — c'est dans le nom)
    → "tacos"        (SECONDAIRE — c'est dans le nom)
    → "smash burger" (NICHE — spécialité, potentiel #1)

  BONUS :
    → "fast food"        (GÉNÉRIQUE — capte les recherches larges)
    → "livraison burger" (INTENTION TRANSACTIONNELLE — les gens qui cherchent ça veulent commander)
```

#### 4.2 Algorithme de sélection des villes

```
1. VILLE PRINCIPALE : Toujours la ville du restaurant (OBLIGATOIRE)

2. VILLES SECONDAIRES — Choisir 1-2 parmi :
   a. La ville voisine la plus peuplée dans un rayon de 15km
   b. La ville "bassin d'emploi" (là où les gens travaillent et mangent le midi)
   c. La ville "hub transport" (aéroport, gare, zone commerciale)

   ATTENTION : Ne PAS choisir une ville trop éloignée où le restaurant n'a aucune chance d'apparaître.

3. VALIDATION : La ville secondaire est pertinente SEULEMENT si :
   - Le restaurant livre dans cette ville, OU
   - Le restaurant est à <15 min en voiture, OU
   - Les résidents de cette ville pourraient raisonnablement venir manger

Exemples :
  Renton, WA → Tukwila (5 min, même zone commerciale), SeaTac (10 min, hub aéroport)
  Neuchâtel, CH → La Chaux-de-Fonds (25 min, 2e ville du canton)
  Paris 11e, FR → Paris (global), Vincennes (à côté)
```

#### 4.3 Requêtes de recherche OPTIMISÉES par mot-clé

La formulation de la requête est CRITIQUE. Différentes formulations donnent des résultats Maps différents.

**Format des requêtes :**

```
ANGLAIS (US, UK) :
  "Best {keyword} in {city}"
  → Cible le Map Pack + résultats organiques de classement
  → Exemple : "Best asian food in Renton"

FRANÇAIS (CH, FR) :
  "Meilleur {keyword} à {city}"
  → Même logique en français
  → Exemple : "Meilleur burger à Neuchâtel"

ALTERNATIVE si le premier format ne retourne pas de Map Pack :
  "{keyword} {city}"
  → Plus court, parfois meilleur pour le Map Pack
  → Exemple : "dim sum Tukwila"

ALTERNATIVE pour la livraison :
  "livraison {keyword} {city}" / "{keyword} delivery {city}"
  → Résultats orientés Uber Eats, DoorDash, etc.
```

**IMPORTANT — Comment lire les résultats :**

```
Résultat WebSearch typique :
┌─────────────────────────────────────────────┐
│ 🗺️  MAP PACK (3 résultats)                 │ ← competitors[0-2]
│  1. Din Tai Fung ★4.6 (2,340 avis)          │    mapRank: 1
│  2. MR. DIM SUM ★4.1 (890 avis)             │    mapRank: 2
│  3. Supreme Dumplings ★4.6 (445 avis)        │    mapRank: 3
├─────────────────────────────────────────────┤
│ 📄  ORGANIC RESULTS                          │ ← organicResults[]
│  1. www.yelp.com — "TOP 10 BEST ..."         │    organicResults[0]
│  2. www.tripadvisor.com — "THE BEST ..."     │    organicResults[1]
│  3. www.facebook.com — "Best chinese ..."    │    organicResults[2]
│  4. dtf.com — "Bellevue Restaurant"          │    organicResults[3]
│  5. www.tripadvisor.com — "LITTLE PEKING..." │    organicResults[4]
└─────────────────────────────────────────────┘

Pour le restaurant analysé :
  → Est-il dans le MAP PACK ? Si oui, mapPackRank = son rang (1, 2 ou 3)
  → Son site apparaît-il dans les ORGANIC ? Si oui, organicRank = sa position
  → Si absent des deux → mapPackRank: null, organicRank: null
```

#### 4.4 Construction intelligente des competitorRankings

**Algorithme détaillé :**

```
1. Créer un dictionnaire : { nom_concurrent: { count: 0, bestRating: 0, mapRanks: [] } }

2. Pour chaque keywordCard :
   Pour chaque concurrent dans competitors (Map Pack) :
     SI concurrent ≠ restaurant_analysé :
       dict[nom].count += 1
       dict[nom].bestRating = max(current, rating)
       dict[nom].mapRanks.push(mapRank)

3. Trier le dictionnaire par :
   a. count (décroissant) — celui qui apparaît le plus souvent est le plus menaçant
   b. bestRating (décroissant) — à fréquence égale, le mieux noté gagne

4. Prendre les TOP 8

5. Assigner rank 1 à 8

Exemple avec O'QG Burger & Tacos :
  Greasemonkees  : apparaît 3× (burger NE, smash NE, burger LCdF) → rank 1
  Neuch' Tacos   : apparaît 2× (burger NE, tacos NE) → rank 2
  King Food      : apparaît 2× (tacos NE, fast food NE) → rank 3
  Holy Cow!      : apparaît 2× (smash NE, burger LCdF) → rank 4
  Burger King    : apparaît 2× (fast food NE, livraison NE) → rank 5
  McDonald's     : apparaît 2× (fast food NE, livraison NE) → rank 6
  La Turquoise   : apparaît 1× → rank 7
  Star Kebab     : apparaît 1× → rank 8
```

---

### ÉTAPE 5 — Rédaction des 100 critères d'audit

**C'est l'étape la plus importante.** Tu utilises TOUTES les données collectées aux étapes 1-4 pour remplir les 100 critères.

**Principe fondamental** : Chaque `findings` doit citer un FAIT VÉRIFIABLE trouvé pendant les étapes précédentes. Jamais une phrase générique.

```
❌ MAUVAIS :  "findings": "SSL certificate is active and valid"     (générique, copier-coller)
✅ BON :      "findings": "HTTPS actif sur oqgburgertacos.ch"       (spécifique, vérifiable)

❌ MAUVAIS :  "findings": "No FAQ section found"                     (générique)
✅ BON :      "findings": "Aucune page FAQ — le site n'a que 3 pages : Accueil, Menu, Contact"

❌ MAUVAIS :  "findings": "Images have alt attributes"               (vague)
✅ BON :      "findings": "12 images produit avec alt='Smash Cheese', alt='Double Bacon' etc."
```

**Arbre de décision pour le status :**

```
SI tu as trouvé la preuve via WebFetch/WebSearch que le critère est satisfait → "pass"
SI tu as trouvé la preuve que le critère N'est PAS satisfait → "fail"
SI tu n'as pas pu vérifier (site trop minimal, données inaccessibles) → "warning"
SI tu n'as PAS fait de WebFetch du site → "warning" pour tous les critères site web
```

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

**Requêtes exactes effectuées (dans l'ordre) :**

```
ÉTAPE 1 — Identification (3 requêtes)
  1. WebSearch('"Feast Buffet" Renton restaurant')
     → Trouvé : feastbuffetrenton.com, Google Maps (4.1★, 5807 avis), Yelp, TripAdvisor
     → Les 5807 avis prouvent un restaurant très fréquenté
     → Catégories Google : Buffet restaurant, Asian restaurant, Chinese restaurant

  2. WebSearch('"Feast Buffet" Renton site:yelp.com')
     → Trouvé : fiche Yelp avec note, nombre d'avis, catégories, prix $$
     → Confirmé adresse : 801 Rainier Ave S, Renton, WA 98057

  3. WebFetch('https://feastbuffetrenton.com', prompt: audit SEO structuré)
     → Résultat : site TRÈS minimal — quasi pas de texte
     → SSL: YES, H1: non vérifiable, meta description: non vérifiable
     → Horaires: OUI, Adresse: OUI, Téléphone: OUI
     → Pas de menu en ligne, pas de section À propos, pas de FAQ
     → Pas de commande en ligne, pas de réservation

ÉTAPE 2 — Site web (1 requête supplémentaire)
  4. WebFetch('https://feastbuffetrenton.com/robots.txt')
     → robots.txt et sitemap présents

ÉTAPE 4 — Mots-clés (9 requêtes)
  5.  WebSearch("Best asian food in Renton")
  6.  WebSearch("Best asian food in Tukwila")
  7.  WebSearch("Best asian food in SeaTac")
  8.  WebSearch("Best dim sum in Renton")
  9.  WebSearch("Best dim sum in Tukwila")
  10. WebSearch("Best dim sum in SeaTac")
  11. WebSearch("Best soup in Renton")
  12. WebSearch("Best soup in Tukwila")
  13. WebSearch("Best soup in SeaTac")

TOTAL : 13 requêtes (3 identification + 1 site + 9 mots-clés)
```

**Pourquoi ces choix de mots-clés :**
- "asian food" → terme le plus large, correspond à la catégorie Google "Asian restaurant"
- "dim sum" → spécialité distinctive du buffet, mentionnée dans la description Google
- "soup" → plat populaire mentionné dans les catégories de menu
- PAS "buffet" → trop générique (inclut des buffets d'hôtel, petit-déjeuner, etc.)
- PAS "sushi" → trop de restaurants sushi spécialisés, Feast Buffet serait noyé

**Pourquoi ces villes :**
- Renton → ville du restaurant (obligatoire)
- Tukwila → 5 min en voiture, zone commerciale Westfield Southcenter, bassin d'emploi commun
- SeaTac → 10 min, hub aéroport, les voyageurs cherchent "asian food near SeaTac"

**Résultat critique** : Feast Buffet n'apparaît dans AUCUN Map Pack sur 9 recherches malgré 5807 avis → tous les mapPackRank sont `null`. C'est un signal fort : le SEO local est mauvais malgré la popularité.

**Leçons techniques :**
- Un restaurant avec 5800 avis peut NE PAS apparaître dans le Map Pack → le nombre d'avis seul ne suffit pas
- Le site avait beaucoup de `"warning"` avec `"findings": "Working on finding this data..."` → c'est INCORRECT. On aurait dû mettre `"fail"` pour les critères non trouvés sur un site aussi minimal. Le `warning` ne doit être utilisé que si le critère est partiellement satisfait, pas si les données sont inaccessibles.
- Les concurrents dominants (Din Tai Fung 3×, PHO BOX 2×, MR. DIM SUM 2×) sont apparus sur PLUSIEURS mots-clés → algorithme de fréquence pour competitorRankings

---

### 4.2 Istanbul Kasap Market (Neuchâtel, CH) — Score 38/100

**Contexte** : Boucherie halal turque qui fait aussi kebab/döner. Double activité = double complexité. Domaine .ch → pays CH, locale FR.

**Requêtes exactes effectuées (dans l'ordre) :**

```
ÉTAPE 1 — Identification (4 requêtes)
  1. WebSearch('"Istanbul Kasap Market" Neuchâtel')
     → DÉCOUVERTE CRITIQUE : 2 domaines trouvés ! boucherie-istanbul.ch + lecointurc.com
     → Google Maps : 4.4★, 12 avis (TRÈS PEU comparé à Feast Buffet)
     → Catégories : Boucherie, Kebab Döner, Pizza Take Away, Alimentation orientale
     → Signal : 2 fiches Google séparées (boucherie ET kebab) → problème NAP

  2. WebSearch('"Istanbul Kasap" Neuchâtel site:local.ch OR site:search.ch')
     → Trouvé sur local.ch : adresse exacte Rue des Moulins 51, 2000 Neuchâtel
     → Téléphone boucherie : +41 32 724 30 87
     → Téléphone kebab : +41 32 544 74 74 (DIFFÉRENT → additionalPhones)
     → Horaires détaillés pour les deux activités

  3. WebSearch('"Istanbul Kasap" Neuchâtel site:facebook.com OR instagram')
     → Facebook trouvé : facebook.com/istanbulkasapmarket
     → Pas d'Instagram trouvé

  4. WebSearch('"Istanbul" boucherie Neuchâtel site:zefix.ch OR site:moneyhouse.ch')
     → Raison sociale : Istanbul Kasap Market Sàrl
     → Pas de nom de propriétaire trouvé → ownerName: "Non déterminé"

ÉTAPE 2 — Site web (2 requêtes)
  5. WebFetch('https://boucherie-istanbul.ch', prompt: audit SEO structuré)
     → WooCommerce détecté (WordPress + WooCommerce)
     → AUCUNE mention du kebab/restaurant sur le site boucherie
     → Catégories produit : Agneau, Boeuf, Veau, Volaille
     → Pas d'adresse, pas d'horaires, pas de section À propos
     → SSL OK, responsive OK, mais performance moyenne (scripts WooCommerce)

  6. WebFetch('https://boucherie-istanbul.ch/robots.txt')
     → robots.txt WordPress par défaut, sitemap auto-généré

ÉTAPE 4 — Mots-clés (6 requêtes)
  7.  WebSearch("Meilleur kebab à Neuchâtel")
  8.  WebSearch("Meilleur döner à Neuchâtel")
  9.  WebSearch("Meilleure boucherie halal à Neuchâtel")
  10. WebSearch("Viande halal à Neuchâtel")
  11. WebSearch("Meilleur restaurant turc à Neuchâtel")
  12. WebSearch("Meilleur kebab à La Chaux-de-Fonds")

TOTAL : 12 requêtes (4 identification + 2 site + 6 mots-clés)
```

**Pourquoi 5 mots-clés (au lieu de 3) :**
- Ce business a une DOUBLE ACTIVITÉ (boucherie + restaurant) → il faut couvrir les deux
- "kebab" et "döner" semblent similaires mais donnent des résultats Maps DIFFÉRENTS
- "boucherie halal" et "viande halal" ciblent les mêmes clients mais via des intentions différentes
- "restaurant turc" est le terme culturel large

**Pourquoi seulement 2 villes :**
- Neuchâtel est petit (34k habitants), le bassin de chalandise est limité
- La Chaux-de-Fonds est la 2e ville du canton (38k), à 25 min → pertinent
- PAS de 3e ville car les autres (Bienne, Yverdon) sont dans d'autres cantons et trop loin

**Résultat stratégique** : Le restaurant est #1 pour "boucherie halal" et "viande halal" (sa niche) mais INVISIBLE pour "kebab" et "döner" (le marché compétitif). Cela révèle que Google catégorise le business comme boucherie, pas comme restaurant.

**Leçons techniques :**
- 2 fiches Google = TOUJOURS `fail` sur le critère NAP (confusion pour Google)
- En Suisse, local.ch/search.ch donne des données de MEILLEURE QUALITÉ que Google pour les horaires et téléphones
- La recherche `site:zefix.ch` permet de trouver la raison sociale exacte (registre du commerce suisse)
- Quand le restaurant est classé #1, il apparaît dans ses propres `competitors` dans la keywordCard ET `mapPackRank: 1`
- Tout le rapport est en français : titres de sections, descriptions de critères, findings

---

### 4.3 O'QG Burger & Tacos (Neuchâtel, CH) — Score 48/100

**Contexte** : Restaurant fast-casual burger/tacos avec système de commande en ligne. Domaine .ch → pays CH, locale FR.

**Requêtes exactes effectuées (dans l'ordre) :**

```
ÉTAPE 1 — Identification (3 requêtes)
  1. WebSearch('"OQG" OR "O\'QG" burger tacos Neuchâtel')
     → DÉCOUVERTE CRITIQUE : 4 domaines ! oqgburgertacos.ch, neuchatel.oqgburgertacos.ch,
       oqgburger.com, oqg-burgertacos.shop → FRAGMENTATION MASSIVE
     → Google Maps : 4.5★ via Restaurant Guru (164 avis)
     → Catégories : Restaurant de hamburgers, Restaurant de tacos, Fast food, Livraison
     → Instagram actif : @oqg_burger_tacos (trouvé dans les résultats)
     → Facebook : trouvé dans les résultats
     → 2e établissement : La Chaux-de-Fonds (sous-domaine lachaux.oqgburgertacos.ch)

     NOTE SUR LA REQUÊTE : Utilisation de OR pour couvrir les 2 orthographes
     du nom (OQG vs O'QG — l'apostrophe varie selon les plateformes)

  2. WebSearch("oqgburgertacos.ch site:google.com")
     → Vérifier combien de pages sont indexées pour le domaine principal
     → Permet de confirmer que c'est bien le domaine principal (plus de pages indexées)

  3. WebSearch('"OQG" burger Neuchâtel site:local.ch OR site:search.ch')
     → local.ch : adresse Rue de la Dîme 6 (DIFFÉRENT du Faubourg du Lac 17 trouvé ailleurs)
     → Téléphone : 032 753 19 75
     → Horaires détaillés

     NOTE : L'adresse diffère selon les sources → signal d'incohérence NAP
     Après vérification : Faubourg du Lac 17 = ancienne adresse, Rue de la Dîme 6 = actuelle

ÉTAPE 2 — Site web (2 requêtes)
  4. WebFetch('https://oqgburgertacos.ch', prompt: audit SEO structuré)
     → Site de commande en ligne propre avec menu interactif
     → MAIS : zéro texte (juste des noms de produits), zéro meta description,
       zéro alt tags sur les images, zéro schema markup
     → Favicon : OUI (logo OQG)
     → SSL : OUI
     → Système de commande intégré avec panier → CTA "Commander" passe
     → Instagram non lié malgré une présence active
     → Catégories menu : Smash Burger, Tacos, Burgers, Samboussa, Kids, Frites, Tenders, Desserts

  5. WebFetch('https://neuchatel.oqgburgertacos.ch', prompt: "Comparer avec le domaine principal")
     → Menu identique mais avec adresse + téléphone + horaires
     → Contenu dupliqué entre les 2 sous-domaines → critère "duplicate content" = warning

ÉTAPE 4 — Mots-clés (6 requêtes)
  6.  WebSearch("Meilleur burger à Neuchâtel")
      → Map Pack : Greasemonkees #1, Neuch' Tacos #2, O'QG #3 → mapPackRank: 3
  7.  WebSearch("Meilleur tacos à Neuchâtel")
      → Map Pack : Neuch' Tacos #1, O'QG #2, King Food #3 → mapPackRank: 2
  8.  WebSearch("Meilleur smash burger à Neuchâtel")
      → Map Pack : O'QG #1, Greasemonkees #2, Holy Cow! #3 → mapPackRank: 1 (NICHE WIN!)
  9.  WebSearch("Meilleur fast food à Neuchâtel")
      → Map Pack : McDonald's #1, Burger King #2, King Food #3 → mapPackRank: null (absent)
  10. WebSearch("Meilleur burger à La Chaux-de-Fonds")
      → Map Pack : Holy Cow! #1, O'QG #2, McDonald's #3 → mapPackRank: 2
  11. WebSearch("Livraison burger Neuchâtel")
      → Map Pack : McDonald's #1, Burger King #2, O'QG #3 → mapPackRank: 3
      → Organic : Uber Eats en #1 → winner est une plateforme, pas un restaurant

TOTAL : 11 requêtes (3 identification + 2 site + 6 mots-clés)
```

**Pourquoi cette stratégie de mots-clés :**
- "burger" → terme principal (dans le nom du restaurant), forte compétition
- "tacos" → terme secondaire (dans le nom), compétition moyenne
- "smash burger" → NICHE STRATÉGIQUE. Peu de restaurants se positionnent dessus → potentiel #1
- "fast food" → terme générique pour voir si O'QG apparaît face aux chaînes (non → insight utile)
- "livraison burger" → INTENTION TRANSACTIONNELLE. Le client veut commander maintenant.
- PAS de mot-clé "kebab" même si les concurrents en font → ce n'est pas le positionnement d'O'QG

**Pattern découvert — La pyramide de niche :**
```
                    "smash burger" → #1 (NICHE = fort)
               "tacos" → #2 (SPÉCIALITÉ = moyen)
          "burger" → #3 (GÉNÉRIQUE = dilué)
     "fast food" → absent (TROP LARGE = invisible)

→ Plus le mot-clé est spécifique, mieux le restaurant est classé.
→ C'est une RÈGLE GÉNÉRALE qui se vérifie pour la plupart des restaurants.
```

**Leçon critique — Fragmentation des domaines :**
```
4 domaines trouvés pour le même restaurant :
  oqgburgertacos.ch            → Site principal (menu + commande)
  neuchatel.oqgburgertacos.ch  → Sous-domaine par ville
  oqgburger.com                → Ancien domaine (page À propos dessus !)
  oqg-burgertacos.shop         → Domaine shop (jamais vu en pratique)

IMPACT SEO : Google ne sait pas quel domaine prioriser → le "jus SEO" est divisé par 4.
C'est pourquoi le critère "Un seul domaine" est en FAIL avec findings détaillés.
```

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

## 9. Optimisation des Requêtes — Aide-mémoire Rapide

### Nombre total de requêtes par rapport

```
Budget optimal : 11-15 requêtes par restaurant

  Étape 1 (Identification)  : 3-4 WebSearch
  Étape 2 (Site web)         : 2-3 WebFetch
  Étape 3 (Google Business)  : 0-1 WebSearch (souvent déjà couvert en Étape 1)
  Étape 4 (Mots-clés)       : 6-9 WebSearch (3 mots-clés × 2-3 villes)
  ──────────────────────────────────────
  TOTAL                      : 11-17 requêtes
```

### Qualité des requêtes — Patterns à utiliser

```
IDENTIFICATION :
  ✅ '"Nom Exact" ville restaurant'          → Force la correspondance exacte
  ✅ '"Nom" ville site:local.ch'             → Cible un annuaire précis
  ✅ '"Nom" ville site:zefix.ch'             → Registre du commerce (CH)
  ❌ 'Nom restaurant avis'                   → Trop vague, résultats pollués
  ❌ 'Nom'                                   → Homonymes partout

MOTS-CLÉS :
  ✅ 'Meilleur {keyword} à {ville}'          → Déclenche le Map Pack en FR
  ✅ 'Best {keyword} in {city}'              → Déclenche le Map Pack en EN
  ✅ '{keyword} {ville}'                     → Alternatif si le premier ne donne pas de Map Pack
  ❌ '{keyword} restaurant {ville}'          → Le mot "restaurant" dilue les résultats
  ❌ 'Où manger {keyword} à {ville}'        → Formulation trop conversationnelle

SITE WEB :
  ✅ WebFetch avec prompt structuré M1-T7    → Réponses mappables aux critères
  ✅ WebFetch robots.txt PUIS sitemap.xml    → robots.txt référence souvent le sitemap
  ❌ WebFetch avec prompt vague "analyse ce site" → Réponse inutilisable
  ❌ WebFetch de chaque page du site         → Trop de requêtes, redondant
```

### Arbre de décision — Quand ajouter une requête supplémentaire

```
SI la Recherche MAÎTRE n'a pas trouvé Google Maps :
  → AJOUTER : WebSearch("{nom} {ville} google maps avis")

SI le site web a un menu mais pas trouvé en page d'accueil :
  → AJOUTER : WebFetch de la page /menu ou /carte

SI l'adresse diffère entre Google et le site :
  → NE PAS ajouter de requête, noter comme fail NAP

SI le restaurant a des avis sur Restaurant Guru mais pas Google :
  → AJOUTER : WebSearch("{nom} {ville} site:restaurantguru.com")

SI le pays est la Suisse et local.ch n'a rien donné :
  → AJOUTER : WebSearch("{nom} {ville} site:search.ch")

SI aucun réseau social trouvé :
  → AJOUTER : WebSearch("{nom} {ville} instagram OR facebook OR tiktok")
  → UNE SEULE requête pour les 3 réseaux

SINON :
  → NE PAS ajouter de requête. Mets les champs manquants à null.
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
