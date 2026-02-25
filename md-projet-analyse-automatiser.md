# Automatisation de la Création de Rapports

> Document d'analyse — Options techniques et plan de mise en place

---

## Objectif

Automatiser le processus de création de rapports restaurant en proposant deux modes d'entrée :

1. **Formulaire web** — L'utilisateur saisit manuellement les infos (nom, email, tel du proprio + nom restaurant, lien Google, site web)
2. **Webhook / URL** — Un système externe envoie les données via URL ou API POST et le rapport se génère automatiquement

Le rapport final doit toujours être **accessible via une URL publique** (ex: `https://app.exemple.com/report/feast-buffet`).

---

## Architecture Actuelle

```
┌──────────────────────────────────────────────────────────────┐
│  CLIENT (React + Vite)                                       │
│  Routes: /report/:slug  /improve/:slug  /start/:slug         │
│  Builder: /builder?name=...&city=...&rating=...               │
│  → Données: JSON statiques OU API OU builder client-side     │
└──────────────────┬───────────────────────────────────────────┘
                   │ fetch /api/reports/:slug
┌──────────────────▼───────────────────────────────────────────┐
│  EXPRESS (port 3001)                                          │
│  GET  /api/restaurants     → liste                           │
│  GET  /api/reports/:slug   → rapport complet (scores calculés)│
│  POST /api/analyze         → HTML → Gemini → ingest → rapport │
└──────────────────┬───────────────────────────────────────────┘
                   │
┌──────────────────▼──────────┐
│  SQLite (data/reports.db)   │
│  restaurants | reports |    │
│  criteria                   │
└─────────────────────────────┘
```

**Ce qui manque** pour automatiser :
- Un **formulaire web** (page `/analyze`)
- Un **pipeline de scraping** automatisé (Google Business, SEO, PageSpeed)
- Un **système de jobs asynchrones** (le scraping + analyse prend 30-60s)
- Un **webhook endpoint** pour les déclenchements externes
- Une **analyse IA** (Claude ou Gemini) pour interpréter les données scrapées

---

## Pipeline de Génération Automatique

```
Entrée (Form ou Webhook)
   │
   ▼
┌─────────────────────────────────────────┐
│  1. COLLECTE DES DONNÉES (~15-30s)      │
│  ├─ Google Places API → infos business  │
│  ├─ PageSpeed Insights API → scores     │
│  ├─ Scrape HTML du site → SEO audit     │
│  └─ SerpAPI → keywords + concurrents    │
└────────────────┬────────────────────────┘
                 │
   ▼
┌─────────────────────────────────────────┐
│  2. ANALYSE IA (~5-10s)                  │
│  Claude Sonnet → analyse structurée     │
│  Input: données scrapées                │
│  Output: 100 critères pass/fail/warning │
│          + scores + recommandations     │
└────────────────┬────────────────────────┘
                 │
   ▼
┌─────────────────────────────────────────┐
│  3. SAUVEGARDE + NOTIFICATION (~1s)     │
│  ├─ Ingest dans SQLite/DB              │
│  ├─ Générer le slug + URL              │
│  └─ Callback webhook / email / redirect │
└────────────────┬────────────────────────┘
                 │
   ▼
  URL publique: /report/{slug}
```

---

## Option A : Formulaire Web (Page `/analyze`)

### Fonctionnement

Une nouvelle page dans l'app React avec un formulaire :

| Champ | Type | Requis |
|-------|------|--------|
| Nom du propriétaire | text | oui |
| Email | email | oui |
| Téléphone | tel | non |
| Nom du restaurant | text | oui |
| Lien Google Maps | url | non |
| Site web | url | oui |

### Flow utilisateur

```
1. User remplit le form sur /analyze
2. Submit → POST /api/reports/generate
3. Redirect vers /improve/{slug} (animation 28s)
4. En background, le pipeline collecte + analyse
5. Quand c'est prêt → /report/{slug} accessible
6. Email envoyé au proprio avec le lien du rapport
```

### Implémentation

```
src/components/analyze/
  ├─ AnalyzePage.tsx          ← Formulaire
  ├─ AnalyzeForm.tsx          ← Champs + validation
  └─ AnalyzeProgress.tsx      ← Barre de progression (polling)
```

---

## Option B : Webhook / URL Trigger

### Mode URL (GET) — Simple

```
GET /api/generate?name=Feast+Buffet&website=feastbuffet.com&place_id=ChIJ...
```

Utile pour : liens dans des emails, intégrations simples, tests rapides.

### Mode Webhook (POST) — Production

