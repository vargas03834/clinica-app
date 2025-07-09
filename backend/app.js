const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const patientRoutes = require('./routes/patients');
const financeRoutes = require('./routes/finances');
require('dotenv').config();

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/finances', financeRoutes);

module.exports = app;