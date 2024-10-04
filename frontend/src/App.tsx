import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Landingpage from './Pages/Landingpage';
import Videocall from './Components/Videocall';
import Featurespage from './Pages/Featurespage';
// Import other components for routing

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/features" element={<Featurespage/>} />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
