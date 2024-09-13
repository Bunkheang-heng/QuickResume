// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsKUKX61Iqr18kMM1mvbu-yc6jAc0J0jU",
  authDomain: "quickresume-1f00f.firebaseapp.com",
  projectId: "quickresume-1f00f",
  storageBucket: "quickresume-1f00f.appspot.com",
  messagingSenderId: "778679270367",
  appId: "1:778679270367:web:a96d7dac595cdf322ba26a",
  measurementId: "G-TWJSMLE3CV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };