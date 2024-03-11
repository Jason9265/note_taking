import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, ListGroup, InputGroup } from 'react-bootstrap';

const TagsManageModal = ({ show, onHide}) => {
    const [tags, setTags] = useState([]);
    // const [tags, setTags] = useState([
    //     { name: 'Tag1', isEditing: false },
    //     { name: 'Tag2', isEditing: false },
    //     { name: 'Tag3', isEditing: false },
    // ]);  

    useEffect(() => {

        fetchTags();
    }, []);

    const fetchTags = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tags/`);
        if (response.ok) {
            const data = await response.json();
            setTags(data); // Store all tags in state
        }
    };

    const handleEditToggle = (index) => {
        const updatedTags = tags.map((tag, i) => {
        if (i === index) {
            return { ...tag, isEditing: !tag.isEditing };
        }
        return tag;
        });
        setTags(updatedTags);
    };

    const handleTagChange = (index, newName) => {
        const updatedTags = tags.map((tag, i) => {
        if (i === index) {
            return { ...tag, name: newName };
        }
        return tag;
        });
        setTags(updatedTags);
    };

    const handleDeleteTag = (index) => {
        const updatedTags = tags.filter((_, i) => i !== index);
        setTags(updatedTags);
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Tags Manage</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-end mb-2">
                    <Button disabled variant="outline-success">Add Tag</Button>
                </div>
                <ListGroup>
                {tags.map((tag, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                    {tag.isEditing ? (
                        <InputGroup>
                        <Form.Control
                            type="text"
                            value={tag.name}
                            onChange={(e) => handleTagChange(index, e.target.value)}
                        />
                        <Button variant="outline-secondary" onClick={() => handleEditToggle(index)}>
                            Save
                        </Button>
                        </InputGroup>
                    ) : (
                        <>
                        {tag.name}
                            <div>
                                <Button variant="outline-primary" disabled onClick={() => handleEditToggle(index)} className="ms-2">
                                    Edit
                                </Button>
                                <Button variant="outline-danger" disabled onClick={() => handleDeleteTag(index)} className="ms-2">
                                    Delete
                                </Button>
                            </div>
                        </>
                    )}
                    </ListGroup.Item>
                ))}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                Close
                </Button>
                <Button variant="primary" onClick={onHide}>
                Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TagsManageModal;
