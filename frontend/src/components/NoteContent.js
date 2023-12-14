// src/components/NoteContent.js

import React, { useState, useEffect } from 'react';
// import ReactMarkdown from "react-markdown";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const NoteContent = ({ notes, setNotes, activeNoteId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);

  const toggleTagsDropdown = () => {
    setShowTagsDropdown(!showTagsDropdown);
  };

  const isTagSelected = (tagName) => {
    return selectedTags.includes(tagName);
  };

  const handleTagChange = (tag, isChecked) => {
    if (isChecked) {
      setSelectedTags([...selectedTags, tag]); // Add tag to selected tags
    } else {
      setSelectedTags(selectedTags.filter(t => t !== tag)); // Remove tag from selected tags
    }
    // Here you would also make an API call to update the tags in the backend if needed
  };

  useEffect(() => {
    // Find the active note by ID
    const activeNote = notes.find(note => note.id === activeNoteId);
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content);
      setSelectedTags(activeNote.tags.map(tag => tag.name));
    } else {
      setTitle("");
      setContent("");
      setSelectedTags([]);
    }
    // Fetch tags from the backend
    const fetchTags = async () => {
      const response = await fetch('http://localhost:8000/api/tags/'); // Adjust the URL to your API
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      }
    };

    fetchTags();
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

  const handleTagSelection = (e) => {
    const selectedOptions = Array.from(e.target.options)
                                  .filter(option => option.selected)
                                  .map(option => option.value);
    setSelectedTags(selectedOptions);
  };

  if (!activeNoteId) {
    return <p>Select a note to view its content</p>;
  }
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="form-control"
          style={{ width: '60%' }}  // Adjust the width as needed
        />

        <div style={{ position: 'relative', display: 'inline-block' }}>
          {/* Tags dropdown trigger button */}
          <button onClick={toggleTagsDropdown} className="btn btn-secondary">
            Tags
          </button>

          {/* Tags dropdown list */}
          {showTagsDropdown && (
            <div className="dropdown-menu" style={{ 
              display: 'block', 
              position: 'absolute', 
              left: 0, 
              top: '100%', // Position the dropdown right below the button
              zIndex: 1000 // Ensure the dropdown is on top of other elements
            }}>
              {tags.map(tag => (
                <div key={tag.id} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={tag.name}
                    id={`tag-${tag.id}`}
                    checked={isTagSelected(tag.name)}
                    onChange={(e) => handleTagChange(tag.name, e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor={`tag-${tag.id}`}>
                    {tag.name}
                  </label>
                </div>
              ))}
              {/* Add new tag button or input field goes here */}
            </div>
          )}
        </div>
      </div>
      <SimpleMDE
        value={content}
        onChange={handleContentChange}
      />
      {/* ... rest of your component ... */}
    </div>
  );
};

export default NoteContent;
