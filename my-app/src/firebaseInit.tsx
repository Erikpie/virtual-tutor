import firebase from "firebase/app"
import "firebase/auth"
import "firebase/analytics"
import "firebase/database"
// Configure Firebase
// TODO: FIXME: This config should be stored in an env file once the mvp
// is complete. Otherwise this is a security concern and will lead to the abuse
// of API keys
export const firebaseConfig = {
  apiKey: "AIzaSyBLfvlNwNehgXM2jCzx75wADA5xRssDChs",
  authDomain: "live-web-tutor.firebaseapp.com",
  databaseURL: "https://live-web-tutor-default-rtdb.firebaseio.com",
  projectId: "live-web-tutor",
  storageBucket: "live-web-tutor.appspot.com",
  messagingSenderId: "332165633586",
  appId: "1:332165633586:web:25de3e35ffe8cff5ee0e2b",
  measurementId: "G-0Q6B99NS1Z",
}

// Firebase app was getting initialized twice before, no idea why, just added this to fix it. Should get rid of this later
let app: firebase.app.App
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig)
} else {
  app = firebase.app() // if already initialized, use that one
}

export const auth = app.auth();
export const analytics = app.analytics();
export const provider = new firebase.auth.GoogleAuthProvider();
export default app
