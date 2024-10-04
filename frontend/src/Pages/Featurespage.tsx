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
    <div className="bg-black h-screen">
      <div className="flex mx-8 justify-between">
        <Cards
          title="Connect"
          label="Get in Touch with firstHand Successful mentors"
          list={['Connect with students clearing the exams', 'Filter and find your comfort zone', 'Work around with best tips and advice']}
        />
        <Cards
          title="Connect"
          label="Get in Touch with firstHand Successful mentors"
          list={['Connect with students clearing the exams', 'Filter and find your comfort zone', 'Work around with best tips and advice']}
        />
        <Cards
          title="Connect"
          label="Get in Touch with firstHand Successful mentors"
          list={['Connect with students clearing the exams', 'Filter and find your comfort zone', 'Work around with best tips and advice']}
        />
      </div>

      <div className="mx-8 my-8">
        <h2 className="text-white text-2xl mb-4">Available Trainers</h2>
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Qualification</th>
              <th className="py-2 px-4">City</th>
              <th className="py-2 px-4">Subjects</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {trainers.map((trainer) => (
              <tr key={trainer.email} className="text-center">
                <td className="py-2 px-4">{trainer.name}</td>
                <td className="py-2 px-4">{trainer.email}</td>
                <td className="py-2 px-4">{trainer.qualification}</td>
                <td className="py-2 px-4">{trainer.city}</td>
                <td className="py-2 px-4">{trainer.subjects.join(', ')}</td>
                <td>
                  <button onClick={() => console.log("Clicked")} className="bg-black text-white rounded-lg px-4 py-2 mb-2">
                    Request session
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Button to navigate to Connect page for Ideal Trainers */}
        <button
          onClick={() => navigate('/connect')}
          className="bg-blue-500 text-white rounded-lg px-4 py-2 mt-4"
        >
          Find Ideal Trainer
        </button>
      </div>

      <BackgroundBeams />
    </div>
  );
};

export default Featurespage;
