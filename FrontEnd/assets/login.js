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
            localStorage.setItem("userdata", JSON.stringify(data));
            window.location.href = "./index.html";
        } else {
            let messageError = document.querySelector(".error-message");
            messageError.textContent = data.message || "E-mail ou mot de passe incorrect.";
        }
    });
});