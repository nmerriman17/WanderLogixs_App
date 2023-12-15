import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import './header.css';

import logoImage from '../assets/images/logo-icon.png'; 

export default function AppHeader() {
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
    
        const baseUrl = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3004';
        const apiUrl = `${baseUrl}/api/search?term=${encodeURIComponent(searchTerm)}`;
    
        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Sending token
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            setSearchResults(data);
            setShowModal(true);
        } catch (error) {
            console.error('Error during fetch:', error);
            setSearchResults([]);
        }
    };

    const handleCloseModal = () => setShowModal(false);

    return (
        <>
            <Navbar className="bg-body-tertiary" expand="lg">
                <Container>
                    {/* Logo and Brand */}
                    <Navbar.Brand className="d-flex align-items-center header-light-blue-logo text">
                        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={logoImage} alt="Logo" style={{ maxWidth: '100px', marginRight: '10px' }} />
                            <span style={{ color: '#7794A6' }}>WanderLogixs</span>
                        </Link>
                    </Navbar.Brand>

                    {/* Toggler */}
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />



                    {/* Navbar Links and Search Form */}
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/trips">Trips</Nav.Link>
                            <Nav.Link as={Link} to="/expenses">Expenses</Nav.Link>
                            <Nav.Link as={Link} to="/itinerary">Itinerary</Nav.Link>
                            <Nav.Link as={Link} to="/media" style={{ marginRight: '20px' }}>Media</Nav.Link>
                        </Nav>
                        <Form className="d-flex ms-auto" onSubmit={handleSearchSubmit}>
                            <Form.Control
                                name="search"
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <Button type="submit" className="rounded-button">Submit</Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Modal for displaying search results */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Search Results</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {searchResults.length > 0 ? (
                        <ul>
                            {searchResults.map(result => (
                                <li key={result.id}>{result.name}</li>
                            ))}
                        </ul>
                    ) : (
                        <div>No results found</div> // or simply 'null' if you don't want to show anything
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
}
