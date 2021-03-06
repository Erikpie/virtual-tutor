import "firebase/database"
import firebase from "firebase/app"
//import { useEffect, useState } from 'react';

//Was getting error about firebase not being initialized before this code was run from firebaseInit.tsx
import { firebaseConfig } from "./firebaseInit"

let app: firebase.app.App
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig)
} else {
  app = firebase.app() // if already initialized, use that one
}

var user_storage = firebase.database()

export function writeUserData(
  userId: string,
  name: string,
  email: string,
  tutor: Boolean,
  admin: Boolean
) {
  user_storage.ref("users/" + userId).set({
    display_name: name,
    email: email,
    tutor_access: tutor,
    admin_access: admin,
  })
  console.log("Added User to Database")
}

export function setUserAdmin(userID: string, admin: boolean) {
  user_storage.ref("users/" + userID).update({ admin_access: admin })
}

export function setUserTutor(userID: string, tutor: boolean) {
  user_storage.ref("users/" + userID).update({ tutor_access: tutor })
}

export function createRoom(join_component): void {
  user_storage
    .ref("rooms")
    .once("value")
    .then((snapshot) => {
      let x = (snapshot.val() && snapshot.val().lastID) || 0
      // book this room by updating last known id
      // (This creates a race condition where two unrelated students
      // can book the same room if they click the button at the same time...
      // We got to think about how to fix that with mutex)
      user_storage.ref().update({ "rooms/lastID": x + 1 })

      // create the room with such an id
      user_storage.ref("/")

      join_component.setState({ roomReady: x })
    })
}

export function getUpdate(room_component): void {
  user_storage
    .ref("rooms/" + room_component.state.id)
    .once("value")
    .then((snapshot) => {
      let newVal = snapshot.val()
      console.log("Server Result" + JSON.stringify(newVal))
      room_component._isMounted = true
      newVal.messages = newVal.messages.messages
      console.log(newVal)
      room_component.setState(newVal) // update to current values
      room_component._isMounted = false
    })
}

export function initRoom(room_component): void {
  let x = JSON.parse(JSON.stringify(room_component)) // deep copy. Got a better way?
  delete x.state.name
  delete x.state.isTutor
  delete x.state.id
  delete x.state.messageVal
  let jsonData: string = JSON.stringify(x.state)
  console.log(jsonData)
  console.log(JSON.stringify(room_component.state))
  // create room in firebase
  // Use update() instead of set() because set() overrides and erases data
  user_storage.ref("rooms/" + room_component.state.id).update(x.state)
}

export function sendMessage(room_component, message): void {
  user_storage.ref("rooms/" + room_component.state.id + "/messages").update({
    messages: message,
  })
}

export default app
