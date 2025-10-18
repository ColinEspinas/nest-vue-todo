# Guide de développement - Application TODO

## Description du projet

Cette application est un gestionnaire de tâches (TODO) construit avec une architecture monorepo Turborepo. Elle comprend :

- **Frontend** : Application Vue 3 avec TypeScript et Vite
- **Backend** : API NestJS avec authentification JWT
- **Base de données** : SQLite avec Prisma ORM

## Architecture

Le projet suit le pattern Repository pour isoler Prisma de la logique métier :

```
nest-vue-todo/
├── apps/
│   ├── backend/         # API NestJS
│   │   ├── src/
│   │   │   ├── auth/    # Module d'authentification
│   │   │   ├── todos/   # Module de gestion des tâches
│   │   │   └── prisma/  # Service Prisma
│   │   └── prisma/      # Schéma et migrations
│   └── frontend/        # Application Vue 3
│       └── src/
│           ├── api/     # Clients API
│           ├── stores/  # Stores Pinia
│           ├── views/   # Pages (Login, Register, Todos)
│           └── router/  # Configuration du routeur
└── packages/            # Packages partagés (futurs)
```

## Fonctionnalités

### Authentification
- Inscription d'utilisateur
- Connexion avec JWT
- Protection des routes

### Gestion des tâches
- Création de tâches avec validation :
  - Titre : maximum 50 caractères
  - Contenu : maximum 256 caractères
  - Priorité : haute, moyenne ou basse
  - Date d'exécution optionnelle (format JJ/MM/AAAA)
- Affichage de la liste des tâches
- Marquage des tâches comme complétées
- Suppression des tâches
- Validation côté client et serveur

## Prérequis

- Node.js (version 20.x ou supérieure)
- npm (version 10.x ou supérieure)

## Installation

1. Cloner le dépôt :
```bash
git clone <url-du-depot>
cd nest-vue-todo
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement du backend :
```bash
cd apps/backend
# Le fichier .env est déjà créé avec les valeurs par défaut
```

4. Initialiser la base de données :
```bash
cd apps/backend
npx prisma migrate dev
```

## Démarrage de l'application

### Option 1 : Démarrer les deux applications en même temps (recommandé)

Depuis la racine du projet :
```bash
npm run dev
```

Cette commande démarre automatiquement :
- Le backend sur http://localhost:3000
- Le frontend sur http://localhost:5173

### Option 2 : Démarrer les applications séparément

#### Backend
```bash
cd apps/backend
npm run start:dev
```

Le serveur démarre sur http://localhost:3000

#### Frontend
```bash
cd apps/frontend
npm run dev
```

L'application démarre sur http://localhost:5173

## Utilisation

1. Ouvrir votre navigateur à l'adresse http://localhost:5173
2. Créer un compte en cliquant sur "S'inscrire"
3. Une fois connecté, vous pouvez :
   - Ajouter des tâches
   - Marquer les tâches comme terminées
   - Supprimer des tâches

## Tests et validation

### Backend

Compiler le backend :
```bash
cd apps/backend
npm run build
```

Lancer les tests :
```bash
cd apps/backend
npm run test
```

### Frontend

Compiler le frontend :
```bash
cd apps/frontend
npm run build
```

Les fichiers compilés seront dans `apps/frontend/dist/`

## Structure de la base de données

### Utilisateur (User)
- `id` : Identifiant unique (UUID)
- `email` : Email (unique)
- `password` : Mot de passe hashé
- `name` : Nom (optionnel)
- `createdAt` : Date de création
- `updatedAt` : Date de mise à jour

### Tâche (Todo)
- `id` : Identifiant unique (UUID)
- `title` : Titre (max 50 caractères)
- `content` : Contenu (max 256 caractères)
- `priority` : Priorité (high, medium, low)
- `executionDate` : Date d'exécution (format JJ/MM/AAAA, optionnel)
- `completed` : État de complétion (booléen)
- `userId` : Référence à l'utilisateur
- `createdAt` : Date de création
- `updatedAt` : Date de mise à jour

## API Backend

### Authentification

#### POST /auth/register
Créer un nouveau compte utilisateur.

**Body :**
```json
{
  "email": "utilisateur@example.com",
  "password": "motdepasse123",
  "name": "Nom Optionnel"
}
```

#### POST /auth/login
Se connecter à un compte existant.

**Body :**
```json
{
  "email": "utilisateur@example.com",
  "password": "motdepasse123"
}
```

**Réponse :**
```json
{
  "access_token": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "utilisateur@example.com",
    "name": "Nom Optionnel"
  }
}
```

### Tâches (authentification requise)

Toutes les requêtes suivantes nécessitent un header `Authorization: Bearer <token>`

#### GET /todos
Récupérer toutes les tâches de l'utilisateur connecté.

#### POST /todos
Créer une nouvelle tâche.

**Body :**
```json
{
  "title": "Ma tâche",
  "content": "Description de la tâche",
  "priority": "high",
  "executionDate": "25/12/2024"
}
```

#### PATCH /todos/:id
Mettre à jour une tâche.

**Body :**
```json
{
  "completed": true
}
```

#### DELETE /todos/:id
Supprimer une tâche.

## Technologies utilisées

### Backend
- **NestJS** : Framework Node.js progressif
- **Prisma** : ORM pour TypeScript et Node.js
- **SQLite** : Base de données relationnelle
- **Passport JWT** : Authentification JWT
- **bcrypt** : Hachage des mots de passe
- **class-validator** : Validation des DTOs

### Frontend
- **Vue 3** : Framework JavaScript progressif
- **TypeScript** : Typage statique
- **Vite** : Outil de build rapide
- **Vue Router** : Routage
- **Pinia** : Gestion d'état
- **Axios** : Client HTTP

### Monorepo
- **Turborepo** : Système de build pour monorepos

## Dépannage

### Le backend ne démarre pas
- Vérifiez que le port 3000 est disponible
- Vérifiez que la base de données est correctement initialisée avec `npx prisma migrate dev`

### Le frontend ne peut pas se connecter au backend
- Vérifiez que le backend est bien démarré sur http://localhost:3000
- Vérifiez la configuration CORS dans `apps/backend/src/main.ts`

### Erreurs de validation
- Le titre doit contenir moins de 50 caractères
- Le contenu doit contenir moins de 256 caractères
- La date doit être au format JJ/MM/AAAA
- Le mot de passe doit contenir au moins 6 caractères

## Notes sur l'internationalisation

L'interface utilisateur est en français, tandis que le code est en anglais pour respecter les conventions de développement internationales.

## Développement futur

Pistes d'amélioration possibles :
- Ajout de tests unitaires et e2e
- Pagination de la liste des tâches
- Filtres et recherche
- Modification des tâches existantes
- Gestion des catégories
- Notifications
- Mode sombre
