import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import './expenses.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppHeader from '../components/header.js'; 
import Card from 'react-bootstrap/Card';

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
        <Card.Title>Card Title</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

const AppExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [formState, setFormState] = useState('submit');

  const handleSubmit = (values, { resetForm }) => {
    if (formState === 'submit') {
      const expenseWithDecimalAmount = { ...values, amount: parseFloat(values.amount) };
      setExpenses([expenseWithDecimalAmount, ...expenses]);
      resetForm();
      setFormState('submitted');

      // Reset the form state back to 'submit' after a delay
      setTimeout(() => {
        setFormState('submit');
      }, 1); // Change the delay as needed
    }
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
