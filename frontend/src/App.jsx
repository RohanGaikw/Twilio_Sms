import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure phone number is in E.164 format
    let formattedPhoneNumber = phoneNumber.trim();
    if (!formattedPhoneNumber.startsWith('+')) {
      formattedPhoneNumber = `+91${formattedPhoneNumber}`;  // Defaulting to India (+91)
    }

    try {
      const response = await axios.post('http://localhost:5000/send-message', {
        phoneNumber: formattedPhoneNumber,
        message: message, // Using state message
      });

      if (response.data.success) {
        setStatus('Message sent successfully!');
        setPhoneNumber('');
        setMessage('');
      } else {
        setStatus('Failed to send message');
      }
    } catch (error) {
      console.error("Error sending message:", error.response ? error.response.data : error.message);
      setStatus('Error sending message');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Send a Message</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
          <input
            type="text"
            className="form-control"
            id="phoneNumber"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">Message</label>
          <textarea
            className="form-control"
            id="message"
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Send</button>
      </form>
      {status && <p className="mt-3 text-center">{status}</p>}
    </div>
  );
}

export default App;
