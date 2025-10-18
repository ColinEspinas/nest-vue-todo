# nest-vue-todo

Application de gestion de tâches (TODO) avec authentification, construite avec Vue 3 et NestJS dans un monorepo Turborepo.

## 🚀 Démarrage rapide

```bash
# Installer les dépendances
npm install

# Initialiser la base de données
cd apps/backend
npx prisma migrate dev
cd ../..

# Démarrer l'application (frontend + backend)
npm run dev
```

Ouvrez http://localhost:5173 dans votre navigateur.

## 📚 Documentation complète

Consultez le [Guide de développement](./GUIDE.md) pour des instructions détaillées sur :
- L'architecture du projet
- Les fonctionnalités
- L'API backend
- Le déploiement
- Le dépannage

## 🛠️ Technologies

- **Frontend**: Vue 3, TypeScript, Vite, Pinia
- **Backend**: NestJS, Prisma, SQLite, JWT
- **Monorepo**: Turborepo

## ✨ Fonctionnalités

- ✅ Authentification (inscription/connexion)
- ✅ Gestion de tâches (CRUD)
- ✅ Validation des données (client + serveur)
- ✅ Interface en français
- ✅ Repository pattern pour Prisma
