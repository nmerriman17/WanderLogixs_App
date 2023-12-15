import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppHeader from '../components/header.js';
import './dashboard.css';

function AppDashboard() {
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  // Add other state variables as needed

  useEffect(() => {
    // Fetch Upcoming Trips
    axios.get('/api/upcoming-trips')
         .then(response => setUpcomingTrips(response.data))
         .catch(error => console.error('Error fetching upcoming trips:', error));

    // Fetch Recent Activity
    axios.get('/api/recent-activity')
         .then(response => setRecentActivity(response.data))
         .catch(error => console.error('Error fetching recent activity:', error));

    // Additional fetch calls for weather, travel tips, etc.

  }, []);

  return (
    <>
      <AppHeader />
      <div className="dashboard-container">
        <div className="dashboard-section">
          <div className="upcoming-trips">
            <h2>Upcoming Trips</h2>
            {/* Render upcoming trips here */}
            {upcomingTrips.map(trip => <div key={trip.id}>{trip.name}</div>)}
          </div>
          <div className="activity-feed">
            <h2>Recent Activity</h2>
            {/* Render recent activities here */}
            {recentActivity.map(activity => <div key={activity.id}>{activity.description}</div>)}
          </div>
        </div>
        <div className="dashboard-section">
          {/* Weather and Travel Tips sections can be populated similarly */}
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
