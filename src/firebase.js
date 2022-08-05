import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDbnc_dj-1HpzQqLjQf_FkpwoJDxF6siMM",
  authDomain: "bamboo-b04ef.firebaseapp.com",
  projectId: "bamboo-b04ef",
  storageBucket: "bamboo-b04ef.appspot.com",
  messagingSenderId: "316299522771",
  appId: "1:316299522771:web:11d6cd0f920045e37ada26",
  measurementId: "G-XKLY9B1J0Y"
};

initializeApp(firebaseConfig);
const auth = getAuth();

export { auth };