// Authentification de l'utilisateur
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#login-form");

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Récupération des données de l'utilisateur depuis le formulaire
        const users = {
            email: document.querySelector("#email").value,
            password: document.querySelector("#password").value,
        };

        // Envoi des données de l'utilisateur à l'API pour l'authentification
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(users),
        });

        // Récupération de la réponse de l'API
        const data = await response.json();

        // Si la connexion est réussie, enregistrement des données de l'utilisateur dans le localStorage et redirection
        if (response.ok) {
            localStorage.setItem("userdata", JSON.stringify(data));
            window.location.href = "./index.html";

        } else { // Si la connexion échoue, affichage du message d'erreur
            let messageError = document.querySelector(".error-message");
            messageError.textContent = data.message || "E-mail ou mot de passe incorrect.";
        }
    });
});