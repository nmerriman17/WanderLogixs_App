import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import './trip.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import AppHeader from '../components/header.js'; 
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import axios from 'axios';


const schema = yup.object().shape({
    destination: yup.string().required('Destination is required'),
    startDate: yup.date().required('Start date is required'),
    endDate: yup.date().required('End date is required'),
    purpose: yup.string().required('Purpose is required'),
    notes: yup.string(),
    media: yup.mixed(),
});

const TripCard = ({ trip, onEdit, onDelete }) => {
    return (
        <Col xs={12} md={6} lg={4}>
            <Card>
                {trip.media && (
                    <Card.Img variant="top" src={URL.createObjectURL(trip.media)} alt="Trip" />
                )}
                <Card.Body>
                    <Card.Title>{trip.destination}</Card.Title>
                    <Card.Text>
                        <b>Start Date:</b> {trip.startDate}
                    </Card.Text>
                    <Card.Text>
                        <b>End Date:</b> {trip.endDate}
                    </Card.Text>
                    <Card.Text>
                        <b>Purpose:</b> {trip.purpose}
                    </Card.Text>
                    <Card.Text>
                        <b>Notes:</b> {trip.notes}
                    </Card.Text>
                    <button onClick={() => onEdit(trip)}>Edit</button>
                    <button onClick={() => onDelete(trip)}>Delete</button>
                </Card.Body>
            </Card>
        </Col>
    );
};

const TripsForm = () => {
  const [trips, setTrips] = useState([]);
  const [editingTrip, setEditingTrip] = useState(null);

  // Fetch trips from the backend
  useEffect(() => {
      axios.get('/api/trips')
           .then(response => setTrips(response.data))
           .catch(error => console.error('Error fetching trips', error));
  }, []);

  const handleSubmit = (values, { resetForm }) => {
      const apiCall = editingTrip 
          ? axios.put(`/api/trips/${editingTrip.id}`, values)
          : axios.post('/api/trips', values);

      apiCall.then(response => {
          setTrips(editingTrip ? trips.map(trip => trip.id === editingTrip.id ? response.data : trip) : [response.data, ...trips]);
          setEditingTrip(null);
          resetForm();
      }).catch(error => console.error('Error submitting trip', error));
  };

  const handleEdit = (trip) => {
      setEditingTrip(trip);
  };

  const handleDelete = (tripToDelete) => {
      axios.delete(`/api/trips/${tripToDelete.id}`)
           .then(() => {
               setTrips(trips.filter(trip => trip.id !== tripToDelete.id));
           })
           .catch(error => console.error('Error deleting trip', error));
  };

  return (
        <>
            <AppHeader />
            <div className='trips-form-container'>
                <div className="trips-header">
                    <div className="trips-text">Add/Edit Your Trip</div>
                    <div className="underline"></div>
                </div>

                <Formik
                    initialValues={editingTrip || {
                        destination: '',
                        startDate: '',
                        endDate: '',
                        purpose: '',
                        notes: '',
                        media: null,
                    }}
                    enableReinitialize
                    validationSchema={schema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue }) => (
            <Form>
              <div className="inputs">
                {/* Form fields */}
                <div className="input">
                  <Field name="destination" type="text" placeholder="Destination" className="form-control" />
                </div>
                <div className="input">
                  <Field name="startDate" type="date" className="form-control" />
                  <Field name="endDate" type="date" className="form-control" />
                </div>
                <div className="input">
                  <Field name="purpose" type="text" placeholder="Purpose" className="form-control" />
                </div>
                <div className="input">
                  <Field name="notes" type="text" placeholder="Notes" className="form-control" />
                </div>
                <div className="input">
                  <input
                    id="file"
                    name="media"
                    type="file"
                    onChange={(event) => {
                      setFieldValue('media', event.currentTarget.files[0]);
                    }}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="trips-submit-container">
                                <button type="submit" className="btn trip-btn-primary submit">
                                    {editingTrip ? 'Update' : 'Submit'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
            <div className="trips-display">
                {trips.map((trip, index) => (
                    <TripCard key={index} trip={trip} onEdit={() => handleEdit(trip)} onDelete={() => handleDelete(trip)} />
                ))}
            </div>
        </>
    );
};

export default TripsForm;