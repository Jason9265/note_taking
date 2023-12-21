import logo from '../img/logoreact.png';
import React, { useState, useEffect } from 'react';
import { Dropdown, InputGroup, FormControl } from 'react-bootstrap';
import './NotePage.css';


const ChatWithNote = () => {
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
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
    // console.log(selectedItem);
  };

  const handleSelect = (eventKey) => {
    setSelectedItem(eventKey);
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
        <h1 className='ml-3'>Chat with Your Notes</h1>
      </header>
      <div>
        <Dropdown onSelect={handleSelect}>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Selecte Tag
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item eventKey="All">All</Dropdown.Item>
            <div className="dropdown-divider"></div>
            {tags.map((tag, index) => (
              <Dropdown.Item key={index} eventKey={tag.id}>
                {tag.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
          <button type="button" className="btn btn-primary ms-2" onClick={handleGenerateKB}>Generate knowledge base</button>
        </Dropdown>

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
            <button type="button" className="btn btn-primary" onClick={handleUpdateIntro}>Provide instructions</button>
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
              <button type="button" className="btn btn-primary" onClick={handleSendMessage}>Send</button>
              <button type="button" className="btn btn-primary ms-2" onClick={handleSaveChat}>Save as Note</button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default ChatWithNote;
