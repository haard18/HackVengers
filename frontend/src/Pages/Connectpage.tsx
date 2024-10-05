import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LoadingScreen from '../Components/Loading Screen'; // Ensure correct import path
import Navbar from '../Components/Navbar';

const Connectpage = () => {
    type IdealTrainer = {
        id: string;
        name: string;
        email: string;
        qualification: string;
        city: string;
        subjects: string[];
        iconurl: string;
    };

    const [idealTrainers, setIdealTrainers] = useState<IdealTrainer[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [sessionDetails, setSessionDetails] = useState({
        startTime: new Date(),
        endTime: new Date(),
        topic: '',
        trainerId: ''
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const auth = localStorage.getItem('token');
        if (!auth) {
            console.error('No auth token found');
            return;
        }
        const fetchIdealTrainers = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/trainee/getIdealTrainers', {
                    headers: {
                        'auth-token': auth,
                    },
                });
                const data = await response.json();
                setIdealTrainers(data);
            } catch (error) {
                console.error('Error fetching ideal trainers:', error);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 4000);
            }
        };

        fetchIdealTrainers();
    }, []);

    const handleSessionRequest = (trainerId: string) => {
        setSessionDetails({ ...sessionDetails, trainerId });
        setIsDialogOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSessionDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date: Date, field: string) => {
        setSessionDetails((prev) => ({ ...prev, [field]: date }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const auth = localStorage.getItem('token');
        if (!auth) {
            console.error('No auth token found');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/trainee/createSession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': auth,
                },
                body: JSON.stringify({
                    ...sessionDetails,
                    startTime: sessionDetails.startTime.toISOString(),
                    endTime: sessionDetails.endTime.toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create session');
            }

            const data = await response.json();
            console.log('Session created:', data);
            setIsDialogOpen(false);
            setSessionDetails({ startTime: new Date(), endTime: new Date(), topic: '', trainerId: '' });
        } catch (error) {
            console.error('Error creating session:', error);
        }
    };

    if (isLoading) {
        return (
            <LoadingScreen 
                sentence1="Loading your ideal trainers..."
                sentence2="Please wait while we fetch the information."
                sentence3="Connecting you with the best trainers."
                sentence4="Almost there..."
            />
        ); // Show loading screen while loading
    }

    return (
        <>
        <Navbar/>
        <div className="bg-gray-900 text-green-500 min-h-screen p-8 overflow-auto">
            <h2 className="text-4xl font-extrabold mb-6 text-center">Find Your Ideal Trainers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {idealTrainers.map((trainer) => (
                    <div key={trainer.id} className="bg-gray-800 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-gray-700 hover:shadow-2xl">
                        <img
                            src={trainer.iconurl}
                            alt={`${trainer.name}'s icon`}
                            className="w-24 h-24 object-cover mb-4 rounded-full mx-auto shadow-md"
                        />
                        <h3 className="text-2xl font-semibold mb-2 text-center">{trainer.name}</h3>
                        <p className="text-gray-400 mb-2 text-center">Qualification: {trainer.qualification}</p>
                        <p className="text-gray-400 mb-2 text-center">City: {trainer.city}</p>
                        <p className="text-gray-400 mb-4 text-center">Subjects: {trainer.subjects.join(', ')}</p>
                        <div className="flex justify-center">
                            <button
                                className="bg-green-600 hover:bg-green-500 text-white rounded-lg px-6 py-2 transition duration-300"
                                onClick={() => handleSessionRequest(trainer.id)}
                            >
                                Request Session
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Session Request Dialog Box */}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-2xl font-semibold mb-4 text-center text-white">Request Session with Trainer</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2 text-gray-300">Start Time</label>
                                <DatePicker
                                    selected={sessionDetails.startTime}
                                    onChange={(date: Date | null) => date && handleDateChange(date, 'startTime')}
                                    showTimeSelect
                                    dateFormat="Pp"
                                    className="border border-gray-600 rounded-lg p-2 w-full bg-gray-700 text-white focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-gray-300">End Time</label>
                                <DatePicker
                                    selected={sessionDetails.endTime}
                                    onChange={(date) => handleDateChange(date as Date, 'endTime')}
                                    showTimeSelect
                                    dateFormat="Pp"
                                    className="border border-gray-600 rounded-lg p-2 w-full bg-gray-700 text-white focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-gray-300">Topic</label>
                                <textarea
                                    name="topic"
                                    value={sessionDetails.topic}
                                    onChange={handleInputChange}
                                    className="border border-gray-600 rounded-lg p-2 w-full bg-gray-700 text-white focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-500 text-white rounded-lg px-4 py-2 transition duration-300 w-full"
                            >
                                Submit Request
                            </button>
                            <button
                                type="button"
                                className="bg-red-600 hover:bg-red-500 text-white rounded-lg px-4 py-2 transition duration-300 w-full mt-2"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default Connectpage;
