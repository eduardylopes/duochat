import { initializeApp } from 'firebase/app';

import { getAuth, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBAvhJ3ZVDWzs0PiWekZ7zhzC_HiRybH50",
  authDomain: "duochat-d3d60.firebaseapp.com",
  databaseURL: "https://duochat-d3d60-default-rtdb.firebaseio.com",
  projectId: "duochat-d3d60",
  storageBucket: "duochat-d3d60.appspot.com",
  messagingSenderId: "685986646829",
  appId: "1:685986646829:web:73e8a5886951470bd761a4",
  measurementId: "G-N3ZF0Z9N2E"
};

const app = initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database, googleProvider, githubProvider }