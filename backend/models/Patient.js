const mongoose = require('mongoose');
const patientSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  birthdate: Date,
  notes: String,
});
module.exports = mongoose.model('Patient', patientSchema);