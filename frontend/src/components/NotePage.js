// src/components/NotePage.js

import React, { useState, useEffect } from 'react';
import NoteList from './NoteList';
import NoteContent from './NoteContent';
import logo from '../img/logoreact.png';
import './NotePage.css';

const NotePage = () => {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);

  // Fetch list of notes
  useEffect(() => {
    const fetchNotes = async () => {
      const response = await fetch('http://localhost:8000/api/notes/');
      const data = await response.json();
      setNotes(data);
    };

    fetchNotes();
  }, []);

  const handleSelectNote = (note) => {
    setActiveNoteId(note.id);
  }

  const handleChatButtonClick = () => {
    // Implement chat functionality
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
    <div>
      <header>
        {/* Your logo */}
        <img src={logo} alt="Logo" />

        {/* Buttons */}
        <button type="button" disabled className="btn btn-outline-primary btn-lg" onClick={handleChatButtonClick}>Chat with Note</button>
        <button type="button" disabled className="btn btn-outline-primary btn-lg" onClick={handleImportUrlButtonClick}>Import from URL</button>
        <button type="button" className="btn btn-outline-primary btn-lg" onClick={handleAddNote}>Create New Note</button>
        <button type="button" disabled className="btn btn-outline-primary btn-lg" onClick={handleImportMdButtonClick}>Import .md file</button>
        <button type="button" disabled className="btn btn-outline-primary btn-lg" onClick={handleExportMdButtonClick}>Export .md file</button>
      </header>

      <div className="content">
        {/* Left side: Note list */}
        <div className="note-list col-md-4">
          <NoteList 
            notes={notes}
            onSelectNote={handleSelectNote}
            activeNoteId={activeNoteId} />
        </div>

        {/* Right side: Content of the selected note */}
        <div className="note-content col-md-8">
          <NoteContent 
            notes={notes}
            // onSelectNote={handleSelectNote}
            setNotes={setNotes}
            activeNoteId={activeNoteId} />
        </div>
      </div>
    </div>
  );
};

export default NotePage;
