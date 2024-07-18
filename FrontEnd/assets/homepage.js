let works = null; // Stocke les travaux récupérés pour éviter des appels répétés à l'API

// Récupération des travaux depuis l'API si tableau vide
async function getWorks() {
    if (works === null) {
        await refreshWorks();
    }
    return works;
}

// Récupération des travaux depuis l'API (aussi utilisé pour charger les nouveaux travaux)
async function refreshWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    works = await response.json();
    return works;
}

// Affichage des éléments dans la galerie
async function displayWorks(listWorks) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = ""; // Vide la galerie avant d'ajouter les nouveaux éléments et évite les duplications

    if (listWorks !== null) {
        listWorks.forEach((work) => {
            const figure = document.createElement("figure");
            const img = document.createElement("img");
            const figcaption = document.createElement("figcaption");
            img.src = work.imageUrl;
            img.alt = work.title;
            figcaption.textContent = work.title;
            figure.appendChild(img);
            figure.appendChild(figcaption);
            gallery.appendChild(figure);
        });
    }
}

// Récupération des catégories depuis l'API
async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    return categories;
}

// Affichage des boutons filtres par catégories
async function displayCategoriesBtn() {
    const categories = await getCategories();
    const filters = document.querySelector(".filters");

    categories.unshift({ id: 0, name: "Tous" }); // Ajout de l'objet "Tous" au début des catégories et retourne la nouvelle longueur du tableau

    categories.forEach((category) => {
        const btn = document.createElement("button");
        btn.classList.add("filter-btn");
        btn.textContent = category.name;
        btn.id = category.id;
        if (category.id === 0)
            btn.classList.add("selected");
        filters.appendChild(btn);
    });

    // Ajout des événements de clic sur les boutons de filtres après leur création
    addFilterEventListeners();
}

// Fonction pour filtrer les travaux par catégorie
async function filterWorksByCategory(categoryId) {
    listWorks = await getWorks();
    if (Number(categoryId) === 0) { // Conversion de categoryId en nombre
        displayWorks(listWorks); // Affiche tous les travaux
    } else {
        const filteredWorks = listWorks.filter(work => work.categoryId == categoryId); // Filtre les travaux
        displayWorks(filteredWorks); // Affiche les travaux filtrés
    }
}

// Ajout des événements de clic sur les boutons de filtres
function addFilterEventListeners() {
    const buttons = document.querySelectorAll(".filters .filter-btn");
    buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const buttonId = e.target.id; // Récupération de l'id du bouton cliqué
            filterWorksByCategory(buttonId);

            // Supprime la classe 'selected' de tous les boutons et l'ajoute au bouton cliqué
            buttons.forEach((item) => {
                item.classList.remove("selected");
            });
            button.classList.add("selected");
        });
    });
}

// Fonction pour gérer l'affichage en fonction de l'état de l'utilisateur
async function displayUserState() {
    const userData = localStorage.getItem("userdata");
    const filters = document.querySelector(".filters");
    const loginLink = document.querySelector("#login-link");
    const logoutLink = document.querySelector("#logout-link");
    const editionMode = document.querySelector("#edition-mode");
    const modifyBtn = document.querySelector("#modify-btn");

    if (userData !== null) {
        const header = document.querySelector("header");
        // Utilisateur connecté
        filters.style.display = "none";
        loginLink.style.display = "none";
        logoutLink.style.display = "block";
        editionMode.style.display = "flex";
        header.style.margin = "100px 0px 50px";
        modifyBtn.style.display = "inline-flex";
        logoutLink.addEventListener("click", () => {
            // Déconnexion de l'utilisateur
            localStorage.clear();
            displayUserState(); // Met à jour l'affichage après la déconnexion
        });
    } else {
        // Utilisateur non connecté
        filters.style.display = "flex";
        loginLink.style.display = "block";
        logoutLink.style.display = "none";
        editionMode.style.display = "none";
        header.style.margin = "0px";
        modifyBtn.style.display = "none";
    }
}

// Exécution du script au chargement du DOM
document.addEventListener("DOMContentLoaded", async function () {
    await displayWorks(await getWorks());
    await displayCategoriesBtn();
    await displayUserState();
});