```
POST /api/reports/generate
Authorization: Bearer <api-key>
Content-Type: application/json

{
  "owner_name": "John Doe",
  "owner_email": "john@example.com",
  "owner_phone": "+1-425-235-1888",
  "restaurant_name": "Feast Buffet",
  "website_url": "https://feastbuffet.com",
  "google_place_id": "ChIJ...",
  "locale": "fr",
  "callback_url": "https://crm.exemple.com/webhook/report-ready"
}
```

Réponse immédiate (< 1s) :
```json
{
  "job_id": "rpt_abc123",
  "status": "queued",
  "report_url": "https://app.exemple.com/report/feast-buffet-renton",
  "poll_url": "/api/reports/rpt_abc123/status"
}
```

Callback quand terminé :
```json
POST https://crm.exemple.com/webhook/report-ready
{
  "job_id": "rpt_abc123",
  "status": "complete",
  "report_url": "https://app.exemple.com/report/feast-buffet-renton",
  "score": 47
}
```

---

## APIs de Scraping Nécessaires

| Donnée | API | Coût | Rôle |
|--------|-----|------|------|
| Infos Google Business | **Google Places API** | $17/1000 requêtes | Nom, adresse, tel, avis, horaires, catégories |
| Mots-clés + concurrents | **SerpAPI** | $50/mo (5000 recherches) | Rankings Google Maps + Search |
| Audit site web (perf) | **PageSpeed Insights API** | **Gratuit** | Scores Lighthouse, Core Web Vitals |
| Audit SEO (contenu) | **Scrape HTML + Cheerio** | Gratuit (self-hosted) | Meta tags, H1, schema, alt, etc. |
| Analyse IA | **Claude API (Sonnet)** | ~$0.02/rapport | Interprétation + scoring des 100 critères |

**Coût estimé par rapport** : ~$0.05–0.10
**Coût pour 1000 rapports/mois** : ~$100-150

---

## Analyse IA : Claude vs Gemini

| Critère | Claude (Anthropic) | Gemini (Google) |
|---------|-------------------|-----------------|
| Qualité d'analyse | Excellent | Bon |
| JSON structuré | Fiable (tool use) | Bon (JSON mode) |
| Coût par rapport | ~$0.02 (Sonnet) | ~$0.01 (Flash) |
| Déjà utilisé dans le projet | Non | Oui (extract.ts) |
| Contexte max | 200K tokens | 1M tokens |

**Recommandation** : Utiliser **Claude Sonnet** pour l'analyse qualitative (recommandations, interprétation) et garder **Gemini Flash** pour l'extraction HTML brute (déjà en place).

---

## Système de Jobs Asynchrones

Le pipeline prend 30-60 secondes. Il faut un système async.

### Comparaison

| | BullMQ | Inngest | QStash (Upstash) |
|---|---|---|---|
| Infra requise | Redis | Aucune (managed) | Aucune (managed) |
| Fonctionne sur Vercel | Non | **Oui** | **Oui** |
| Fonctionne sur cPanel | Difficile | Non | **Oui** |
| Fonctionne sur VPS | **Oui** | Oui | Oui |
| Retry par étape | Oui | **Oui (natif)** | Manuel |
| Dashboard | BullBoard | **Intégré** | Basique |
| Coût | Gratuit + Redis | Free tier 500 runs/mo | Free tier 500 msg/jour |

### Recommandation par plateforme

- **Vercel** → Inngest (chaque étape du pipeline est un `step.run()` indépendant, retry automatique)
- **VPS** → BullMQ + Redis (contrôle total, gratuit)
- **cPanel** → QStash (HTTP-only, pas besoin de worker persistant)

---

## Options de Déploiement

### Option 1 : Vercel (Recommandé pour commencer)

```
Avantages :
  ✅ Déploiement automatique (git push)
  ✅ CDN mondial pour le frontend
  ✅ Serverless functions pour l'API
  ✅ HTTPS gratuit
  ✅ Preview deployments par PR
  ✅ Free tier généreux

Inconvénients :
  ❌ Pas de SQLite (filesystem éphémère)
  ❌ Timeout 10s (Hobby) / 60s (Pro à $20/mo)
  ❌ Besoin de Turso ou Supabase pour la DB

Architecture :
  Frontend  → Vercel CDN (build Vite)
  API       → Vercel Serverless Functions (/api/*.ts)
  DB        → Turso (SQLite over HTTP, free tier)
  Jobs      → Inngest (free tier 500 runs/mo)
```

