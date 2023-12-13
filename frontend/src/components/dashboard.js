import React from 'react';
import AppHeader from '../components/header.js';
import './dashboard.css';

function AppDashboard() {

  return (
    <>
      <AppHeader />
      <div className="dashboard-container">
        <div className="dashboard-section">
          <div className="upcoming-trips">Upcoming Trips</div>
          <div className="activity-feed">Recent Activity</div>
        </div>
        <div className="dashboard-section">
          <div className="weather-widget">Weather Information</div>
          <div className="travel-tips">Travel Tips and Articles</div>
        </div>
        <div className="emergency-info">Emergency Contacts</div>
        <p>For questions or concerns, please email <a href="mailto:wanderlogixs@gmail.com">wanderlogixs@gmail.com</a></p>
      </div>
    </>
  );
}

export default AppDashboard;
