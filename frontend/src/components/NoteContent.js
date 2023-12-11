// src/components/NoteContent.js

import React from 'react';

const NoteContent = ({ note }) => {
    if (!note) {
        return <p>Select a note to view its content</p>;
    }

    return (
        <div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
        </div>
    );
};

export default NoteContent;
