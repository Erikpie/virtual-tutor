import React, { useState, useRef, useEffect, useCallback } from "react"
import firebase from "firebase/app"
import "firebase/database"

var config = {
  apiKey: "AIzaSyBLfvlNwNehgXM2jCzx75wADA5xRssDChs",
  authDomain: "live-web-tutor.firebaseapp.com",
  databaseURL: "https://live-web-tutor-default-rtdb.firebaseio.com/",
}
firebase.initializeApp(config)

// Get a reference to the database service
const database = firebase.database()

const stunServers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302"],
    },
  ],
}

/**
 * TODO: Allow reconnect of screen share
 * TODO: Integrate demo into actual product
 * Uses WebRTC for video screen sharing and Firebase for signaling in
 * order to actually connect to video streams.
 * https://youtu.be/WmR9IMUD_CY
 */
const ScreenShareDemo = () => {
  const [sharing, setSharing] = useState(false)
  const [isHost, setIsHost] = useState(false)
  const [numViewers, setNumViewers] = useState(0)
  const [peerConnections, setPeerConnections] = useState({})
  const [roomID, setRoomID] = useState("")
  const [joinKey, setJoinKey] = useState("")
  const [stream, setStream] = useState()
  const videoContainer = useRef(null)

  // Starts broadcasting and creates an offer for audience to join
  const startSharing = async () => {
    // Create new room in DB if it doesn't exist
    const roomDoc = roomID
      ? database.ref("rooms").child(roomID)
      : database.ref("rooms").push()
    const roomDocKey = roomID ? roomID : (await roomDoc).key
    const localStream = stream
      ? stream
      : await navigator.mediaDevices.getDisplayMedia({ video: true })

    // Add your first session
    await addSession(roomDocKey, localStream)

    // Finally update state if all is sucessful
    setJoinKey(roomDocKey)
    setStream(localStream)
    setSharing(true)
    setIsHost(true)
  }

  const addSession = useCallback(
    async (roomID, localStream) => {
      // Create a new webRTC signaling session in DB
      const screenSessionDoc = database.ref("rooms").child(roomID).push()
      const screenSessionDocKey = (await screenSessionDoc).key
      const offerCandidates = screenSessionDoc.child("offerCandidates")

      // Save the key of the session so that a client can find and join it
      await database
        .ref("rooms")
        .child(roomID)
        .update({ availableSessionID: screenSessionDocKey })

      // Initialize a peer connection and add it to existing peer connections
      const pc = new RTCPeerConnection(stunServers)
      setPeerConnections({ ...peerConnections, [screenSessionDocKey]: pc })

      // Get screen sharing stream from user and add it to the remote connection
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream)
      })

      // Grab host ICE candidates and save to DB
      pc.onicecandidate = (event) => {
        event.candidate && offerCandidates.push(event.candidate.toJSON())
      }

      // Create an offer for a peer to join, and save it to the database
      const offerDesc = await pc.createOffer()
      await pc.setLocalDescription(offerDesc)
      const offer = {
        sdp: offerDesc.sdp,
        type: offerDesc.type,
      }
      await screenSessionDoc.set({ offer })

      // Start listening for peer answers, and save those answers
      // to the signaling DB
      screenSessionDoc.on("value", async (snapshot) => {
        const data = snapshot.val()
        if (!pc.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer)
          await pc.setRemoteDescription(answerDescription)
        }
      })
      const answerCandidates = screenSessionDoc.child("answerCandidates")

      // Add candidate to peer connection when they join the call
      answerCandidates.on("child_added", async (data) => {
        const candidate = new RTCIceCandidate(data.val())
        await pc.addIceCandidate(candidate)
      })

      // Watch for connection state changes on host
      pc.onconnectionstatechange = () => {
        // console.log(pc.iceConnectionState)
        if (pc.iceConnectionState === "connected") {
          setNumViewers(numViewers + 1)
        }
      }
    },
    [peerConnections, numViewers]
  )

  // Used to join a user who's already broadcasting
  const joinSharing = async () => {
    // Create a peer connection
    const pc = new RTCPeerConnection(stunServers)
    const remoteStream = new MediaStream()

    // Allows remote stream to be broadcasted to user joining the room
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track)
      })
    }

    // Get room information
    const roomDoc = database.ref("rooms").child(roomID)
    if (!roomDoc) {
      throw Error("RoomID not found!")
    }
    // Grab signaling info for the joining room by finding the last
    // webRTC session
    const availableSessionDoc = await roomDoc.child("availableSessionID").get()
    const availableSessionID = await availableSessionDoc.val()

    console.log(availableSessionID)
    // TODO: Should be a soft error displayed to the user rather than an
    // exception to be thrown
    if (!availableSessionID || availableSessionID === "") {
      throw Error("Room might be fully occupied, try again later")
    }

    const screenSessionDoc = roomDoc.child(availableSessionID)

    // Add local ICE candidates to the signaling DB
    const answerCandidates = screenSessionDoc.child("answerCandidates")
    pc.onicecandidate = (event) => {
      event.candidate && answerCandidates.push(event.candidate.toJSON())
    }

    // Get host signaling information and add your own signaling information
    // to the signaling DB
    const offerDoc = await screenSessionDoc.child("offer").get()
    const offerDesc = await offerDoc.val()
    await pc.setRemoteDescription(new RTCSessionDescription(offerDesc))
    const answerDescription = await pc.createAnswer()
    await pc.setLocalDescription(answerDescription)
    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    }

    await screenSessionDoc.update({ answer })

    // Get host ICE candidates to establish peer connection
    const offerCandidates = screenSessionDoc.child("offerCandidates")
    offerCandidates.on("child_added", (data) => {
      const candidate = new RTCIceCandidate(data.val())
      pc.addIceCandidate(candidate)
    })

    // Remove the availableSessionID on the database
    database.ref("rooms").child(roomID).child("availableSessionID").remove()

    // Update local state to show stream
    setStream(remoteStream)
    setSharing(true)
  }

  // This gets called when the broadcaster wants to stop sharing their screen
  // or when they disconnect from the video stream
  // TODO: Find some way to cleanup the signaling DB when the host/audience
  // closes the browser instead of clicking the disconnect button
  const stopSharing = () => {
    stream.getTracks().forEach((track) => track.stop())
    videoContainer.current.srcObject = null
    // Remove signaling info from database
    // for all peers
    database.ref("rooms").child(joinKey).remove()
    setStream()
    setSharing(false)
  }

  useEffect(() => {
    // In case the user ends the video in some other manner
    const videoEnded = () => {
      videoContainer.current.srcObject = null
      setSharing(false)
    }

    // Makes sure that the stream is being displayed if there is one
    if (videoContainer.current.srcObject !== stream) {
      videoContainer.current.srcObject = stream
    }

    // Checks to see if all peer connections are occupied and creates a new
    // connection if all current connections are occupied
    if (isHost) {
      let occupied = true

      for (const connectionID in peerConnections) {
        if (peerConnections[connectionID].iceConnectionState === "new") {
          occupied = false
        }
      }

      if (joinKey !== "" && occupied) {
        addSession(joinKey, stream)
      }
    }

    // Event listener for when the stream ends
    stream &&
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        videoEnded()
      })
    return (
      stream &&
      stream.getVideoTracks()[0].removeEventListener("ended", () => {
        videoEnded()
      })
    )
  }, [stream, peerConnections, addSession, joinKey, isHost /*, numViewers*/])

  return (
    <div>
      <video
        ref={videoContainer}
        style={{ height: "256px" }}
        autoPlay
        playsInline
      />
      {sharing ? (
        <div>
          <p>Room IDs</p>
          <div>
            <p>{joinKey}</p>
          </div>
          <button onClick={startSharing}>Add user</button>
          <button onClick={stopSharing}>Stop sharing</button>
        </div>
      ) : (
        <div>
          <button onClick={startSharing}>Create room (screen sharing)</button>
          <input
            type="text"
            value={roomID}
            onChange={(e) => setRoomID(e.target.value)}
            placeholder="Room ID"
          />
          <button onClick={joinSharing}>Join a room</button>
        </div>
      )}
    </div>
  )
}

export default ScreenShareDemo
