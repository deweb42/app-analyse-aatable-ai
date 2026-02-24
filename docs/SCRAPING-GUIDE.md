# Guide de Recherche & Scraping — Analyse Restaurant

> Document destiné à un agent IA. Suivre ce protocole produit une analyse de qualité professionnelle (niveau McKinsey) pour n'importe quel restaurant.

## Vue d'ensemble

L'objectif est de collecter **toutes les données publiques** sur un restaurant afin de remplir un `HealthReport` complet (100 critères d'audit, profil Google, mots-clés, concurrents, et `businessInfo`).

---

## Phase 1 — Identification de l'entreprise

### 1.1 Recherche initiale

Effectuer ces recherches en parallèle :

| Requête | Source | Données attendues |
|---------|--------|-------------------|
| `"{nom restaurant}" {ville}` | Google / WebSearch | Site officiel, réseaux sociaux, avis |
| `"{nom restaurant}" site:google.com/maps` | Google | Fiche Google Business |
| `"{nom restaurant}" {ville}` | search.ch (Suisse) ou Pages Jaunes | Adresse, téléphone, horaires |
| `"{nom restaurant}" {ville}` | local.ch (Suisse) / Yelp (US) | Catégories, description |

### 1.2 Données à collecter (→ `businessInfo`)

```
- legalName : raison sociale exacte (registre du commerce si dispo)
- ownerName : nom du propriétaire/gérant
- address, city, state, postalCode, country
- phone + additionalPhones
- email
- website + additionalWebsites (commande en ligne, sous-domaines)
- description : texte complet de la fiche Google ou du site
- cuisineTypes : liste exhaustive
- priceRange : $, $$, $$$, $$$$
- openingHours : par jour, format local
- socialMedia : Facebook, Instagram, TikTok, Twitter, LinkedIn
- platforms : Google Maps, TripAdvisor, Yelp, TheFork, Uber Eats, Just Eat, Deliveroo
```

**Règle d'or** : Ne jamais inventer de données. Si une information n'est pas trouvable, laisser le champ vide ou `null`.

---

## Phase 2 — Analyse du site web (→ Section "Website Experience")

### 2.1 Scraping du site

```
WebFetch(url: "https://site-du-restaurant.com", prompt: "Extraire...")
```

#### Éléments à vérifier (40 critères)

| Catégorie | Points à vérifier |
|-----------|-------------------|
| **SEO technique** | Title tag, meta description, H1, schema markup, sitemap.xml, robots.txt, canonical URLs |
| **Contenu** | Page "À propos", menu en ligne (pas PDF), photos de qualité, histoire/storytelling |
| **Performance** | HTTPS, responsive mobile, vitesse de chargement, images optimisées |
| **Conversion** | Bouton de commande visible, réservation en ligne, numéro de téléphone cliquable, CTA visible |
| **Local SEO** | Nom de ville dans les titres/contenus, adresse sur le site, Google Maps intégré, NAP cohérent |
| **Réseaux sociaux** | Liens vers les réseaux, widgets d'avis, intégration Instagram |

### 2.2 Méthode d'analyse du site

1. **Page d'accueil** : `WebFetch` avec prompt détaillé demandant titre, meta, H1, liens de navigation, CTA visibles, images, texte principal
2. **Page menu** : Vérifier si le menu est en HTML (bon) ou PDF (mauvais), si les prix sont affichés, si les photos sont présentes
3. **Page contact/about** : Vérifier la présence d'adresse, téléphone, horaires, histoire du restaurant
4. **Vérifications techniques** :
   - `WebFetch(url + "/robots.txt")` → existe ?
   - `WebFetch(url + "/sitemap.xml")` → existe ?
   - Vérifier que le site charge en HTTPS (pas HTTP)
   - Vérifier la présence de schema.org/Restaurant dans le HTML

---

## Phase 3 — Analyse Google Business Profile (→ Section "Local Listings")

### 3.1 Données à collecter

```
- Nom exact affiché
- Note moyenne + nombre d'avis
- Catégories (principale + secondaires)
- Description
- Téléphone
- Site web lié
- Horaires d'ouverture
- Tranche de prix
- Photos (quantité, qualité)
- Questions/Réponses
- Posts récents
```

### 3.2 Critères d'audit (20 critères)

