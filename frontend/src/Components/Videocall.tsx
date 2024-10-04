import React, { useEffect, useRef, useState } from 'react';
import Peer, { MediaConnection } from 'peerjs';

const Videocall: React.FC = () => {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [remoteId, setRemoteId] = useState<string>('');
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peer = useRef<Peer | null>(null);
  const [call, setCall] = useState<MediaConnection | null>(null);

  useEffect(() => {
    // Initialize PeerJS
    peer.current = new Peer({ key: 'peerjs' }); // or your PeerJS server

    peer.current.on('open', (id) => {
      setPeerId(id);
    });

    peer.current.on('call', (incomingCall) => {
      // Answer the call
      incomingCall.answer(localVideoRef.current!.srcObject as MediaStream);
      setCall(incomingCall);

      incomingCall.on('stream', (remoteStream) => {
        remoteVideoRef.current!.srcObject = remoteStream;
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
          const outgoingCall = peer.current.call(remoteId, localStream);
          setCall(outgoingCall);

          outgoingCall.on('stream', (remoteStream) => {
            remoteVideoRef.current!.srcObject = remoteStream;
          });
        });
    }
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
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-64 h-auto border border-gray-300 rounded"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-64 h-auto border border-gray-300 rounded"
        />
      </div>
    </div>
  );
};

export default Videocall;
