// Authentification de l'utilisateur

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#login-form");

    form.addEventListener('submit', async function (event) {
        // Désactivation du comportement par défaut du navigateur (sans rechargement de la page)
        event.preventDefault();

        // Création de l'objet qui servira de charge utile de la requête
        const users = {
            email: document.querySelector("#email").value, // valeur saisie par l'utilisateur sur la page web
            password: document.querySelector("#password").value,
        };

        // Utilisation d'une requête POST pour envoyer les valeurs des entrées du formulaire
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(users),
        });

        const data = await response.json();

        if (response.ok) {
            // Stockage du token d'authentification dans le stockage local
            localStorage.setItem("authToken", data.token);
            // Redirection vers la page d'accueil quand la connexion est confirmée
            window.location.href = "./index.html";
        } else {
            // Ajout d'un message d'erreur au formulaire
            let messageError = document.querySelector("#error-message");
            if (!messageError) {
                messageError = document.createElement("p");
                messageError.id = "error-message";
                messageError.style.color = "red";
                messageError.style.textAlign = "center";
                form.appendChild(messageError);
            }
            // Affichage du message d'erreur quand les informations sont incorrectes
            messageError.textContent = data.message || "E-mail ou mot de passe incorrect.";
        }
    });
});