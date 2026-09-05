# ⚙️ COUCHE 2 : BACKEND & API REST
## Projet : Guinée Propre & Fleurie (VPF)

Ce dossier contient la **deuxième couche (Tier 2)** : le serveur d'API REST propulsé par Express et TypeScript.

---

## 📋 Informations Générales

- **Environnement :** Node.js 20+
- **Langage :** TypeScript 5
- **Framework Web :** Express 4
- **ORM :** Prisma 7 (`@prisma/client` + `@prisma/adapter-pg`)
- **Authentification :** JWT (JsonWebToken) + Bcrypt (hash 10 rounds)
- **Port local par défaut :** `3000`

---

## 📁 Architecture des Fichiers

```
backend/
├── prisma/
│   ├── schema.prisma      # Modélisation des données PostgreSQL
│   └── seed.ts            # Création automatique du Super Administrateur
├── src/
│   ├── controllers/       # Logique de traitement des requêtes
│   │   ├── auth.controller.ts       # Login, Refresh, Logout, /me
│   │   ├── user.controller.ts       # Utilisateurs & Annuaire
│   │   ├── volunteer.controller.ts  # Candidatures bénévoles
│   │   └── contact.controller.ts    # Messages de contact
│   ├── middleware/        # Sécurité et validation
│   │   ├── auth.middleware.ts       # Vérification JWT & requireSuperAdmin
│   │   ├── validators.ts            # Validation express-validator
│   │   └── error.middleware.ts     # Gestion globale des erreurs
│   ├── routes/            # Points d'entrée de l'API
│   │   ├── auth.routes.ts           # /api/auth/login, /api/auth/me
│   │   ├── user.routes.ts           # /api/users
│   │   ├── volunteer.routes.ts      # /api/volunteers
│   │   └── contact.routes.ts        # /api/contact
│   ├── lib/
│   │   └── prisma.ts      # Instance centralisée PrismaClient avec adaptateur PG
│   └── server.ts          # Démarrage de l'application et configuration CORS
├── .env                   # Variables d'environnement
├── prisma.config.ts       # Configuration de connexion Prisma 7
├── package.json           # Dépendances et scripts
└── Dockerfile             # Construction de l'image de production
```

---

## 🔑 Endpoints Principaux

### 1. Authentification (`/api/auth`)
- `POST /api/auth/login` : Connexion avec email et mot de passe (retourne `token`, `refreshToken`, et l'objet `user`).
- `GET /api/auth/me` : Vérification du profil et du rôle connecté (Header : `Authorization: Bearer <token>`).
- `POST /api/auth/refresh` : Renouvellement du token JWT d'accès.
- `POST /api/auth/logout` : Révocation du refresh token.

### 2. Formulaires & Public
- `POST /api/contact` : Soumission de message de contact.
- `POST /api/volunteers` : Dépôt de candidature de bénévole.
- `GET /api/users` : Annuaire public des membres et bénévoles.

### 3. Santé du service
- `GET /api/health` : Retourne `{ status: 'ok', service: 'VPF Backend API' }`.

---

## 💻 Commandes Utiles (Local)

```bash
# 1. Démarrer le serveur backend en mode développement
npm run dev

# 2. Insérer le Super Admin
npm run seed

# 3. Synchroniser la base PostgreSQL
npx prisma db push
```

---

## 🚀 Mise en Production du Backend

### Option A : Azure App Service (Recommandé)
1. Créez un **Web App Linux** avec le runtime **Node.js 20 LTS**.
2. Dans **Configuration > Paramètres d'application**, définissez :
   - `PORT=3000`
   - `DATABASE_URL=postgresql://...` (URL de votre base Azure PostgreSQL)
   - `JWT_SECRET=votre_cle_secrete_longue_et_aleatoire`
   - `NODE_ENV=production`
3. Déployez le code via GitHub Actions ou Azure CLI (`az webapp up`).

### Option B : Déploiement Conteneur Docker (Render, Railway, VPS)
Le fichier `Dockerfile` est déjà prêt à l'emploi. Il suffit d'exécuter :
```bash
docker build -t vpf-backend ./backend
docker run -p 3000:3000 --env-file ./backend/.env vpf-backend
```
