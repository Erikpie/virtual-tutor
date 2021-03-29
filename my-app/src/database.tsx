import 'firebase/database';
import firebase from 'firebase/app';
//import { useEffect, useState } from 'react';

//Was getting error about firebase not being initialized before this code was run from firebaseInit.tsx
import { firebaseConfig } from './firebaseInit';

let app: firebase.app.App;
if (!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app(); // if already initialized, use that one
}

var user_storage = firebase.database();

export function writeUserData(userId: string, name: string, email: string, tutor: Boolean, admin: Boolean){
  user_storage.ref('users/' + userId).set({
    display_name: name,
    email: email,
    tutor_access: tutor,
    admin_access: admin,
  });
  console.log("Added User to Database");
}
  
export function setUserAdmin(userID: string, admin: boolean){
    user_storage.ref('users/' + userID).update({admin_access: admin});
}
  
export function setUserTutor(userID: string, tutor: boolean){
  user_storage.ref('users/' + userID).update({tutor_access: tutor});
}
