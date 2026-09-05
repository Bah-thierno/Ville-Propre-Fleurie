# Architecture 3 Tiers & Guide de Déploiement en Production
## Projet : Guinée Propre & Fleurie (VPF)

Ce document présente de manière claire et détaillée l'architecture en **3 couches (3 tiers)** du projet ainsi que la méthodologie pour le déploiement en production.

---

## 🏛️ Vue d'Ensemble de l'Architecture 3 Tiers

```
┌──────────────────────────────────────────────────────────────┐
│                    COUCHE 1 : FRONTEND                       │
│  React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion │
│  - Interface Citoyenne & Portail Admin                       │
│  - Port local : http://localhost:5173                        │
│  - Racine du projet : /src                                   │
└──────────────────────────────┬───────────────────────────────┘
                               │
                      Requêtes HTTPS / REST API
                      Headers : Authorization Bearer <JWT>
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                    COUCHE 2 : BACKEND                        │
│  Node.js + Express 4 + TypeScript + Prisma Client + JWT Auth │
│  - Authentification (Super Admin & Gestionnaires de Villes)  │
│  - Logique métier (Bénévoles, Villes, Contacts, Rapports)   │
│  - Port local : http://localhost:3000                        │
│  - Répertoire : /backend                                     │
└──────────────────────────────┬───────────────────────────────┘
                               │
                       Connexion SQL (Port 5432)
                       Pooling & ORM Prisma
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                COUCHE 3 : BASE DE DONNÉES                    │
│  PostgreSQL 15 (Docker en local / Cloud managé en prod)     │
│  - Tables : User, PublicUser, City, ContactMessage,          │
│             VolunteerApplication, RefreshToken               │
│  - Schéma & Migrations : /backend/prisma/schema.prisma       │
└──────────────────────────────────────────────────────────────┘
```

---

## 📂 Organisation des Dossiers par Couche

### 1. Couche Frontend (Présentation)
- **Emplacement :** Racine du projet (`/`) et dossier `src/`
- **Rôle :**
  - Page d'accueil, présentation des 38 villes, projets, résultats.
  - Page de connexion sécurisée (`src/pages/Login.tsx`).
  - Layout et Tableau de bord d'administration (`src/components/layout/AdminLayout.tsx` et `src/pages/admin/Dashboard.tsx`).
- **Configuration :**
  - `vite.config.ts` : Proxy inverse configuré pour rediriger `/api` vers le backend local `http://localhost:3000`.
  - `tailwind.config.js` : Design system aux couleurs nationales et environnementales.

### 2. Couche Backend (API & Logique Métier)
- **Emplacement :** Dossier `backend/`
- **Rôle :**
  - `src/server.ts` : Point d'entrée de l'API Express, configuration CORS et middlewares.
  - `src/routes/auth.routes.ts` : Routes de connexion (`/api/auth/login`), profil (`/api/auth/me`), rafraîchissement token (`/api/auth/refresh`), et déconnexion.
  - `src/controllers/auth.controller.ts` : Vérification des identifiants (Bcrypt), génération des tokens JWT, gestion du rôle `SUPER_ADMIN`.
  - `src/middleware/auth.middleware.ts` : Protection des routes sensibles avec `authenticateToken` et `requireSuperAdmin`.

### 3. Couche Base de Données (Persistance)
- **Emplacement :** `backend/prisma/schema.prisma` et conteneur Docker `guinee_postgres`
- **Rôle :**
  - Modélisation relationnelle avec Prisma ORM.
  - Stockage persistant des utilisateurs (avec mot de passe haché par bcrypt).
  - Gestion des tokens de session et rafraîchissement (`RefreshToken`).
  - Script d'amorçage automatique (`backend/prisma/seed.ts`) pour créer le Super Administrateur.

---

## 🚀 Guide de Déploiement en Production

Pour mettre ce projet en production, vous avez 2 approches principales :

### Option A : Déploiement Cloud Moderne (PaaS Recommandé)

Cette option est la plus simple, la plus scalable et offre une haute disponibilité :

#### 1. Déployer la Base de Données (PostgreSQL)
- **Services recommandés :**
  - **Azure Database for PostgreSQL Flexible Server**
  - ou **Supabase** (PostgreSQL managé gratuit/low-cost)
  - ou **Neon.tech**
- **Action :**
  - Créer l'instance PostgreSQL sur le port 5432.
  - Récupérer l'URL de connexion sécurisée :
    `DATABASE_URL="postgresql://<user>:<password>@<host>:5432/<dbname>?sslmode=require"`
  - Exécuter la migration depuis votre terminal :
    ```bash
    cd backend
    npx prisma db push
    npm run seed
    ```

#### 2. Déployer le Backend (API Express)
- **Services recommandés :**
  - **Azure App Service (Linux Node.js 20)**
  - ou **Render.com** (Web Service Node)
  - ou **Railway.app**
- **Variables d'environnement en production :**
  - `PORT=3000`
  - `DATABASE_URL` : URL de la base de données de production.
  - `JWT_SECRET` : Clé secrète robuste (min 64 caractères aléatoires).
  - `NODE_ENV=production`
- **Commande de démarrage :**
  - Build : `npm install && npx prisma generate`
  - Start : `npm start`

#### 3. Déployer le Frontend (React Vite)
- **Services recommandés :**
  - **Azure Static Web Apps** (workflow déjà disponible dans `.github/workflows/`)
  - ou **Vercel** / **Netlify**
- **Configuration :**
  - Répertoire source : `/`
  - Commande de build : `npm run build`
  - Dossier de sortie : `dist`
  - Configurer l'URL de l'API backend dans le fichier de réécriture (`staticwebapp.config.json` ou variable `VITE_API_URL`).

---

### Option B : Déploiement Tout-en-un via Docker Compose (VPS / Serveur Dédié)

Si vous disposez d'un VPS (Ubuntu / Debian chez OVH, DigitalOcean, Hetzner, etc.) :

1. Cloner le projet sur le serveur :
   ```bash
   git clone <url-du-repo>
   cd guinee-propre-fleurie
   ```

2. Configurer les variables d'environnement dans `backend/.env` :
   ```env
   DATABASE_URL=postgresql://postgres:<mot_de_passe_securise>@postgres:5432/guinee_propre_db
   JWT_SECRET=<cle_secrete_longue>
   ```

3. Lancer les 3 couches avec Docker Compose :
   ```bash
   docker compose up -d --build
   ```

4. Exécuter le seed pour créer le Super Administrateur :
   ```bash
   docker compose exec backend npm run seed
   ```

Toutes les 3 couches démarreront automatiquement et redémarreront en cas de redémarrage du serveur (`restart: always`).

---

## 🔐 Identifiants par défaut du Super Administrateur (Dev / Init)

- **Email :** `admin@guineepropre.gn`
- **Mot de passe :** `SuperAdmin2026!`
- **Rôle :** `SUPER_ADMIN`
- **Permissions :** Accès illimité au tableau de bord, supervision nationale, gestion des villes et des bénévoles.
