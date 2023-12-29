import logo from '../img/logoreact.png';
import React, { useState, useEffect, useRef } from 'react';
import { Button, InputGroup, FormControl, Form, Container, Row, Col, ListGroup } from 'react-bootstrap';
import './NotePage.css';


const ChatWithNote = () => {
  const [selectedTag, setSelectedTag] = useState('All');
  const [content, setContent] = useState('');
  const [instructions, setInstructions] = useState('');
  const [tags, setTags] = useState([]);
  const [fileId, setFileId] = useState('');
  const [threadId, setThreadId] = useState('');
  const [assistantId, setAssistantId] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);


  useEffect(() => {
    const fetchTags = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tags/`);
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleGenerateKB = async () => {
    // Create md file remotely
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/create_md_remote/`, {
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
    } else {
      console.log('Success:', data);
      setFileId(data.file_id);
    }
  };

  const handleSelect = (event) => {
    const value = event.target.value;
    setSelectedTag(value);
  };

  const handleUpdateIntro = async () => {
    // Create Assistance and Thread
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/create_assistance_thread/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileId: fileId, instructions: instructions})
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}\nError from backend:', ${response.json().error}`);
    }
    const data = await response.json();
    if (data.error) {
      console.error('Error from backend:', data.error);
    } else {
      console.log('Success:', data);
      setThreadId(data.thread_id);
      setAssistantId(data.assistant_id);
    }
  }

  const handleSendMessage = async () => {
    const newMessage = { value: content, role: 'You' };
    setMessages([...messages, newMessage]);
    setContent('');

    // Run command and list messages
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/gpt_message/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        threadId: threadId, 
        assistantId: assistantId, 
        instructions: instructions, 
        content: content,
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}\nError from backend:', ${response.json().error}`);
    }
    const data = await response.json();
    if (data.error) {
      console.error('Error from backend:', data.error);
    } else {
      console.log('Success:', data);
      setMessages([...messages, newMessage, { value: data.result, role: 'gpt' }]);
    }
  };

  const handleSaveChat = () => {
    // Logic to save chat as a note
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
          <InputGroup className="mb-2">
            <Form.Select onChange={handleSelect} className='w-75'>
              <option value="All">All Tags</option>
              {tags.map(tag => (
                <option key={tag.id} value={tag.name}>{tag.name}</option>
              ))}
            </Form.Select>
            <Button variant="primary" className="w-25" onClick={handleGenerateKB}>Generate knowledge base</Button>
          </InputGroup>

          <InputGroup className="mb-2">
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

          <ListGroup className="mt-2" style={{ height: '250px', overflowY: 'auto' }}>
            {messages.map((msg, index) => (
              <ListGroup.Item key={index}>
                <b>{msg.role}:</b> {msg.value}
              </ListGroup.Item>
            ))}
            <div ref={messagesEndRef} />
          </ListGroup>

          <InputGroup className="mb-2 mt-2">
            <InputGroup.Text>Chat Box...</InputGroup.Text>
            <FormControl
              as="textarea"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder='Type your message...'
            />
          </InputGroup>
          <div className="d-flex justify-content-end mt-2">
            <Button variant="primary" onClick={handleSendMessage}>Send</Button>
            <Button disabled variant="primary ms-2" onClick={handleSaveChat}>Save as Note</Button>
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
