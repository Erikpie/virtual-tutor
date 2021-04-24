import React, { useState, useEffect } from "react"
import "./styles.css"

import firebase from "../../firebaseInit"

const database = firebase.database()

function Search() {
  const [rooms, setRooms] = useState(null)

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
              // Prevents the lastID property of Firebase from showing up
              // as a room
              if (index === Object.entries(rooms).length - 1) return null
              return (
                <div
                  className="Search__room-card"
                  key={roomEntry[0]}
                  onClick={() => console.log(roomEntry[0])}
                >
                  <h2>{roomEntry[1].subject || "No subject"}</h2>
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
