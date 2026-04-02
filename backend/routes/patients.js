const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const { protect, authorize } = require('../middleware/auth');

// @GET /api/patients/me
router.get('/me', protect, authorize('patient'), async (req, res) => {
    try {
        const patient = await Patient.findById(req.user._id).select('-password');
        res.json(patient);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @PUT /api/patients/me
router.put('/me', protect, authorize('patient'), async (req, res) => {
    try {
        const { name, phone, dateOfBirth, gender, address } = req.body;
        const patient = await Patient.findByIdAndUpdate(
            req.user._id,
            { name, phone, dateOfBirth, gender, address },
            { new: true }
        ).select('-password');
        res.json(patient);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
