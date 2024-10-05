import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cards } from '../Components/Card';

const Featurespage = () => {
    type Trainers = {
        name: string;
        email: string;
        qualification: string;
        city: string;
        iconurl: string;
        subjects: string[];
    };

    const [trainers, setTrainers] = useState<Trainers[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem('token');
        if (!auth) {
            console.error('No auth token found');
            return;
        }

        const fetchTrainers = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/trainer/getAllTrainers', {
                    headers: {
                        'auth-token': auth,
                    },
                });
                const data = await response.json();
                setTrainers(data);
            } catch (error) {
                console.error('Error fetching trainers:', error);
            }
        };

        fetchTrainers();
    }, []);

    return (
        <div className="bg-gray-800 min-h-screen p-8 relative">
            <>
                <h1 className="text-white text-4xl font-bold text-center mb-10">Explore Our Mentorship Program</h1>
                <div className="flex flex-wrap justify-around gap-6 mb-8">
                    <Cards
                        title="Connect"
                        label="Get in Touch with firstHand Successful mentors"
                        list={['Connect with students clearing the exams', 'Filter and find your comfort zone', 'Work around with best tips and advice']}
                    />
                    <Cards
                        title="Explore"
                        label="Discover personalized learning paths"
                        list={['Tailored resources for your learning style', 'Interactive sessions for deeper understanding', 'Connect with experienced educators']}
                    />
                    <Cards
                        title="Grow"
                        label="Enhance your skills with guided practice"
                        list={['Regular feedback from mentors', 'Access to a variety of learning materials', 'Join a community of learners']}
                    />
                </div>

                <div className="bg-gray-800 bg-opacity-90 rounded-lg shadow-lg p-6 mx-4">
                    <h2 className="text-green-500 text-3xl font-semibold mb-4">Available Tutors</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-700 rounded-lg shadow-md text-white">
                            <thead>
                                <tr className="text-center bg-gray-600 text-white uppercase text-sm tracking-wider">
                                    <th className="py-3 px-4 font-semibold"></th>
                                    <th className="py-3 px-4 font-semibold">Name</th>
                                    <th className="py-3 px-4 font-semibold">Qualification</th>
                                    <th className="py-3 px-4 font-semibold">Subjects</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-600">
                                {trainers.map((trainer) => (
                                    <tr key={trainer.email} className="text-center hover:bg-gray-500 transition-colors duration-200">
                                        <td className="py-3 px-4">
                                            <div className="flex justify-center">
                                                <img src={trainer.iconurl} alt={trainer.name} className="w-14 h-14 rounded-full border-2 border-green-500" />
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 font-medium text-green-400">{trainer.name}</td>
                                        <td className="py-3 px-4 text-gray-300">{trainer.qualification}</td>
                                        <td className="py-3 px-4 text-gray-300">{trainer.subjects.join(', ')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Centering the button */}
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => navigate('/connect')}
                        className="bg-green-500 text-white rounded-lg px-6 py-3 transition-transform transform hover:scale-105 shadow-lg hover:bg-green-600"
                    >
                        Find Ideal Trainer
                    </button>
                </div>
            </>
        </div>
    );
};

export default Featurespage;
