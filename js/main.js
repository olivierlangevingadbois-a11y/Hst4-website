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
  // Chaque bouton de réponse porte data-bon="true" si c'est la bonne réponse.
  document.querySelectorAll(".question").forEach(function (question) {
    const boutons = question.querySelectorAll(".options button");
    const retour = question.querySelector(".retour-quiz");
    boutons.forEach(function (bouton) {
      bouton.addEventListener("click", function () {
        // Réinitialiser l'état de la question
        boutons.forEach(function (b) {
          b.classList.remove("bon", "mauvais");
        });
        const estBon = bouton.getAttribute("data-bon") === "true";
        if (estBon) {
          bouton.classList.add("bon");
          if (retour) retour.textContent = "✓ Bonne réponse !";
        } else {
          bouton.classList.add("mauvais");
          // Met aussi en évidence la bonne réponse
          boutons.forEach(function (b) {
            if (b.getAttribute("data-bon") === "true") {
              b.classList.add("bon");
            }
          });
          if (retour) retour.textContent = "✗ Réponse à revoir — la bonne réponse est surlignée en vert.";
        }
      });
    });
  });
});
