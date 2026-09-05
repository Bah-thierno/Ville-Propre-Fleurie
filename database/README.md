# 🗄️ COUCHE 3 : BASE DE DONNÉES (DATABASE LAYER)
## Projet : Guinée Propre & Fleurie (VPF)

Ce dossier représente la **troisième couche (Tier 3)** de l'application : la couche de persistance des données.

---

## 📋 Informations Générales

- **SGBD :** PostgreSQL 15
- **ORM :** Prisma 7 (`@prisma/client` + `@prisma/adapter-pg`)
- **Port local par défaut :** `5432`
- **Nom de la base locale :** `guinee_propre_db`
- **Utilisateur par défaut :** `postgres`
- **Mot de passe par défaut :** `password`
- **Emplacement du Schéma Prisma :** `../backend/prisma/schema.prisma`
- **Configuration Prisma :** `../backend/prisma.config.ts`

---

## 🏗️ Structure des Tables

| Table | Description | Rôle dans l'application |
|---|---|---|
| `User` | Comptes administrateurs | Accès au dashboard (`SUPER_ADMIN` ou `CITY_MANAGER`). Contient mot de passe hashé (bcrypt). |
| `RefreshToken` | Sessions et jetons d'actualisation | Maintien sécurisé des connexions administrateurs. |
| `City` | Données des 38 villes de Guinée | Contenu riche (statistiques, fondateurs, photos avant/après, bureaux). |
| `PublicUser` | Bénévoles et membres publics | Annuaire des bénévoles engagés, matricules et rôles communautaires. |
| `VolunteerApplication` | Candidatures de bénévolat | Formulaire citoyen de recrutement soumis depuis le site web. |
| `ContactMessage` | Formulaire de contact | Messages envoyés par les visiteurs du site web. |

---

## 💻 Commandes Utiles (Développement Local)

Depuis la racine du projet :

```bash
# 1. Démarrer la base de données PostgreSQL dans Docker
npm run db:up

# 2. Synchroniser le schéma Prisma avec PostgreSQL
cd backend
npx prisma db push

# 3. Créer ou mettre à jour le compte Super Administrateur
npm run seed

# 4. Ouvrir l'explorateur visuel de données (Prisma Studio)
npx prisma studio

# 5. Arrêter la base de données locale
npm run db:down
```

---

## 🚀 Déploiement en Production (Mise en Production)

Pour la production, la base de données ne doit pas utiliser les identifiants de développement par défaut. Vous avez 2 options :

### Option 1 : PostgreSQL Managé dans le Cloud (Recommandé)

1. **Fournisseurs compatibles :**
   - **Azure Database for PostgreSQL Flexible Server** (Recommandé pour un écosystème Azure)
   - **Supabase** (PostgreSQL managé très performant)
   - **Neon.tech** (PostgreSQL Serverless)
   - **AWS RDS PostgreSQL**

2. **Étapes de configuration :**
   - Créez votre instance PostgreSQL dans la région la plus proche (ex: Europe West ou Afrique du Sud).
   - Récupérez la chaîne de connexion sécurisée (SSL activé) :
     ```env
     DATABASE_URL="postgresql://<UTILISATEUR>:<MOT_DE_PASSE>@<HOTE>:5432/<NOM_BASE>?sslmode=require"
     ```
   - Renseignez cette variable `DATABASE_URL` dans les paramètres de votre service Backend (ex: Azure App Service).
   - Déployez le schéma vers la base de production :
     ```bash
     cd backend
     npx prisma db push
     npm run seed
     ```

### Option 2 : PostgreSQL sur Serveur Dédié / VPS (Docker Compose)

Si vous hébergez vous-même sur un VPS Ubuntu :
1. Modifiez les variables dans votre fichier `.env` sur le serveur :
   ```env
   POSTGRES_USER=vpf_prod_admin
   POSTGRES_PASSWORD=un_mot_de_passe_tres_long_et_securise_2026
   POSTGRES_DB=guinee_propre_db
   ```
2. Lancez le service avec `docker compose up -d postgres`.
3. Configurez une sauvegarde automatique quotidienne (cron) :
   ```bash
   docker exec -t guinee_postgres pg_dumpall -c -U postgres > /backups/dump_$(date +%Y%m%d).sql
   ```
