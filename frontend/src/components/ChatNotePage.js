import logo from '../img/logoreact.png';
import React, { useState, useEffect } from 'react';
import { Button, InputGroup, FormControl, Form, Container, Row, Col } from 'react-bootstrap';
import './NotePage.css';


const Message = ({ message }) => {
  return (
    <div className={`message ${message.role}`}>
      <p>{message.role === 'user' ? 'You: ' : 'Assistant: '}{message.value}</p>
    </div>
  );
};

const ChatWithNote = () => {
  const [selectedTag, setSelectedTag] = useState('All');
  const [content, setContent] = useState('');
  const [instructions, setInstructions] = useState('');
  const [tags, setTags] = useState([]);
  const [fileId, setFileId] = useState('');
  const [threadId, setThreadId] = useState('');
  const [assistantId, setAssistantId] = useState('');
  const [messages, setMesages] = useState([]);


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
    const response = await fetch('http://localhost:8000/api/create_assistance_thread/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileId: fileId, instructions: instructions})
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
    // Run command and list messages
    const response = await fetch('http://localhost:8000/api/gpt_message/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ threadId: threadId, assistantId: assistantId, instructions: instructions, content: content })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.error) {
      console.error('Error from backend:', data.error);
    } else {
      console.log('Success:', data);
      await setMesages(data.messages)
    }

  };

  const handleSaveChat = () => {
    // Logic to save chat as a note
    console.log(messages);
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

          <div className="message-dialog">
            {messages.map((value, index) => (
              <Message key={index} message={value} />
            ))}
          </div>

          <InputGroup className="mb-3 mt-3">
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
