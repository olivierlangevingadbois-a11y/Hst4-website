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
├── index.html              Page d'accueil
├── pages/
│   ├── periode-1.html      1840–1896
│   ├── periode-2.html      1896–1945
│   ├── periode-3.html      1945–1980
│   ├── periode-4.html      1980 à aujourd'hui
│   ├── methode.html        Méthode historique
│   └── revision.html       Quiz de révision interactifs
├── css/
│   └── style.css           Feuille de style (responsive)
├── js/
│   └── main.js             Menu mobile, quiz, année dynamique
└── images/
    └── hero.svg            Image de bannière
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

## Pistes d'amélioration

- Ajouter des cartes historiques et des images d'archives (avec mentions de source).
- Enrichir les quiz et ajouter un calcul de score.
- Ajouter des fiches PDF imprimables par période.
