import React, { useEffect, useRef, useState } from 'react';
import Peer, { MediaConnection } from 'peerjs';
import RecordRTC from 'recordrtc';
import { FaMicrophone, FaMicrophoneSlash, FaPhoneSlash, FaVideo, FaVideoSlash, FaClipboard } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const email = useLocation().state.traineeEmail;
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');
  const [captions, setCaptions] = useState<string>('');

  useEffect(() => {
    peer.current = new Peer();
    peer.current.on('open', (id) => setPeerId(id));

    peer.current.on('call', (incomingCall) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((localStream) => {
        localVideoRef.current!.srcObject = localStream;
        incomingCall.answer(localStream);
        setCall(incomingCall);

        incomingCall.on('stream', (remoteStream) => {
          remoteVideoRef.current!.srcObject = remoteStream;
        });

        const audioRecorder = new RecordRTC(localStream, { type: 'audio', mimeType: 'audio/webm' });
        audioRecorder.startRecording();
        setRecorder(audioRecorder);

        // Start Speech Recognition
        startSpeechRecognition();
      });
    });

    return () => {
      peer.current?.destroy();
      stopSpeechRecognition(); // Cleanup on unmount
    };
  }, []);

  const startSpeechRecognition = () => {
    const recognition = new (window as any).SpeechRecognition();
    recognition.continuous = true; // Keep recognizing until stopped
    recognition.interimResults = true; // Show interim results

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => (result.isFinal ? result[0].transcript : ''))
        .join(' ');

      setCaptions(transcript); // Update captions state
    };

    recognition.start(); // Start listening
  };

  const stopSpeechRecognition = () => {
    const recognition = new (window as any).SpeechRecognition();
    recognition.stop(); // Stop listening
  };

  const endCall = () => {
    call?.close();
    setCall(null);
    recorder?.stopRecording(() => {
      const audioBlob = recorder.getBlob();
      // Process or upload the recorded audio
    });
    setRecorder(null);
  };

  const startCall = () => {
    if (peer.current && remoteId) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((localStream) => {
        localVideoRef.current!.srcObject = localStream;
        const outgoingCall = peer.current!.call(remoteId, localStream);
        setCall(outgoingCall);

        outgoingCall.on('stream', (remoteStream) => {
          remoteVideoRef.current!.srcObject = remoteStream;
        });

        const audioRecorder = new RecordRTC(localStream, { type: 'audio', mimeType: 'audio/wav' });
        audioRecorder.startRecording();
        setRecorder(audioRecorder);
        
        // Start Speech Recognition
        startSpeechRecognition();
      });
    }
  };

  const toggleMute = () => {
    const stream = localVideoRef.current?.srcObject as MediaStream;
    stream?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    const stream = localVideoRef.current?.srcObject as MediaStream;
    stream?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsVideoOff(!isVideoOff);
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
      headers: { 'auth-token': token },
    });
    console.log('Email sent:', response.data);
  };

  return (
    <div className='bg-black min-h-screen flex items-center justify-center'>
      <div className="flex flex-col items-center bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-semibold text-white">Video Call</h2>

        <div className="w-full flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <p className="text-lg text-gray-300">Your Peer ID:</p>
            <span className="font-mono text-lg bg-gray-700 text-gray-200 px-4 py-2 rounded-lg">{peerId}</span>
            <button
              onClick={copyToClipboard}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none transition-transform transform hover:scale-105"
              title="Copy to clipboard"
            >
              <FaClipboard className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Enter remote peer ID"
              value={remoteId}
              onChange={(e) => setRemoteId(e.target.value)}
              className="p-3 bg-gray-700 border-none rounded-lg w-72 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={startCall}
              disabled={!remoteId}
              className={`p-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-transform transform hover:scale-105 focus:outline-none disabled:bg-gray-400`}
            >
              Start Call
            </button>
            {userType === 'trainer' && (
              <button
                onClick={sendEmail}
                className="p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105 focus:outline-none"
              >
                Send Email
              </button>
            )}
          </div>
        </div>

        <div className="relative w-full flex justify-center items-center mt-8">
          <div className="w-full h-96 bg-gray-700 rounded-xl overflow-hidden shadow-lg">
            <video ref={remoteVideoRef} autoPlay playsInline className="object-cover w-full h-full rounded-xl" />
          </div>

          <div className="absolute bottom-4 right-4 w-32 h-32 bg-gray-800 rounded-xl overflow-hidden shadow-lg">
            <video ref={localVideoRef} autoPlay playsInline muted className="object-cover w-full h-full rounded-xl" />
          </div>
        </div>

        {/* Captions Display */}
        <div className="text-center text-white mt-4 p-4 bg-gray-600 rounded-lg">
          <p>{captions}</p>
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={toggleMute}
            className="p-3 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-600 transition-transform transform hover:scale-105 focus:outline-none"
          >
            {isMuted ? <FaMicrophoneSlash className="w-6 h-6" /> : <FaMicrophone className="w-6 h-6" />}
          </button>
          <button
            onClick={toggleVideo}
            className="p-3 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-600 transition-transform transform hover:scale-105 focus:outline-none"
          >
            {isVideoOff ? <FaVideoSlash className="w-6 h-6" /> : <FaVideo className="w-6 h-6" />}
          </button>
          <button
            onClick={endCall}
            className="p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105 focus:outline-none"
          >
            <FaPhoneSlash className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Videocall;
