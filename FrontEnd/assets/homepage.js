// Récupération des travaux depuis l'API
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    return works;
}

// Affichage des éléments dans la galerie
async function displayWorks(works) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = ""; // Vide la galerie avant d'ajouter les nouveaux éléments et évite les duplications

    works.forEach((work) => {
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

    categories.unshift({ id: 0, name: "Tous" });

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
    const worksList = await getWorks();
    if (Number(categoryId) === 0) {
        displayWorks(worksList); // Affiche tous les travaux
    } else {
        const filteredWorks = worksList.filter(work => work.categoryId == categoryId);
        displayWorks(filteredWorks); // Affiche les travaux filtrés
    }
}

// Ajout des événements de clic sur les boutons de filtres
function addFilterEventListeners() {
    const buttons = document.querySelectorAll(".filters .filter-btn");
    buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const buttonId = e.target.id; // récupération de l'id du bouton cliqué
            filterWorksByCategory(buttonId);

            // Supprime la classe 'selected' de tous les boutons et l'ajoute au bouton cliqué
            buttons.forEach((item) => {
                item.classList.remove("selected");
            });
            button.classList.add("selected");
        });
    });
}

// Exécution du script au chargement du DOM
document.addEventListener("DOMContentLoaded", async function () {
    await displayWorks(await getWorks());
    await displayCategoriesBtn();
});