**Structure Vercel :**
```
/
├── api/
│   ├── reports/
│   │   ├── generate.ts      ← POST webhook + form submit
│   │   ├── [slug].ts        ← GET rapport
│   │   └── [id]/status.ts   ← GET polling
│   └── restaurants.ts        ← GET liste
├── src/                       ← React SPA
├── vercel.json
└── package.json
```

### Option 2 : VPS (DigitalOcean / Hetzner)

```
Avantages :
  ✅ Contrôle total
  ✅ SQLite natif (pas de migration DB)
  ✅ Pas de timeout
  ✅ Redis + BullMQ locaux
  ✅ $5-10/mois

Inconvénients :
  ❌ Setup manuel (Nginx, PM2, SSL)
  ❌ Pas de scaling automatique
  ❌ Maintenance serveur

Architecture :
  Nginx → reverse proxy
  PM2   → Express + Worker
  Redis → file d'attente jobs
  SQLite → data/reports.db
```

### Option 3 : cPanel

```
Avantages :
  ✅ Tu l'as déjà
  ✅ SQLite fonctionne
  ✅ Simple à déployer

Inconvénients :
  ❌ Passenger (pas PM2), instable pour long-running
  ❌ Pas de Redis / workers background
  ❌ Pas de WebSockets
  ❌ Node.js versions parfois anciennes
  ❌ Mauvais pour les jobs async (timeout ~30s)

Verdict : Utilisable pour servir les rapports statiques,
mais PAS adapté pour le pipeline de génération automatique.
```

### Recommandation Finale

| Besoin | Solution |
|--------|----------|
| **MVP rapide** | **Vercel** + Inngest + Turso |
| **Production stable** | **VPS** ($6/mo Hetzner) + BullMQ + Redis |
| **Budget zéro** | **Vercel free** + traitement synchrone (timeout risk) |
| **Rapports existants seulement** | **cPanel** (servir le frontend + JSON statiques) |

---

## Plan de Mise en Place (Étapes)

### Phase 1 — API de génération (1-2 jours)

- [ ] Créer `POST /api/reports/generate` (accepte form + webhook)
- [ ] Intégrer Google Places API (récupérer infos business)
- [ ] Intégrer PageSpeed Insights API (scores Lighthouse)
- [ ] Scraper HTML du site avec Cheerio (audit SEO basique)
- [ ] Intégrer Claude Sonnet pour l'analyse des 100 critères

### Phase 2 — Formulaire web (1 jour)

- [ ] Créer la page `/analyze` avec le formulaire
- [ ] Validation des champs (Zod ou simple)
- [ ] Submit → appel API → redirect vers `/improve/{slug}`
- [ ] Polling du status pendant l'animation improve

### Phase 3 — Jobs async (1 jour)

- [ ] Setup Inngest (Vercel) ou BullMQ (VPS)
- [ ] Découper le pipeline en étapes avec retry
- [ ] Endpoint de polling `GET /api/reports/:id/status`
- [ ] Callback webhook optionnel

### Phase 4 — Déploiement (1 jour)

- [ ] Configurer Vercel ou VPS
- [ ] Migrer SQLite vers Turso (si Vercel)
- [ ] Variables d'environnement (API keys)
- [ ] Domaine custom + HTTPS
- [ ] Tests end-to-end

### Phase 5 — Notifications (optionnel)

- [ ] Email au proprio quand le rapport est prêt (Resend / Postmark)
- [ ] SMS optionnel (Twilio)

---

## Coûts Mensuels Estimés

| Service | Free Tier | Production (~500 rapports/mo) |
|---------|-----------|-------------------------------|
| Vercel | Oui (Hobby) | $20/mo (Pro) |
| Turso (DB) | 500 DBs, 9GB | Gratuit |
| Inngest (jobs) | 500 runs/mo | Gratuit |
| Google Places API | $200 credit/mo | ~$8.50 |
| SerpAPI | — | $50/mo |
| PageSpeed API | Illimité | Gratuit |
| Claude API (Sonnet) | — | ~$10 |
| Domaine | — | ~$12/an |
| **Total** | **~$0** | **~$90/mo** |

---

## Résumé des Décisions à Prendre

1. **Plateforme de déploiement** : Vercel vs VPS vs cPanel ?
2. **Base de données** : Garder SQLite (VPS/cPanel) ou migrer Turso (Vercel) ?
3. **IA pour l'analyse** : Claude Sonnet seul ou Claude + Gemini ?
4. **Données Google** : Google Places API (officiel) ou SerpAPI (plus riche) ?
5. **Jobs async** : Inngest (serverless) ou BullMQ (self-hosted) ?
6. **Notifications** : Email seul ou email + SMS ?
