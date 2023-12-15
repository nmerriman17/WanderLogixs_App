import React, { useState } from 'react';
import { Container, Nav, Navbar, Form, Button, Modal } from 'react-bootstrap';
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
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/search?term=${encodeURIComponent(searchTerm)}`;
        const token = localStorage.getItem('token');

        if (!token) {
            // TODO: Handle unauthenticated state, redirect to login or show a message
        }

        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
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
                    <Navbar.Brand className="d-flex align-items-center header-light-blue-logo text">
                        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={logoImage} alt="Logo" style={{ maxWidth: '100px', marginRight: '10px' }} />
                            WanderLogixs
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/trips">Trips</Nav.Link>
                            <Nav.Link as={Link} to="/expenses">Expenses</Nav.Link>
                            <Nav.Link as={Link} to="/itinerary">Itinerary</Nav.Link>
                            <Nav.Link as={Link} to="/media">Media</Nav.Link>
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
                            <Button type="submit" className="rounded-button">Search</Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

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
                    ) : <p>No results found.</p>}
                </Modal.Body>
            </Modal>
        </>
    );
}
