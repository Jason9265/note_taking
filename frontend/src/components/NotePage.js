// src/components/NotePage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteList from './NoteList';
import NoteContent from './NoteContent';
import logo from '../img/logoreact.png';
import './NotePage.css';
import { Alert, Button, Col, Container, Row, Modal } from 'react-bootstrap';

const NotePage = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showUploadMD, setShowUploadMD] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showTagsManage, setShowTagsManage] = useState(false);


  const fetchNotes = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notes/`);
    const data = await response.json();
    setNotes(data);
  };

  // Fetch list of notes
  useEffect(() => {
    fetchNotes();

    const fetchTags = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tags/`);
      if (response.ok) {
        const data = await response.json();
        setTags(data); // Store all tags in state
      }
    };

    fetchTags();
  }, []);
 
  const handleSelectNote = (note) => {
    fetchNotes();
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
    setShowUploadMD(true);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // get title and content of .md uploaded file
  const handleUpload = () => {
    if (selectedFile) {
      if ( selectedFile.name.endsWith('.md') ) {
        const newNoteTitle = getFileName(selectedFile.name);
        const reader = new FileReader();
        reader.onload = (event) => {
          const fileContent = event.target.result;
          console.log("content: ", fileContent);

          handleAddNote(newNoteTitle, fileContent);
        }
        reader.readAsText(selectedFile);

        handleUploadMDClose();
      } else {
        alert('Please select a markdown file to upload.');
      }
    } else {
      alert('Please select a file to upload.');
    }
  };

  const getFileName = (filename) => {
    const extensionIndex = filename.lastIndexOf('.');
    const nameOnly = extensionIndex !== -1 ? filename.slice(0, extensionIndex) : filename;
    return nameOnly;
  }

  const handleUploadMDClose = () => {
    setShowUploadMD(false);
  }

  const downloadMDFile = (filename, content) => {
    var blob = new Blob([content], { type: 'text/markdown;charset=utf-8'});

    var downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = filename;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  const handleExportMdButtonClick = () => {
    // Implement export .md file functionality
    if (activeNoteId) {
      const activeNote = notes.find(note => note.id === activeNoteId);
      downloadMDFile(activeNote.title, activeNote.content);
      setShowAlert(false);
    } else {
      setShowAlert(true);
    }
  };

  const handleManageTagsClick = () => {
    // navigate to new page if tags too much
    setShowTagsManage(true);
  };

  const handleTagsManageClose = () => {
    setShowTagsManage(false);
  }

  const handleAddNote = async (newTitle = 'New Note', newContent = 'New Note Content') => {
    // Define the new note data
    const newNoteData = {
      title: newTitle,
      content: newContent,
    };
  
    // Make a POST request to the server to create a new note
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNoteData)
      });
    
      // If the note is created successfully, update the notes state
      if (response.ok) {
        // Parse the response to get the created note
        const createdNote = await response.json();
        setNotes([...notes, createdNote]);
        setActiveNoteId(createdNote.id); // Optionally set the new note as active
      } else {
        // Handle any errors, such as showing a message to the user
        console.error('Failed to create a new note:');
      }
    } catch (error) {
      console.error('Error creating new note:', error);
    }
  };

  return (
    <>
      <Container fluid>
        {showAlert && (
          <Alert variant='danger'>
            Please select a note first
          </Alert>
        )}
        <Row className="align-items-center my-3">
          <Col xs={12} className="mb-3">
            <header className="d-flex align-items-center">
              <a href="/note">
                <img src={logo} alt="Logo" height="80" />
              </a>

              <Button variant="outline-primary btn-lg ms-2" onClick={handleChatButtonClick}>Chat with Note</Button>
              <Button disabled variant="outline-primary btn-lg ms-2" onClick={handleImportUrlButtonClick}>Import from URL</Button>
              <Button variant="outline-primary btn-lg ms-2" onClick={() => handleAddNote()}>Create New Note</Button>
              <Button variant="outline-primary btn-lg ms-2" onClick={handleImportMdButtonClick}>Import .md file</Button>
              <Button variant="outline-primary btn-lg ms-2" onClick={handleExportMdButtonClick}>Export .md file</Button>
              <Button variant="outline-primary btn-lg ms-2" onClick={handleManageTagsClick}>Manage tags</Button>
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
              activeNoteId={activeNoteId}
              showTagsDropdown={showTagsDropdown}
              setShowTagsDropdown={setShowTagsDropdown}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              tags={tags} />
          </Col>
        </Row>
      </Container>

      <Modal show={showUploadMD} onHide={handleUploadMDClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="file" onChange={handleFileChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleUploadMDClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpload}>
            Upload File
          </Button>
        </Modal.Footer>
      </Modal>
    
      <Modal show={showTagsManage} onHide={handleTagsManageClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tags Manage</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleTagsManageClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleTagsManageClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NotePage;
