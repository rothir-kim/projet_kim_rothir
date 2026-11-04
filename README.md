# Projet pollutions – Kim Rothir

Application de recensement et de gestion des pollutions observées sur le terrain.

- `api/` : API REST Node.js / Express en TypeScript, données stockées dans PostgreSQL (via Sequelize)
- `Front/` : application Angular

## Lancer l'API en local

### Prérequis

- Node.js 20 ou plus
- PostgreSQL installé sur le PC (port par défaut `5432`)
- Une base `pollution_db` créée (par exemple avec pgAdmin)

### Installation

```bash
cd api
npm install
```

Créer un fichier `api/.env` (il n'est pas envoyé sur GitHub) :

```
DATABASE_URL=postgres://postgres:MOT_DE_PASSE@localhost:5432/pollution_db
```

Puis lancer :

```bash
npm run dev
```

Au premier lancement, la table `pollution` est créée automatiquement et remplie avec les données de `api/pollutions.json`.

L'API écoute sur `http://localhost:3000`.

### Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Lance l'API en développement (redémarre à chaque modification) |
| `npm run build` | Compile le TypeScript dans `dist/` |
| `npm run start` | Lance la version compilée (utilisé par Render) |

### Variables d'environnement

| Variable | Rôle | Valeur par défaut |
|---|---|---|
| `DATABASE_URL` | Adresse de connexion à la base PostgreSQL | aucune (obligatoire) |
| `PORT` | Port d'écoute du serveur | `3000` |
| `ORIGINES_AUTORISEES` | Origines autorisées par CORS, séparées par des virgules | `http://localhost:4200` |

### Routes

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/health` | Vérifie que l'API fonctionne |
| GET | `/api/pollutions` | Liste des pollutions (de la plus récente à la plus ancienne) |
| GET | `/api/pollutions/:id` | Détail d'une pollution |
| POST | `/api/pollutions` | Ajoute une pollution (réponse `201`) |
| PUT | `/api/pollutions/:id` | Modifie une pollution |
| DELETE | `/api/pollutions/:id` | Supprime une pollution (réponse `204`) |

En cas de données invalides (champ vide, type inconnu, latitude hors limites…), l'API répond `400`.
Si la pollution n'existe pas, elle répond `404`.

### Organisation du code (`api/src/`)

```
src/
├── index.ts                         démarrage du serveur
├── config.ts                        lecture des variables d'environnement
├── models/
│   ├── index.ts                     connexion à la base (Sequelize)
│   └── pollution.model.ts           description de la table pollution
├── controllers/
│   └── pollution.controller.ts      ce que fait chaque route
└── routes/
    └── pollution.routes.ts          les adresses de l'API
```

## Lancer le front

```bash
cd Front
npm install
ng serve
```

L'application est disponible sur `http://localhost:4200`.

L'URL de l'API dépend de l'environnement (remplacement configuré par `fileReplacements` dans `angular.json`) :

- développement (`ng serve`) : `src/environments/environment.development.ts` → `http://localhost:3000/api`
- production (`ng build`) : `src/environments/environment.ts` → `https://projet-kim-rothir-api.onrender.com/api`

## Déploiement

Le déploiement sur Render est décrit dans le fichier `render.yaml` (Blueprint) :

- une base PostgreSQL `pollution-db` (offre gratuite)
- l'API `projet-kim-rothir-api`, qui reçoit automatiquement l'adresse de la base dans `DATABASE_URL`

Adresses :

- API : https://projet-kim-rothir-api.onrender.com/api/pollutions
- Front : https://… (à compléter)

> Sur l'offre gratuite de Render, l'API se met en veille après une période d'inactivité :
> la première requête peut prendre jusqu'à 50 secondes. La base gratuite expire au bout de 30 jours.