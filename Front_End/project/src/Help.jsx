import React from 'react';
import './Help.css';

const Help = () => {
  return (
    <div className="help-container" style={{ maxWidth: '100vw', width: '100vw', padding: '0 20px' }}>
      <h2>Help & Support</h2>
      <p>Welcome to the help center. Here you can find FAQs, contact support, and get assistance.</p>
      <section className="faq-section">
        <h3>Frequently Asked Questions</h3>
        <ul>
          <li><strong>How do I enroll in a course?</strong> You can browse courses and click "Enroll Now" on the course page.</li>
          <li><strong>How do I track my progress?</strong> Your dashboard shows your course progress and recent activity.</li>
          <li><strong>How do I get a certificate?</strong> Complete at least 80% of a course and request a certificate in the Certifications page.</li>
          {/* Add more FAQs as needed */}
        </ul>
      </section>
      <section className="contact-support">
        <h3>Contact Support</h3>
        <p>If you need further assistance, please email support@example.com or call 1-800-123-4567.</p>
      </section>
    </div>
  );
};

export default Help;
