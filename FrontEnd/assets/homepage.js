let works = null; // Stocke les travaux récupérés pour éviter des appels répétés à l'API

// Fonction pour créer la section portfolio
function getPortfolioSection() {
    let portfolioSection = document.querySelector("#portfolio");

    // Crée la section portfolio si elle n'existe pas
    if (!portfolioSection) {
        portfolioSection = document.createElement("section");
        portfolioSection.id = "portfolio";
        portfolioSection.className = "portfolio";

        // Crée l'en-tête avec le lien "modifier"
        const header = document.createElement("h2");
        header.innerHTML = 'Mes projets<a href="#modal" class="modifyBtn js-modal" id="modify-btn"><i class="fa-regular fa-pen-to-square"></i> modifier</a>';

        portfolioSection.appendChild(header);

        // Ajoute la section au main, avant la section contact
        const main = document.querySelector("main");
        if (main) {
            main.insertBefore(portfolioSection, document.querySelector("#contact"));
        } else {
            document.body.appendChild(portfolioSection);
        }
    }

    // Assure que le bouton "modifier" ouvre la modale
    const modifyBtn = document.querySelector("#modify-btn");
    if (modifyBtn) {
        modifyBtn.addEventListener("click", (e) => {
            e.preventDefault();
            openModal('#modal');
        });
    }
    return portfolioSection;
}

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
    let gallery = document.querySelector(".gallery");
    if (!gallery) {
        gallery = document.createElement("div");
        gallery.className = "gallery";
        getPortfolioSection().appendChild(gallery);
    }
    gallery.innerHTML = ""; // Vide la galerie avant d'ajouter les nouveaux éléments

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
    let filters = document.querySelector(".filters");
    if (!filters) {
        filters = document.createElement("div");
        filters.className = "filters";
        getPortfolioSection().appendChild(filters);
    }

    const categories = await getCategories();

    categories.unshift({ id: 0, name: "Tous" }); // Ajout de l'objet "Tous" au début des catégories

    categories.forEach((category) => {
        const btn = document.createElement("button");
        btn.classList.add("filter-btn");
        btn.textContent = category.name;
        btn.id = category.id;
        if (category.id === 0) {
            btn.classList.add("selected");
        }
        filters.appendChild(btn);
    });

    // Ajout des événements de clic sur les boutons de filtres après leur création
    addFilterEventListeners();
}

// Fonction pour filtrer les travaux par catégorie
async function filterWorksByCategory(categoryId) {
    works = await getWorks();
    if (Number(categoryId) === 0) { // Conversion de categoryId en nombre
        displayWorks(works); // Affiche tous les travaux
    } else {
        const filteredWorks = works.filter(work => work.categoryId == categoryId); // Filtre les travaux
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

// Fonction pour gérer le cache ou l'affichage des éléments en fonction de l'état de l'utilisateur
async function displayUserState() {
    const userData = localStorage.getItem("userdata");
    const filters = document.querySelector(".filters");
    const loginLink = document.querySelector("#login-link");
    const logoutLink = document.querySelector("#logout-link");
    const modifyBtn = document.querySelector("#modify-btn");
    const header = document.querySelector("header");

    if (userData !== null) {
        // Utilisateur connecté
        filters.style.display = "none";
        loginLink.style.display = "none";
        logoutLink.style.display = "block";

        // Crée et ajoute "edition-mode"
        const editionMode = document.createElement("div");
        editionMode.className = "editionMode";
        editionMode.id = "edition-mode";
        editionMode.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>Mode édition';
        document.body.prepend(editionMode);

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
        const existingEditionMode = document.querySelector("#edition-mode");
        if (existingEditionMode) {
            existingEditionMode.remove();
        }
        header.style.margin = "50px";
        modifyBtn.style.display = "none";
    }
}

// Exécution du script au chargement du DOM
document.addEventListener("DOMContentLoaded", async function () {
    await getPortfolioSection();
    await displayCategoriesBtn();
    await displayWorks(await getWorks());
    await displayUserState();
});
