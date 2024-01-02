// src/components/NoteContent.js

import React, { useState, useEffect } from 'react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Container, Form, InputGroup, FormControl, Dropdown, Button, Modal } from 'react-bootstrap';


const NoteContent = ({ notes, activeNoteId, showTagsDropdown, setShowTagsDropdown, selectedTags, setSelectedTags, tags }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


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

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notes/${activeNoteId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteToUpdate)
    });

    if (response.ok) {
      return 'Title updated.';
    } else {
      console.error('Failed to update the title');
    }
  };

  // update changed content
  const handleContentChange = async (newContent) => {
    setContent(newContent);

    const noteToUpdate = { ...notes.find(note => note.id === activeNoteId), content: newContent };

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notes/${activeNoteId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteToUpdate)
    });

    if (response.ok) {
      return 'Content updated.';
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

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notes/${activeNoteId}/`, {
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

  const handleDeleteNote = () => {
    setShowDeleteConfirm(true);
  }

  const confirmDelete = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notes/${activeNoteId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
  
    if (response.ok) {
      console.log('Note deleted');
      window.location.reload();
    } else {
      console.error('Failed to delete the note');
    }
  
    setShowDeleteConfirm(false);
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
        <Button variant="outline-danger ms-1" onClick={handleDeleteNote}>Delete</Button>
      </InputGroup>
      
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to permanently delete this note?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <SimpleMDE
        value={content}
        onChange={handleContentChange}
      />
    </Container>
  );
};

export default NoteContent;
