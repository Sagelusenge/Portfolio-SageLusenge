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

## Production

`npm run build` génère le frontend dans `dist/client`. `npm start` lance Express, qui sert aussi les pages React compilées.
