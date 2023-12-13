// src/components/NotePage.js

import React, { useState } from 'react';
import NoteList from './NoteList';
import NoteContent from './NoteContent';
import logo from '../img/logoreact.png';
import './NotePage.css';

const NotePage = () => {
  const [activeNoteId, setActiveNoteId] = useState(null);

  // Fetch or provide a list of notes
  const notes = [
    { id: 1, title: 'Note 1', content: 'This is the content of Note 1.' },
    { id: 2, title: 'Note 2', content: 'Content for Note 2 goes here.' },
    { id: 3, title: 'Note 3', content: 'Content of Note 3 is included.' },
  ];

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

  return (
    <div>
      <header>
        {/* Your logo */}
        <img src={logo} alt="Logo" />

        {/* Buttons */}
        <button type="button" className="btn btn-outline-primary btn-lg" onClick={handleChatButtonClick}>Chat with Note</button>
        <button type="button" className="btn btn-outline-primary btn-lg" onClick={handleImportUrlButtonClick}>Import from URL</button>
        <button type="button" className="btn btn-outline-primary btn-lg" onClick={handleImportMdButtonClick}>Import .md file</button>
        <button type="button" className="btn btn-outline-primary btn-lg" onClick={handleExportMdButtonClick}>Export .md file</button>
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
            onSelectNote={handleSelectNote}
            activeNoteId={activeNoteId} />
        </div>
      </div>
    </div>
  );
};

export default NotePage;
