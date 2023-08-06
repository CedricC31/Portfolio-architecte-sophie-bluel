"use strict";

// ********* CONSTANTES *********

const emailElt = document.getElementById('email');
const passwordElt = document.getElementById('password');

// ********* FONCTIONS *********
function login(event) {
  event.preventDefault();  // Empêche l'envoi du formulaire par défaut

  // Récupérer les valeurs des champs email et password
  const email = emailElt.value;
  const password = passwordElt.value;

  // Construire les données à envoyer dans la requête POST
  const data = {
    email: email,
    password: password
  };

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
        alert("Erreur dans l'identifiant ou le mot de passe.");
      }
    })
    .catch(error => {
      // Gérer les erreurs de la requête
      console.error("Une erreur s'est produite lors de la requête:", error);
    });
}

// ********* MAIN *********

document.getElementById('login-form').addEventListener('submit', function (event) {
  login(event);
});
