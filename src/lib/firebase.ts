import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDPAbz5Oejc91PcQQmyugVEFGbsf-itvBA",
    authDomain: "still-9f7e0.firebaseapp.com",
    projectId: "still-9f7e0",
    storageBucket: "still-9f7e0.firebasestorage.app",
    messagingSenderId: "1023637356088",
    appId: "1:1023637356088:web:f34f16d5d28b5a093530cd"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);