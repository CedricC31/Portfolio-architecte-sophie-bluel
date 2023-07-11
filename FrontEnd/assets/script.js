"use strict";

// ********* CONSTANTES *********

const galleryElt = document.querySelector('.gallery');
const filterButtonsElt = document.querySelectorAll('.filter');
//***** */
const adminElements = document.querySelectorAll('.admin');

// ********* FONCTIONS *********

/**
 * Récupère les travaux à partir de l'API spécifiée et les ajoute à la galerie.
 */
function fetchWorks(category) {
  fetch('http://localhost:5678/api/works')
    .then(res => res.json())
    .then(data => {
      galleryElt.innerHTML = ''; // Efface le contenu précédent de la galerie

      data.forEach(project => {
        if (category === 'all' || category === project.category.name.toLowerCase() || !category) {
          const figure = document.createElement('figure');
          const img = document.createElement('img');
          const figcaption = document.createElement('figcaption');

          img.src = project.imageUrl;
          img.setAttribute('alt', project.title);
          figcaption.textContent = project.title;

          figure.appendChild(img);
          figure.appendChild(figcaption);
          galleryElt.appendChild(figure);
        }
      });
      //**** */
      addClassAdmin();
    })
    .catch(error => {
      console.error('Une erreur s\'est produite lors de la récupération des projets:', error);
    });
}

filterButtonsElt.forEach(button => {
  button.addEventListener('click', () => {
    filterButtonsElt.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const category = button.getAttribute('data-category');
    
    fetchWorks(category);
  });
});

/**
 * Déconnecte l'utilisateur en supprimant le token et l'ID utilisateur du localStorage ou d'un cookie.
 * Redirige vers la page d'accueil ou une autre page spécifiée.
 */
function logout() {
  // Supprimer le token et userId du localStorage ou d'un cookie
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  //***** */

  const galleryFilters = document.querySelector('.gallery-filters');

  if (galleryFilters) {
    // Ajouter la classe "hidden" à la div avec la classe "gallery-filters"
    galleryFilters.classList.add('hidden');
  }

  removeClassAdmin();
  // Rediriger vers la page d'accueil ou une autre page
  window.location.href = 'index.html';
}

// ********* MAIN *********

document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const logoutLi = document.getElementById('logout-li');

  if (token && userId) {
    // Utilisateur connecté, afficher "logout" et ajouter la classe "admin" aux éléments nécessaires
    logoutLi.innerHTML = '<a href="#" onclick="logout()">logout</a>';
    addClassAdmin();
  } else {
    // Utilisateur non connecté, afficher "login" et supprimer la classe "admin" des éléments
    logoutLi.innerHTML = '<a href="login.html">login</a>';
    removeClassAdmin();
  }

  fetchWorks();
});

function addClassAdmin() {
  // Vérifier si l'utilisateur est connecté avant d'ajouter la classe "admin"
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  if (token && userId) {
    adminElements.forEach(element => {
      element.classList.remove('admin'); // Supprimer la classe "admin"
    });

    const galleryFilters = document.querySelector('.gallery-filters');
    if (galleryFilters) {
      // Ajouter la classe "hidden" à la div avec la classe "gallery-filters"
      galleryFilters.classList.add('hidden');
    }
  }
}

function removeClassAdmin() {
  adminElements.forEach(element => {
    element.classList.add('admin'); // Ajouter la classe "admin"
  });
}
/*
fetchWorks();

document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const logoutLi = document.getElementById('logout-li');

  if (token && userId) {
    // Utilisateur connecté, afficher "logout"
    logoutLi.innerHTML = '<a href="#" onclick="logout()">logout</a>';
  } else {
    // Utilisateur non connecté, afficher "login"
    logoutLi.innerHTML = '<a href="login.html">login</a>';
  }
});*/
