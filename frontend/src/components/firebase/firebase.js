import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAyc2fM-5uEJbHNSPDe3zRCyokYHygpiDw",
  authDomain: "localpeople-37b10.firebaseapp.com",
  databaseURL: "https://localpeople-37b10-default-rtdb.firebaseio.com",
  projectId: "localpeople-37b10",
  storageBucket: "localpeople-37b10.appspot.com",
  messagingSenderId: "245937527403",
  appId: "1:245937527403:web:9c2603338ea5f998162f2e",
  measurementId: "G-VC5L7QJF2S",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
