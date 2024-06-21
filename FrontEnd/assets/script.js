
// Récupération des travaux depuis l'API //
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    return works;
}

// Ajout des éléments dans la galerie //
async function displayWorks() {
    const gallery = document.querySelector(".gallery");
    console.log("Gallery :", gallery);
    const worksList = await getWorks();
    worksList.forEach((work) => {
        console.log("Work :", work)
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
///   Execution du script    ///
// Récupère des travaux depuis l'API via une requête fetch.
// Convertit la réponse en JSON.
// Sélectionne un élément de galerie dans le DOM.
// Pour chaque travail récupéré, crée des éléments figure, img, et figcaption.
// Remplit ces éléments avec les données des travaux.
// Ajoute ces éléments à la galerie.
// S'exécute une fois que le DOM est entièrement chargé.


// Ajout des filtres par catégorie de projet //
/* Utiliser l'objet 'Set' pour stocker ou obtenir une liste unique de toutes les catégories */
/* Mettre à jour l'affichage des projets en fonction des catégories sélectionnées */

// Récupération des catégories depuis l'API //
async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    console.log("Categories :", categories);
    return categories;
}

// Affichage des bouttons par catégories //
async function displayCategoriesBtn() {
    const filters = document.querySelector(".filters");
    console.log("Filters :", filters);
    const categories = await getCategories();

    categories.forEach((category) => {
        const btn = document.createElement("button");
        btn.textContent = category.name;
        btn.id = category.id;
        filters.appendChild(btn);
    });
}

// Evènements click sur les boutons pour filtrer par catégories //

/* A construire */


document.addEventListener("DOMContentLoaded", function (event) {
    displayWorks();
    displayCategoriesBtn();
})