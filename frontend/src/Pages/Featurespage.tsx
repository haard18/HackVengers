import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cards } from '../Components/Card';
import { BackgroundBeams } from '../Components/ui/background-beams';

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
        const fetchTrainers = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/trainer/getAllTrainers');
                const data = await response.json();
                setTrainers(data);
            } catch (error) {
                console.error('Error fetching trainers:', error);
            }
        };

        fetchTrainers();
    }, []);

    return (
        <div className="bg-gradient-to-r from-gray-800 to-black min-h-screen p-8">
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

            <div className="bg-transparent rounded-lg shadow-lg p-6 mx-4">
                <h2 className="text-green-500 text-3xl font-semibold mb-4">Available Tutors</h2>
                <table className="min-w-full bg-black rounded-lg overflow-hidden shadow-md text-green-500">
                    <thead className="bg-gray-200">
                        <tr className="text-center ">
                            <th className="py-3 px-4 text-gray-700 font-semibold"></th>
                            <th className="py-3 px-4 text-gray-700 font-semibold">Name</th>
                            {/* <th className="py-3 px-4 text-gray-700 font-semibold">Email</th> */}
                            <th className="py-3 px-4 text-gray-700 font-semibold">Qualification</th>
                            {/* <th className="py-3 px-4 text-gray-700 font-semibold">City</th> */}
                            <th className="py-3 px-4 text-gray-700 font-semibold">Subjects</th>
                            {/* <th className="py-3 px-4 text-gray-700 font-semibold">Action</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {trainers.map((trainer) => (
                            <tr key={trainer.email} className="text-center hover:bg-gray-400 hover:text-black transition-colors duration-200">
                                <td className='py-3 px-4 border-b border-gray-300'>
                                    <div className='flex justify-center'>
                                        <img src={trainer.iconurl} alt="" className="w-12 h-12 rounded-full" />
                                    </div>
                                </td>
                                <td className="py-3 px-4 border-b border-gray-300">{trainer.name}</td>
                                {/* <td className="py-3 px-4 border-b border-gray-300">{trainer.email}</td> */}
                                <td className="py-3 px-4 border-b border-gray-300">{trainer.qualification}</td>
                                {/* <td className="py-3 px-4 border-b border-gray-300">{trainer.city}</td> */}
                                <td className="py-3 px-4 border-b border-gray-300">{trainer.subjects.join(', ')}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>

                <button
                    onClick={() => navigate('/connect')}
                    className="mt-6 w-[1/6] border-4 text-white  border-green-500  rounded-lg px-4 py-2 transition-transform transform hover:scale-105"
                >
                    Find Ideal Trainer
                </button>
            </div>

            <BackgroundBeams />
        </div>
    );
};

export default Featurespage;
