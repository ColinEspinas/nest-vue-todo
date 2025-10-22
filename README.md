# 📝 Todo App Vue + NestJS

> Application de gestion de tâches moderne, rapide et typée, construite avec Vue 3, NestJS, Prisma et Turborepo.

---

## ✨ Fonctionnalités

- Inscription et connexion
- Création et suppression de tâches
- Priorisation et échéance des tâches
- Filtrage et affichage des tâches
- Statistiques personnelles

---

## 🚀 Technologies

**Backend**

- [NestJS](https://nestjs.com/) · Framework Node.js
- [Prisma](https://prisma.io/) · ORM
- [SQLite](https://www.sqlite.org/) · Base de données embarquée

**Frontend**

- [Vue 3](https://vuejs.org/) · Framework JavaScript
- [VueUse](https://vueuse.org/) · Collection de composables Vue
- [Reka UI](https://reka-ui.com/) · Bibliothèque de composants UI
- [Tailwind CSS](https://tailwindcss.com/) · Framework CSS
- [Vite](https://vitejs.dev/) · Build tool

**Architecture**

- [Turborepo](https://turbo.build/) · Monorepo avec `apps/api` et `apps/web`

---

## ⚡️ Installation & Démarrage rapide

### Prérequis

- Node.js >= 18
- npm >= 10

### Installation

1. **Cloner le projet**

   ```bash
   git clone https://github.com/ColinEspinas/nest-vue-todo
   cd nest-vue-todo
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**

   Vous pouvez copier les fichiers d'exemple fournis :

   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```

   Voir la [section Variables d'environnement](#variables-denvironnement) pour la configuration détaillée.

4. **Appliquer les migrations et générer le client Prisma**

   ```bash
   cd apps/api
   npx prisma migrate dev   # Appliquer les migrations (création de la base)
   npx prisma generate      # Générer le client Prisma
   cd ../..
   ```

5. **Lancer l'application**

   ```bash
   npm run dev
   ```

### Accès aux services

- **Frontend** : http://localhost:3001
- **API** : http://localhost:3000
- **Base de données** : Par défaut c'est le fichier `apps/api/prisma/dev.db` (SQLite)

---

## 🔑 Variables d'environnement

### API Backend (`apps/api/.env`)

| Variable     | Description                      | Valeur par défaut     | Requis |
| ------------ | -------------------------------- | --------------------- | ------ |
| DATABASE_URL | Chemin vers la base SQLite       | file:./dev.db         | ✅     |
| JWT_SECRET   | Clé secrète JWT (32+ caractères) | -                     | ✅     |
| FRONTEND_URL | URL du frontend pour CORS        | http://localhost:3001 | ✅     |
| PORT         | Port de l'API                    | 3000                  | ❌     |

### Frontend (`apps/web/.env`)

| Variable          | Description                      | Valeur par défaut     | Requis |
| ----------------- | -------------------------------- | --------------------- | ------ |
| VITE_API_BASE_URL | URL de l'API backend             | http://localhost:3000 | ✅     |
| PORT              | Port du serveur de développement | 3001                  | ❌     |

> **Important** : Seul `JWT_SECRET` doit être modifié obligatoirement avec une valeur sécurisée.

---

## 🛠️ Commandes de développement

### Commandes globales (racine du projet)

```bash
npm run dev         # Démarrer frontend + backend en mode développement
npm run build       # Build complet des deux apps
npm run test        # Lancer tous les tests
npm run lint        # Linting global
```

### API (NestJS)

```bash
cd apps/api
npm run dev         # Démarrage API en mode développement
npm run build       # Build production API
npm run test        # Tests unitaires
npm run lint        # Linting API
npm prisma migrate dev    # Migration DB (dev)
npm prisma migrate deploy # Migration DB (prod)
npm prisma studio         # Interface graphique DB
```

### Frontend (Vue 3)

```bash
cd apps/web
npm run dev         # Démarrage frontend en mode développement
npm run build       # Build production frontend
npm run test:unit   # Tests unitaires
npm run lint        # Linting frontend
```

---

## 🗂️ Structure du projet

```text
nest-vue-todo/
├── apps/
│   ├── api/                    # Backend NestJS
│   │   ├── src/
│   │   │   ├── auth/           # Module authentification
│   │   │   ├── tasks/          # Module tâches
│   │   │   ├── users/          # Module utilisateurs
│   │   │   └── prisma.service.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Schéma DB
│   │   │   └── migrations/     # Migrations
│   │   └── test/               # Config Jest
│   └── web/                    # Frontend Vue 3
│       ├── src/
│       │   ├── components/     # Composants Vue
│       │   ├── composables/    # Composables
│       │   ├── stores/         # Stores Pinia
│       │   ├── views/          # Pages
│       │   └── types/          # Types TypeScript
│       └── public/             # Assets statiques
├── docs/                       # Documentation
├── turbo.json                  # Config Turborepo
└── package.json                # Package racine
```

---

## 📚 API Endpoints

**Authentification**

- `POST /auth/register` — Inscription
- `POST /auth/login` — Connexion
- `GET /auth/me` — Informations utilisateur

**Tâches**

- `GET /tasks` — Liste des tâches
- `POST /tasks` — Créer une tâche
- `PUT /tasks/:id` — Modifier une tâche
- `DELETE /tasks/:id` — Supprimer une tâche

---

## ✅ Tests

L'API dispose d'une suite de tests complète :

### Tests unitaires

```bash
cd apps/api
npm run test              # Tous les tests
npm run test:watch        # Mode watch
npm run test:cov          # Avec couverture
```

Les tests couvrent :

- Services et contrôleurs d'authentification et de gestion des tâches
- Validation des données et gestion d'erreurs

---

### Points d'amélioration

- Ce readme n'est pas très beau car généré automatiquement puis corrigé manuellement, il faudrait le rendre plus lisible et agréable.
- Le sort par priorité n'est pas bon, de ce que j'ai pu voir il faudrait faire une raw query mais je n'ai pas eu le temps d'aller plus loin.
- Edition des taches en réutilisant le même composant que pour la création.
- Meilleure page d'accueil, actuellement très basique.
- Ajouter des tests en end-to-end (E2E) pour le frontend et le backend.
- Ajouter un docker compose pour faciliter le développement.
- Mieux utiliser le monorepo en partageant du code entre les apps (par exemple, les types).

## 📝 Licence

Ce projet est sous licence MIT.

## 🔗 Ressources

- [Documentation NestJS](https://docs.nestjs.com/)
- [Guide Vue 3](https://vuejs.org/guide/)
- [Documentation Prisma](https://www.prisma.io/docs/)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
