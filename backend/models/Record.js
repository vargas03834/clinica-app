const mongoose = require('mongoose');
const recordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  diagnosis: String,
  treatment: String,
  date: Date,
  doctor: String,
});
module.exports = mongoose.model('Record', recordSchema);