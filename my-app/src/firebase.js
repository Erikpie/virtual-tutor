import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics';

// Configure Firebase
// Pretty sure this is ill-advised but I don't really know where else to put these right now
const firebaseConfig = {
  apiKey: "AIzaSyBCN4SXzjRXFJAVmTSfqRnllcaDbr5JIRU",
  authDomain: "tutorbuds-59fea.firebaseapp.com",
  projectId: "tutorbuds-59fea",
  storageBucket: "tutorbuds-59fea.appspot.com",
  messagingSenderId: "1082477495907",
  appId: "1:1082477495907:web:a85d8ff36c2163a7abda56",
  measurementId: "G-KG3Y18ELCQ"
};

// Firebase app was getting initialized twice before, no idea why, just added this to fix it. Should get rid of this later
var app;
if (!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app(); // if already initialized, use that one
}

export const auth = app.auth();
export const analytics = app.analytics();
export const provider = new firebase.auth.GoogleAuthProvider();
export default app