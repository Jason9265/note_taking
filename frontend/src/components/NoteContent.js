// src/components/NoteContent.js

import React, { useState, useEffect } from 'react';
// import ReactMarkdown from "react-markdown";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const NoteContent = ({ notes, setNotes, activeNoteId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    // Find the active note by ID
    const activeNote = notes.find(note => note.id === activeNoteId);
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [activeNoteId, notes]);

  const handleTitleChange = async (newTitle) => {
    setTitle(newTitle);

    const noteToUpdate = { ...notes.find(note => note.id === activeNoteId), title: newTitle };

    const response = await fetch(`http://localhost:8000/api/notes/${activeNoteId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteToUpdate)
    });

    if (response.ok) {
      setNotes(notes.map(note => {
        if (note.id === activeNoteId) {
          return { ...note, title: newTitle };
        }
        return note;
      }));
    } else {
      console.error('Failed to update the title');
    }
  };

  const handleContentChange = async (newContent) => {
    setContent(newContent);

    const noteToUpdate = { ...notes.find(note => note.id === activeNoteId), content: newContent };

    const response = await fetch(`http://localhost:8000/api/notes/${activeNoteId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteToUpdate)
    });

    if (response.ok) {
      setNotes(notes.map(note => {
        if (note.id === activeNoteId) {
          return { ...note, content: newContent };
        }
        return note;
      }));
    } else {
      console.error('Failed to update the content');
    }
  };

  if (!activeNoteId) {
    return <p>Select a note to view its content</p>;
  }
  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        className="form-control"
      />
      <SimpleMDE
        value={content}
        onChange={handleContentChange}
      />
      {/* <ReactMarkdown>{content}</ReactMarkdown> */}
    </div>
  );
};

export default NoteContent;
