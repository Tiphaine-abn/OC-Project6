// Fonction utilitaire pour créer les éléments des modales
function createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    Object.keys(attributes).forEach(attribute => {
        if (attribute === 'className') {
            element.className = attributes[attribute];
        } else if (attribute === 'style') {
            Object.assign(element.style, attributes[attribute]);
        } else {
            element.setAttribute(attribute, attributes[attribute]);
        }
    });
    if (typeof content === 'string') {
        element.textContent = content;
    } else if (Array.isArray(content)) {
        content.forEach(child => element.appendChild(child));
    } else {
        element.appendChild(content);
    }
    return element;
}

// Création de la première modale (Galerie photo)
const modalElement = createElement('aside', {
    id: 'modal',
    className: 'modal',
    'aria-hidden': 'true',
    role: 'dialog',
    'aria-labelledby': 'titlemodal',
    style: { display: 'none' }
}, [
    createElement('div', { className: 'modal-wrapper js-modal-stop' }, [
        createElement('button', { className: 'js-modal-close' }, createElement('i', { className: 'fa-solid fa-xmark' })),
        createElement('h3', { id: 'titlemodal' }, 'Galerie photo'),
        createElement('div', { id: 'photo-container', className: 'photo-container' }),
        createElement('div', { className: 'modal-line' }),
        createElement('a', { className: 'modalBtn js-modal', href: '#modalAddPhoto' }, 'Ajouter une photo')
    ])
]);
document.body.appendChild(modalElement);

// Création de la deuxième modale (Ajout photo)
const modalAddPhotoElement = createElement('aside', {
    id: 'modalAddPhoto',
    className: 'modal',
    'aria-hidden': 'true',
    role: 'dialog',
    'aria-labelledby': 'titlemodal2',
    style: { display: 'none' }
}, [
    createElement('div', { className: 'modal-wrapper js-modal-stop' }, [
        createElement('a', { className: 'js-modal-back', href: '#modal' }, createElement('i', { className: 'fa-solid fa-arrow-left' })),
        createElement('button', { className: 'js-modal-close' }, createElement('i', { className: 'fa-solid fa-xmark' })),
        createElement('h3', { id: 'titlemodal2' }, 'Ajout photo'),
        createElement('div', { className: 'cardInputPhoto' }, [
            createElement('i', { className: 'fa-regular fa-image' }),
            createElement('label', { for: 'file', className: 'addPhotoBtn' }, '+ Ajouter photo'),
            createElement('input', { type: 'file', id: 'file', name: 'image', style: { display: 'none' } }),
            createElement('img', { src: '#', alt: 'Aperçu du projet', style: { display: 'none' } }),
            createElement('p', {}, 'jpg, png : 4mo max')
        ]),
        createElement('form', { className: 'formContent', href: '#modalAddPhoto' }, [
            createElement('label', {}, 'Titre'),
            createElement('input', { className: 'formInput', type: 'text', name: 'addTitle' }),
            createElement('label', {}, 'Catégorie'),
            createElement('select', { className: 'formInput', name: 'selectCategory' }),
            createElement('div', { className: 'modal-line' }),
            createElement('button', { className: 'validateBtn' }, 'Valider'),
            createElement('p', { className: 'error-message' })
        ])
    ])
]);
document.body.appendChild(modalAddPhotoElement);

let currentModal = null;

// Fonction pour ajouter des cartes de photo à la galerie de la modale
function addPhotoCards() {
    const photoContainer = document.getElementById('photo-container');
    photoContainer.innerHTML = "";

    works.forEach(work => {
        const card = createElement('div', { className: 'photo-card', 'data-work-id': work.id }, [
            createElement('img', { src: work.imageUrl, alt: work.title || 'Photo du projet' }),
            createElement('div', { className: 'delete-icon' }, createElement('i', { className: 'fa-solid fa-trash-can' }))
        ]);

        card.querySelector('.delete-icon').addEventListener('click', (e) => {
            deleteWork(e.currentTarget.closest(".photo-card").dataset.workId);
        });

        photoContainer.appendChild(card);
    });
}

// Fonction pour supprimer un projet
function deleteWork(id) {
    const userData = JSON.parse(localStorage.getItem("userdata"));
    const token = userData ? userData.token : null;

    const init = {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        }
    };
    fetch("http://localhost:5678/api/works/" + id, init)
        .then((response) => {
            if (!response.ok) {
                throw Error(response.status, response.body);
            }
        })
        .then(async () => {
            const photoContainer = document.querySelector('.photo-container');
            const childs = photoContainer.childNodes;
            console.log("childNodes => ", childs);
            for (let i = 0; i < childs.length; ++i) {
                const currentChild = childs[i];
                if (Number(currentChild.dataset.workId) === Number(id)) {
                    photoContainer.removeChild(currentChild);
                    await displayWorks(await refreshWorks());
                    return;
                }
            }
        })
        .catch((error) => {
            console.log("Erreur lors de la suppression :", error);
        });
}

