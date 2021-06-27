import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyDzulYmNvZSc8SUcwXMIJmcNyYr4JHU0es",
  authDomain: "login-and-signup-5fc8b.firebaseapp.com",
  projectId: "login-and-signup-5fc8b",
  storageBucket: "login-and-signup-5fc8b.appspot.com",
  messagingSenderId: "382906376942",
  appId: "1:382906376942:web:7306be3117ac0deceac9ff",
  measurementId: "G-3548B5KZQ6",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
export default firebase;
