// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBN5XrA9JX6DfFvR0PbkTcPigrC-ZYXuFI",
  authDomain: "sitefilmes-6ecd1.firebaseapp.com",
  projectId: "sitefilmes-6ecd1",
  storageBucket: "sitefilmes-6ecd1.appspot.com",
  messagingSenderId: "678157852689",
  appId: "1:678157852689:web:2c8222be9e9bb359d451b0",
  measurementId: "G-TZ87MND79W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };