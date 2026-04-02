const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { protect, authorize } = require('../middleware/auth');

// @GET /api/doctors/search
router.get('/search', async (req, res) => {
    try {
        const { specialization, location, hospital, name } = req.query;
        const query = { isActive: true };
        if (specialization) query.specialization = { $regex: specialization, $options: 'i' };
        if (name) query.name = { $regex: name, $options: 'i' };
        if (hospital) query.hospital = hospital;

        let doctors = await Doctor.find(query)
            .populate('hospital', 'hospital_name location contact')
            .select('-password');

        if (location) {
            doctors = doctors.filter(d =>
                d.hospital && d.hospital.location.toLowerCase().includes(location.toLowerCase())
            );
        }
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/doctors
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find({ isActive: true })
            .populate('hospital', 'hospital_name location')
            .select('-password');
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/doctors/me  (doctor's own profile)
router.get('/me', protect, authorize('doctor'), async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.user._id)
            .populate('hospital', 'hospital_name location contact')
            .select('-password');
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/doctors/appointments (doctor views their bookings)
router.get('/appointments', protect, authorize('doctor'), async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor_id: req.user._id })
            .populate('patient_id', 'name email phone')
            .sort({ date: 1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/doctors/:id
router.get('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id)
            .populate('hospital', 'hospital_name location contact')
            .select('-password');
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @PUT /api/doctors/me (update profile)
router.put('/me', protect, authorize('doctor'), async (req, res) => {
    try {
        const { name, specialization, experience, bio, fee, phone } = req.body;
        const doctor = await Doctor.findByIdAndUpdate(
            req.user._id,
            { name, specialization, experience, bio, fee, phone },
            { new: true }
        ).select('-password');
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @PUT /api/doctors/availability
router.put('/availability', protect, authorize('doctor'), async (req, res) => {
    try {
        const { availability } = req.body;
        const doctor = await Doctor.findByIdAndUpdate(
            req.user._id,
            { availability },
            { new: true }
        ).select('-password');
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
