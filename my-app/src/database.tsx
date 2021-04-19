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

export function createRoom(join_component): void {
	user_storage.ref('/rooms').once('value').then((snapshot) => {
	  var x = snapshot.val().lastID;
	  // book this room by updating last known id
	  // (This creates a race condition where two unrelated students
	  // can book the same room if they click the button at the same time...
	  // We got to think about how to fix that)
	  user_storage.ref().update({'rooms/lastID': x + 1});

	  // create the room with such an id
	  user_storage.ref('/')
	  
	  join_component.setState({roomReady: x});
});
}

export function getUpdate(room_component): void {
	
}

export function initRoom(room_component): void {
	
}

export default app
