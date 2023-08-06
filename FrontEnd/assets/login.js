"use strict";

// ********* CONSTANTES *********

const emailElt = document.getElementById('email');
const passwordElt = document.getElementById('password');

// ********* FONCTIONS *********
function login(event) {
  event.preventDefault();

  const email = emailElt.value;
  const password = passwordElt.value;

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
        const token = data.token;
        const userId = data.userId;

        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);

        window.location.href = 'index.html';
      } else {
        alert("Erreur dans l'identifiant ou le mot de passe.");
      }
    })
    .catch(error => {
      console.error("Une erreur s'est produite lors de la requête:", error);
    });
}

// ********* MAIN *********

document.getElementById('login-form').addEventListener('submit', function (event) {
  login(event);
});
