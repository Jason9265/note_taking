// src/routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotePage from './components/NotePage';
import ChatNotePage from './components/ChatNotePage';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/note" element={<NotePage />} />
                <Route path="/chatnote" element={<ChatNotePage />} />
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
};

export default AppRoutes;
