// Menggunakan array untuk Firebase
export const firebaseConfig = [
    process.env.FIREBASE_API_KEY,
    process.env.FIREBASE_AUTH_DOMAIN,
    process.env.FIREBASE_PROJECT_ID,
    process.env.FIREBASE_STORAGE_BUCKET,
    process.env.FIREBASE_MESSAGING_SENDER_ID,
    process.env.FIREBASE_APP_ID
];

// Cara mengaksesnya:
export const firebaseConfigObj = {
    apiKey: firebaseConfig[0],
    authDomain: firebaseConfig[1],
    projectId: firebaseConfig[2],
    storageBucket: firebaseConfig[3],
    messagingSenderId: firebaseConfig[4],
    appId: firebaseConfig[5],
};
// Menggunakan array untuk Telegram
export const TELEGRAM_CONFIG = [
    process.env.TELEGRAM_BOT_TOKEN,
    process.env.TELEGRAM_CHAT_ID
];

// Cara mengaksesnya:
export const telegramConfigObj = {
    token: TELEGRAM_CONFIG[0],
    chat_id: TELEGRAM_CONFIG[1]
};