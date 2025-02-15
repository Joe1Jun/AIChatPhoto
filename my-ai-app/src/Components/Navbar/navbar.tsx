import { Link } from "react-router-dom";




const Navbar = () => {
    
   

    return (
        <nav className="fixed top-0 left-0 h-full bg-gray-500 p-4 text-white w-64 border-r border-gray-400">
      <div className="text-lg font-bold mb-6">My Chat App</div>
      <ul className="space-y-4">
        <li>
          <Link to="/" className="hover:underline">Home</Link>
        </li>
        <li>
          <Link to="/about" className="hover:underline">About</Link>
        </li>
        <li>
          <Link to="/chat" className="hover:underline">New Chat</Link>
        </li>
        <li>
        
        </li>
      </ul>
    </nav>
      );
    };


    







export default Navbar;