// src/components/NotePage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteList from './NoteList';
import NoteContent from './NoteContent';
import logo from '../img/logoreact.png';
import './NotePage.css';
import { Button, Container, Row, Col } from 'react-bootstrap';

const NotePage = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);

  // Fetch list of notes
  useEffect(() => {
    const fetchNotes = async () => {
      const response = await fetch('http://localhost:8000/api/notes/');
      const data = await response.json();
      setNotes(data);
    };

    fetchNotes();

    const fetchTags = async () => {
      const response = await fetch('http://localhost:8000/api/tags/');
      if (response.ok) {
        const data = await response.json();
        setTags(data); // Store all tags in state
      }
    };

    fetchTags();
  }, []);

  const handleSelectNote = (note) => {
    setActiveNoteId(note.id);
    setShowTagsDropdown(false);
    setSelectedTags(note.tags);
  }

  const handleChatButtonClick = () => {
    navigate('/chatnote');
  };

  const handleImportUrlButtonClick = () => {
    // Implement import from URL functionality
  };

  const handleImportMdButtonClick = () => {
    // Implement import .md file functionality
  };

  const handleExportMdButtonClick = () => {
    // Implement export .md file functionality
  };

  const handleManageTagsClick = () => {
    // Implement export .md file functionality
  };

  const handleAddNote = async () => {
    // Define the new note data
    const newNoteData = {
      title: 'New Note',
      content: 'New Note Content',
    };
  
    // Make a POST request to the server to create a new note
    const response = await fetch('http://localhost:8000/api/notes/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newNoteData)
    });
  
    // Parse the response to get the created note
    const createdNote = await response.json();
  
    // If the note is created successfully, update the notes state
    if (response.ok) {
      setNotes([...notes, createdNote]);
      setActiveNoteId(createdNote.id); // Optionally set the new note as active
    } else {
      // Handle any errors, such as showing a message to the user
      console.error('Failed to create a new note:', createdNote);
    }
  };

  return (
    <Container fluid>
      <Row className="align-items-center my-3">
        <Col xs={12} className="mb-3">
          <header className="d-flex align-items-center">
            <a href="/note">
              <img src={logo} alt="Logo" height="80" />
            </a>

            <Button variant="outline-primary btn-lg ms-2" onClick={handleChatButtonClick}>Chat with Note</Button>
            <Button disabled variant="outline-primary btn-lg ms-2" onClick={handleImportUrlButtonClick}>Import from URL</Button>
            <Button variant="outline-primary btn-lg ms-2" onClick={handleAddNote}>Create New Note</Button>
            <Button disabled variant="outline-primary btn-lg ms-2" onClick={handleImportMdButtonClick}>Import .md file</Button>
            <Button disabled variant="outline-primary btn-lg ms-2" onClick={handleExportMdButtonClick}>Export .md file</Button>
            <Button disabled variant="outline-primary btn-lg ms-2" onClick={handleManageTagsClick}>Manage tags</Button>
          </header>
        </Col>
      </Row>

      <Row>
        {/* Left side: Note list */}
        <Col md={4}>
          <NoteList 
            notes={notes}
            onSelectNote={handleSelectNote}
            activeNoteId={activeNoteId} />
        </Col>

        {/* Right side: Content of the selected note */}
        <Col md={8}>
          <NoteContent 
            notes={notes}
            setNotes={setNotes}
            activeNoteId={activeNoteId}
            showTagsDropdown={showTagsDropdown}
            setShowTagsDropdown={setShowTagsDropdown}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            tags={tags} />
        </Col>
      </Row>
    </Container>
  );
};

export default NotePage;
