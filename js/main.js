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
});
