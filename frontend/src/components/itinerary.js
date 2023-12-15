import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import * as yup from 'yup';
import AppHeader from '../components/header.js';
import './itinerary.css';

// Define the schema for validation using yup
const itinerarySchema = yup.object().shape({
    eventName: yup.string().required('Event name is required'),
    location: yup.string().required('Location is required'),
    startDate: yup.date().required('Start date is required').max(yup.ref('endDate'), 'Start date must be before end date'),
    endDate: yup.date().required('End date is required').min(yup.ref('startDate'), 'End date must be after start date'),
    startTime: yup.string().required('Start time is required'),
    endTime: yup.string().required('End time is required'),
    description: yup.string(),
    notification: yup.string()
});

function Itinerary() {
    const [events, setEvents] = useState([]);
    const [editingEventId, setEditingEventId] = useState(null);
    const [eventForm, setEventForm] = useState({
        eventName: '',
        location: '',
        startDate: new Date(),
        endDate: new Date(),
        startTime: '12:00',
        endTime: '12:00',
        description: '',
        notification: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            const token = localStorage.getItem('token');
            const apiURL = process.env.REACT_APP_API_URL || 'https://wanderlogixs-3ca36711a00d.herokuapp.com/api';
            const fetchURL = `${apiURL}/itinerary`;
    
            console.log('Fetching from URL:', fetchURL); // Debug log
    
            if (!token) {
                navigate('/login');
                return;
            }
    
            try {
                const response = await fetch(fetchURL, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
    
        fetchEvents();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventForm({ ...eventForm, [name]: value });
    };

    const formatDateValue = (date) => {
        if (!(date instanceof Date)) {
            console.error('Invalid date value:', date);
            return ''; // Return an empty string or handle the error as needed
        }
        return date.toISOString().split('T')[0];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const validatedData = await itinerarySchema.validate(eventForm, { abortEarly: false });
            const eventData = {
                ...validatedData,
                startDate: validatedData.startDate.toISOString().split('T')[0],
                endDate: validatedData.endDate.toISOString().split('T')[0]
            };

            const method = editingEventId ? 'PUT' : 'POST';
            const endpoint = editingEventId ? `${process.env.REACT_APP_API_URL}/itinerary/${editingEventId}` : `${process.env.REACT_APP_API_URL}/itinerary`;

            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(eventData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedEvent = await response.json();
            if (editingEventId) {
                setEvents(events.map(event => event.event_id === editingEventId ? updatedEvent : event));
            } else {
                setEvents([...events, updatedEvent]);
            }

            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors({ form: 'Error submitting form' });
        }
    };

    const resetForm = () => {
        setEventForm({
            eventName: '',
            location: '',
            startDate: new Date(),
            endDate: new Date(),
            startTime: '12:00',
            endTime: '12:00',
            description: '',
            notification: ''
        });
        setEditingEventId(null);
        setErrors({});
    };

    const handleEditEvent = (event) => {
        setEditingEventId(event.event_id);
        setEventForm({
            eventName: event.event_name,
            location: event.location,
            startDate: new Date(event.start_datetime),
            endDate: new Date(event.end_datetime),
            startTime: event.start_datetime.split('T')[1].substring(0, 5),
            endTime: event.end_datetime.split('T')[1].substring(0, 5),
            description: event.description,
            notification: event.notification
        });
    };

    return (
        <>
            <AppHeader />
            <div className='calendar-form-container'>
                <div className="calendar-header">
                    <div className="calendar-text">Your Itinerary</div>
                    <div className="underline"></div>
                </div>
                <form onSubmit={handleSubmit} className="itinerary-form">
                    {/* Event Name Input */}
                    <div className="form-row">
                        <div className="input">
                            <input
                                type="text"
                                name="eventName"
                                value={eventForm.eventName}
                                onChange={handleInputChange}
                                placeholder="Event Name"
                            />
                            {errors.eventName && <div className="error">{errors.eventName}</div>}
                        </div>

                        {/* Location Input */}
                        <div className="input">
                            <input
                                type="text"
                                name="location"
                                value={eventForm.location}
                                onChange={handleInputChange}
                                placeholder="Location"
                            />
                            {errors.location && <div className="error">{errors.location}</div>}
                        </div>
                    </div>

                    {/* Date and Time Inputs */}
                    <div className="form-row">
                        <div className="input">
                            <input
                                type="date"
                                name="startDate"
                                value={formatDateValue(eventForm.startDate)}
                                onChange={handleInputChange}
                                placeholder="Start Date"
                            />
                            {errors.startDate && <div className="error">{errors.startDate}</div>}
                        </div>
                        <div className="input">
                            <input
                                type="time"
                                name="startTime"
                                value={eventForm.startTime}
                                onChange={handleInputChange}
                                placeholder="Start Time"
                            />
                            {errors.startTime && <div className="error">{errors.startTime}</div>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="input">
                            <input
                                type="date"
                                name="endDate"
                                value={formatDateValue(eventForm.endDate)}
                                onChange={handleInputChange}
                                placeholder="End Date"
                            />
                            {errors.endDate && <div className="error">{errors.endDate}</div>}
                        </div>
                        <div className="input">
                            <input
                                type="time"
                                name="endTime"
                                value={eventForm.endTime}
                                onChange={handleInputChange}
                                placeholder="End Time"
                            />
                            {errors.endTime && <div className="error">{errors.endTime}</div>}
                        </div>
                    </div>

                    {/* Description and Notification */}
                    <div className="form-row description-row">
                        <div className="input full-width">
                            <textarea
                                name="description"
                                value={eventForm.description}
                                onChange={handleInputChange}
                                placeholder="Description"
                            />
                            {errors.description && <div className="error">{errors.description}</div>}
                        </div>
                    </div>

                    <div className="form-row button-row">
                        <div className="input reminder-select">
                            <label>
                                Set Reminder:
                                <select
                                    name="notification"
                                    value={eventForm.notification}
                                    onChange={handleInputChange}>
                                    <option value="none">None</option>
                                    <option value="15min">15 minutes before</option>
                                    <option value="30min">30 minutes before</option>
                                    <option value="1hour">1 hour before</option>
                                    <option value="1day">1 day before</option>
                                </select>
                            </label>
                            {errors.notification && <div className="error">{errors.notification}</div>}
                        </div>
                        
                        <div className="itinerary-submit-container">
                            <button type="submit" className="btn trip-btn-primary submit">Submit</button>
                            <button type="button" className="btn trip-btn-secondary submit" onClick={resetForm}>Cancel</button>
                        </div>
                    </div>
                </form>

                {/* Calendar Component */}
                <div className="calendar-container">
                <Calendar
                    onChange={date => setEventForm({ ...eventForm, startDate: date })}
                    value={new Date()}
                    tileContent={({ date, view }) =>
                        view === 'month' && events.map(event => {
                            const eventStartDate = new Date(event.start_datetime);
                            const eventEndDate = new Date(event.end_datetime);
                            if (date >= eventStartDate && date <= eventEndDate) {
                                return (
                                    <div key={event.event_id} onClick={() => handleEditEvent(event)}>
                                        {event.event_name}
                                    </div>
                                );
                            }
                            return null;
                    })}
                />
            </div>
            </div>
        </>
    );
}

export default Itinerary;
