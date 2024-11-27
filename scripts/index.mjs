import { saveHistory, getCurrentUser, getInformation } from "./firebase.mjs";
import { TELEGRAM_CONFIG } from "./env.mjs";

// Watch position elements
const textLatitude = document.querySelector(".latitude");
const textLongtitude = document.querySelector(".longtitude");
// Posisi sekarang
let latitude = 0;
let longtitude = 0;

// Toast
const toastContainer = document.querySelector(".toast-container");
const toastTimeout = document.querySelector("#toastTimeout");
const toastSukses = document.querySelector("#toastSukses");
const toastError = document.querySelector("#toastError");

if (navigator.geolocation) {
    // Watch posisi
    navigator.geolocation.watchPosition(locationOnSuccess, locationOnError, {
        enableHighAccuracy: true
    });
} else {
    locationOnError();
}

// Current position
function locationOnError() {
    const modalGagal = new bootstrap.Modal("#modalIzinLokasiGagal", {
        backdrop: "static",
        keyboard: false
    });

    modalGagal.show();
}

/**
 * @param {GeolocationPosition} pos
 */
function locationOnSuccess(pos) {
    latitude = pos.coords.latitude;
    longtitude = pos.coords.longitude; 

    // Ubah nomor X dan Y
    textLatitude.innerHTML = latitude;
    textLongtitude.innerHTML = longtitude;
}


// Tombol emergency //
let onworking = false;

/**
 * @type {HTMLDivElement}
 */
const bigButton = document.querySelector(".big-button");

// Touch perlu dihandle di js untuk transisi
// karena mobile tidak support :active
bigButton.ontouchstart = bigButton.onmousedown = () => {
    // Mencegah context menu muncul di mobile
    window.oncontextmenu = function(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    };

    if (onworking) return;
    bigButton.classList.add("pressed");
}

let timeouted = false
bigButton.onmouseup = async () => {
    window.oncontextmenu = null;
    if (onworking) return;

    bigButton.classList.remove("pressed");

    // Cegah spam kiriman data
    if (timeouted) {
        // Berikan toast timeout jika terlalu sering menekan
        /** @type {HTMLDivElement} */
        const toast = toastTimeout.cloneNode(true);
        toast.id = null;
        const ctrl = bootstrap.Toast.getOrCreateInstance(toast);

        setTimeout(() => {
            ctrl.hide();
            setTimeout(() => toastContainer.removeChild(toast), 1000);
        }, 5000);
        toastContainer.prepend(toast);
        return ctrl.show();
    }

    onworking = true;
    setTimeout(() => timeouted = false, 1000 * 5);
    timeouted = true;
    bigButton.innerHTML = `<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>`;

    try {
        const information = await getInformation(getCurrentUser().uid);

        // History
        const data = {
            name: information.name || "NoName",
            latitude: latitude,
            longitute: longtitude,
            date: Date.now(),
            gmap: `https://www.google.com/maps?q=loc:${latitude},${longtitude}`
        }
        await saveHistory(getCurrentUser().uid, data);

        // Telegram
        let message = "**🚨 Laporan Terbaru!**";
        message += "\n\n";
        message += `Nama: ${information.name || "Tanpa Nama"}\n`;
        message += `NIM: ${information.nim}\n`;
        message += `Email: ${information.email}\n`;
        message += `Fakultas: ${information.fakultas}\n`;
        message += `Prodi: ${information.studi}\n`;
        message += `Latitude: ${data.latitude}\n`;
        message += `Longitude: ${data.longitute}\n`;
        message += `\n\n`;
        message += data.gmap;

        await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chat_id,
                text: message
            })
        });

        /** @type {HTMLDivElement} */
        const toast = toastSukses.cloneNode(true);
        toast.id = null;
        const ctrl = bootstrap.Toast.getOrCreateInstance(toast);

        toastContainer.prepend(toast);
        ctrl.show();

        setTimeout(() => {
            ctrl.hide();
            setTimeout(() => toastContainer.removeChild(toast), 1000);
        }, 5000);
    } catch (error) {
        console.error(error);

        /** @type {HTMLDivElement} */
        const toast = toastError.cloneNode(true);
        toast.id = null;
        const ctrl = bootstrap.Toast.getOrCreateInstance(toast);

        toastContainer.prepend(toast);
        ctrl.show();

        setTimeout(() => {
            ctrl.hide();
            setTimeout(() => toastContainer.removeChild(toast), 1000);
        }, 5000);
    }

    // Ubah kembali tombol emergency
    bigButton.innerHTML = "EMERGENCY!";
    onworking = false;
}