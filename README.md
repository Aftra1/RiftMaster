# Rift Masters

Jeu de cartes à collectionner **League of Legends** dans le navigateur, façon WikiMasters.
La rareté de chaque champion vient de son pick rate et de son win rate en Ranked Solo/Duo (Émeraude+) sur [DPM.LOL](https://dpm.lol) ; celle des objets vient de leur pick rate.

**Jouer :** https://aftra1.github.io/RiftMaster/

## Contenu
- 173 champions, objets, sorts d'invocateur et runes clés
- 1 963 skins en variantes (galerie dans la fiche de chaque champion)
- Cartes brillantes, boosters à thème, atelier hextech (coffres, clés, fusion, boutique du jour)
- Défis du jour façon LoLdle (Classique, Emoji, Illustration, Titre), Plus ou moins, Draft, Pronostics
- Missions, événements, niveaux de compte, titres, succès, vitrines

## Sauvegarde
La progression est enregistrée dans le navigateur (localStorage). Utilise **Profil → Sauvegarde** pour exporter/importer ta partie.
Le classement en ligne et les échanges entre joueurs ne fonctionnent que dans la version artefact claude.ai.

## Structure
- `index.html` : tout le jeu (HTML/CSS/JS, aucune dépendance)
- `img/c` : illustrations des champions · `img/ks` : planches de skins par champion · `img/items.webp`, `img/s`, `img/r` : objets, sorts, runes
- `hx/`, `sc/` : interface hextech et blasons de régions (créations originales)
- `maj/` : procédure de mise à jour à chaque patch

## Mentions
Projet de fan non officiel. Rift Masters n'est ni approuvé ni sponsorisé par Riot Games et ne reflète pas les opinions de Riot Games ou de quiconque impliqué dans la production ou la gestion de League of Legends. League of Legends et Riot Games sont des marques ou des marques déposées de Riot Games, Inc. Les illustrations des champions, skins, objets et runes appartiennent à Riot Games.
