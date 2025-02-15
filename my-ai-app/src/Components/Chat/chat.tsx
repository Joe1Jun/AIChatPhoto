
import { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import PhotoUploadButton from "../PhotoUploadButton.tsx/PhotoUploadButton";


// Interface sets up the requirements for the message type

interface Message {
  id: string;
  role: string;
  content: string;
  //This can be used to reassemble the conversation in order 
  createdAt: string; // ISO 8601 timestamp or Date object
}




const Chat = () => {
  //Initialises the useState of the messages as an empty array of the interface types
  const [messages, setMessages] = useState<Message[]>([]);
 
  const [input, setInput] = useState("");
  



  // Handle input change (no need for explicit event typing in TypeScript)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setInput(e.target.value);
  };

  // Handle message sending
  const handleSubmit = () => {
    if (input.trim() === "") return;
    console.log(input)
    

    // Add user message to the chat
    //uuid randomly generates a string each time this method is called
    //Allows for unique id for each message
    const userMessage = { id: uuidv4(), role: "user", content: input, createdAt: new Date().toISOString(), };
    
    setMessages([...messages, userMessage]);
    
    
    console.log(userMessage)
    
    handleResponse(userMessage)
    
    
    setInput(""); // Clear input field
  };

  const handleResponse = async (message: {id: string; role: string; content: string }) => {
    try {
      //const userId = message.id
      const response = await axios.post("http://localhost:5001/ask", {
       // messages: [{ id: userId , role : "user", content: message.content }],
       
        message : message.content
      });
  
      console.log("AI Response:", response.data.response);

      
      
      const aiMessage = {
        id: uuidv4(),
        role: "AI",
        content: response.data.response,
        createdAt: new Date().toISOString(),
      };
      
           
      // Check if AI message is constructed properly
      console.log("New AI Message:", aiMessage);

      // Correctly append aiMessage to the state using the previous state (prevMessages)
    setMessages(prevMessages => [...prevMessages, aiMessage]);
  
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  const handlePhotoUploadResponse = (message: { role: string; content: string }) => {
    // The content could be the URL to the image, so you need to handle it properly
    setMessages(prevMessages => [
      ...prevMessages,
      { ...message, id: uuidv4(), createdAt: new Date().toISOString() }
    ]);
  };
  
  
  
  
  
  
// md:ml-64 worked to solve the issue with the chat page
  return (
    
    <div className="flex flex-col h-screen md:ml-64">
  <div className="flex flex-col items-center justify-center h-screen mt-8">
    <h1 className="text-4xl font-bold text-white mb-4">ChatApp</h1>
    <hr className="w-3/4 border-t-2 border-gray-400" />
  </div>
     <div className="flex-1  pb-24 px-4 mt-6 ">
     {messages.map(m => (
  <div key={m.id} className={`flex mb-4 ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
    <div className={`max-w-xs rounded-lg p-4 mt-6 ${m.role === 'user' ? 'bg-blue-200 self-start ml-4' : 'bg-gray-200 self-end mr-4'}`}>
      <span className="font-bold">{m.role === 'user' ? 'User: ' : 'AI: '}</span>
      
      {/* If the content is a valid image URL, render an img tag */}
      {m.content.startsWith('http') || m.content.startsWith('blob:') ? (
        <img src={m.content} alt="Uploaded" className="max-w-full h-auto rounded-md" />
      ) : (
        <span className="whitespace-pre-wrap text-black">{m.content}</span>
      )}
    </div>
  </div>
))}

    </div>

    
   

      <div className="fixed bottom-0 left-0 right-0 md:left-64">
        <div className="w-full backdrop-blur-sm p-4 md:p-6 flex justify-center items-center">
          <input
            className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg shadow-md"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
          <button
            className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
            onClick={handleSubmit}
          >
            Send
          </button>
          <PhotoUploadButton onUpload={handlePhotoUploadResponse} />
        </div>
      </div>
    </div>
  );
};

export default Chat;


