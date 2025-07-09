const express = require('express');
const router = express.Router();
const { create, getAll } = require('../controllers/appointmentController');
const auth = require('../middlewares/auth');
router.post('/', auth, create);
router.get('/', auth, getAll);
module.exports = router;
