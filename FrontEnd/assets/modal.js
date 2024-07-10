let modal = null

const addPhotoCards = (photos) => {
    const photoContainer = document.getElementById('photo-container');
    photoContainer.innerHTML = ''; // Vide le conteneur avant d'ajouter de nouvelles cartes

    photos.forEach(photo => {
        const card = document.createElement('div');
        card.classList.add('photo-card');

        const img = document.createElement('img');
        img.src = photo.url;
        img.alt = photo.alt || 'Photo du projet';

        const deleteIcon = document.createElement('div');
        deleteIcon.classList.add('delete-icon');
        deleteIcon.innerHTML = '<i class="fa-regular fa-trash-can"></i>';

        deleteIcon.addEventListener('click', () => {
            // Logique pour supprimer la carte de photo
            card.remove();
        });

        card.appendChild(img);
        card.appendChild(deleteIcon);
        photoContainer.appendChild(card);
    });
};

const openModal = function (e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href')); // Récupère la cible de la modale à partir de l'attribut 'href' du lien cliqué
    target.style.display = null;
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');
    modal = target;
    // Ajoute des écouteurs d'événements pour gérer la fermeture de la modale et empêcher la propagation de l'événement
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
}

const closeModal = function (e) {
    if (modal === null) return; // Si aucune modale n'est ouverte, arrête la fonction
    e.preventDefault();
    modal.style.display = "none" // Masque la modale
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    // Supprime les écouteurs d'événement
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);

    modal = null; // Réinitialise la variable 'modal' à null pour indiquer qu'aucun modal n'est ouvert
}

const stopPropagation = function (e) {
    e.stopPropagation();
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);
})

window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
})
