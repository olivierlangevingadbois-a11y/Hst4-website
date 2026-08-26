# Répertoire d'images RÉCITUS — mode d'emploi

`repertoire_images.json` est la source machine. Chaque entrée décrit une image
de contenu tirée des pages HTML des 4 périodes. Aucun élément d'interface
(logos, icônes) n'est inclus.

## Champs de chaque entrée
- `period`      : période d'origine (Période 1 à 4)
- `dossier`     : dossier thématique auquel l'image appartient
- `title`       : titre du document (ex. « Document 2 : Jean-Baptiste-Éric Dorion »)
- `type`        : `image` ou `video`
- `image_url`   : **lien direct** vers le fichier image plein format
- `preview_url` : lien vers la vignette/aperçu
- `video_url`   : (vidéos seulement) lien YouTube
- `description` : ce que montre l'image — résumé en une ligne, tiré du code existant
- `image_source`: légende / provenance de l'image (déjà présente dans les pages)
- `text_source` : provenance du texte d'accompagnement
- `excerpt`     : extrait du texte d'accompagnement (contexte)
- `alt`         : texte alternatif d'origine

## Utilité
Permet à Claude Code de savoir ce que contient chaque image **sans la télécharger
ni l'analyser** : il suffit de lire `description` / `image_source`.

Total : 435 images.
