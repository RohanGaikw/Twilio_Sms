require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Twilio Setup
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;  // Your Twilio number

// API endpoint to send messages
app.post('/send-message', async (req, res) => {
    const { phoneNumber, message } = req.body;
  
    if (!phoneNumber || !message) {
        return res.status(400).json({ success: false, message: 'Phone number and message are required.' });
    }

    try {
      const messageResponse = await client.messages.create({
        body: message,
        from: twilioNumber,   // Twilio number
        to: phoneNumber       // User's phone number from frontend
      });

      console.log("Message sent:", messageResponse.sid);
      res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ success: false, message: 'Failed to send message', error: error.message });
    }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
            