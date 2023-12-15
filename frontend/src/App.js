import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

//import AppDashboard from './components/dashboard.js'
import AppLogin from './components/loginsignup.js'; 
import AppItinerary from './components/itinerary.js';
import AppTrip from './components/trip.js';
import AppExpenses from './components/expenses.js'
import AppMedia from './components/media.js'
import ForgotPassword from './components/forgotpassword.js';

//<Route path="/dashboard" element={<AppDashboard />} /> 


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<AppLogin />} />
          <Route path="/itinerary" element={<AppItinerary />} />
          <Route path="/trips" element={<AppTrip />} />
          <Route path="/expenses" element={<AppExpenses />} />
          <Route path="/media" element={<AppMedia />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />



        </Routes>
      </Router>
    </div>
  );
}

export default App;
