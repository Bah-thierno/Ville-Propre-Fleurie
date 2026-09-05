# Guinée Propre & Fleurie - Plateforme Nationale

Plateforme officielle du mouvement citoyen **Ville Propre & Fleurie - Guinée (VPF)**.

---

## 🏛️ Architecture en 3 Couches (3 Tiers)

Le projet est rigoureusement structuré en **3 couches indépendantes et connectées** :

```
┌────────────────────────────────────────────────────────────────────────┐
│                        COUCHE 1 : FRONTEND                             │
│  React 18 • TypeScript • Vite • Tailwind CSS • Framer Motion           │
│  - Emplacement : /src (Port local : 5173)                              │
│  - Interface publique & Portail Administration                         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                           Proxy / API REST (/api)
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        COUCHE 2 : BACKEND                              │
│  Node.js • Express • TypeScript • Prisma Client • JWT Auth             │
│  - Emplacement : /backend (Port local : 3000)                          │
│  - Documentation détaillée : backend/README.md                         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                            Prisma ORM (Port 5432)
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     COUCHE 3 : BASE DE DONNÉES                         │
│  PostgreSQL 15 (Docker en local / Cloud managé en production)          │
│  - Emplacement : /database & /backend/prisma                           │
│  - Documentation détaillée : database/README.md                        │
└────────────────────────────────────────────────────────────────────────┘
```

> 📖 **Guide complet d'architecture et de mise en production :** voir [ARCHITECTURE_3_TIERS.md](ARCHITECTURE_3_TIERS.md)

---

## ⚡ Démarrage Rapide en Local (3 Couches)

### Étape 1 : Démarrer la Base de Données (Couche 3)
```bash
npm run db:up
```
*(Démarre le conteneur Docker PostgreSQL `guinee_postgres` sur le port 5432)*

### Étape 2 : Démarrer le Backend API (Couche 2)
```bash
npm run dev:backend
```
*(Démarre l'API Express sur http://localhost:3000)*

### Étape 3 : Démarrer le Frontend (Couche 1)
```bash
npm run dev:frontend
```
*(Démarre le client web sur http://localhost:5173 avec proxy automatique vers le backend)*

---

## 🔑 Compte Super Administrateur (Accès Initial)

- **Page de connexion :** [http://localhost:5173/login](http://localhost:5173/login)
- **Email :** `admin@guineepropre.gn`
- **Mot de passe :** `SuperAdmin2026!`
- **Rôle :** `SUPER_ADMIN`
- **Réinitialiser / Ré-insérer le compte :** `npm run db:seed`

---

## 📁 Organisation du Répertoire

```
guinee-propre-fleurie/
├── src/                     # [COUCHE 1] Code source Frontend React
│   ├── components/          # Composants réutilisables & Layout Admin
│   ├── pages/               # Pages (Accueil, Villes, Login, Admin Dashboard)
│   └── App.tsx              # Routes React
│
├── backend/                 # [COUCHE 2] Code source Backend Express & API
│   ├── src/
│   │   ├── controllers/     # Contrôleurs (Auth, Utilisateurs, Bénévoles)
│   │   ├── routes/          # Routes REST (/api/auth, /api/users, etc.)
│   │   └── server.ts        # Point d'entrée de l'API
│   ├── prisma/              # Schéma Prisma & Seed
│   └── README.md            # Guide spécifique du Backend
│
├── database/                # [COUCHE 3] Scripts et configuration Base de Données
│   ├── docker-compose.db.yml # Lanceur Docker PostgreSQL isolé
│   ├── seed_super_admin.sql  # Script SQL manuel Super Admin
│   └── README.md             # Guide spécifique Base de Données
│
├── ARCHITECTURE_3_TIERS.md  # Guide complet de déploiement en production
├── docker-compose.yml       # Orchestration globale des 3 services
└── package.json             # Scripts unifiés pour les 3 couches
```

---

## 🚀 Résumé pour le Déploiement en Production

1. **Base de données :** Déployer une instance PostgreSQL managée (ex: Azure Flexible Server, Supabase, Neon) et récupérer `DATABASE_URL`.
2. **Backend :** Déployer l'API sur Azure App Service (Linux Node 20) ou conteneur Docker avec les variables `DATABASE_URL` et `JWT_SECRET`.
3. **Frontend :** Déployer le build (`npm run build`) sur Azure Static Web Apps ou Vercel.

---

## 📝 License

© 2024-2026 Ville Propre & Fleurie - Guinée. Tous droits réservés.
