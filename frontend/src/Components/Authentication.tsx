import React, { useState } from 'react';

const Authentication = () => {
    console.log("Authentication");
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup
  const [userType, setUserType] = useState('trainer'); // State to select between trainer and trainee
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
  const [loading, setLoading] = useState(false); // To handle request state

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserType(e.target.value);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const url = `http://localhost:3000/api/${userType}/${isLogin ? 'login' : 'signup'}`;
    
    const requestData = {
      name: formData.name || '',
      email: formData.email,
      password: formData.password,
      phone: formData.phone || '',
      ...(userType === 'trainer' && {
        city: formData.city || '',
        qualification: formData.qualification || '',
        subjects: formData.subjects || [], // Should be an array for trainers
      }),
      ...(userType === 'trainee' && {
        schoolName: formData.schoolName || '',
        class: formData.class || '',
        branch: formData.branch || '',
        subjects: formData.subjects || [], // Should be an array for trainees as well
      })
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      const result = await response.json();
      if (response.ok) {
        console.log('Success:', result);
      } else {
        console.error('Error:', result);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg w-full max-w-md p-8">
        <h2 className="text-3xl font-semibold text-center mb-8">
          {isLogin ? 'Login' : 'Signup'}
        </h2>

        {!isLogin && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="userType">
              I am a
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

        <form onSubmit={handleSubmit}>
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
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="phone">
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Your phone number"
                />
              </div>

              {userType === 'trainer' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="qualification">
                      Qualification
                    </label>
                    <input
                      type="text"
                      id="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Your qualification"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="city">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Your city"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="subjects">
                      Subjects
                    </label>
                    <input
                      type="text"
                      id="subjects"
                      value={formData.subjects}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter subjects (comma-separated)"
                    />
                  </div>
                </>
              )}

              {userType === 'trainee' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="schoolName">
                      School Name
                    </label>
                    <input
                      type="text"
                      id="schoolName"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Your school name"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="class">
                      Class
                    </label>
                    <input
                      type="text"
                      id="class"
                      value={formData.class}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Your class"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="branch">
                      Branch
                    </label>
                    <input
                      type="text"
                      id="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Your branch"
                    />
                  </div>
                </>
              )}
            </>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your password"
            />
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="confirm-password">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Confirm your password"
              />
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-2 rounded bg-green-500 hover:bg-green-600 text-white font-semibold transition duration-300 ${loading ? 'opacity-50' : ''}`}
            disabled={loading}
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Signup'}
          </button>
        </form>

        <p className="text-center mt-4">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={toggleAuthMode}
            className="text-green-400 hover:text-green-500 font-medium ml-2"
          >
            {isLogin ? 'Signup' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Authentication;
