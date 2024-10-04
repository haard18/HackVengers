import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the CSS

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
        startTime: new Date(), // Default to current date
        endTime: new Date(),
        topic: '',
        trainerId: ''
    });

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

    return (
        <div className="bg-black text-green-500 h-full p-8">
            <h2 className=" text-2xl mb-6">Ideal Trainers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {idealTrainers.map((trainer) => (
                    <div key={trainer.id} className="bg-gray-100 p-6 rounded-lg shadow-lg">
                        <img
                            src={trainer.iconurl}
                            alt={`${trainer.name}'s icon`}
                            className="w-full h-48 object-cover mb-4 rounded-lg"
                        />
                        <h3 className="text-lg font-bold mb-2">{trainer.name}</h3>
                        <p className="text-gray-700 mb-2">Qualification: {trainer.qualification}</p>
                        <p className="text-gray-700 mb-2">City: {trainer.city}</p>
                        <p className="text-gray-700 mb-4">Subjects: {trainer.subjects.join(', ')}</p>
                        <button
                            className="bg-blue-500 text-white rounded-lg px-4 py-2"
                            onClick={() => handleSessionRequest(trainer.id)}
                        >
                            Request Session
                        </button>
                    </div>
                ))}
            </div>

            {/* Session Request Dialog Box */}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl mb-4">Request Session with Trainer</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2">Start Time</label>
                                <DatePicker
                                    selected={sessionDetails.startTime}
                                    onChange={(date: Date | null) => date && handleDateChange(date, 'startTime')}
                                    showTimeSelect
                                    dateFormat="Pp"
                                    className="border rounded-lg p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">End Time</label>
                                <DatePicker
                                    selected={sessionDetails.endTime}
                                    onChange={(date) => handleDateChange(date as Date, 'endTime')}
                                    showTimeSelect
                                    dateFormat="Pp"
                                    className="border rounded-lg p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Topic</label>
                                <textarea
                                    name="topic"
                                    value={sessionDetails.topic}
                                    onChange={handleInputChange}
                                    className="border rounded-lg p-2 w-full"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white rounded-lg px-4 py-2"
                            >
                                Submit Request
                            </button>
                            <button
                                type="button"
                                className="bg-gray-500 text-white rounded-lg px-4 py-2 ml-2"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Connectpage;
