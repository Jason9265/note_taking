// src/components/NoteList.js

import React from 'react';

const NoteList = ({ notes, onSelectNote, activeNoteId }) => {

    return (
        <ul className="list-group">
            {notes.map((note) => (
                <li 
                    key={note.id}
                    className={`list-group-item ${note.id === activeNoteId ? 'active' : ''}`}
                    onClick={() => onSelectNote(note)}
                >
                    {note.title}
                </li>
            ))}
        </ul>
    );
};

export default NoteList;
