import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import './header.css';

import logoImage from '../assets/images/logo-icon.png'; 

export default function AppHeader() {
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:3004/api/search?term=${encodeURIComponent(searchTerm)}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'), // Replace with your auth token retrieval logic
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setSearchResults(data); // Update search results state
        } catch (error) {
            console.error('Error during fetch:', error);
            setSearchResults([]); // Reset search results on error
        }
    };

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
                            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
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

            {/* Display Search Results */}
            <div>
                {searchResults.length > 0 ? (
                    <ul>
                        {searchResults.map(result => (
                            <li key={result.id}>{result.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No results found</p>
                )}
            </div>
        </>
    );
}
