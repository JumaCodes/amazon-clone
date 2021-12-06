import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCrps8ZoCG4nx76PHgS_zpNdHZy8qp_HYM",
  authDomain: "clone-3fd22.firebaseapp.com",
  projectId: "clone-3fd22",
  storageBucket: "clone-3fd22.appspot.com",
  messagingSenderId: "980156197266",
  appId: "1:980156197266:web:994c12e6ca2bd2457f794b",
  measurementId: "G-339KR0GPRR"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
export { db, auth };