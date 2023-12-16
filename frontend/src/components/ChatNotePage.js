import React, { useState } from 'react';
import './NotePage.css';

const ChatWithNote = () => {
  const [message, setMessage] = useState('');
  const [instructions, setInstructions] = useState('');
  
  const handleSendMessage = () => {
    // Logic to handle sending message
  };

  const handleSaveChat = () => {
    // Logic to save chat as a note
  };

  return (
    <div>
      <header>
        <h1>Chat with Your Notes</h1>
      </header>
      <div>
        {/* Dropdown for selecting tags */}
        <select>
          <option>All Tags</option>
          {/* Options for tags */}
        </select>
        <button>Generate knowledge base</button>
      </div>
      <div>
        {/* The chatbox area */}
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <textarea
          value={instructions}
          onChange={e => setInstructions(e.target.value)}
          placeholder="Enter instructions..."
        />
      </div>
      <div>
        <button onClick={handleSendMessage}>Send</button>
        <button onClick={handleSaveChat}>Save Chat as Note</button>
      </div>
    </div>
  );
};

export default ChatWithNote;
