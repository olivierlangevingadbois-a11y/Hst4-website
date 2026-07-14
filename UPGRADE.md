# Plan de mise à niveau du site (courshistoire.com)

> **Comment reprendre le travail** (si la session est interrompue) :
> branche `claude/keen-volta-m2nq66` · chaque étape = 1 commit · cocher la case
> de l'étape dans ce fichier **dans le même commit** que l'étape elle-même.
> Les pages `documents*.html` sont GÉNÉRÉES : modifier `tools/generer_documents.py`
> puis relancer `python3 tools/generer_documents.py` (ne pas éditer ces pages à la main).
> Contrainte permanente : aucune mention de cette série ni reproduction
> de ses pages complètes (source neutre « Document d'analyse, juin 2025 »).

## État d'avancement

- [x] **Étape 0 — Ce plan** : commit du plan de mise à niveau.
- [x] **Étape 1 — Moteur de quiz v2** (`js/main.js`, `css/style.css`, `pages/revision.html`) :
  compteur de score par série, barre de progression, mélange des choix à l'affichage,
  bouton « Recommencer », meilleur score conservé (`localStorage`), un seul essai
  compté par question.
- [ ] **Étape 2 — Banque de documents : recherche + visionneuse**
  (`tools/generer_documents.py` puis régénération, `js/main.js`, `css/style.css`) :
  champ de recherche par mots-clés + filtre par dossier sur chaque page de période;
  visionneuse (lightbox) avec légende et navigation clavier au lieu d'ouvrir
  l'image brute dans un nouvel onglet.
- [ ] **Étape 3 — Pratique de réponse longue** (`pages/revision.html` ou nouvelle page) :
  2-3 questions à développement par période (reformulées, jamais copiées), avec
  démarche par étapes et réponse modèle repliable (`<details>`) pour l'autocorrection.
- [ ] **Étape 4 — Maillage des pages de période** (`pages/periode-*.html`) :
  encarts « Pratique cette période » (liens vers documents filtrés + quiz),
  styles d'impression pour réviser sur papier.
- [ ] **Étape 5 — Accessibilité et confort** (`css/style.css`, toutes pages) :
  lien d'évitement « Aller au contenu », états `:focus-visible`,
  `prefers-reduced-motion`, contrastes vérifiés, favicon SVG, page `404.html`.
- [ ] **Étape 6 — SEO / partage** : balises Open Graph + description sur toutes les
  pages (générateur inclus), `robots.txt`, `sitemap.xml`.
- [ ] **Étape 7 — Contrôle qualité final** : vérification des liens internes,
  imbrication HTML, poids des images; mise à jour de la description du PR #1.

## Notes de contexte

- 492 documents dans la banque (`data/repertoire_images.json`), dont 57 locaux
  dans `images/documents-2025/` (dossier « Documents d'analyse — juin 2025 »).
- 21 questions à choix multiple dans `pages/revision.html` (9 par OI + 12 série
  d'entraînement liée aux documents locaux).
- Le site est servi par GitHub Pages; la mise en privé se fait dans les
  réglages GitHub (hors de portée des outils de cette session).
