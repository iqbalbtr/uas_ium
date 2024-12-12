"use client"
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCA4xdEIqkHF2JHx0KplmVz0aI61sVErFw",
  authDomain: "empat-husada.firebaseapp.com",
  projectId: "empat-husada",
  storageBucket: "empat-husada.firebasestorage.app",
  messagingSenderId: "1095838304542",
  appId: "1:1095838304542:web:f0bf5c742127a1ba4b610f",
  measurementId: "G-PX2SZ5YVBG"
};

const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;