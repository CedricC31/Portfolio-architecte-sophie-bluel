"use strict";

// ********* CONSTANTES *********

const galleryElt = document.querySelector('.gallery');
const filterButtonsElt = document.querySelectorAll('.filter');
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

      addClassAdmin();
    })
    .catch(error => {
      console.error("Une erreur s'est produite lors de la récupération des projets:", error);
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

/****** */
let modal = null
const focusableSelector = 'button, a, input, textarea'
let focusables = []
const galleryModal = document.querySelector('.modal-gallery .gallery-pictures');


function fetchModalWorks() {
  fetch('http://localhost:5678/api/works')
    .then(res => res.json())
    .then(data => {
      galleryModal.innerHTML = '';

      data.forEach(projectModal => {
        if (modal !== null) {
          const figure = document.createElement('figure');
          figure.dataset.id = projectModal.id;
          const img = document.createElement('img');
          const figcaption = document.createElement('figcaption');
          const button = document.createElement('button');
          const iconContainer = document.createElement('span');
          const squareIcon = document.createElement('i');
          const trashIcon = document.createElement('i');

          const secondButton = document.createElement('button');
          const secondIconContainer = document.createElement('span');
          const secondSquareIcon = document.createElement('i');
          const secondTrashIcon = document.createElement('i');

          img.src = projectModal.imageUrl;
          img.setAttribute('alt', projectModal.title);
          figcaption.textContent = "éditer";
          button.type='button';
          button.classList.add('trash-can');
          iconContainer.classList.add('fa-stack', 'fa-2x');
          squareIcon.classList.add('fa-solid', 'fa-square', 'fa-stack-2x');
          trashIcon.classList.add('fa-solid', 'fa-trash-can', 'fa-stack-1x');

          secondButton.type = 'button';
          secondButton.classList.add('cross-arrow');
          secondIconContainer.classList.add('fa-stack', 'fa-2x');
          secondSquareIcon.classList.add('fa-solid', 'fa-square', 'fa-stack-2x');
          secondTrashIcon.classList.add('fa-solid', 'fa-arrows-up-down-left-right', 'fa-stack-1x')

          iconContainer.appendChild(squareIcon);
          iconContainer.appendChild(trashIcon);
          secondIconContainer.appendChild(secondSquareIcon);
          secondIconContainer.appendChild(secondTrashIcon);

          button.appendChild(iconContainer);
          secondButton.appendChild(secondIconContainer);

          figure.appendChild(img);
          figure.appendChild(figcaption);
          figure.appendChild(button);
          figure.appendChild(secondButton);

          galleryModal.appendChild(figure);

          const buttons = figure.querySelectorAll('button');
          buttons.forEach(button => {
            focusables.push(button);
          });
          button.addEventListener('click', function() {
            deleteFigure(figure);
          });
        }
      });

    })
    .catch(error => {
      console.error("Une erreur s'est produite lors de la récupération des projets:", error);
    });
}

/********* */
const openModal = function (e) {
  e.preventDefault()

  modal = document.querySelector(e.target.getAttribute('href'))
  focusables = Array.from(modal.querySelectorAll(focusableSelector))
  focusables[0].focus()

  modal.querySelector('.return').style.display = 'none'
  modal.querySelector('.add-modal-gallery').style.display = 'none'

  modal.style.display = null
  modal.removeAttribute('aria-hidden')
  modal.setAttribute('aria-modal', 'true')
  modal.addEventListener('click', closeModal)
  modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
  modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)

  fetchModalWorks()
}

const modalGallery = document.querySelector('.modal-gallery');
const modalButton = document.querySelector('.modal-button');
const addModalGallery = document.querySelector('.add-modal-gallery');
const modalReturn = document.querySelector('.return');

document.querySelector('.add-picture').addEventListener('click', () => {
  modalGallery.style.display = 'none';
  modalButton.style.display = 'none';
  addModalGallery.style.display = 'flex';
  modalReturn.style.display = 'block';

  modalReturn.addEventListener('click', () => {
    modalGallery.style.display = 'flex';
    modalButton.style.display = 'flex';
    addModalGallery.style.display = 'none';
    modalReturn.style.display = 'none';
  });
});

const closeModal = function (e) {
  if (modal === null) return
  e.preventDefault()
  modal.style.display = "none"
  modal.setAttribute('aria-hidden', 'true')
  modal.removeAttribute('aria-modal')
  modal.removeEventListener('click', closeModal)
  modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
  modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)

  modal.querySelector('.modal-gallery').style.display = 'flex';
  modal.querySelector('.modal-button').style.display = 'flex';
  modal.querySelector('.add-modal-gallery').style.display = 'none';
  modal.querySelector('.return').style.display = 'none';

  modal = null

  form.reset();
}

