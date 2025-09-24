import React, { useState } from 'react';
import './App.css'; // Import the CSS file

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., send data to a backend)
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="page-section contact-form">
      <h2>Contact Us</h2>
      <p>
        We'd love to hear from you! Whether you have a question about our courses,
        need assistance, or just want to provide feedback, please feel free to reach out.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="6" value={formData.message} onChange={handleChange} required></textarea>
        </div>
        <button type="submit">Send Message</button>
      </form>

      <div style={{ marginTop: '30px' }}>
        <h3>Other Ways to Reach Us</h3>
        <p><strong>Email:</strong> support@learnsphere.com</p>
        <p><strong>Phone:</strong> +1 (800) 123-4567</p>
        <p>
          <strong>Address:</strong><br />
          123 Learning Lane<br />
          Education City, EC 54321<br />
          United States
        </p>
      </div>
    </div>
  );
};

export default Contact;