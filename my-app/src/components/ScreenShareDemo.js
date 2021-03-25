import React, { useState, useRef, useEffect, useCallback } from "react"

import firebase from "../firebaseInit"

// Get a reference to the database service
const database = firebase.database()

// STUN servers are used to handle the complicated networking involved with
// peer connections and are pretty essential to the webRTC screen sharing
// feature that this component demonstrates
const stunServers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302"],
    },
  ],
}

/**
 * Uses WebRTC for video screen sharing and Firebase RealtimeDB for signaling in
 * order to actually connect to video streams.
 * https://youtu.be/WmR9IMUD_CY
 * https://firebase.google.com/docs/database/web/structure-data
 * https://webrtc.org/getting-started/peer-connections
 *
 * TODO: Integrate demo into actual product once room functionality is finished
 * TODO: Set a timer for DB to clear room data if the host terminates unexpectedly
 *       This will require a backend or cloud function to achieve
 * TODO: Do some memory cleanup for the host when a peer leaves the
 *       call/disconnects. This is very difficult to do if we stick with
 *       a client only approach to webRTC signaling
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

  // addSession() sets up the actual webRTC peer connection and sends information
  // to the signaling database in order to generate a peer connection session
  // that'll let a user join and see the host's screen
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
        if (pc.iceConnectionState === "connected") {
          setNumViewers(numViewers + 1)
        }
      }
    },
    [peerConnections, numViewers]
  )

  // Used to join a user who's already broadcasting. It essentially
  // creates a response to the host's webRTC peer connection after
  // it gets the necessary connection information from the signaling database
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
    // to the signaling DB after seeing the host details
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
  // or when a viewer disconnects from the call
  const stopSharing = () => {
    if (isHost) {
      // Remove signaling info from database for all peers since the
      // screen sharing session is over
      database.ref("rooms").child(joinKey).remove()
    }
    // Cleanup the webRTC streams and local state values
    stream.getTracks().forEach((track) => track.stop())
    videoContainer.current.srcObject = null
    setStream()
    setSharing(false)
  }

  useEffect(() => {
    // In case the user ends the video in some other manner. Note that
    // the event listener that calls this function isn't all that robust
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
  }, [stream, peerConnections, addSession, joinKey, isHost])

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
            <p>Share the key below to let others join the screenshare room</p>
            <p>
              Note: Don't forget to copy over the "-" character in the beginning
            </p>
            <p>{joinKey}</p>
          </div>
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
