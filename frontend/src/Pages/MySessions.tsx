import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MySessions = () => {
    type Session = {
        id: string;
        topic: string;
        startTime: string;
        endTime: string;
        status: string;
        traineeId: string;
        trainer: { name: string; email: string; phone: string };
    };

    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const [sessions, setSessions] = useState<Session[]>([]);
    const [nextSession, setNextSession] = useState<Session | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const navigate = useNavigate();

    const fetchMySessions = async () => {
        const response = await axios.get(`http://localhost:3000/api/${userType}/getMySessions`, {
            headers: { 'auth-token': token }
        });
        console.log(response.data);
        setSessions(response.data);
    };

    const handleAcceptSession = async (sessionId: string) => {
        try {
            const response = await axios.post(`http://localhost:3000/api/trainer/acceptSession/${sessionId}`, {}, {
                headers: { 'auth-token': token }
            });
            console.log('Session accepted:', response.data);
            fetchMySessions();
        } catch (error) {
            console.error('Error accepting session:', error);
        }
    };

    const handleJoinCall = (sessionId: string) => {
        // Navigate to the VideoCall page with just the sessionId
        navigate(`/videocall`, { state: { sessionId } });
    };

    useEffect(() => {
        if (!token) {
            console.error('No auth token found');
            return;
        }
        fetchMySessions();
    }, [token]);

    useEffect(() => {
        const upcomingSession = sessions.find(session => session.status === 'Accepted' && new Date(session.endTime) > new Date());
        setNextSession(upcomingSession || null);
    }, [sessions]);

    useEffect(() => {
        if (nextSession) {
            const intervalId = setInterval(() => {
                const now = new Date().getTime();
                const sessionEndTime = new Date(nextSession.endTime).getTime();
                const distance = sessionEndTime - now;

                if (distance < 0) {
                    clearInterval(intervalId);
                    setTimeLeft(0);
                } else {
                    setTimeLeft(distance);
                }
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [nextSession]);

    const formatTimeLeft = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <div className="bg-white p-8 h-screen">
            <h2 className="text-black text-2xl mb-6">My Sessions</h2>

            {nextSession && (
                <div className="bg-blue-100 p-4 rounded-lg mb-6">
                    <h3 className="text-blue-600 font-bold">Next Accepted Session:</h3>
                    <p className="text-gray-700">Topic: {nextSession.topic}</p>
                    <p className="text-gray-700">Ends in: {formatTimeLeft(timeLeft)}</p>
                    <button
                        onClick={() => handleJoinCall(nextSession.id)} // Pass session ID
                        className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Join Call
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {sessions.map((session) => (
                    <div key={session.id} className="bg-gray-100 p-6 rounded-lg shadow-lg mb-4 transition-transform transform hover:scale-105">
                        <h3 className="text-lg font-bold mb-2">{session.topic}</h3>
                        <p className="text-gray-700 mb-2">Start Time: {new Date(session.startTime).toLocaleString()}</p>
                        <p className="text-gray-700 mb-2">End Time: {new Date(session.endTime).toLocaleString()}</p>
                        <p className={`text-gray-700 mb-2 ${session.status === 'Accepted' ? 'text-green-500' : session.status === 'Pending' ? 'text-yellow-500' : ''}`}>
                            Status: {session.status}
                        </p>
                        <p className="text-gray-700 mb-2">
                            {userType === 'trainer'
                                ? `Trainee: ${session.traineeId}`
                                : `Trainer: ${session.trainer.name}`}
                        </p>
                        {userType === 'trainer' && session.status === 'Pending' && (
                            <button
                                className="bg-green-500 text-white rounded-lg px-4 py-2 mt-4 transition-colors duration-200 hover:bg-green-600"
                                onClick={() => handleAcceptSession(session.id)}
                            >
                                Accept Session
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MySessions;
