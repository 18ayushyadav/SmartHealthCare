const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const { protect, authorize } = require('../middleware/auth');

// @POST /api/hospitals/register
router.post('/register', async (req, res) => {
    try {
        const { hospital_name, location, contact, email, description } = req.body;
        const hospital = await Hospital.create({ hospital_name, location, contact, email, description });
        res.status(201).json(hospital);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/hospitals
router.get('/', async (req, res) => {
    try {
        const hospitals = await Hospital.find({ isActive: true })
            .populate('doctors', 'name specialization avatar fee');
        res.json(hospitals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/hospitals/:id
router.get('/:id', async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id)
            .populate('doctors', 'name specialization experience fee avatar rating');
        if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
        res.json(hospital);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @PUT /api/hospitals/:id
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(hospital);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @POST /api/hospitals/:id/doctors — add a doctor (create + assign)
router.post('/:id/doctors', protect, authorize('admin'), async (req, res) => {
    try {
        const { name, email, password, specialization, experience, bio, fee, phone } = req.body;
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) return res.status(400).json({ message: 'Doctor already exists' });

        const doctor = await Doctor.create({
            name, email, password, specialization, experience, bio, fee, phone,
            hospital: req.params.id,
        });

        await Hospital.findByIdAndUpdate(req.params.id, {
            $push: { doctors: doctor._id },
        });

        const populated = await Doctor.findById(doctor._id).select('-password').populate('hospital', 'hospital_name');
        res.status(201).json(populated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
