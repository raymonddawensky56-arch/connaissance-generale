# Connaissance générale

Application PWA de quiz multilingue construite avec React, TypeScript et Vite.

## Langues préparées
Français, anglais, espagnol, portugais, créole haïtien, allemand, arabe (RTL) et chinois simplifié.

## Lancer le projet
Prérequis : Node.js 20 ou plus récent.

```bash
npm install
npm run dev
```

Ouvre l'adresse locale affichée par Vite.

## Construire pour la production

```bash
npm run build
npm run preview
```

Le dossier de sortie est `dist`.

## Déploiement Cloudflare Pages
1. Importe ce dépôt GitHub dans Cloudflare Pages.
2. Framework preset : **Vite**.
3. Build command : `npm run build`.
4. Build output directory : `dist`.
5. Lance le déploiement.

Le fichier `public/_redirects` permet le routage de l'application.

## État actuel
Cette livraison est un socle fonctionnel. Les deux questions incluses sont des exemples de démonstration, pas la base finale de 8 000 questions. Les catégories, langues, navigation, favoris, thème et statistiques locales sont préparés.

## Publicités
Aucun SDK publicitaire ni identifiant de production n'est intégré. Les annonces ne seront ajoutées qu'après vérification des règles et création des comptes appropriés. Le modèle prévu est une annonce à la fin d'une série complète, jamais pendant les questions.
