import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom'; 
import './header.css';

import logoImage from '../assets/images/logo-icon.png'; 


export default function AppHeader() {
    const handleSearch = async (event) => {
        event.preventDefault();
        const searchTerm = event.target.elements.search.value; // Adjust based on your input field's name
    
        const response = await fetch('http://localhost:3004/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchTerm }),
        });
    
        const data = await response.json();
        console.log(data); // Handle the search results as needed
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
                        <Form className="d-flex ms-auto" onSubmit={handleSearch}>
                            <Form.Control
                                name="search"
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                            />
                            <Button type="submit" className="rounded-button">Submit</Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}
