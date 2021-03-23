import React, { useState, useRef, useEffect } from "react"
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
 * TODO: Use one universal key to join room instead of new key for each user
 *       This involves using something other than the callDoc ID
 * TODO: Allow reconnect of screen share
 * TODO: Integrate demo into actual product
 * Uses WebRTC for video screen sharing and Firebase for signaling in
 * order to actually connect to video streams.
 * https://youtu.be/WmR9IMUD_CY
 */
const ScreenShareDemo = () => {
  const [sharing, setSharing] = useState(false)
  const [peerConnections, setPeerConnections] = useState({})
  const [roomID, setRoomID] = useState("")
  const [joinKeys, setJoinKeys] = useState([])
  const [stream, setStream] = useState()
  const videoContainer = useRef(null)

  // Starts broadcasting and creates an offer for audience to join
  const startSharing = async () => {
    // Initialize signaling info to database
    const callDoc = database.ref("calls").push()
    const callDocKey = (await callDoc).key
    setJoinKeys([...joinKeys, callDocKey])
    const offerCandidates = callDoc.child("offerCandidates")

    // Initialize a peer connection and add it to existing peer connections
    const pc = new RTCPeerConnection(stunServers)
    setPeerConnections({ ...peerConnections, [callDocKey]: pc })

    // Get screen sharing stream from user and add it to the remote connection
    const localStream = stream
      ? stream
      : await navigator.mediaDevices.getDisplayMedia({ video: true })
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
    await callDoc.set({ offer })

    // Start listening for peer answers, and save those answers
    // to the signaling DB
    callDoc.on("value", async (snapshot) => {
      const data = snapshot.val()
      console.log(data)
      if (!pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer)
        await pc.setRemoteDescription(answerDescription)
      }
    })
    const answerCandidates = callDoc.child("answerCandidates")

    // Add candidate to peer connection when they join the call
    answerCandidates.on("child_added", async (data) => {
      const candidate = new RTCIceCandidate(data.val())
      await pc.addIceCandidate(candidate)
    })

    // Finally update state if all is sucessful
    setStream(localStream)
    setSharing(true)
  }

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

    // Grab signaling info for the joining room
    const callDoc = database.ref("calls").child(roomID)
    const answerCandidates = callDoc.child("answerCandidates")

    // Add local ICE candidates to the signaling DB
    pc.onicecandidate = (event) => {
      event.candidate && answerCandidates.push(event.candidate.toJSON())
    }

    // Get room information and 
    const callData = (await callDoc.get()).val()
    if (!callData) {
      throw Error("RoomID not found!")
    }

    // Get host signaling information and add your own signaling information
    // to the signaling DB
    const offerDesc = callData.offer
    await pc.setRemoteDescription(new RTCSessionDescription(offerDesc))
    const answerDescription = await pc.createAnswer()
    await pc.setLocalDescription(answerDescription)
    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    }

    await callDoc.update({ answer })

    // Get host ICE candidates to establish peer connection
    const offerCandidates = callDoc.child("offerCandidates")
    offerCandidates.on("child_added", (data) => {
      const candidate = new RTCIceCandidate(data.val())
      pc.addIceCandidate(candidate)
    })

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
    joinKeys.forEach((roomID) => {
      database.ref("calls").child(roomID).remove()
    })
    setSharing(false)
  }

  useEffect(() => {
    // In case the user ends the video in some other manner
    const videoEnded = () => {
      videoContainer.current.srcObject = null
      setSharing(false)
    }

    if (videoContainer.current.srcObject !== stream) {
      videoContainer.current.srcObject = stream
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
  }, [stream])

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
            {joinKeys.map((roomID) => (
              <p key={roomID}>{roomID}</p>
            ))}
          </div>
          <button onClick={startSharing}>Add user</button>
          <button onClick={stopSharing}>Stop sharing</button>
        </div>
      ) : (
        <div>
          <button onClick={startSharing}>Start screen sharing</button>
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
