const mongoose = require('mongoose');
const financeSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  concept: String,
  amount: Number,
  date: Date,
  status: { type: String, enum: ['pagado', 'pendiente'], default: 'pendiente' },
});
module.exports = mongoose.model('Finance', financeSchema);