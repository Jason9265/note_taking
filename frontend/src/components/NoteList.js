// src/components/NoteList.js

import React from 'react';

const NoteList = ({ onSelectNote }) => {
    // Fetch or provide a list of notes
    const notes = [
        { id: 1, title: 'Note 1', content: 'This is the content of Note 1.' },
        { id: 2, title: 'Note 2', content: 'Content for Note 2 goes here.' },
        { id: 3, title: 'Note 3', content: 'Content of Note 3 is included.' },
    ];

    return (
        <ul>
            {notes.map((note) => (
                <li key={note.id} onClick={() => onSelectNote(note)}>
                    {note.title}
                </li>
            ))}
        </ul>
    );
};

export default NoteList;
