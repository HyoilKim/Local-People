import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyDRhJhanXZ-aRszdNtTxcFdBJC-5G9iVRQ",
    authDomain: "localpeople.firebaseapp.com",
    databaseURL: "https://localpeople-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "localpeople",
    storageBucket: "localpeople.appspot.com",
    messagingSenderId: "416210388254",
    appId: "1:416210388254:web:0e78b0eb4137367d35f50f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
export default firebase;
