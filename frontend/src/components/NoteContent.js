// src/components/NoteContent.js

import React, { useState, useEffect } from 'react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Container, Form, InputGroup, FormControl, Dropdown } from 'react-bootstrap';


const NoteContent = ({ notes, setNotes, activeNoteId, showTagsDropdown, setShowTagsDropdown, selectedTags, setSelectedTags, tags }) => {
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

  const toggleTagsDropdown = () => {
    setShowTagsDropdown(!showTagsDropdown);
  };

  // update changed title
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

  // update changed content
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

  // update changed tags
  const handleTagChange = async (tagId, isChecked) => {
    const newSelectedTags = isChecked
      ? [...selectedTags, tagId]
      : selectedTags.filter(id => id !== tagId);

      setSelectedTags(newSelectedTags);
      const noteToUpdate = {
      tags: newSelectedTags
    };

    const response = await fetch(`http://localhost:8000/api/notes/${activeNoteId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteToUpdate)
    });

    if (!response.ok) {
      console.error('Failed to update the tags');
      console.log(response);
    }

    return newSelectedTags;
  };
  
  if (!activeNoteId) {
    return <Container className='mt-4'><p>Select a note to view its content</p></Container>;
  }
  return (
    <Container className='mt-4'>
      <InputGroup className="mb-3">
        <FormControl
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Enter note title"
        />
        <Dropdown show={showTagsDropdown} onToggle={toggleTagsDropdown}>
          <Dropdown.Toggle variant="outline-secondary" id="dropdown-custom-components">
            Tags
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {tags.map(tag => (
              <Form.Check
                key={tag.id}
                type="checkbox"
                id={tag.id}
                label={tag.name}
                checked={selectedTags.includes(tag.id)}
                onChange={(e) => handleTagChange(tag.id, e.target.checked)}
                className="dropdown-item"
              />
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </InputGroup>
      
      <SimpleMDE
        value={content}
        onChange={handleContentChange}
      />
    </Container>
  );
};

export default NoteContent;
