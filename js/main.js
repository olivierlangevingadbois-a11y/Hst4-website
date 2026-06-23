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
  document.querySelectorAll(".question").forEach(function (question) {
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
        // Réinitialiser l'état de la question
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

        // Rétroaction détaillée (nouveau modèle)
        if (feedback) {
          feedback.classList.remove("bonne", "mauvaise");
          feedback.classList.add("montre", estBon ? "bonne" : "mauvaise");
          if (pourquoi) {
            feedback.innerHTML = (estBon ? "✓ " : "✗ ") + pourquoi;
          } else {
            feedback.textContent = estBon
              ? "✓ Bonne réponse !"
              : "✗ Réponse à revoir — la bonne réponse est surlignée en vert.";
          }
        }

        // Ancien modèle (compatibilité)
        if (retour) {
          retour.textContent = estBon
            ? "✓ Bonne réponse !"
            : "✗ Réponse à revoir — la bonne réponse est surlignée en vert.";
        }
      });
    });
  });
});
