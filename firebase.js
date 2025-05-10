// firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyC3-DiICvYhyCHnsrLzSHLM4w-pG-dYg0M",
    authDomain: "foodorderingapp-c59d7.firebaseapp.com",
    projectId: "foodorderingapp-c59d7",
    storageBucket: "foodorderingapp-c59d7.appspot.com",
    messagingSenderId: "284783797063",
    appId: "1:284783797063:web:5430272b8a9184dc37a262",
    measurementId: "G-HXJVNNCF6P"
  };

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const db = getFirestore(app);
  
  export { db };