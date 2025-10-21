# 📝 Todo App Vue + NestJS

Une application de gestion de tâches simple et élégante construite avec **Vue 3** et **NestJS**. Ce projet open-source démontre l'utilisation moderne des technologies web avec TypeScript, une interface utilisateur propre et une architecture bien structurée.

## ✨ Fonctionnalités

- 🔐 **Authentification** - Système d'auth JWT avec hachage bcrypt
- 📋 **Gestion des tâches** - Créer, modifier, supprimer des tâches avec priorités et échéances
- 🎨 **Interface moderne** - Vue 3 + Composition API avec Tailwind CSS
- 📱 **Design responsive** - Fonctionne parfaitement sur mobile et desktop
- ⚡ **États de chargement** - Skeleton loading pour une meilleure UX
- ✅ **Validation** - Validation côté client avec Zod et retours visuels
- 🏪 **Gestion d'état** - Stores Pinia pour l'état centralisé

## 🏗️ Architecture

Ce projet utilise un monorepo Turborepo avec :

### Applications

- **`apps/api`** - API REST NestJS avec Prisma ORM
- **`apps/web`** - Application Vue 3 avec TypeScript

### Technologies utilisées

**Backend :**

- [NestJS](https://nestjs.com/) - Framework Node.js
- [Prisma](https://prisma.io/) - ORM type-safe
- [SQLite](https://sqlite.org/) - Base de données
- [JWT](https://jwt.io/) - Authentification
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js/) - Hachage des mots de passe

**Frontend :**

- [Vue 3](https://vuejs.org/) - Framework JavaScript
- [TypeScript](https://www.typescriptlang.org/) - Typage statique
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Reka UI](https://reka-ui.com/) - Composants UI
- [Pinia](https://pinia.vuejs.org/) - Gestion d'état
- [Zod](https://zod.dev/) - Validation de schémas
- [Vite](https://vitejs.dev/) - Build tool

**Outils de développement :**

- [Turborepo](https://turbo.build/) - Monorepo
- [ESLint](https://eslint.org/) - Linting
- [Prettier](https://prettier.io) - Formatage

## 🚀 Installation

### Prérequis

- Node.js >= 18
- npm >= 10

### Étapes

1. **Cloner le projet**

   ```bash
   git clone <repository-url>
   cd nest-vue-todo
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configurer la base de données**

   ```bash
   cd apps/api
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Variables d'environnement**

   Créer `apps/api/.env` :

   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="votre-cle-secrete-jwt"
   ```

5. **Lancer l'application**

   ```bash
   # Depuis la racine
   npm run dev
   ```

   L'application sera accessible à :
   - API : `http://localhost:3000`
   - Web : `http://localhost:5173`

## 📖 Utilisation

### API Endpoints

**Authentification :**

- `POST /auth/register` - Créer un compte
- `POST /auth/login` - Se connecter
- `GET /auth/me` - Infos utilisateur

**Tâches :**

- `GET /tasks` - Récupérer les tâches
- `POST /tasks` - Créer une tâche
- `PUT /tasks/:id` - Modifier une tâche
- `DELETE /tasks/:id` - Supprimer une tâche

### Fonctionnalités

**Gestion des tâches :**

- Créer des tâches avec titre, description et priorité (haute/moyenne/basse)
- Définir des échéances optionnelles
- Marquer comme terminé/en cours
- Supprimer avec confirmation
- Statistiques en temps réel

**Interface :**

- Validation de formulaires en temps réel
- États de chargement skeleton
- Design responsive
- Tooltips informatifs

## 🛠️ Développement

### Commandes disponibles

**Racine du projet :**

```bash
npm run dev          # Démarrer en mode développement
npm run build        # Build pour production
npm run lint         # Analyser le code
npm run test         # Lancer les tests
npm run format       # Formater avec Prettier
npm run check-types  # Vérifier les types
```

**API :**

```bash
cd apps/api
npm run dev          # API en mode watch
npm run build        # Build API
npm run start:prod   # Démarrer en production
npm run test         # Tests unitaires
npm run test:e2e     # Tests end-to-end
```

**Web :**

```bash
cd apps/web
npm run dev          # Serveur de dev Vite
npm run build        # Build pour production
npm run preview      # Prévisualiser le build
npm run test:unit    # Tests unitaires
npm run type-check   # Vérifier les types
```

### Base de données

```bash
cd apps/api

# Créer une migration
npx prisma migrate dev --name nom-migration

# Réinitialiser la DB
npx prisma migrate reset

# Interface Prisma Studio
npx prisma studio

# Générer le client
npx prisma generate
```

## 📁 Structure du projet

```
nest-vue-todo/
├── apps/
│   ├── api/                    # Backend NestJS
│   │   ├── src/
│   │   │   ├── auth/          # Module authentification
│   │   │   ├── tasks/         # Module tâches
│   │   │   ├── users/         # Module utilisateurs
│   │   │   └── prisma.service.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma  # Schéma DB
│   │   │   └── migrations/    # Migrations
│   │   └── test/              # Tests E2E
│   └── web/                   # Frontend Vue 3
│       ├── src/
│       │   ├── components/    # Composants Vue
│       │   ├── composables/   # Composables
│       │   ├── stores/        # Stores Pinia
│       │   ├── views/         # Pages
│       │   └── types/         # Types TypeScript
│       └── public/            # Assets statiques
├── docs/                      # Documentation
├── turbo.json                 # Config Turborepo
└── package.json               # Package racine
```

## 🎨 Composants

L'application utilise un système de design modulaire :

- **Composants de base** : Boutons, inputs, checkboxes réutilisables
- **Composants métier** : Listes de tâches, formulaires, navigation
- **Composants skeleton** : États de chargement
- **Tags** : Indicateurs de priorité, échéances et statuts

## � Sécurité

- Mots de passe hachés avec bcrypt
- Authentification JWT stateless
- Validation côté client et serveur
- Configuration CORS appropriée

## 🧪 Tests

- **Tests unitaires** : Jest (API) + Vitest (Frontend)
- **Tests E2E** : Configuration complète pour l'API
- **Vérification de types** : TypeScript en mode strict

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🤝 Contribuer

Les contributions sont les bienvenues ! Voici comment procéder :

1. Forker le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commiter les changements (`git commit -am 'Ajouter une nouvelle fonctionnalité'`)
4. Pousser vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 🔗 Liens utiles

- [Documentation NestJS](https://docs.nestjs.com/)
- [Guide Vue 3](https://vuejs.org/guide/)
- [Documentation Prisma](https://www.prisma.io/docs/)
- [Documentation Turborepo](https://turbo.build/repo/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)

---

Fait avec ❤️ - Un projet open-source simple et propre

</div>
