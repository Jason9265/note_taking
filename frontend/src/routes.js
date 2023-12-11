// src/routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotePage from './components/NotePage';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/note" element={<NotePage />} />
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
};

export default AppRoutes;
