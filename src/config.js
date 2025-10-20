// src/config.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBKC-kisDdoIS0b2_jA8qz0edDNs-jfBDI",
  authDomain: "zetzu-app.firebaseapp.com",
  databaseURL: "https://zetzu-app-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "zetzu-app",
  storageBucket: "zetzu-app.firebasestorage.app",
  messagingSenderId: "1030001539813",
  appId: "1:1030001539813:web:94107cf013aa6efa80f20c",
  measurementId: "G-CDEYCEPT0M"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);