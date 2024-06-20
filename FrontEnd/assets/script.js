// Récupération de l'API et des travaux //
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works")
    const works = await response.json();
    return works;
}

// Ajout des éléments dans la galerie //
async function displayWorks() {
    const gallery = document.querySelector(".gallery");
    console.log("Gallery =>", gallery);
    const worksList = await getWorks();
    if (worksList) {
        worksList.forEach((work) => {
            console.log("Work =>", work)
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

document.addEventListener("DOMContentLoaded", function (event) {
    displayWorks();
})

///   Execution du script    ///
// Récupère des travaux depuis une API via une requête fetch.
// Convertit la réponse en JSON.
// Sélectionne un élément de galerie dans le DOM.
// Pour chaque travail récupéré, crée des éléments figure, img, et figcaption.
// Remplit ces éléments avec les données des travaux.
// Ajoute ces éléments à la galerie.
// S'exécute une fois que le DOM est entièrement chargé.