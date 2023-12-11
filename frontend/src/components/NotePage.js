// src/components/NotePage.js

import React, { useState } from 'react';
import NoteList from './NoteList';
import NoteContent from './NoteContent';
import logo from '../img/logoreact.png';

const NotePage = () => {
  const [selectedNote, setSelectedNote] = useState(null);

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
        <button onClick={handleChatButtonClick}>Chat with Note</button>
        <button onClick={handleImportUrlButtonClick}>Import from URL</button>
        <button onClick={handleImportMdButtonClick}>Import .md file</button>
        <button onClick={handleExportMdButtonClick}>Export .md file</button>
      </header>

      <div className="content">
        {/* Left side: Note list */}
        <div className="note-list">
          <NoteList onSelectNote={(note) => setSelectedNote(note)} />
        </div>

        {/* Right side: Content of the selected note */}
        <div className="note-content">
          <NoteContent note={selectedNote} />
        </div>
      </div>
    </div>
  );
};

export default NotePage;
