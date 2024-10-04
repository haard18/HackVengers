import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { FaMicrophone, FaMicrophoneSlash, FaPhoneSlash, FaExclamationTriangle, FaVideo, FaVideoSlash } from 'react-icons/fa';

const Videocall: React.FC = () => {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [remoteId, setRemoteId] = useState<string>('');
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peer = useRef<Peer | null>(null);
  const [call, setCall] = useState<Peer.MediaConnection | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);

  useEffect(() => {
    // Initialize PeerJS
    peer.current = new Peer(); // No key is needed for peerjs unless using a specific server

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
        });
    });

    return () => {
      if (peer.current) {
        peer.current.destroy();
      }
    };
  }, []);

  const startCall = () => {
    if (remoteId && peer.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((localStream) => {
          localVideoRef.current!.srcObject = localStream;

          const outgoingCall = peer.current!.call(remoteId, localStream);
          setCall(outgoingCall);

          outgoingCall.on('stream', (remoteStream) => {
            remoteVideoRef.current!.srcObject = remoteStream;
          });
        });
    }
  };

  const toggleMute = () => {
    const localStream = localVideoRef.current!.srcObject as MediaStream;
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    const localStream = localVideoRef.current!.srcObject as MediaStream;
    localStream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsVideoOff(!isVideoOff);
  };

  const endCall = () => {
    if (call) {
      call.close();
      setCall(null);
    }
  };

  const reportCall = () => {
    alert('Reporting the call to the system admin.');
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Video Call</h2>
      <div className="mb-4">
        <p className="text-lg">Your Peer ID: <strong>{peerId}</strong></p>
        <input
          type="text"
          placeholder="Enter remote peer ID"
          value={remoteId}
          onChange={(e) => setRemoteId(e.target.value)}
          className="mt-2 p-2 border border-gray-300 rounded"
        />
        <button
          onClick={startCall}
          disabled={!remoteId}
          className={`mt-2 p-2 bg-blue-500 text-white rounded 
                      hover:bg-blue-600 disabled:bg-gray-400`}
        >
          Start Call
        </button>
      </div>

      <div className="flex space-x-4">
        {/* Local video */}
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-64 h-auto border border-gray-300 rounded"
        />
        {/* Remote video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-64 h-auto border border-gray-300 rounded"
        />
      </div>

      {/* Control buttons */}
      <div className="flex space-x-4 mt-4">
        {/* Mute/Unmute */}
        <button
          onClick={toggleMute}
          className={`p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none`}
        >
          {isMuted ? (
            <FaMicrophoneSlash className="text-red-500 w-6 h-6" />
          ) : (
            <FaMicrophone className="text-green-500 w-6 h-6" />
          )}
        </button>

        {/* Stop/Resume Video */}
        <button
          onClick={toggleVideo}
          className={`p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none`}
        >
          {isVideoOff ? (
            <FaVideoSlash className="text-red-500 w-6 h-6" />
          ) : (
            <FaVideo className="text-green-500 w-6 h-6" />
          )}
        </button>

        {/* End Call */}
        <button
          onClick={endCall}
          className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 focus:outline-none"
        >
          <FaPhoneSlash className="w-6 h-6" />
        </button>

        {/* Report Call */}
        <button
          onClick={reportCall}
          className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-none"
        >
          <FaExclamationTriangle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Videocall;
