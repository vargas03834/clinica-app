const Patient = require('../models/Patient');

exports.create = async (req, res) => {
  const patient = new Patient(req.body);
  await patient.save();
  res.status(201).json(patient);
};

exports.getAll = async (req, res) => {
  const patients = await Patient.find();
  res.json(patients);
};
