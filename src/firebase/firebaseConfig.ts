
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBAbH0I0ylJcInHvzYKeXnRKuFSgO3m_EA",
  authDomain: "prueba-9c7af.firebaseapp.com",
  databaseURL: "https://prueba-9c7af-default-rtdb.firebaseio.com",
  projectId: "prueba-9c7af",
  storageBucket: "prueba-9c7af.firebasestorage.app",
  messagingSenderId: "623639387020",
  appId: "1:623639387020:web:8a035f026ab5da3261d4a9",
  measurementId: "G-BEN8Z33YT9"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app,auth };