const stopPropagation = function (e) {
  e.stopPropagation()
}

const focusInModal = function (e) {
  e.preventDefault()
  let visibleFocusables = focusables.filter(f => getComputedStyle(f).display !== 'none')
  let index = visibleFocusables.findIndex(f => f === modal.querySelector(':focus'))
  if (e.shiftKey === true) {
    index--
  } else {
    index++
  }
  if (index >= visibleFocusables.length) {
    index = 0
  }
  if (index < 0) {
    index = visibleFocusables.length - 1
  }
  visibleFocusables[index].focus()
}

document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', openModal)
})

window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' || e.key === 'Esc') {
    closeModal(e)
  }
  if (e.key === 'Tab' && modal !== null) {
    focusInModal(e)
  }
})

/****code qui fonctionne avec fermeture de la modal */

function deleteFigure(figure) {
  console.log("deleteFigure called")
  const id = figure.dataset.id;
  console.log(id)

  const confirmation = confirm("Voulez-vous vraiment supprimer cette figure ?");

  if (confirmation) {
    const token = localStorage.getItem('token');
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    fetch(`http://localhost:5678/api/works/${id}`, requestOptions)
      .then(response => {
        console.log(response)
        if (response.ok) {
          figure.remove();
        } else {
          console.error("Une erreur s'est produite lors de la suppression de la figure.");
        }
      })
      .catch(error => {
        console.error("Une erreur s'est produite lors de la suppression de la figure:", error);
      });
  } else {
    console.log("Suppression annulée");
  }
}

/***************ajouter une photo */

const form = document.querySelector('.add-gallery');
const fileInput = document.getElementById('add-file-input');
const titleInput = document.getElementById('title');
const categorySelect = document.getElementById('category-select');
const addPictureButton = document.querySelector('.add-picture-button');
const contentPicture = document.querySelector('.content-picture');

const categories = [
  { id: 1, name: 'Objets' },
  { id: 2, name: 'Appartements' },
  { id: 3, name: 'Hotels & restaurants' }
];

categories.forEach((category) => {
  const option = document.createElement('option');
  option.value = category.id.toString();
  option.text = category.name;
  categorySelect.appendChild(option);
});

const returnButton = document.querySelector('.return');

returnButton.addEventListener('click', () => {
  form.reset();
  contentPicture.src = '';
  contentPicture.style.display = 'none';
  addPictureButton.style.display = 'block';
});

fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      contentPicture.src = reader.result;
      contentPicture.style.display = 'block';
      addPictureButton.style.display = 'none';
    };
  } else {
    contentPicture.style.display = 'none';
    addPictureButton.style.display = 'block'; 
  }
});

fileInput.addEventListener('input', checkFormValidity);
titleInput.addEventListener('input', checkFormValidity);
categorySelect.addEventListener('input', checkFormValidity);

function checkFormValidity() {
  const isImageSelected = fileInput.files.length > 0;
  const isTitleFilled = titleInput.value.trim() !== '';
  const isCategorySelected = categorySelect.value !== '';

  if (isImageSelected && isTitleFilled && isCategorySelected) {
    document.querySelector('.valid-btn').style.backgroundColor = '#1d6154';
  } else {
    document.querySelector('.valid-btn').style.backgroundColor = '';
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (fileInput.files.length === 0 || titleInput.value === '' || categorySelect.value === '') {
    alert("Veuillez remplir tous les champs du formulaire");
    return;
  }

  const formData = new FormData();
  formData.append('image', fileInput.files[0]);
  formData.append('title', titleInput.value);
  formData.append('category', categorySelect.value);
  console.log(categorySelect.value);

  const token = localStorage.getItem('token');
  if (token) {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);

    try {
      const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        body: formData,
        headers: headers
      });

      if (response.ok) {
        const gallery = await response.json();
        console.log("Galerie créée avec succès:", gallery);
        form.reset();
      } else {
        console.error("Erreur lors de la création de la galerie:", response.status);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la requête:", error);
    }
  }
});