| Catégorie | Vérifications |
|-----------|---------------|
| **Complétude du profil** | Description remplie, catégories correctes, horaires à jour, téléphone, site web |
| **Photos** | Au moins 10 photos, photos de l'intérieur, de l'extérieur, des plats, du menu |
| **Avis** | Note > 4.0, réponses aux avis, nombre d'avis > 50, avis récents |
| **Activité** | Posts réguliers, Questions répondues, offres spéciales |
| **Cohérence NAP** | Nom, Adresse, Téléphone identiques partout (site, Google, annuaires) |

---

## Phase 4 — Analyse des mots-clés & concurrents (→ Section "Search Results")

### 4.1 Sélection des mots-clés

Choisir **5 mots-clés** pertinents :

```
Format : "Meilleur {cuisine} à {ville}" / "Best {cuisine} in {city}"
```

Exemples pour un restaurant de burger à Neuchâtel :
1. `"Meilleur burger à Neuchâtel"`
2. `"Meilleur tacos à Neuchâtel"`
3. `"Restaurant fast food Neuchâtel"`
4. `"Livraison burger Neuchâtel"`
5. `"Meilleur restaurant Neuchâtel"`

**Règles de sélection** :
- 2-3 mots-clés sur la cuisine principale
- 1 mot-clé générique (restaurant + ville)
- 1 mot-clé sur la livraison/commande si pertinent
- Toujours inclure la ville

### 4.2 Recherche par mot-clé

Pour chaque mot-clé, effectuer une `WebSearch` et collecter :

```json
{
  "keyword": "burger",
  "city": "Neuchâtel",
  "fullKeyword": "Meilleur burger à Neuchâtel",
  "mapPackRank": null,        // Position dans Google Maps (1-3 ou null)
  "organicRank": null,        // Position dans les résultats organiques (ou null)
  "winner": "Nom du #1",     // Qui est premier dans le Map Pack
  "competitors": [...],       // Top 3 du Map Pack avec notes
  "organicResults": [...]     // Top 5 résultats organiques (site, titre)
}
```

### 4.3 Analyse concurrentielle

Après avoir collecté tous les mots-clés :

1. **Dédupliquer** les concurrents qui apparaissent sur plusieurs mots-clés
2. **Trier** par fréquence d'apparition (celui qui revient le plus = principal concurrent)
3. **Garder les top 8** pour `competitorRankings`
4. **Exclure** le restaurant analysé de la liste des concurrents
5. **Collecter** la note Google de chaque concurrent

---

## Phase 5 — Audit des 100 critères

### Structure des sections

| Section | ID | Nombre de critères |
|---------|----|--------------------|
| Search Results | `search-results` | 40 |
| Website Experience | `website-experience` | 40 |
| Local Listings | `local-listings` | 20 |

### Format d'un critère

```json
{
  "title": "Titre court descriptif",
  "description": "Explication de pourquoi c'est important",
  "status": "pass | fail | warning",
  "findings": "Ce qui a été trouvé (pour fail/warning)",
  "expected": "Ce qui est attendu (pour fail/warning)"
}
```

### Règles d'évaluation

- **pass** : Le critère est satisfait. Pas de `findings`/`expected` nécessaire.
- **fail** : Le critère n'est clairement pas satisfait. Toujours fournir `findings` et `expected`.
- **warning** : Partiellement satisfait ou non vérifiable avec certitude. Fournir `findings` et `expected`.

### Catégories par section

#### Search Results (40 critères)
```
- Keyword Rankings (10) : Classement pour chaque mot-clé
- Local Pack Presence (8) : Présence dans le pack local Google
- Organic Visibility (8) : Visibilité dans les résultats organiques
- Directory Listings (7) : Présence sur annuaires (Yelp, TripAdvisor, TheFork...)
- Competitor Gap (7) : Écart avec les concurrents
```

#### Website Experience (40 critères)
```
- Technical SEO (10) : Title, meta, schema, sitemap, robots.txt
- Content Quality (8) : Textes, photos, storytelling, menu
- Mobile & Performance (8) : Responsive, vitesse, HTTPS
- Conversion Elements (7) : CTA, commande en ligne, téléphone
- Local Signals (7) : Ville dans contenu, adresse, carte
```

