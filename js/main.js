/* ===================================================================
   Histoire du Québec et du Canada — Secondaire 4
   Scripts : menu mobile, quiz interactif, année dynamique
   =================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  // --- Menu mobile ---
  const btnMenu = document.querySelector(".btn-menu");
  const menu = document.querySelector(".menu");
  if (btnMenu && menu) {
    btnMenu.addEventListener("click", function () {
      menu.classList.toggle("ouvert");
      const ouvert = menu.classList.contains("ouvert");
      btnMenu.setAttribute("aria-expanded", ouvert ? "true" : "false");
    });
  }

  // --- Année dynamique dans le pied de page ---
  document.querySelectorAll(".annee-courante").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // --- Quiz interactif ---
  // Chaque bouton de réponse porte data-bon="true" si c'est la bonne réponse,
  // et data-pourquoi="..." pour expliquer pourquoi la réponse est bonne ou non.
  // Seul le PREMIER essai de chaque question compte dans le score : on peut
  // ensuite cliquer les autres choix pour lire leurs rétroactions.

  function melanger(liste) {
    for (let i = liste.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [liste[i], liste[j]] = [liste[j], liste[i]];
    }
    return liste;
  }

  function melangerChoix(question) {
    question.querySelectorAll(".options").forEach(function (ul) {
      melanger(Array.from(ul.children)).forEach(function (li) {
        ul.appendChild(li);
      });
    });
  }

  function brancherQuestion(question, surPremierEssai) {
    const boutons = question.querySelectorAll(".options button");
    const retour = question.querySelector(".retour-quiz");
    const feedback = question.querySelector(".feedback");
    function bonBouton() {
      let b = null;
      boutons.forEach(function (x) {
        if (x.getAttribute("data-bon") === "true") b = x;
      });
      return b;
    }
    boutons.forEach(function (bouton) {
      bouton.addEventListener("click", function () {
        boutons.forEach(function (b) {
          b.classList.remove("bon", "mauvais");
        });
        const estBon = bouton.getAttribute("data-bon") === "true";
        const pourquoi = bouton.getAttribute("data-pourquoi");
        if (estBon) {
          bouton.classList.add("bon");
        } else {
          bouton.classList.add("mauvais");
          const bb = bonBouton();
          if (bb) bb.classList.add("bon");
        }

        if (feedback) {
          feedback.classList.remove("bonne", "mauvaise");
          feedback.classList.add("montre", estBon ? "bonne" : "mauvaise");
          feedback.innerHTML = pourquoi
            ? (estBon ? "✓ " : "✗ ") + pourquoi
            : estBon
              ? "✓ Bonne réponse !"
              : "✗ Réponse à revoir — la bonne réponse est surlignée en vert.";
        }

        // Ancien modèle (compatibilité)
        if (retour) {
          retour.textContent = estBon
            ? "✓ Bonne réponse !"
            : "✗ Réponse à revoir — la bonne réponse est surlignée en vert.";
        }

        if (!question.dataset.repondue) {
          question.dataset.repondue = estBon ? "bon" : "mauvais";
          question.classList.add("repondue");
          if (surPremierEssai) surPremierEssai(estBon);
        }
      });
    });
  }

  document.querySelectorAll(".quiz").forEach(function (quiz, index) {
    const questions = quiz.querySelectorAll(".question");
    if (!questions.length) return;

    const cle = "quiz:" + location.pathname + "#" + index;
    let repondues = 0;
    let bonnes = 0;

    // Tableau de bord de la série
    const tableau = document.createElement("div");
    tableau.className = "quiz-tableau";
    tableau.innerHTML =
      '<div class="quiz-jauge" role="progressbar" aria-label="Progression de la série"' +
      ' aria-valuemin="0" aria-valuemax="' + questions.length + '" aria-valuenow="0">' +
      '<span class="quiz-jauge-remplie"></span></div>' +
      '<p class="quiz-etat" role="status"></p>' +
      '<button type="button" class="btn-recommencer">↺ Recommencer la série</button>';
    quiz.parentNode.insertBefore(tableau, quiz);

    const jauge = tableau.querySelector(".quiz-jauge");
    const remplie = tableau.querySelector(".quiz-jauge-remplie");
    const etat = tableau.querySelector(".quiz-etat");

    function meilleur() {
      try {
        return localStorage.getItem(cle);
      } catch (e) {
        return null;
      }
    }

    function afficherEtat() {
      const m = meilleur();
      let texte = bonnes + " bonne(s) réponse(s) sur " + repondues + " question(s) répondues (série de " + questions.length + ")";
      if (repondues === questions.length) {
        texte = "Série terminée : " + bonnes + "/" + questions.length + " au premier essai.";
        try {
          if (m === null || bonnes > Number(m)) {
            localStorage.setItem(cle, String(bonnes));
            texte += " Nouveau record !";
          }
        } catch (e) { /* stockage indisponible : on ignore */ }
      }
      const m2 = meilleur();
      if (m2 !== null) texte += " · Meilleur score : " + m2 + "/" + questions.length;
      etat.textContent = texte;
      remplie.style.width = (repondues / questions.length) * 100 + "%";
      jauge.setAttribute("aria-valuenow", String(repondues));
    }

    questions.forEach(function (q) {
      melangerChoix(q);
      brancherQuestion(q, function (estBon) {
        repondues++;
        if (estBon) bonnes++;
        afficherEtat();
      });
    });

    tableau.querySelector(".btn-recommencer").addEventListener("click", function () {
      repondues = 0;
      bonnes = 0;
      questions.forEach(function (q) {
        delete q.dataset.repondue;
        q.classList.remove("repondue");
        q.querySelectorAll(".options button").forEach(function (b) {
          b.classList.remove("bon", "mauvais");
        });
        const f = q.querySelector(".feedback");
        if (f) {
          f.classList.remove("montre", "bonne", "mauvaise");
          f.textContent = "";
        }
        melangerChoix(q);
      });
      afficherEtat();
      quiz.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    afficherEtat();
  });

  // Questions hors d'une série .quiz : comportement simple, sans score
  document.querySelectorAll(".question").forEach(function (q) {
    if (!q.closest(".quiz")) brancherQuestion(q, null);
  });

  // --- Recherche dans la banque de documents ---
  // Filtre les cartes par mots-clés (sans tenir compte des accents) et par
  // dossier; les sections vides sont masquées.
  const champRecherche = document.getElementById("recherche-docs");
  const filtreDossier = document.getElementById("filtre-dossier");
  if (champRecherche) {
    const compte = document.querySelector(".compte-resultats");

    function normaliser(s) {
      return s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    }

    // Index construit une seule fois : texte normalisé de chaque carte
    const cartes = Array.from(document.querySelectorAll(".doc-carte")).map(function (carte) {
      return {
        el: carte,
        section: carte.closest(".dossier"),
        texte: normaliser(carte.textContent),
      };
    });

    function filtrer() {
      const mots = normaliser(champRecherche.value).split(/\s+/).filter(Boolean);
      const dossier = filtreDossier ? filtreDossier.value : "";
      let visibles = 0;
      cartes.forEach(function (c) {
        const okDossier = !dossier || (c.section && c.section.id === dossier);
        const okMots = mots.every(function (m) {
          return c.texte.indexOf(m) !== -1;
        });
        const ok = okDossier && okMots;
        c.el.hidden = !ok;
        if (ok) visibles++;
      });
      document.querySelectorAll(".dossier").forEach(function (section) {
        section.hidden = !section.querySelector(".doc-carte:not([hidden])");
      });
      if (compte) {
        compte.textContent =
          mots.length || dossier
            ? visibles + " document(s) affiché(s)"
            : "";
      }
    }

    champRecherche.addEventListener("input", filtrer);
    if (filtreDossier) filtreDossier.addEventListener("change", filtrer);
  }

  // --- Visionneuse d'images (lightbox) ---
  // Ouvre les images de la banque dans une visionneuse plein écran avec
  // légende et navigation clavier; les vidéos continuent d'ouvrir leur lien.
  const vignettes = Array.from(
    document.querySelectorAll(".doc-carte:not(.video) .vignette, figure.q-doc img")
  );
  if (vignettes.length) {
    let visionneuse = null;
    let indexCourant = 0;

    function infosVignette(v) {
      if (v.matches("figure.q-doc img")) {
        const fig = v.closest("figure");
        const cap = fig.querySelector("figcaption");
        return { src: v.src, titre: v.alt, source: cap ? cap.textContent : "" };
      }
      const carte = v.closest(".doc-carte");
      const titre = carte.querySelector("h4");
      const source = carte.querySelector(".doc-source");
      return {
        src: v.getAttribute("href"),
        titre: titre ? titre.textContent : "",
        source: source ? source.textContent : "",
      };
    }

    function visibles() {
      return vignettes.filter(function (v) {
        const carte = v.closest(".doc-carte");
        return !carte || !carte.hidden;
      });
    }

    function construire() {
      visionneuse = document.createElement("div");
      visionneuse.className = "visionneuse";
      visionneuse.setAttribute("role", "dialog");
      visionneuse.setAttribute("aria-label", "Visionneuse de document");
      visionneuse.innerHTML =
        '<button type="button" class="v-fermer" aria-label="Fermer (Échap)">×</button>' +
        '<button type="button" class="v-prec" aria-label="Document précédent">‹</button>' +
        '<figure><img alt="" /><figcaption></figcaption></figure>' +
        '<button type="button" class="v-suiv" aria-label="Document suivant">›</button>';
      document.body.appendChild(visionneuse);
      visionneuse.querySelector(".v-fermer").addEventListener("click", fermer);
      visionneuse.querySelector(".v-prec").addEventListener("click", function () {
        naviguer(-1);
      });
      visionneuse.querySelector(".v-suiv").addEventListener("click", function () {
        naviguer(1);
      });
      visionneuse.addEventListener("click", function (e) {
        if (e.target === visionneuse) fermer();
      });
      document.addEventListener("keydown", function (e) {
        if (!visionneuse.classList.contains("ouverte")) return;
        if (e.key === "Escape") fermer();
        if (e.key === "ArrowLeft") naviguer(-1);
        if (e.key === "ArrowRight") naviguer(1);
      });
    }

    function afficher(v) {
      const infos = infosVignette(v);
      const img = visionneuse.querySelector("img");
      img.src = infos.src;
      img.alt = infos.titre;
      visionneuse.querySelector("figcaption").innerHTML =
        "<strong>" + infos.titre + "</strong><br>" + infos.source;
      const liste = visibles();
      indexCourant = liste.indexOf(v);
      visionneuse.querySelector(".v-prec").disabled = indexCourant <= 0;
      visionneuse.querySelector(".v-suiv").disabled = indexCourant >= liste.length - 1;
    }

    function naviguer(sens) {
      const liste = visibles();
      const suivant = liste[indexCourant + sens];
      if (suivant) afficher(suivant);
    }

    function ouvrir(v) {
      if (!visionneuse) construire();
      afficher(v);
      visionneuse.classList.add("ouverte");
      document.body.style.overflow = "hidden";
      visionneuse.querySelector(".v-fermer").focus();
    }

    function fermer() {
      visionneuse.classList.remove("ouverte");
      document.body.style.overflow = "";
    }

    vignettes.forEach(function (v) {
      v.addEventListener("click", function (e) {
        e.preventDefault();
        ouvrir(v);
      });
      if (v.matches("img")) {
        v.style.cursor = "zoom-in";
        v.setAttribute("tabindex", "0");
        v.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            ouvrir(v);
          }
        });
      }
    });
  }
});
