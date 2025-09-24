import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardWidgets from './DashboardWidgets';
import Courses from '../Courses';
import Performance from '../Performance';
import Assignment from '../Assignment';
import Certifications from '../Certifications';
import Profile from '../Profile';
import Settings from '../Settings';
import Schedule from '../Schedule';
import Discussions from '../Discussions';
import TakeQuiz from '../TakeQuiz';
import './Dashboard.css';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <div className="dashboard-layout">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-title">
              <h1>Welcome back, {localStorage.getItem('name') || 'Guest'}!</h1>
              <p>Here's what's happening with your courses today.</p>
            </div>
            <div className="header-actions">
              <div className="search-bar">
                <input 
                  type="search" 
                  placeholder="Search courses, assignments..." 
                  className="search-input"
                />
              </div>
              <div className="user-profile">
                <span className="user-name">{localStorage.getItem('name') || 'Guest'}</span>
                <div className="user-avatar">
                  {/* You can add a profile picture here */}
                  <span className="avatar-placeholder">
                    {(localStorage.getItem('name') || 'G')[0].toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {activeSection === 'dashboard' && <DashboardWidgets />}
          {activeSection === 'courses' && <Courses />}
          {activeSection === 'performance' && <Performance />}
          {activeSection === 'assignments' && <Assignment />}
          {activeSection === 'certifications' && <Certifications />}
          {activeSection === 'profile' && <Profile />}
          {activeSection === 'settings' && <Settings />}
          {activeSection === 'schedule' && <Schedule />}
          {activeSection === 'discussions' && <Discussions />}
          {activeSection === 'takequiz' && <TakeQuiz />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
