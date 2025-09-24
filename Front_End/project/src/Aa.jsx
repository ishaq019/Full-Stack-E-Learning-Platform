import React from 'react';
import './Aa.css';
import { useLocation } from 'react-router-dom';

const Aa = () => {
  const location = useLocation();
  const { username, courseName, completionDate } = location.state || {
    username: 'Student Name',
    courseName: 'Course Name',
    completionDate: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric', 
      year: 'numeric'
    })
  };

  const generateUID = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  return (
    <div>
      <div id='main'>
        <div>
          <h2>Certificate Of Graduation</h2>
          <p>Awarded to</p>
          <h4>{username}</h4>
          <p>for successful completion of</p>
          <h5><p>{courseName}</p></h5>
          <p>from PrepInsta Technologies PVT. LTD the course completion<br/>
             Certification was issued on {completionDate}</p>
        </div>
        <div id='p1'>
          <div id='c0'>
            <h6>Aashay Mishra</h6>
            <p>Co-Founder, Director-Academics</p>
          </div>
        </div>
        <div id='uid'>UID: {generateUID()}</div>
      </div>
    </div>
  );
}

export default Aa;
