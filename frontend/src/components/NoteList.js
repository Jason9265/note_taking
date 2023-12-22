// src/components/NoteList.js

import React from 'react';
import { ListGroup } from 'react-bootstrap';

const NoteList = ({ notes, onSelectNote, activeNoteId }) => {

    return (
        <ListGroup className='mt-4'>
            {notes.map((note) => (
                <ListGroup.Item
                    key={note.id}
                    action
                    active={note.id === activeNoteId}
                    onClick={() => onSelectNote(note)}
                >
                    {note.title}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

export default NoteList;
