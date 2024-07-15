let modal = null

function addPhotoCards() {
    const photoContainer = document.getElementById('photo-container');
    photoContainer.innerHTML = "";

    works.forEach(work => {
        const card = document.createElement('div');
        card.classList.add('photo-card');
        card.dataset.workId = work.id; // Ajout de l'ID du travail

        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title || 'Photo du projet';

        const deleteProject = document.createElement('div');
        deleteProject.classList.add('delete-icon');
        deleteProject.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

        deleteProject.addEventListener('click', (e) => {
            deleteWork(e.currentTarget.closest(".photo-card").dataset.workId)
        });

        card.appendChild(img);
        card.appendChild(deleteProject);
        photoContainer.appendChild(card);
    });
};

// Suppression des projets existants
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
                throw Error(response.status, response.body)
            }
        })
        .then(async () => {
            const photoContainer = document.querySelector('.photo-container');
            const childs = photoContainer.childNodes;
            console.log("childNodes => ", childs);
            for (i = 0; i < childs.length; ++i) {
                const currentChild = childs[i];
                if (Number(currentChild.dataset.workId) === Number(id)) {
                    photoContainer.removeChild(currentChild)
                    await displayWorks(await refreshWorks());
                    return;
                }
            }
        })
        .catch((error) => {
            console.log("Erreur lors de la suppression :", error);
        });
};

const openModal = function (targetHref) {
    const target = document.querySelector(targetHref); // Récupère la cible de la modale à partir de l'attribut 'href' du lien cliqué
    if (modal !== null) {
        modal.style.display = "none";
        modal.removeAttribute('aria-modal');
        modal.setAttribute('aria-hidden', true);
        modal.removeEventListener('click', closeModal);
        modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
        modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
        modal = null;
    }
    target.style.display = null;
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');
    modal = target;
    // Ajoute des écouteurs d'événements pour gérer la fermeture de la modale et empêcher la propagation de l'événement
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
    const backBtn = modal.querySelector('.js-modal-back');
    if (backBtn !== null) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(e.currentTarget.getAttribute('href'));
        });
    }
    if (targetHref === '#modal') {
        addPhotoCards();
    }
}

const closeModal = function () {
    if (modal === null) return; // Si aucune modale n'est ouverte, arrête la fonction
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
    a.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(e.currentTarget.getAttribute('href'));
    });
})

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
    console.log(file);
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