import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Landingpage from './Pages/Landingpage';

import Featurespage from './Pages/Featurespage';
import Connectpage from './Pages/Connectpage';
import Authentication from './Components/Authentication';
// Import other components for routing

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/features" element={<Featurespage/>} />
      <Route path="/connect" element={<Connectpage/>} />        <Route path="/auth" element={<Authentication/>} />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
