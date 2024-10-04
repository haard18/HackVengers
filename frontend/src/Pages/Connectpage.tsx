import React, { useEffect, useState } from 'react';

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
    const auth = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtMXVjc3BsYTAwMDFud3Zva2o4am5qY2giLCJpYXQiOjE3MjgwMzEwNjJ9.QY0QQ2i7qGSQlm-9vY9TpMj5A2oxQnu74AGhP2J_rNQ";
    useEffect(() => {
        const fetchIdealTrainers = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/trainee/getIdealTrainers', {
                    headers: {
                        'auth-token':auth, // Add actual auth token here
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

    return (
        <div className="bg-white h-screen p-8">
            <h2 className="text-black text-2xl mb-6">Ideal Trainers</h2>
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
                            onClick={() => console.log(`Request session with ${trainer.name}`)}
                        >
                            Request Session
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Connectpage;
