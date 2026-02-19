# Messagerie-Instantanee

## Cloner le repo

git clone https://github.com/Y-BombParty/BombParty-Api.git

cd Messagerie-Instantanee

## Lancement de l'application

### Avant de lancer l'application effectuer cette commande

**npm install**

### Pour lancer l'application, utiliser cette commande : 

**npm install**

## Structure de l'application

- **src/ :** contient le contenu de notre app

- **components/ :**  contient les différents composants de notre app.

- **pages/ :** contient toutes les pages

- **stores/ :** contient un fichier store.ts dans lequel est définit le store

- **types/ :** contient un fichier interface.ts dans lequel sont définit les différentes interfaces

- **router.ts :**  le fichier router.ts contient les différentes routes de l'app

- **App.vue :**  c'est le composant racine

- **main.ts :** créer l'app et contient les différents plugins

## Fonctionnalité de l'application

**Authentification**

- un token JWT est stocké en mémoire via Pinia lorsque l'utilisateur se connecte

- le refresh token est automatique chaque 2 heures via un timer centralisé

- une redirection automatique vers /login si la session expire ou si l'utilisateur n'est pas connecté

**Création, modification, suppression des channels**

- création d'un channel via un popup avec nom, image et membres

- modification des métadonnées du channel (nom, image, thème de couleurs personnalisées)

- ajout de membres via une liste séparée par des virgules

- suppression complète d'un channel

- personnalisation du thème avec 5 couleurs configurables (primary, primary dark, accent, text, accent text)

**Création, modification des messages**

- création de messages avec type (Text ou Image) et contenu

- modification du contenu des messages existants via popup d'édition

- mise à jour en temps réel des messages via connexion WebSocket

- affichage des messages avec auteur et timestamp

- chargement des messages par batch avec pagination

## Contribution

**Emmanuel YOHORE** et **Mathis SILOTIA**

