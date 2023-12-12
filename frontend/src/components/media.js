import React, { useState, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon } from 'react-share';
import Card from 'react-bootstrap/Card';
import './media.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppHeader from '../components/header.js'; 

// Validation schema
const schema = yup.object().shape({
  category: yup.string().required('Category is required'),
  tags: yup.string(),
  notes: yup.string(),
  media: yup.array(), // Custom validation can be added for file types, sizes, etc.
});

// MediaCard component
const MediaCard = ({ media, index }) => {
  const shareUrl = window.location.origin + '/media/' + index; // Or a more sophisticated URL

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{media.category}</Card.Title>
        <p>Tags: {media.tags}</p>
        <p>Notes: {media.notes}</p>
        {/* Display uploaded media previews if needed */}
        <div>
          <FacebookShareButton url={shareUrl}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton url={shareUrl}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
        </div>
      </Card.Body>
    </Card>
  );
};

// Main AppMedia component
const AppMedia = () => {
  const [mediaEntries, setMediaEntries] = useState([]);
  const formikRef = useRef();

  const handleSubmit = (values, { resetForm }) => {
    const newEntry = { ...values };
    setMediaEntries([newEntry, ...mediaEntries]);
    resetForm();
  };

  return (
    <>
      <AppHeader />
      <div className="media-form-container">
        <div className="media-header">
          <div className="media-text">Upload Your Media</div>
          <div className="underline"></div>
        </div>
        <Formik
          initialValues={{ trip: '', tags: '', notes: '', media: [] }}
          validationSchema={schema}
          onSubmit={handleSubmit}
          innerRef={formikRef}
        >
          {({ setFieldValue }) => (
            <Form id="media-form">
              <div className="inputs">
                <div className="input">
                  <Field 
                  name="tripName" 
                  type="text"
                  placeholder="Enter Trip Name" 
                  className="form-control" />
                </div>
                <div className="input">
                  <Field
                    name="tags"
                    type="text"
                    placeholder="Enter tags separated by commas"
                    className="form-control"
                  />
                </div>
                <div className="input">
                  <Field
                    name="notes"
                    type="text"
                    placeholder="Notes"
                    className="form-control"
                  />
                </div>
                <div className="input">
                  <input
                    id="file"
                    name="media"
                    type="file"
                    multiple
                    onChange={(event) => {
                      setFieldValue('media', event.currentTarget.files);
                    }}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="media-submit-container">
                <button type="submit" className="btn media-btn-primary submit">Submit</button>
                <button type="submit" className="btn media-btn-secondary submit" onClick={() => formikRef.current?.resetForm()}>
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div className="media-display">
        {mediaEntries.map((entry, index) => (
          <MediaCard key={index} media={entry} index={index} />
        ))}
      </div>
    </>
  );
};

export default AppMedia;
