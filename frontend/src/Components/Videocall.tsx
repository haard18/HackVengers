import React, { useEffect, useRef, useState } from 'react';
import Peer, { MediaConnection } from 'peerjs';
import { FaMicrophone, FaMicrophoneSlash, FaPhoneSlash, FaExclamationTriangle, FaVideo, FaVideoSlash, FaClipboard } from 'react-icons/fa';

const Videocall: React.FC = () => {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [remoteId, setRemoteId] = useState<string>('');
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peer = useRef<Peer | null>(null);
  const [call, setCall] = useState<MediaConnection | null>(null);
  // const [call, setCall] = useState<MediaConnection | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);

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

  const copyToClipboard = () => {
    if (peerId) {
      navigator.clipboard.writeText(peerId)
        .then(() => alert('Peer ID copied to clipboard!'))
        .catch(err => console.error('Failed to copy: ', err));
    }
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
      </div>

      <div className="relative w-full flex justify-center items-center">
        {/* Remote video (big screen) */}
        <div className="w-full h-96 bg-gray-900 rounded-xl overflow-hidden shadow-md">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="object-cover w-full h-full rounded-xl"
          />
        </div>

        {/* Local video (positioned outside the main frame) */}
        <div className="absolute bottom-4 right-4 w-32 h-32 bg-gray-900 rounded-xl overflow-hidden shadow-md">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="object-cover w-full h-full rounded-xl"
          />
          {isVideoOff && (
            <div className="absolute inset-0 bg-gray-800 flex justify-center items-center text-white">
              Video Off
            </div>
          )}
        </div>

        {/* Control buttons */}
        <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-80 p-4 rounded-full flex space-x-4 items-center justify-center shadow-lg">
          {/* Mute/Unmute */}
          <button
            onClick={toggleMute}
            className="p-3 rounded-full bg-white hover:bg-gray-100 text-gray-700 focus:outline-none"
          >
            {isMuted ? (
              <FaMicrophoneSlash className="text-red-600 w-6 h-6" />
            ) : (
              <FaMicrophone className="text-green-600 w-6 h-6" />
            )}
          </button>

          {/* Stop/Resume Video */}
          <button
            onClick={toggleVideo}
            className="p-3 rounded-full bg-white hover:bg-gray-100 text-gray-700 focus:outline-none"
          >
            {isVideoOff ? (
              <FaVideoSlash className="text-red-600 w-6 h-6" />
            ) : (
              <FaVideo className="text-green-600 w-6 h-6" />
            )}
          </button>

          {/* End Call */}
          <button
            onClick={endCall}
            className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white focus:outline-none"
          >
            <FaPhoneSlash className="w-6 h-6" />
          </button>

          {/* Report Call */}
          <button
            onClick={reportCall}
            className="p-3 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white focus:outline-none"
          >
            <FaExclamationTriangle className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Videocall;
