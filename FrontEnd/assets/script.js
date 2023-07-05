"use strict";

// ********* CONSTANTES *********

const gallery = document.querySelector('.gallery');
const filterButtons = document.querySelectorAll('.filter');

// ********* FONCTIONS *********

/**
 * Récupère les travaux à partir de l'API spécifiée et les ajoute à la galerie.
 */
function fetchWorks(category) {
  fetch('http://localhost:5678/api/works')
    .then(res => res.json())
    .then(data => {
      gallery.innerHTML = ''; // Efface le contenu précédent de la galerie

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
          gallery.appendChild(figure);
        }
      });
    })
    .catch(error => {
      console.error('Une erreur s\'est produite lors de la récupération des projets:', error);
    });
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const category = button.getAttribute('data-category');
    
    fetchWorks(category);
  });
});

// ********* MAIN *********

fetchWorks();


document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();  // Empêche l'envoi du formulaire par défaut

  // Récupérer les valeurs des champs email et password
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Construire les données à envoyer dans la requête POST
  const data = {
    email: email,
    password: password
  };

  // Envoyer la requête POST fetch
  fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      if (data.userId && data.token) {
        // Récupérer le token de la réponse
        const token = data.token;
        const userId = data.userId;

        // Stocker le token et userId dans le localStorage ou dans un cookie
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);

        // Rediriger vers la page d'accueil
        window.location.href = 'index.html';
      } else {
        // Afficher un message d'erreur de connexion
        console.error('Échec de la connexion:', data.error);
      }

      /*if (data.success) {
        // Rediriger vers la page d'accueil
        window.location.href = 'http://127.0.0.1:5500/FrontEnd/index.html#portfolio';
      } else {
        // Afficher un message d'erreur de connexion
        console.error('Échec de la connexion:', data.error);
      }*/

      console.log(data);  // Afficher la réponse dans la console
      console.log(userId);
      console.log(token);
    })
    .catch(error => {
      // Gérer les erreurs de la requête
      console.error('Une erreur s\'est produite lors de la requête:', error);
    });
});
