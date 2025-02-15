
import './App.css'
import Navbar from './Components/Navbar/navbar'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import About from './Components/About/about';
import Chat from './Components/Chat/chat';


function App() {
 



  return (
    <Router>
    <Navbar />
      <Routes>
        <Route path="/" element={<h1 className="text-center text-4xl mt-10">Welcome to the Home Page</h1>} />
        <Route path="/about" element={<About />}  />
         <Route path="/chat"  element={<Chat />} />
      
        </Routes>
    </Router>
  );
}

export default App