#### Local Listings (20 critères)
```
- Google Business Profile (8) : Complétude, photos, catégories
- Review Management (6) : Note, réponses, volume
- NAP Consistency (3) : Cohérence nom/adresse/téléphone
- Platform Presence (3) : Présence sur plateformes tierces
```

---

## Phase 6 — Calcul des scores

Les scores sont calculés dynamiquement :

```
score_section = nombre de "pass" dans la section
max_score_section = nombre total de critères dans la section
overall_score = somme des scores des 3 sections
overall_max = somme des max des 3 sections (100)
```

### Niveaux de notation

| Score (%) | Rating | Couleur |
|-----------|--------|---------|
| 0–39% | Poor | #D65353 |
| 40–59% | Fair | #F89412 |
| 60–79% | Good | #57AA30 |
| 80–100% | Excellent | #2E7D32 |

---

## Phase 7 — Assemblage du rapport

### Ordre de remplissage du JSON

1. `restaurant` — Infos de base
2. `businessInfo` — Toutes les données scrappées brutes
3. `googleProfile` — Profil Google Business
4. `keywordCards` — 5 cartes de mots-clés avec concurrents
5. `sections` — 3 sections avec 100 critères au total
6. `competitorRankings` — Top 8 dédupliqué des keywordCards
7. `revenueLoss` — Calculé : `nb_fails × 45`, top 3 problèmes
8. `overallScore` + `subScores` — Calculés depuis les critères
9. `auditSummary` — `totalReviewed: 100`, `needsWork: nb_fails + nb_warnings`
10. `caseStudies` — Exemples standard (Cyclo Noodles, Talkin' Tacos, Saffron)
11. `ctaText` + `ctaBanner` — Textes CTA standard

---

## Bonnes pratiques

### Qualité McKinsey

1. **Exhaustivité** : Ne jamais sauter un critère. 100 critères minimum.
2. **Précision** : Chaque `findings` doit citer un fait vérifiable, pas une opinion.
3. **Cohérence** : Les données de `businessInfo`, `googleProfile` et `restaurant` doivent être cohérentes.
4. **Actionabilité** : Chaque `fail` doit avoir un `expected` qui indique clairement quoi faire.
5. **Neutralité** : Pas de langage promotionnel. Constater les faits.

### Erreurs courantes à éviter

- Mettre `pass` sans avoir vérifié → Toujours vérifier via WebFetch ou WebSearch
- Inventer des notes Google ou des nombres d'avis → Toujours sourcer
- Copier-coller les mêmes concurrents pour tous les mots-clés → Chaque mot-clé a ses propres résultats
- Oublier de vérifier la cohérence NAP → Le nom, l'adresse et le téléphone doivent être identiques partout
- Mettre des URLs inventées dans `sources` → Uniquement des URLs réellement consultées

### Outils disponibles

| Outil | Usage |
|-------|-------|
| `WebSearch` | Recherche Google pour mots-clés, concurrents, présence en ligne |
| `WebFetch` | Scraper le contenu d'un site web spécifique |
| `Read` | Lire des fichiers JSON existants comme référence |
| `Write` | Créer le fichier JSON final |

### Temps estimé par restaurant

- Phase 1 (Identification) : 5-10 requêtes
- Phase 2 (Site web) : 3-5 WebFetch
- Phase 3 (Google Business) : 2-3 requêtes
- Phase 4 (Mots-clés) : 5 WebSearch + analyse
- Phase 5 (100 critères) : Rédaction basée sur les données collectées
- Phase 6-7 (Scores + assemblage) : Calcul automatique

**Total : ~20-25 requêtes par restaurant**

---

## Template de prompt pour un nouvel audit

```
Crée un rapport complet HealthReport pour le restaurant "{nom}" à {ville}.

1. Recherche toutes les informations publiques (site web, Google Maps, réseaux sociaux, annuaires)
2. Analyse le site web (SEO, contenu, performance, conversion)
3. Recherche 5 mots-clés pertinents et identifie les concurrents
4. Remplis les 100 critères d'audit (40 + 40 + 20)
5. Calcule les scores dynamiquement
6. Remplis businessInfo avec toutes les données brutes collectées

Utilise le format exact de src/data/feast-buffet.json comme référence.
Suis le protocole de docs/SCRAPING-GUIDE.md.
```
