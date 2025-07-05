// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGc6wpsdaP1ya1N2vxntRM0KG9eAzkeLI",
  authDomain: "walmart-hackthon.firebaseapp.com",
  projectId: "walmart-hackthon",
  storageBucket: "walmart-hackthon.firebasestorage.app",
  messagingSenderId: "840737680536",
  appId: "1:840737680536:web:fb3cbb38af7c173a9d74ed",
  measurementId: "G-HJ5Q5WZ9RR"
};
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_API_KEY,
//   authDomain: import.meta.env.VITE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_APP_ID,
//   measurementId: import.meta.env.VITE_MEASUREMENT_Id
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);