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
        trainee: { name: string; email: string; phone: string };
    };

    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const [sessions, setSessions] = useState<Session[]>([]);
    const [nextSession, setNextSession] = useState<Session | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [traineeEmail, setTraineeEmail] = useState<string>('');
    const navigate = useNavigate();

    const fetchMySessions = async () => {
        const response = await axios.get(`http://localhost:3000/api/${userType}/getMySessions`, {
            headers: { 'auth-token': token }
        });
        if (response.data.length > 0) {
            setTraineeEmail(response.data[0].trainee.email);
        }
        console.log('Fetched sessions:', response.data);
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

    const handleJoinCall = () => {
        navigate(`/videocall`, { state: { traineeEmail } });
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
        <div className="bg-gray-900 p-8 h-screen text-gray-100">
            <h2 className="text-white text-3xl mb-6 font-semibold">My Sessions</h2>

            {nextSession && (
                <div className="bg-gray-800 p-6 rounded-lg mb-6 shadow-lg">
                    <h3 className="text-blue-400 font-bold text-lg">Next Accepted Session:</h3>
                    <p className="text-gray-300">Topic: {nextSession.topic}</p>
                    <p className="text-gray-300">Ends in: {formatTimeLeft(timeLeft)}</p>
                    <button
                        onClick={handleJoinCall}
                        className="mt-4 p-2 bg-green-600 text-white rounded transition-colors duration-300 hover:bg-green-700"
                    >
                        Join Call
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sessions.map((session) => (
                    <div key={session.id} className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105">
                        <h3 className="text-lg font-bold text-blue-400 mb-2">{session.topic}</h3>
                        <p className="text-gray-300 mb-2">Start Time: {new Date(session.startTime).toLocaleString()}</p>
                        <p className="text-gray-300 mb-2">End Time: {new Date(session.endTime).toLocaleString()}</p>
                        <p className={`text-gray-300 mb-2 ${session.status === 'Accepted' ? 'text-green-500' : session.status === 'Pending' ? 'text-yellow-500' : ''}`}>
                            Status: {session.status}
                        </p>
                        <p className="text-gray-300 mb-2">
                            {userType === 'trainer'
                                ? `Trainee: ${session.trainee.name} (${session.trainee.email})`
                                : `Trainer: ${session.trainee.name}`}
                        </p>
                        {userType === 'trainer' && session.status === 'Pending' && (
                            <button
                                className="bg-green-600 text-white rounded-lg px-4 py-2 mt-4 transition-colors duration-300 hover:bg-green-700"
                                onClick={() => handleAcceptSession(session.id)}
                            >
                                Accept Session
                            </button>
                        )}
                        {session.status === 'Accepted' && (
                            <button
                                onClick={handleJoinCall}
                                className="mt-4 p-2 bg-blue-600 text-white rounded transition-colors duration-300 hover:bg-blue-700"
                            >
                                Join Call
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MySessions;
