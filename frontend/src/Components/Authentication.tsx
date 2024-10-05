import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner'; // Import the Spinner component


const Authentication = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('trainer');
  const [loading, setLoading] = useState(false); // Loading state for the spinner
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    qualification: '',
    city: '',
    subjects: '',
    schoolName: '',
    class: '',
    branch: ''
  });

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Reset the form when toggling between login and signup
    setFormData({
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      qualification: '',
      city: '',
      subjects: '',
      schoolName: '',
      class: '',
      branch: ''
    });
  };

  const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserType(e.target.value);
    // Reset fields that are not applicable for the selected user type
    if (e.target.value === 'trainee') {
      setFormData((prevData) => ({
        ...prevData,
        qualification: '',
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        schoolName: '',
        class: '',
        branch: '',
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when form is submitted

    const url = `http://localhost:3000/api/${userType}/${isLogin ? 'login' : 'signUp'}`;

    const subjectsArray = formData.subjects.split(',').map(subject => subject.trim());

    const requestData = {
      name: formData.name || '',
      email: formData.email,
      password: formData.password,
      phone: formData.phone || '',
      city: formData.city || '',
      ...(userType === 'trainer' && {
        qualification: formData.qualification || '',
        subjects: subjectsArray,
      }),
      ...(userType === 'trainee' && {
        schoolName: formData.schoolName || '',
        class: formData.class || '',
        branch: formData.branch || '',
        subjects: subjectsArray,
      })
    };

    try {
      const response = await axios.post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Assuming the token is returned in response.data.token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userType', userType);
        navigate('/features');
        console.log('Success:', response.data);
      } else {
        console.error('Error:', response.data);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false); // Set loading state back to false after submission completes
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg w-full max-w-3xl p-8">
        <h2 className="text-3xl font-semibold text-center mb-8">
          {isLogin ? 'Login' : 'Signup'}
        </h2>

        {loading ? (
          <Spinner /> // Show spinner when loading is true
        ) : (
          <>
            {isLogin && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="userType">
                  Login as
                </label>
                <select
                  id="userType"
                  value={userType}
                  onChange={handleUserTypeChange}
                  className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="trainer">Trainer</option>
                  <option value="trainee">Trainee</option>
                </select>
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!isLogin && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="name">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Your name"
                    />
                  </div>

                  {/* More form fields here... */}
                </>
              )}

              <div className="mb-4 col-span-2">
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Your email"
                  required
                />
              </div>

              <div className="mb-4 col-span-2">
                <label className="block text-sm font-medium mb-1" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Your password"
                  required
                />
              </div>

              <div className="mb-4 col-span-2">
                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded"
                >
                  {isLogin ? 'Login' : 'Signup'}
                </button>
              </div>

              <div className="mb-4 col-span-2 text-center">
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="text-gray-400 hover:text-white focus:outline-none"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Authentication;
