// src/components/NoteContent.js

import React from "react";

const NoteContent = ({ notes, onSelectNote, activeNoteId }) => {
  if (!activeNoteId) {
    return <p>Select a note to view its content</p>;
  }

  return (
    <div>
      <h2>{notes[activeNoteId - 1].title}</h2>
      <p>{notes[activeNoteId - 1].content}</p>
    </div>
  );
};

export default NoteContent;
