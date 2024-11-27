import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { auth } from "./firebase.mjs";

/** @type {HTMLInputElement} */
const email = document.querySelector("input[name=login-email]");
/** @type {HTMLInputElement} */
const password = document.querySelector("input[name=login-password]");
/** @type {HTMLButtonElement} */
const loginBtn = document.querySelector("form button");

loginBtn.onclick = async function() {
    for (const element of [email, password]) {
        if (!element.value) return element.reportValidity();
    }

    try {
        loginBtn.innerHTML = `<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>`;
        await signInWithEmailAndPassword(auth, email.value, password.value);
    } catch (error) {
        loginBtn.innerHTML = "Masuk";
        console.error("Login failed:", error.code, error.message);
        showLoginError(error.message);
    }
}

/**
 * @param {string} message
 */
const showLoginError = (message) => {
    /** @type {HTMLDivElement} */
    const error = document.querySelector(".alert");
    if (message) {
        error.innerText = message;
    } else {
        error.innerText = "Email atau kata sandi salah.";
    }

    error.classList.remove("d-none");
}