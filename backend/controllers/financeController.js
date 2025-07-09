exports.create = async (req, res) => {
  const entry = new Finance(req.body);
  await entry.save();
  res.status(201).json(entry);
};

exports.getAll = async (req, res) => {
  const finances = await Finance.find().populate('patient');
  res.json(finances);
};