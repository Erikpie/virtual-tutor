import firebase from "firebase/app"
import "firebase/auth"
import "firebase/analytics"
import "firebase/database"
import {
  FirebaseDatabaseProvider,
  FirebaseDatabaseNode,
  FirebaseDatabaseMutation,
} from "@react-firebase/database"

// Configure Firebase
// Pretty sure this is ill-advised but I don't really know where else to put these right now
export const firebaseConfig = {
  apiKey: "AIzaSyBLfvlNwNehgXM2jCzx75wADA5xRssDChs",
  authDomain: "live-web-tutor.firebaseapp.com",
  projectId: "live-web-tutor",
  storageBucket: "live-web-tutor.appspot.com",
  messagingSenderId: "332165633586",
  databaseURL: "live-web-tutor-default-rtdb.firebaseio.com",
  appId: "1:1082477495907:web:a85d8ff36c2163a7abda56",
  measurementId: "G-KG3Y18ELCQ",
}

// Firebase app was getting initialized twice before, no idea why, just added this to fix it. Should get rid of this later
let app: firebase.app.App
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig)
} else {
  app = firebase.app() // if already initialized, use that one
}

export const auth = app.auth()
export const analytics = app.analytics()
export const provider = new firebase.auth.GoogleAuthProvider()
export default app
