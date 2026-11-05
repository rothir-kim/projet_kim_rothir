# Alerte Pollution – Kim Rothir

Application de recensement et de gestion des pollutions observées sur le terrain.

- `api/` : API REST Node.js / Express en TypeScript, données stockées dans PostgreSQL (via Sequelize)
- `Front/` : application Angular

## Lancer l'API en local

### Prérequis

- Node.js 22
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

Au démarrage, l'API lance les **migrations** (avec la librairie `umzug`) : elles créent ou mettent à jour les tables `pollution` et `utilisateur`. La liste des migrations déjà faites est gardée dans la table `SequelizeMeta`.
Au premier lancement, la table `pollution` est ensuite remplie avec les données de `api/pollutions.json` (ces pollutions n'ont pas d'auteur).

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
| GET | `/api/pollutions` | Liste des pollutions (de la plus récente à la plus ancienne), avec leur auteur |
| GET | `/api/pollutions/:id` | Détail d'une pollution |
| POST | `/api/pollutions` | Ajoute une pollution, avec l'`auteurId` de la personne connectée (réponse `201`) |
| PUT | `/api/pollutions/:id` | Modifie une pollution |
| DELETE | `/api/pollutions/:id` | Supprime une pollution (réponse `204`) |
| GET | `/api/users` | Liste des utilisateurs (sans les mots de passe) |
| POST | `/api/users` | Crée un utilisateur (réponse `201`) |
| POST | `/api/users/login` | Connexion fictive : vérifie le login et le mot de passe |
| DELETE | `/api/users/:id` | Supprime un utilisateur (réponse `204`) |

Codes d'erreur :

| Code | Signification |
|---|---|
| `400` | Données invalides (champ vide, type inconnu, date future, URL de photo invalide, mot de passe trop faible…) : le détail est dans `details` |
| `401` | Login ou mot de passe incorrect |
| `404` | Pollution ou utilisateur introuvable (ou id qui n'est pas un nombre) |
| `409` | Login ou email déjà utilisé |

### Utilisateurs et mots de passe

Un utilisateur a les champs : `login`, `motDePasse`, `nom`, `prenom`, `adresse`, `email`, `telephone`, `dateNaissance` (AAAA-MM-JJ).

Le téléphone ne doit contenir que des chiffres : le 0 du début et les espaces sont facultatifs, et il est enregistré au format `06 12 34 56 78`.

Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.
Il est haché avec `bcryptjs` dans le modèle avant l'enregistrement (jamais en clair) et n'est jamais renvoyé par l'API.

### Auteur d'une pollution

Chaque pollution déclarée est liée à l'utilisateur qui l'a créée (colonne `auteurId`), et l'API renvoie son prénom et son nom dans `auteur`.
Les pollutions de départ n'ont pas d'auteur. Si un compte est supprimé, ses pollutions restent mais n'ont plus d'auteur.

La connexion est « fictive » : l'API vérifie le login et le mot de passe, puis renvoie l'utilisateur, sans jeton de sécurité.

### Organisation du code (`api/src/`)

```
src/
├── index.ts                         démarrage du serveur
├── config.ts                        lecture des variables d'environnement
├── models/
│   ├── index.ts                     connexion à la base (Sequelize)
│   ├── validateurs.ts               règles communes (date, URL, mot de passe, téléphone)
│   ├── pollution.model.ts           description de la table pollution (et lien vers l'auteur)
│   └── user.model.ts                description de la table utilisateur
├── migrations/
│   ├── index.ts                     liste des migrations, lancées au démarrage
│   ├── 001-creation-tables.ts       création des tables
│   └── 002-ajout-auteur.ts          ajout de la colonne auteurId
├── middlewares/
│   ├── verifier-id.ts               refuse les id qui ne sont pas des nombres (404)
│   └── gestion-erreurs.ts           réponses d'erreur communes (400, 409, 500)
├── controllers/
│   ├── pollution.controller.ts      ce que fait chaque route des pollutions
│   └── user.controller.ts           ce que fait chaque route des utilisateurs
└── routes/
    ├── pollution.routes.ts          les adresses /api/pollutions
    └── user.routes.ts               les adresses /api/users
```

## Lancer le front

```bash
cd Front
npm install
ng serve
```

L'application est disponible sur `http://localhost:4200`.

Tests unitaires (filtres, validateurs, messages d'erreur) :

```bash
npm test
```

### Pages

| Adresse | Rôle |
|---|---|
| `/pollutions` | Liste des pollutions, avec filtres |
| `/pollutions/nouvelle` | Déclarer une pollution (connexion requise) |
| `/pollutions/:id` | Détail d'une pollution |
| `/pollutions/:id/modifier` | Modifier une pollution (connexion requise) |
| `/utilisateurs` | Liste des utilisateurs (connexion requise) |
| `/inscription` | Créer un compte (critères du mot de passe, adresse proposée par le service de l'IGN), puis retour à la connexion |
| `/connexion` | Se connecter (connexion fictive, l'utilisateur est gardé dans le navigateur) |

Sans connexion, on peut seulement consulter les pollutions. Les pages marquées « connexion requise » sont protégées par `connexionGuard` (`src/app/guards/connexion.guard.ts`), qui renvoie vers `/connexion`.
Cette protection ne concerne que l'affichage : l'API, elle, ne vérifie pas qui envoie les requêtes (connexion fictive).

L'URL de l'API dépend de l'environnement (remplacement configuré par `fileReplacements` dans `angular.json`) :

- développement (`ng serve`) : `src/environments/environment.development.ts` → `http://localhost:3000/api`
- production (`ng build`) : `src/environments/environment.ts` → `https://projet-kim-rothir-api.onrender.com/api`

### Style

Toutes les couleurs du site (palette « Océan ») sont réunies dans le bloc `:root` en haut de `src/styles.scss` : pour changer de palette, il suffit de modifier ce bloc.
Les polices (Anton pour les titres, DM Sans pour le texte) viennent de Google Fonts et sont chargées dans `src/index.html`.
Les animations sont coupées automatiquement si l'utilisateur a demandé à son système de réduire les animations.

## Déploiement

Le déploiement sur Render est décrit dans le fichier `render.yaml` (Blueprint) :

- une base PostgreSQL `pollution-db` (offre gratuite)
- l'API `projet-kim-rothir-api`, qui reçoit automatiquement l'adresse de la base dans `DATABASE_URL`

Le front est déployé séparément sur Render (site statique). Il a une règle de réécriture pour que les adresses comme `/pollutions/3` marchent aussi après un rechargement de la page :

| Source | Destination | Action |
|---|---|---|
| `/*` | `/index.html` | Rewrite |

Adresses :

- API : https://projet-kim-rothir-api.onrender.com/api/pollutions
- Front : https://projet-kim-rothir.onrender.com

> Sur l'offre gratuite de Render, l'API se met en veille après une période d'inactivité :
> la première requête peut prendre jusqu'à 50 secondes. La base gratuite expire au bout de 30 jours.