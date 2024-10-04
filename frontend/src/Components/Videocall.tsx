import React, { useEffect, useRef, useState } from 'react';
import Peer, { MediaConnection } from 'peerjs';
import RecordRTC from 'recordrtc';
import { FaMicrophone, FaMicrophoneSlash, FaPhoneSlash, FaVideo, FaVideoSlash, FaClipboard } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Videocall: React.FC = () => {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [remoteId, setRemoteId] = useState<string>('');
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peer = useRef<Peer | null>(null);
  const [call, setCall] = useState<MediaConnection | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [recorder, setRecorder] = useState<RecordRTC | null>(null);
  const [transcription, setTranscription] = useState<string>(''); // State to hold transcription
  const email = useLocation().state.traineeEmail;

  const userType = localStorage.getItem('userType'); // Get userType from local storage

  useEffect(() => {
    peer.current = new Peer();
    peer.current.on('open', (id) => {
      setPeerId(id);
    });

    peer.current.on('call', (incomingCall) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((localStream) => {
          localVideoRef.current!.srcObject = localStream;
          incomingCall.answer(localStream);
          setCall(incomingCall);

          incomingCall.on('stream', (remoteStream) => {
            remoteVideoRef.current!.srcObject = remoteStream;
          });

          const audioRecorder = new RecordRTC(localStream, {
            type: 'audio',
            mimeType: 'audio/webm',
          });
          audioRecorder.startRecording();
          setRecorder(audioRecorder);
        });
    });

    return () => {
      if (peer.current) {
        peer.current.destroy();
      }
    };
  }, []);

  const endCall = () => {
    if (call) {
      call.close();
      setCall(null);

      if (recorder) {
        recorder.stopRecording(() => {
          const audioBlob = recorder.getBlob();
          // Send the entire file to OpenAI
        });
        setRecorder(null);
      }
    }
  };

  const startCall = () => {
    if (peer.current && remoteId) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((localStream) => {
          localVideoRef.current!.srcObject = localStream;
          const outgoingCall = peer.current!.call(remoteId, localStream);
          setCall(outgoingCall);

          outgoingCall.on('stream', (remoteStream) => {
            remoteVideoRef.current!.srcObject = remoteStream;
          });

          const audioRecorder = new RecordRTC(localStream, {
            type: 'audio',
            mimeType: 'audio/wav',
          });
          audioRecorder.startRecording();
          setRecorder(audioRecorder);
        });
    }
  };

  const toggleMute = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const copyToClipboard = () => {
    if (peerId) {
      navigator.clipboard.writeText(peerId);
      alert('Peer ID copied to clipboard');
    }
  };

  const sendEmail = async () => {
    const token = localStorage.getItem('auth-token');
    const response = await axios.post('http://localhost:3000/api/trainer/sendMail', {
      email,
      subject: "Join the video call",
      text: peerId,
    }, {
      headers: {
        'auth-token': token,
      }
    });
    console.log('Email sent:', response.data);
  };

  return (
    <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Video Call</h2>
      <div className="w-full mb-4 text-center">
        <p className="text-lg">Your Peer ID: <strong>{peerId}</strong></p>
        <button
          onClick={copyToClipboard}
          className="ml-2 p-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none"
        >
          <FaClipboard className="inline w-4 h-4 mr-1" />
          Copy ID
        </button>
        <input
          type="text"
          placeholder="Enter remote peer ID"
          value={remoteId}
          onChange={(e) => setRemoteId(e.target.value)}
          className="mt-2 p-2 border border-gray-300 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={startCall}
          disabled={!remoteId}
          className={`ml-4 p-2 bg-blue-500 text-white rounded-lg shadow-md 
                      hover:bg-blue-600 focus:outline-none disabled:bg-gray-400`}
        >
          Start Call
        </button>
        <button
          disabled={!transcription}
          className={`ml-4 p-2 bg-orange-500 text-white rounded-lg shadow-md 
                      hover:bg-orange-600 focus:outline-none disabled:bg-gray-400`}
        >
          Download Transcription
        </button>
        {userType === 'trainer' && ( // Conditionally render the button for trainee
          <button
            onClick={sendEmail}
            className="ml-4 p-2 bg-blue-500 text-white rounded-lg shadow-md 
                        hover:bg-blue-600 focus:outline-none"
          >
            Send Email
          </button>
        )}
      </div>

      <div className="relative w-full flex justify-center items-center">
        <div className="w-full h-96 bg-gray-900 rounded-xl overflow-hidden shadow-md">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="object-cover w-full h-full rounded-xl"
          />
        </div>

        <div className="absolute bottom-4 right-4 w-32 h-32 bg-gray-900 rounded-xl overflow-hidden shadow-md">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="object-cover w-full h-full rounded-xl"
          />
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <button onClick={toggleMute} className="mx-2 p-2 bg-gray-300 rounded-full shadow-md hover:bg-gray-400 focus:outline-none">
          {isMuted ? <FaMicrophoneSlash className="w-6 h-6" /> : <FaMicrophone className="w-6 h-6" />}
        </button>
        <button onClick={toggleVideo} className="mx-2 p-2 bg-gray-300 rounded-full shadow-md hover:bg-gray-400 focus:outline-none">
          {isVideoOff ? <FaVideoSlash className="w-6 h-6" /> : <FaVideo className="w-6 h-6" />}
        </button>
        <button onClick={endCall} className="mx-2 p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 focus:outline-none">
          <FaPhoneSlash className="w-6 h-6" />
        </button>
      </div>

      {transcription && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Transcription:</h3>
          <p className="text-sm whitespace-pre-line">{transcription}</p>
        </div>
      )}
    </div>
  );
};

export default Videocall;
