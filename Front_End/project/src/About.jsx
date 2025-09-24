import React from 'react';
import './App.css'; // Import the CSS file

const About = () => {
  return (
    <div className="page-section about-section">
      <h2>About Our Learning Platform</h2>
      <p>
        Welcome to LearnSphere, your premier destination for online learning and professional development. 
        Our mission is to empower individuals and organizations worldwide by providing accessible, high-quality
        education and training resources.
      </p>
      
      <h3>Our Vision</h3>
      <p>
        We envision a world where anyone, anywhere can transform their life through learning. We strive to be
        a catalyst for positive change by offering courses that are not only informative but also inspiring
        and practical.
      </p>

      <h3>What We Offer</h3>
      <ul>
        <li><strong>Diverse Course Catalog:</strong> From technology and business to arts and personal development, our extensive library covers a wide range of subjects.</li>
        <li><strong>Expert Instructors:</strong> Learn from industry professionals and experienced educators who are passionate about sharing their knowledge.</li>
        <li><strong>Flexible Learning:</strong> Access courses anytime, anywhere, and learn at your own pace with our user-friendly platform.</li>
        <li><strong>Interactive Content:</strong> Engage with dynamic video lectures, hands-on projects, quizzes, and a supportive community of learners.</li>
        <li><strong>Career Advancement:</strong> Gain new skills, earn certificates, and prepare for in-demand jobs with our career-focused programs.</li>
      </ul>

      <h3>Our Commitment</h3>
      <p>
        We are committed to:
      </p>
      <ul>
        <li>Providing an exceptional learning experience.</li>
        <li>Continuously updating our content to reflect the latest industry trends.</li>
        <li>Fostering a supportive and inclusive learning environment.</li>
        <li>Helping our learners achieve their personal and professional goals.</li>
      </ul>
      <p>
        Join us on this learning journey and unlock your full potential. Whether you're looking to advance your career, 
        explore a new hobby, or simply expand your knowledge, LearnSphere is here to guide you every step of the way.
      </p>
    </div>
  );
};

export default About;