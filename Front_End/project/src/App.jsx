import React, { useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import Homepage from './Homepage';
import About from './About';
import Contact from './Contact';
import Assignment from './Assignment';
import Register from './Register';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Courses from './Courses';
import Performance from './Performance';
import CourseContent from './CourseContent';
import Certifications from './Certifications';
import WebDevCourse from './courses/WebDevCourse';
import ReactJSCourse from './courses/ReactJSCourse';
import ExpressJSCourse from './courses/ExpressJSCourse';
import DjangoCourse from './courses/DjangoCourse';
import JavaCourse from './courses/JavaCourse';
import PythonCourse from './courses/PythonCourse';
import AWSCourse from './courses/AWSCourse';
import AICourse from './courses/AICourse';
import GenAICourse from './courses/GenAICourse';
import DevOpsCourse from './courses/DevOpsCourse';
import Aa from './Aa';
import Dashboard from './components/Dashboard';
import Schedule from './Schedule';
import Discussions from './Discussions';
import TakeQuiz from './TakeQuiz';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('Login') === 'yes');
  const [refreshKey, setRefreshKey] = useState(0); // For triggering refresh in child components
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is on dashboard route
  const isDashboardRoute = location.pathname === '/react/dashboard';

  // Helper function for protected navigation
  const navigateIfLoggedIn = (path) => {
    if (localStorage.getItem('Login') === 'yes') {
      navigate(path);
    } else {
      alert('Please Login to access this page.');
      navigate('/login');
    }
  };

  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname === `/react${path}` ? 'active' : '';
  };

  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // You can implement search functionality here
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('Login', 'no');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    navigate('/react');
  };

  // Function to handle successful login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    // Redirect to dashboard after successful login
    navigate('/react/dashboard');
  };

  // Callback to refresh data after quiz submission
  const handleQuizSubmit = () => {
    setRefreshKey(prev => prev + 1);
  };

  // If user is logged in and on dashboard route, show dashboard layout
  if (isLoggedIn && isDashboardRoute) {
    return <Dashboard />;
  }

  return (
    <div>
      <nav id='Nav_parent'>
        <Link to='/react' className={`nav-button ${isActive('')}`}>
          Home
        </Link>

        <div className='search-container'>
          <input
            id='srch'
            placeholder='Search...'
            type='search'
            value={searchQuery}
            onChange={handleSearch}
            aria-label='Search'
          />
        </div>

        {isLoggedIn && (
          <Link 
            to='/react/dashboard'
            className={`nav-button ${isActive('/dashboard')}`}
          >
            Dashboard
          </Link>
        )}

        <Link 
          to='/react/contact'
          onClick={(e) => {
            e.preventDefault();
            navigateIfLoggedIn('/react/contact');
          }}
          className={`nav-button ${isActive('/Contact')}`}
        >
          Contact Us
        </Link>
        <Link 
          to='/react/courses'
          onClick={(e) => {
            e.preventDefault();
            navigateIfLoggedIn('/react/courses');
          }}
          className={`nav-button ${isActive('/Courses')}`}
        >
          Courses
        </Link>
        <Link 
          to='/react/certifications'
          onClick={(e) => {
            e.preventDefault();
            navigateIfLoggedIn('/react/certifications');
          }}
          className={`nav-button ${isActive('/Certifications')}`}
        >
          Certifications
        </Link>
        <Link 
          to='/react/performance'
          onClick={(e) => {
            e.preventDefault();
            navigateIfLoggedIn('/react/performance');
          }}
          className={`nav-button ${isActive('/Performance')}`}
        >
          Performance
        </Link>

        {isLoggedIn ? (
          <button 
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>
        ) : (
          <div className="auth-links">
            <button className={`nav-button ${isActive('/react/login')}`} onClick={() => navigate('/react/login')}>
              Login
            </button>
            <span>/</span>
            <button className={`nav-button ${isActive('/react/register')}`} onClick={() => navigate('/react/register')}>
              Signup
            </button>
          </div>
        )}
      </nav>

      <main id='bgc' className='main-content'>
        <Routes>
          <Route path='/react' element={<Homepage />} />
          <Route path='/react/dashboard' element={<Dashboard />} />
          <Route path='/react/contact' element={<Contact />} />
          <Route path='/react/assignments' element={<Assignment />} />
          <Route path='/react/login' element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path='/react/register' element={<Register />} />
          <Route path='/react/forgot-password' element={<ForgotPassword />} />
          <Route path='/react/reset-password' element={<ResetPassword />} />
          <Route path='/react/courses' element={<Courses />} />
          <Route path='/react/CourseContent' element={<CourseContent />} />
          <Route path='/react/performance' element={<Performance key={refreshKey} />} />
          <Route path='/react/certifications' element={<Certifications key={refreshKey} />} />
          <Route path='/react/schedule' element={<Schedule />} />
          <Route path='/react/discussions' element={<Discussions />} />
          <Route path='/react/webdev' element={<WebDevCourse />} />
          <Route path='/react/reactjs' element={<ReactJSCourse />} />
          <Route path='/react/expressjs' element={<ExpressJSCourse />} />
          <Route path='/react/django' element={<DjangoCourse />} />
          <Route path='/react/java' element={<JavaCourse />} />
          <Route path='/react/python' element={<PythonCourse />} />
          <Route path='/react/aws' element={<AWSCourse />} />
          <Route path='/react/ai' element={<AICourse />} />
          <Route path='/react/genai' element={<GenAICourse />} />
          <Route path='/react/devops' element={<DevOpsCourse />} />
          <Route path='/react/certificate' element={<Aa />} />
          <Route path='/react/takequiz' element={<TakeQuiz onQuizSubmit={handleQuizSubmit} />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
