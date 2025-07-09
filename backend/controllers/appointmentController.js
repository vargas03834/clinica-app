const Appointment = require('../models/Appointment');
const { createGoogleCalendarEvent } = require('../config/googleCalendar');

exports.create = async (req, res) => {
  const appointment = new Appointment(req.body);
  await appointment.save();
  await createGoogleCalendarEvent({
    summary: 'Cita Dental',
    description: appointment.notes,
    start: { dateTime: new Date(appointment.date) },
    end: { dateTime: new Date(new Date(appointment.date).getTime() + 30 * 60000) },
  });
  res.status(201).json(appointment);
};

exports.getAll = async (req, res) => {
  const data = await Appointment.find().populate('patient');
  res.json(data);
};