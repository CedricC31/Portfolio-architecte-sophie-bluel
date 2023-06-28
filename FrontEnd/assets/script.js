"use strict";

// ********* CONSTANTES *********

const gallery = document.querySelector('.gallery');

// ********* FONCTIONS *********

/**
 * Récupère les travaux à partir de l'API spécifiée et les ajoute à la galerie.
 */
function fetchWorks() {
  fetch('http://localhost:5678/api/works')
  .then(res => res.json())
  .then(data => {
    data.forEach(project => {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      const figcaption = document.createElement('figcaption');

      img.src = project.imageUrl;
      img.setAttribute('alt', project.title);
      figcaption.textContent = project.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    });
  });
}

// ********* MAIN *********

fetchWorks();
