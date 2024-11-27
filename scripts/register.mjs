import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { saveDoc, auth } from "./firebase.mjs";

/** @type {HTMLButtonElement} */
const button = document.querySelector("button#daftar");
/** @type {NodeListOf<HTMLInputElement | HTMLSelectElement>} */
const inputs = document.querySelectorAll("input, select");

button.onclick = async () => {
    for (const input of inputs) {
        if (!input.value) {
            input.reportValidity();
            return;
        }
    }

    // Ubah nodelist ke array
    const arr = Array.from(inputs);
    // Ubah foto ke base64
    const photo = await toBase64(arr.find(el => el.name == "register-photo").files[0]);

    const userInformation = {
        name: arr.find(el => el.name == "register-name").value,
        nim: arr.find(el => el.name == "register-nim").value,
        email: arr.find(el => el.name == "register-email").value,
        fakultas: arr.find(el => el.name == "register-fakultas").value,
        studi: arr.find(el => el.name == "register-studi").value,
        photo
    }

    try {
        button.innerHTML = `<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>`;

        const user = await createUserWithEmailAndPassword(
            auth,
            userInformation.email, 
            arr.find(el => el.name == "register-password").value
        ).then(user => user.user);

        // Simpan informasi pribadi
        await saveDoc(userInformation, "users", user.uid);
        // Simpan placeholder history
        await saveDoc({ history: [] }, "history", user.uid);

        window.location = "/";
    } catch (error) {
        button.innerHTML = "Daftar";
        console.error(error);
        showRegisterError();
    }
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

/**
 * @param {string} message
 */
const showRegisterError = (message) => {
    /** @type {HTMLDivElement} */
    const error = document.querySelector(".alert");

    if (message) error.innerText = message;
    else error.innerText = "Email sudah terdaftar.";

    error.classList.remove("d-none");
}