import logo from '../img/logoreact.png';
import React, { useState, useEffect } from 'react';
import { Button, InputGroup, FormControl, Form, Container, Row, Col } from 'react-bootstrap';
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

  const handleGenerateKB = async () => {
    // Create md file remotely
    const response = await fetch('http://localhost:8000/api/create_md_remote/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selectedTag: selectedTag})
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      console.error('Error from backend:', data.error);
      // Handle error
    } else {
      console.log('Success:', data);
      // Handle success - do something with data.response
    }
  };

  const handleSelect = (event) => {
    const value = event.target.value;
    setSelectedTag(value);
  };

  const handleUpdateIntro = () => {
    // Create Assistance and Thread

  }

  const handleSendMessage = () => {
    // Run command

    // List message
  };

  const handleSaveChat = () => {
    // Logic to save chat as a note
  };

  return (
    <Container fluid>
      <Row className="align-items-center my-3">
        <Col xs={12} md={6} className="d-flex align-items-center">
          <a href="/note">
            <img src={logo} alt="Logo" height="80" />
          </a>
          <h1 className='ms-2'>Chat with Your Notes</h1>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <InputGroup className="mb-3">
            <Form.Select onChange={handleSelect} className='w-75'>
              <option value="All">All Tags</option>
              {tags.map(tag => (
                <option key={tag.id} value={tag.name}>{tag.name}</option>
              ))}
            </Form.Select>
            <Button variant="primary" className="w-25" onClick={handleGenerateKB}>Generate knowledge base</Button>
          </InputGroup>

          <InputGroup className="mb-3">
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

          <InputGroup className="mb-3 mt-3">
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
        </Col>

        {/* Chat History unfinished */}
        <Col hidden md={4}>Chat History
        </Col>
      </Row>
    </Container>
  );
};

export default ChatWithNote;
