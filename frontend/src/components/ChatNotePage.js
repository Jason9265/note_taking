import logo from '../img/logoreact.png';
import React, { useState, useEffect } from 'react';
import { Button, InputGroup, FormControl, Form } from 'react-bootstrap';
import './NotePage.css';


const ChatWithNote = () => {
  const [selectedTag, setSelectedTag] = useState('All');
  const [message, setMessage] = useState('');
  const [instructions, setInstructions] = useState('');
  const [tags, setTags] = useState([]);


  useEffect(() => {
    const fetchTags = async () => {
      const response = await fetch('http://localhost:8000/api/tags/');
      if (response.ok) {
        const data = await response.json();
        setTags(data); // Store all tags in state
      }
    };

    fetchTags();
  }, []);

  const handleGenerateKB = () => {
    // console.log(selectedTag);
  };

  const handleSelect = (event) => {
    const value = event.target.value;
    setSelectedTag(value);
  };

  const handleUpdateIntro = () => {

  }

  const handleSendMessage = () => {
    // Logic to handle sending message
  };

  const handleSaveChat = () => {
    // Logic to save chat as a note
  };

  return (
    <div>
      <header className="d-flex align-items-center">
        <a href="/note">
          <img src={logo} alt="Logo" height="80" />
        </a>
        <h1 className='ml-3 ms-2'>Chat with Your Notes</h1>
      </header>
      <div className='mt-4'>
        <div className='col-md-8'>
          <InputGroup>
            <Form.Select onChange={handleSelect} className='w-75'>
              <option key={"All"} value="All">All Tags</option>
              {tags.map((tag, index) => (
                <option key={index} value={tag.id}>{tag.name}</option>
                ))}
            </Form.Select>
            <Button variant="primary w-25" onClick={handleGenerateKB}>Generate knowledge base</Button>
          </InputGroup>
        </div>

        <div className='col-md-8 mt-4'>
          <InputGroup>
            <InputGroup.Text>Chat Instructions...</InputGroup.Text>
            <FormControl
              as="textarea"
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="Please provide instructions..."
            />
          </InputGroup>
          <div className="d-flex justify-content-end mt-2">
            <Button variant="primary" onClick={handleUpdateIntro}>Provide instructions</Button>
          </div>
        </div>

        <div id="chat-box" className='col-md-8 mt-4'>
          <InputGroup>
            <InputGroup.Text>Chat Box...</InputGroup.Text>
            <FormControl
              as="textarea"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder='Type your message...'
            />
          </InputGroup>
            <div className="d-flex justify-content-end mt-2">
              <Button variant="primary" onClick={handleSendMessage}>Send</Button>
              <Button variant="primary ms-2" onClick={handleSaveChat}>Save as Note</Button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default ChatWithNote;
