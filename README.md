# Portfolio — Sage Lusenge

Portfolio professionnel multi-page construit avec React, Express.js et MySQL.

## Pages

- Accueil
- À propos
- Réalisations
- Contact avec enregistrement en base
- Connexion administrateur sécurisée

## Installation locale

1. Installer Node.js 20+ et MySQL 8+.
2. Copier `.env.example` vers `.env`, puis renseigner les accès MySQL et un `JWT_SECRET` robuste.
3. Installer les dépendances : `npm install`.
4. Initialiser MySQL : `npm run db:init`.
5. Renseigner `ADMIN_EMAIL` et `ADMIN_PASSWORD`, puis créer le compte : `npm run db:create-admin`.
6. Lancer le site et l’API : `npm run dev`.

Le site est disponible sur `http://localhost:5173` et l’API sur `http://localhost:3000/api`.

## Déploiement Render séparé

Le fichier `render.yaml` crée deux services indépendants :

- `portfolio-sage-web` : site statique React, publié depuis `dist` ;
- `portfolio-sage-api` : API Node.js, lancée avec `npm start`.

Pour le site statique, `VITE_API_URL` doit contenir l'URL publique de l'API. Pour l'API, renseigner `CLIENT_URL`, les variables `DB_*`, `JWT_SECRET` et, si les notifications sont utilisées, les clés `VAPID_*`.

Le site statique utilise une réécriture de `/*` vers `/index.html` pour préserver les routes React. L'API expose `/health` pour les contrôles Render et `/api/health` pour vérifier la connexion MySQL.
