# Rift Masters — mise à jour des données à chaque patch

La page ne peut pas joindre dpm.lol elle-même : la mise à jour se fait en relançant les scripts
de `extraction.js` dans un navigateur (onglet ouvert sur dpm.lol puis sur ddragon.leagueoflegends.com),
puis en remplaçant dans `index.html` :

- `PATCH`, `GAMES`, `DATE` (en tête du script)
- le bloc `RAW_C` (champions) : `id|nomFR|titre|classes|rôle|pickrate|winrate|banrate|dpm|dégâts_subis/100|kda`
- le bloc `RAW_I` (objets) : `id|nomFR|prix|pickrate|catégorie`
- les images `img/c/<id>.webp` (écran de chargement 232×422) et `img/i/<id>.webp` (icône 64×64)

Les collections des joueurs sont conservées (clés `c:<id>` / `i:<id>`). Au chargement, la page compare
la rareté de chaque carte possédée avec celle du patch précédent et affiche la fenêtre « Nouveau patch ».

Étapes :
1. Sur https://dpm.lol/tierlist : lire le patch dans l'appel réseau `/v1/tierlist?tier=emerald_plus&timeframe=<patch>&gameMode=ranked`.
2. Exécuter `etape1_champions(patch)` puis `etape2_objets(patch)` (même onglet), puis `etape3_export()`.
3. Sur https://ddragon.leagueoflegends.com/api/versions.json : exécuter `etape4_images(version, champIds, itemIds)`
   qui télécharge `riftmasters-images.zip`.
4. Remplacer les données et images, republier.

**Numéro de patch affiché :** DPM.LOL et Data Dragon utilisent encore l'ancienne numérotation (ex. `16.23`), alors que le patch officiel s'appelle `26.23`.
Dans `index.html`, `PATCH`, `PREV` et la clé de `ARCH` doivent utiliser le numéro officiel (`26.xx`) ; garder `16.xx` uniquement pour les appels à DPM.LOL et Data Dragon.

Régions (collections thématiques) : la chaîne `REGM` (`id:region,...`) vient de
https://universe-meeps.leagueoflegends.com/v1/fr_fr/search/index.json (champ `associated-faction-slug`),
lue depuis un onglet ouvert sur https://universe.leagueoflegends.com/fr_fr/ — voir `etape5_regions(ids)`.
Un nouveau champion absent de `REGM` est rangé dans « Runeterra » en attendant.

## Sorts, runes clés et archive de patch (ajouté le 20/11/2026)

- `RAW_S` (sorts d'invocateur : clé|id|nom|pick rate) et `RAW_K` (runes clés : id|nom|arbre|pick rate) se remplissent avec les mêmes appels `/v1/builds/...` : champs `summoners` (pickrate × parties de chaque paire) et `runes.primaryRuneId` (champ `games`), divisés par le nombre de parties couvertes.
- Icônes : Data Dragon `cdn/<version>/img/spell/<image>` pour les sorts, `cdn/img/<icon>` de `runesReforged.json` pour les runes, converties en `img/s/<clé>.webp` et `img/r/<id>.webp`.
- À chaque nouveau patch : ajouter l'ancien patch dans `ARCH` (lignes `id|pr|wr|ban` pour les champions, `id:pr` séparés par `;` pour les objets), puis mettre `PREV` sur ce patch. Les flèches ▲ ▼ et la page « Ce qui a bougé » se recalculent toutes seules.
