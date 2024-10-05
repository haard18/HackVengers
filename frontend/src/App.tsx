import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Landingpage from './Pages/Landingpage';

import Featurespage from './Pages/Featurespage';
import Connectpage from './Pages/Connectpage';
import Authentication from './Components/Authentication';
import MySessions from './Pages/MySessions';
import Videocall from './Components/Videocall';
// Import other components for routing

function App() {
  return (
    <Router>
      <div className="navbar bg-gray-700">
      <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/features" element={<Featurespage  />} />
          <Route path="/connect" element={<Connectpage  />} />
        <Route path="/auth" element={<Authentication />} />
        <Route path='/sessions' element={<MySessions  />} />
        <Route path="/videocall" element={<Videocall />} />
        {/* <Route path="/videocall" element={<Videocall />} /> */}
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