// Fonction pour ouvrir une modale
function openModal(targetHref) {
    const target = document.querySelector(targetHref); // Récupère la cible de la modale à partir de l'attribut 'href' du lien cliqué
    // Vérifie si une modale est déjà ouverte
    if (currentModal !== null) {
        // Ferme la modale actuelle
        currentModal.style.display = "none";
        currentModal.removeAttribute('aria-modal');
        currentModal.setAttribute('aria-hidden', true);
        // Supprime les écouteurs d'événements
        currentModal.removeEventListener('click', closeModal);
        currentModal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
        currentModal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
        // Réinitialise la variable 'currentModal'
        currentModal = null;
    }

    // Ouverture de la nouvelle modale
    if (target) {
        target.style.display = null;
        target.removeAttribute('aria-hidden');
        target.setAttribute('aria-modal', 'true');
        currentModal = target;

        // Ecouteurs d'événements pour gérer la fermeture de la modale et empêcher la propagation de l'événement
        currentModal.addEventListener('click', closeModal);
        currentModal.querySelector('.js-modal-close').addEventListener('click', closeModal);
        currentModal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);

        // Gestion du bouton de retour pour la navigation entre modales
        const backBtn = currentModal.querySelector('.js-modal-back');
        if (backBtn !== null) {
            backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(e.currentTarget.getAttribute('href'));
            });
        }
        // Ajoute des cartes de photo si la cible est la galerie photo
        if (targetHref === '#modal') {
            addPhotoCards();
        }
    } else {
        console.error('La modale est introuvable.');
    }
}

// Fonction pour fermer la modale
function closeModal() {
    if (currentModal === null) return; // Si aucune modale n'est ouverte, arrête la fonction
    currentModal.style.display = "none";
    currentModal.setAttribute('aria-hidden', 'true');
    currentModal.removeAttribute('aria-modal');
    // Supprime les écouteurs d'événement
    currentModal.removeEventListener('click', closeModal);
    currentModal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    currentModal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
    currentModal = null; // Réinitialise la variable 'currentModal' à null pour indiquer qu'aucune modale n'est ouverte
}

// Fonction pour arrêter la propagation des événements
function stopPropagation(e) {
    e.stopPropagation();
}

// Ajoute des écouteurs d'événements à tous les éléments avec la classe 'js-modal' pour ouvrir les modales
document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(e.currentTarget.getAttribute('href'));
    });
});

// Ferme la modale en appuyant sur la touche 'Échap'
window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal();
    }
})

// Prévisualisation de l'image du projet à ajouter 
const previewImg = document.querySelector(".cardInputPhoto img");
const iconFile = document.querySelector(".cardInputPhoto .fa-image");
const inputFile = document.querySelector(".cardInputPhoto input");
const labelFile = document.querySelector(".cardInputPhoto label");
const pFile = document.querySelector(".cardInputPhoto p");

inputFile.addEventListener("change", () => {
    const file = inputFile.files[0]; // Récupération de l'input et enregistrement dans file
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImg.src = e.target.result;
            previewImg.style.display = "block";
            labelFile.style.display = "none";
            iconFile.style.display = "none";
            pFile.style.display = "none";
            updateValidateButton(true);
        }
        reader.readAsDataURL(file);
    }
})

// Mise à jour du bouton de validation lorsque l'image est prévisualisée
function updateValidateButton(readyForSending) {
    const validateBtn = document.querySelector('.formContent .validateBtn');
    if (readyForSending) {
        validateBtn.style.backgroundColor = '#1D6154';
    } else {
        validateBtn.style.backgroundColor = '#A7A7A7';
    }
}

// Ajout d'un nouveau projet 
const form = document.querySelector(".formContent");
const title = document.querySelector(".formContent input[name='addTitle']");
const category = document.querySelector(".formContent select[name='selectCategory']");
let messageError = document.querySelector(".error-message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Vérification du titre et de la catégorie
    if (title.value === '' || category.value === '') {
        messageError.textContent = 'Veuillez remplir tous les champs.';
        return;
    } else {
        messageError.textContent = null;
    }

    // Récupération du token
    const userData = JSON.parse(localStorage.getItem("userdata"));
    const token = userData ? userData.token : null;

    const formData = new FormData(form);
    formData.append('title', title.value);
    formData.append('category', category.value);

    // Ajout du fichier image au formData
    const file = inputFile.files[0];
    if (file) {
        formData.append('image', file);
    }

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: 'POST',
            body: formData,
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erreur lors de l\'ajout du projet');
        }
        console.log("Voici le projet ajouté", data);
        await displayWorks(await refreshWorks());
        openModal('#modal');
    } catch (error) {
        console.log("Erreur lors de l'ajout :", error);
    }
});

// Liste des catégories dans select
async function displayCategoryModal() {
    const select = document.querySelector(".formContent select");
    const categories = await getCategories();

    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "";
    select.appendChild(emptyOption);

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    })
}
displayCategoryModal()