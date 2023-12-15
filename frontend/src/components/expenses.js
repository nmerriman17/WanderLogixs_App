import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import './expenses.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppHeader from '../components/header.js'; 
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API_URL || '/api';

const schema = yup.object().shape({
  date: yup.date().required('Date is required'),
  category: yup.string().required('Category is required'),
  amount: yup
    .number()
    .required('Amount is required')
    .positive()
    .typeError('Amount must be a number'),
  description: yup.string(),
});

const ExpenseCard = ({ expense }) => {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{expense.category}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{expense.date}</Card.Subtitle>
        <Card.Text>
          {expense.description}
          <br />
          <b>Amount:</b> ${expense.amount}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

const AppExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [formState, setFormState] = useState('submit'); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get(`${apiUrl}/expenses`, { headers: { Authorization: `Bearer ${token}` } })
         .then(response => setExpenses(response.data))
         .catch(error => {
           console.error('Error fetching expenses:', error);
           if (error.response && error.response.status === 401) {
             navigate('/login');
           }
         });
  }, [navigate]);

  const handleSubmit = async (values, { resetForm }) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const expenseData = { ...values };
    axios.post(`${apiUrl}/expenses`, expenseData, { headers: { Authorization: `Bearer ${token}` } })
         .then(response => {
           setExpenses([response.data, ...expenses]);
           resetForm();
         })
         .catch(error => console.error('Error submitting expense:', error));
  };


  const handleCancel = () => {
    setFormState('cancel');
    document.getElementById('expense-form').reset();
  };

  return (
    <>
      <AppHeader />
      <div className="expense-form-container">
        <div className="expense-header">
          <div className="expense-text">Add Your Expenses</div>
          <div className="underline"></div>
        </div>
        <Formik
          initialValues={{
            date: '',
            category: '',
            amount: '',
            description: '',
          }}
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form id="expense-form">
              <div className="inputs">
                <div className="input">
                  <Field name="date" type="date" className="form-control" />
                </div>
                <div className="input">
                  <Field as="select" name="category" className="form-control">
                    <option value="">Select Category</option>
                    <option value="food">Food</option>
                    <option value="transportation">Transportation</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="accommodations">Accommodations</option>
                  </Field>
                </div>
                <div className="input">
                  <Field name="amount" type="text" placeholder="Amount" className="form-control" step="0.01" />
                </div>
                <div className="input">
                  <Field name="description" type="text" placeholder="Description" className="form-control" />
                </div>
              </div>
              <div className="expense-submit-container">
                <button type="submit" className="btn expense-btn-primary submit" disabled={formState !== 'submit'}>
                  Submit
                </button>
                
                <button type="button" className="btn expense-btn-secondary submit" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div className="expense-display">
        {expenses.map((expense, index) => (
          <ExpenseCard key={index} expense={expense} />
        ))}
      </div>
    </>
  );
};

export default AppExpenses;
