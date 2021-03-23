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
 * TODO: Start peer to peer broadcast
 * TODO: Start multiple peers broadcast
 * TODO: Integrate demo into actual product
 * Uses WebRTC for video screen sharing and Firebase for signaling in
 * order to actually connect to video streams.
 * https://youtu.be/WmR9IMUD_CY
 */
const ScreenShareDemo = () => {
  const [sharing, setSharing] = useState(false)
  const [roomID, setRoomID] = useState("")
  const [stream, setStream] = useState()
  const videoContainer = useRef(null)

  // Starts broadcasting and creates an offer for audience to join
  const startSharing = async () => {
    const pc = new RTCPeerConnection(stunServers)

    const localStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    })

    // Push tracks from local stream to peer connection
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream)
    })

    // Grab offer candidates and save to DB
    const callDoc = database.ref("calls").push()
    const offerCandidates = callDoc.child("offerCandidates")

    pc.onicecandidate = (event) => {
      event.candidate && offerCandidates.push(event.candidate.toJSON())
    }

    // Create offer
    const offerDesc = await pc.createOffer()
    await pc.setLocalDescription(offerDesc)

    const offer = {
      sdp: offerDesc.sdp,
      type: offerDesc.type,
    }

    await callDoc.set({ offer })

    // Start listening for answers
    callDoc.on("value", async (snapshot) => {
      const data = snapshot.val()
      console.log(data)
      if (!pc.currentRemoteDescription && data.answer) {
        const answerDescription = new RTCSessionDescription(data.answer)
        await pc.setRemoteDescription(answerDescription)
      }
    })

    const answerCandidates = callDoc.child("answerCandidates")

    // Add candidate to peer connection when answered
    answerCandidates.on("child_added", async (data) => {
      const candidate = new RTCIceCandidate(data.val())
      await pc.addIceCandidate(candidate)
    })

    // Finally update state if all is sucessful
    setStream(localStream)
    setSharing(true)
    // } catch (err) {
    //   console.error(err)
    // }
  }

  // Used to join a user who's already broadcasting
  const joinSharing = async () => {
    const pc = new RTCPeerConnection(stunServers)
    // try {
    const remoteStream = new MediaStream()

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track)
      })
    }

    const callDoc = database.ref("calls").child(roomID)
    const answerCandidates = callDoc.child("answerCandidates")

    pc.onicecandidate = (event) => {
      event.candidate && answerCandidates.push(event.candidate.toJSON())
    }

    const callData = (await callDoc.get()).val()

    if (!callData) {
      throw Error("RoomID not found!")
    }

    const offerDesc = callData.offer
    await pc.setRemoteDescription(new RTCSessionDescription(offerDesc))

    const answerDescription = await pc.createAnswer()
    await pc.setLocalDescription(answerDescription)

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    }

    await callDoc.update({ answer })

    const offerCandidates = callDoc.child("offerCandidates")

    offerCandidates.on("child_added", (data) => {
      const candidate = new RTCIceCandidate(data.val())
      pc.addIceCandidate(candidate)
    })

    console.log(pc.iceConnectionState)
    setStream(remoteStream)
    setSharing(true)
    // } catch (err) {
    //   console.error(err)
    // }
  }

  // This gets called with the broadcaster wants to stop sharing their screen
  // TODO: This should probably cleanup signaling information from the database
  const stopSharing = () => {
    stream.getTracks().forEach((track) => track.stop())
    videoContainer.current.srcObject = null
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
        <button onClick={stopSharing}>Stop sharing</button>
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
