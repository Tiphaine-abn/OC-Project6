// Fonction utilitaire pour créer les éléments du formulaire de connexion
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

// Création du formulaire de connexion
const loginFormElement = createElement('form', { id: 'login-form' }, [
    createElement('label', { for: 'email' }, 'Email'),
    createElement('input', { type: 'email', id: 'email', name: 'email', required: true }),
    createElement('label', { for: 'password' }, 'Mot de passe'),
    createElement('input', { type: 'password', id: 'password', name: 'password', required: true }),
    createElement('input', { type: 'submit', value: 'Se connecter' }),
    createElement('a', { href: '#', className: 'forgot-password' }, 'Mot de passe oublié'),
    createElement('p', { className: 'error-message' })
]);

// Création de la section de connexion
const contactSection = createElement('section', { id: 'contact' }, [
    createElement('h2', {}, 'Log In'),
    loginFormElement
]);

// Ajoute la section de connexion au main
const mainElement = document.querySelector('main');
mainElement.appendChild(contactSection);


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
        const response = await fetch("https://oc-project6-backend.onrender.com/api/users/login", {
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
