import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuração oficial do seu projeto Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC2UEvGVC2WzVOzP9ABv5XqsVGyZ7PBviA",
    authDomain: "dvd-digital-platform.firebaseapp.com",
    projectId: "dvd-digital-platform",
    storageBucket: "dvd-digital-platform.firebasestorage.app",
    messagingSenderId: "821458852434",
    appId: "1:821458852434:web:aab201ae8fb4d3fd215d8b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
