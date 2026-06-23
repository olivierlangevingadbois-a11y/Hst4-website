# Histoire du Québec et du Canada — Secondaire 4

Site web de cours pour le programme d'**Histoire du Québec et du Canada de 4ᵉ secondaire**
(de 1840 à aujourd'hui), destiné aux élèves et publié sur
[courshistoire.com](https://www.courshistoire.com).

## Contenu

Le site couvre les **quatre périodes** du programme du ministère de l'Éducation :

1. **La formation du régime fédéral canadien** (1840–1896)
2. **Les nationalismes et l'autonomie du Canada** (1896–1945)
3. **La modernisation du Québec et la Révolution tranquille** (1945–1980)
4. **Les choix de société dans le Québec contemporain** (1980 à aujourd'hui)

S'ajoutent une page de **méthode historique** et une page de **quiz de révision**
interactifs.

## Structure du projet

```
.
├── index.html                   Page d'accueil
├── pages/
│   ├── periode-1.html           Notes de cours 1840–1896
│   ├── periode-2.html           Notes de cours 1896–1945
│   ├── periode-3.html           Notes de cours 1945–1980
│   ├── periode-4.html           Notes de cours 1980 à aujourd'hui
│   ├── documents.html           Hub des dossiers documentaires
│   ├── documents-periode-1.html Galerie de documents (124)
│   ├── documents-periode-2.html Galerie de documents (112)
│   ├── documents-periode-3.html Galerie de documents (119)
│   ├── documents-periode-4.html Galerie de documents (80)
│   ├── methode.html             Méthode historique
│   └── revision.html            Quiz de révision interactifs
├── css/
│   └── style.css                Feuille de style (responsive)
├── js/
│   └── main.js                  Menu mobile, quiz, année dynamique
├── images/
│   ├── hero.svg                 Image de bannière
│   └── placeholder-*.svg        Visuels de remplacement des figures
├── data/
│   └── repertoire_images.json   Source des 435 documents (RÉCITUS)
└── tools/
    └── generer_documents.py     Génère les pages de galerie depuis le JSON
```

## Dossiers documentaires (galeries générées)

Les pages `pages/documents-periode-*.html` et `pages/documents.html` sont
**générées automatiquement** à partir de `data/repertoire_images.json` (435 documents
issus de RÉCITUS — Service national du RÉCIT de l'univers social — et partenaires).
Les images sont affichées directement depuis `documents.recitus.qc.ca` (aucun fichier
n'est copié dans le dépôt). Pour régénérer après une mise à jour du JSON :

```bash
python3 tools/generer_documents.py
```

## Technologies

Site **statique** : HTML5, CSS3 et JavaScript sans dépendance externe. Il peut être
servi par n'importe quel hébergeur de fichiers statiques.

## Développement local

Aucune compilation n'est nécessaire. Pour prévisualiser localement :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Insérer des images de BAnQ (domaine public)

Chaque page de période contient des emplacements `<figure>` prêts à recevoir une
image, signalés par un commentaire HTML `IMAGE À INSÉRER`. Tant qu'aucune image
n'est ajoutée, un visuel de remplacement (`images/placeholder-paysage.svg` ou
`placeholder-portrait.svg`) s'affiche.

Pour ajouter une vraie image depuis
[BAnQ — documents du domaine public](https://numerique.banq.qc.ca/collections/documents-du-domaine-public) :

1. Trouve le document voulu sur le portail de BAnQ et **télécharge l'image**
   (vérifie qu'elle est bien dans le domaine public).
2. **Dépose le fichier** dans le dossier `images/` (ex. `images/p1-confederation.jpg`).
3. Dans la page concernée, remplace le `src` du placeholder :
   ```html
   <img src="../images/p1-confederation.jpg" alt="..." />
   ```
4. **Complète la légende** et l'attribution dans `<figcaption>` : remplace `cote XXXXX`
   par la cote réelle et ajuste le texte.

> ⚠️ Toujours **créditer la source** (BAnQ + cote) et confirmer le statut « domaine
> public » de chaque document avant publication.

## Pistes d'amélioration

- Ajouter des cartes historiques et des GIF/images d'archives de BAnQ (voir ci-dessus).
- Enrichir les quiz et ajouter un calcul de score.
- Ajouter des fiches PDF imprimables par période.
- Compléter les encadrés « Façon de répondre » de la page Méthode pour chaque opération intellectuelle.
