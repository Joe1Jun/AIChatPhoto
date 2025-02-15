import { useState, useEffect } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

interface Conversation {
  _id: string;
  title: string;
}

const ConversationManager = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const navigate = useNavigate();  // This must be called to use the navigate function


  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/conversations");
        setConversations(response.data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
    
    fetchConversations();
  }, []);


  const handleClick = (conversationId: string) => {
    navigate("/previousChat", {
      state: { conversationId }
    });
  };

  return (
    <div className="">
      
      <ul className="">
        {conversations.map(convo => (
         <li 
         key={convo._id} 
         className="cursor-pointer p-2 hover:bg-gray-700 rounded"
         onClick={() => handleClick(convo._id)} // Navigate on click
          >
         {convo.title}
         
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationManager;