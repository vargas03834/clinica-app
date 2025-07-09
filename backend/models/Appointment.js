const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  doctor: String,
  date: Date,
  time: String,
  status: { type: String, default: 'pendiente' },
  notes: String,
});
module.exports = mongoose.model('Appointment', appointmentSchema);