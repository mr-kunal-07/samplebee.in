import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyAp_xzpA7H03zjAeiAL6EPijSoDcxD3_oM",
    authDomain: "billenniumdivas-c8d72.firebaseapp.com",
    projectId: "billenniumdivas-c8d72",
    storageBucket: "billenniumdivas-c8d72.firebasestorage.app",
    messagingSenderId: "1042908478050",
    appId: "1:1042908478050:web:918b56327f22ab6dce2f3b",
    measurementId: "G-EHRP4KWQ3J"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };