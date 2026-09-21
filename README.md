# Portfolio - Sage Lusenge

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
6. Lancer le site et l'API : `npm run dev`.

Le site est disponible sur `http://localhost:5173` et l'API sur `http://localhost:3000/api`.

## Déploiement Render recommandé

Le frontend et le backend sont séparés pour que le portfolio public soit servi comme site statique, sans attendre le réveil du serveur Node.

### 1. Web static

- Type : Static Site
- Build Command : `npm ci && npm run build`
- Publish Directory : `dist`
- Variable d'environnement : `VITE_API_URL=https://portfolio-sage-api.onrender.com`
- Rewrite React Router : `/*` vers `/index.html`

### 2. API Node

- Type : Web Service
- Build Command : `npm ci`
- Start Command : `npm start`
- Health Check Path : `/health`
- Variables d'environnement :
  - `CLIENT_URL=https://portfolio-sage-web.onrender.com`
  - `DB_HOST`
  - `DB_PORT`
  - `DB_USER`
  - `DB_PASSWORD`
  - `DB_NAME`
  - `JWT_SECRET`

Le fichier `render.yaml` décrit ces deux services. Après création sur Render, remplace les URLs `portfolio-sage-web.onrender.com` et `portfolio-sage-api.onrender.com` si Render génère d'autres noms.

## Production locale

`npm run build` génère le frontend statique dans `dist`. `npm start` lance uniquement l'API Express.