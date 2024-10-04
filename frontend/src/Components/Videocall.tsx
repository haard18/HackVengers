import React, { useEffect, useRef, useState } from 'react';
import Peer, { MediaConnection } from 'peerjs';
import RecordRTC from 'recordrtc';
import { FaMicrophone, FaMicrophoneSlash, FaPhoneSlash, FaVideo, FaVideoSlash, FaClipboard } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import { useLocation } from 'react-router-dom';

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
  const email = useLocation().state.email;

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
          saveAudioLocally(audioBlob); // Save audio locally
          uploadToAssemblyAI(audioBlob); // Upload to AssemblyAI for transcription
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

  const uploadToAssemblyAI = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('file', audioBlob);

    // Upload audio file to AssemblyAI
    const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        authorization: '5966dd35db2649ac93f5720effd7df77', // Replace with your AssemblyAI API key
      },
      body: formData,
    });

    const { upload_url } = await uploadResponse.json();

    // Start transcription
    const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        authorization: '5966dd35db2649ac93f5720effd7df77', // Replace with your AssemblyAI API key
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ audio_url: upload_url }),
    });

    const { id } = await transcriptResponse.json();

    // Polling for transcription result
    const checkTranscript = async () => {
      const resultResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
        headers: {
          authorization: '5966dd35db2649ac93f5720effd7df77', // Replace with your AssemblyAI API key
        },
      });

      const result = await resultResponse.json();

      if (result.status === 'completed') {
        setTranscription(result.text); // Update transcription state
      } else if (result.status === 'failed') {
        console.error('Transcription failed:', result.error);
      } else {
        setTimeout(checkTranscript, 5000); // Check again after 5 seconds
      }
    };

    checkTranscript(); // Start checking the transcription result
  };

  const saveAudioLocally = (audioBlob: Blob) => {
    const fileName = `audio-${Date.now()}.webm`; // Create a unique file name
    saveAs(audioBlob, fileName); // Use FileSaver to save the file
  };

  const saveTranscriptionLocally = () => {
    const fileName = `transcription-${Date.now()}.txt`; // Create a unique file name for transcription
    const blob = new Blob([transcription], { type: 'text/plain' }); // Create a text blob
    saveAs(blob, fileName); // Use FileSaver to save the transcription
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
          onClick={saveTranscriptionLocally}
          disabled={!transcription}
          className={`ml-4 p-2 bg-orange-500 text-white rounded-lg shadow-md 
                      hover:bg-orange-600 focus:outline-none disabled:bg-gray-400`}
        >
          Download Transcription
        </button>
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
    </div>
  );
};

export default Videocall;
