const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const Appointment = require('../models/Appointment');
const Admin = require('../models/Admin');
const { protect, authorize } = require('../middleware/auth');

// @POST /api/admin/seed — create default admin
router.post('/seed', async (req, res) => {
    try {
        const exists = await Admin.findOne({ email: 'admin@mediconnect.com' });
        if (exists) return res.json({ message: 'Admin already exists' });
        await Admin.create({ username: 'admin', email: 'admin@mediconnect.com', password: 'admin123' });
        res.status(201).json({ message: 'Admin created: admin@mediconnect.com / admin123' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// All admin routes require admin auth
router.use(protect, authorize('admin'));

// @GET /api/admin/stats
router.get('/stats', async (req, res) => {
    try {
        const [patients, doctors, hospitals, appointments] = await Promise.all([
            Patient.countDocuments(),
            Doctor.countDocuments(),
            Hospital.countDocuments(),
            Appointment.countDocuments(),
        ]);
        const pending = await Appointment.countDocuments({ status: 'pending' });
        const confirmed = await Appointment.countDocuments({ status: 'confirmed' });
        const completed = await Appointment.countDocuments({ status: 'completed' });
        const rejected = await Appointment.countDocuments({ status: 'rejected' });
        res.json({ patients, doctors, hospitals, appointments, pending, confirmed, completed, rejected });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/admin/patients
router.get('/patients', async (req, res) => {
    try {
        const patients = await Patient.find().select('-password').sort({ createdAt: -1 });
        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @DELETE /api/admin/patients/:id
router.delete('/patients/:id', async (req, res) => {
    try {
        await Patient.findByIdAndDelete(req.params.id);
        res.json({ message: 'Patient deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/admin/doctors
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await Doctor.find().select('-password')
            .populate('hospital', 'hospital_name location').sort({ createdAt: -1 });
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @DELETE /api/admin/doctors/:id
router.delete('/doctors/:id', async (req, res) => {
    try {
        await Doctor.findByIdAndDelete(req.params.id);
        res.json({ message: 'Doctor deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/admin/hospitals
router.get('/hospitals', async (req, res) => {
    try {
        const hospitals = await Hospital.find().sort({ createdAt: -1 });
        res.json(hospitals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @DELETE /api/admin/hospitals/:id
router.delete('/hospitals/:id', async (req, res) => {
    try {
        await Hospital.findByIdAndDelete(req.params.id);
        res.json({ message: 'Hospital deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/admin/appointments
router.get('/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('patient_id', 'name email')
            .populate('doctor_id', 'name specialization')
            .populate('hospital', 'hospital_name')
            .sort({ createdAt: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;
