import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import "./styles.css"

import firebase from "../../firebaseInit"

const database = firebase.database()

function Search() {
  const [rooms, setRooms] = useState(null)
  const history = useHistory()

  // Clicking on a room will redirect the user to the
  // room. Uses react-router to pass state into the Room component
  const joinRoom = (roomID, subject) => {
    const newRoomState = {
      id: roomID,
      subject: subject,
      isTutor: false,
      name: "newUser",
      messages: "",
    }
    history.push("/room", newRoomState)
  }

  useEffect(() => {
    // This function should only be called once on render, hence the useEffect
    // hook with an empty dependency array. The roomref.on() function will
    // automatically run every time that rooms property of Firebase updates
    // so it will auto refresh the room list
    const getRooms = async () => {
      const roomRef = database.ref("rooms")

      roomRef.on("value", (snapshot) => {
        const data = snapshot.val()
        setRooms(data)
      })
    }

    getRooms()
  }, [])

  return (
    <div>
      <div className="Search__header">
        <h1>Available rooms</h1>
        <p>
          Look or search for available rooms. The room name is the subject!
          Rooms should refresh automatically.
        </p>
      </div>
      <div className="Search__room-list">
        {rooms ? (
          <>
            {Object.entries(rooms).map((roomEntry, index) => {
              const roomID = roomEntry[0]
              const roomSubject = roomEntry[1].subject
              // Prevents the lastID property of Firebase from showing up
              // as a room
              if (index === Object.entries(rooms).length - 1) return null
              return (
                <div
                  className="Search__room-card"
                  key={roomID}
                  onClick={() => joinRoom(roomID, roomSubject)}
                >
                  <h2>{roomSubject || "No subject"}</h2>
                </div>
              )
            })}
          </>
        ) : (
          <h2>No rooms available!</h2>
        )}
      </div>
    </div>
  )
}
export default Search
