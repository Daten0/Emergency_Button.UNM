// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, arrayUnion, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { 
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { firebaseConfig } from "./env.mjs";

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);

onAuthStateChanged(auth, (user) => {
    console.log("Perubahan state login terjadi.");
    sessionStorage.setItem("user", JSON.stringify(user));
    
    if (user && window.location.pathname == "/login.html") {
        window.location = "/";
    }
});

export async function getProfile(uid) {
    const information = await getDoc(doc(firestore, "users", uid || "0"))
        .then(res => res.data())
        .catch(console.error);
    
    return information;
}

export async function getHistory(uid) {
    const histories = await getDoc(doc(firestore, "history", uid || "0"))
        .then(res => res.get("history"))
        .catch(console.error);

    return histories;
}

export async function getInformation(uid) {
    const information = await getDoc(doc(firestore, "users", uid || "0"))
        .then(res => res.data())
        .catch(console.error);

    return information;
}

export async function saveDoc(data, ...path) {
    await setDoc(doc(firestore, ...path), data);
}

export async function saveHistory(uid, data) {
    await updateDoc(doc(firestore, "history", uid), {
        history: arrayUnion(data)
    });
}

export function getCurrentUser() {
    const user = sessionStorage.getItem("user");
    return JSON.parse(user);
}

if (!getCurrentUser() && (
    window.location.pathname != "/register.html" &&
    window.location.pathname != "/login.html" &&
    !window.location.pathname.startsWith("/styles") &&
    !window.location.pathname.startsWith("/scripts") &&
    !window.location.pathname.startsWith("/img")
)) {
    window.location = "/login.html";
} else if (getCurrentUser() && (
    window.location.pathname == "/register.html" ||
    window.location.pathname == "/login.html"
)) {
    window.location = "/index.html";
}