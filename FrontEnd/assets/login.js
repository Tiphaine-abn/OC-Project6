// Authentification de l'utilisateur

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#login-form");

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const users = {
            email: document.querySelector("#email").value,
            password: document.querySelector("#password").value,
        };

        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(users),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("authToken", data.token);
            console.log("L'utilisateur est connecté");
            window.location.href = "./index.html";
        } else {
            let messageError = document.querySelector("#error-message");
            if (!messageError) {
                messageError = document.createElement("p");
                messageError.id = "error-message";
                messageError.style.color = "red";
                messageError.style.textAlign = "center";
                form.appendChild(messageError);
            }
            messageError.textContent = data.message || "E-mail ou mot de passe incorrect.";
        }
    });
});

/*// Authentification de l'utilisateur

export function generateLoginForm() {
    const main = document.querySelector("main");

    const contactSection = document.createElement("section");
    contactSection.id = "contact";

    const h2 = document.createElement("h2");
    h2.textContent = "Log In";
    contactSection.appendChild(h2);

    const form = document.createElement("form");
    form.id = "login-form";

    const labelEmail = document.createElement("label");
    labelEmail.setAttribute("for", "email");
    labelEmail.textContent = "Email";
    form.appendChild(labelEmail);

    const inputEmail = document.createElement("input");
    inputEmail.type = "email";
    inputEmail.id = "email";
    inputEmail.name = "email";
    inputEmail.required = true;
    form.appendChild(inputEmail);

    const labelPassword = document.createElement("label");
    labelPassword.setAttribute("for", "password");
    labelPassword.textContent = "Mot de passe";
    form.appendChild(labelPassword);

    const inputPassword = document.createElement("input");
    inputPassword.type = "password";
    inputPassword.id = "password";
    inputPassword.name = "password";
    inputPassword.required = true;
    form.appendChild(inputPassword);

    const submitButton = document.createElement("input");
    submitButton.type = "submit";
    submitButton.value = "Se connecter";
    form.appendChild(submitButton);

    const forgotPasswordLink = document.createElement("a");
    forgotPasswordLink.href = "#";
    forgotPasswordLink.className = "forgot-password";
    forgotPasswordLink.textContent = "Mot de passe oublié";
    form.appendChild(forgotPasswordLink);

    contactSection.appendChild(form);
    main.appendChild(contactSection);

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
            // Stockage de l'user et du token d'authentification dans le stockage local
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("authToken", data.token);
            console.log("L'utilisateur est connecté")
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
}

document.addEventListener("DOMContentLoaded", function () {
    generateLoginForm();
});*/