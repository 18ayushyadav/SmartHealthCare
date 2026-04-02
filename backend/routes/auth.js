const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

// @POST /api/auth/patient/register
router.post('/patient/register', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const exists = await Patient.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Patient already registered' });
        const patient = await Patient.create({ name, email, phone, password });
        res.status(201).json({
            _id: patient._id, name: patient.name, email: patient.email,
            phone: patient.phone, role: 'patient',
            token: generateToken(patient._id, 'patient'),
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @POST /api/auth/patient/login
router.post('/patient/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const patient = await Patient.findOne({ email });
        if (patient && await patient.matchPassword(password)) {
            res.json({
                _id: patient._id, name: patient.name, email: patient.email,
                phone: patient.phone, role: 'patient',
                token: generateToken(patient._id, 'patient'),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @POST /api/auth/doctor/login
router.post('/doctor/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const doctor = await Doctor.findOne({ email }).populate('hospital', 'hospital_name location');
        if (doctor && await doctor.matchPassword(password)) {
            res.json({
                _id: doctor._id, name: doctor.name, email: doctor.email,
                specialization: doctor.specialization, hospital: doctor.hospital,
                role: 'doctor',
                token: generateToken(doctor._id, 'doctor'),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @POST /api/auth/admin/login
router.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (admin && await admin.matchPassword(password)) {
            res.json({
                _id: admin._id, username: admin.username, email: admin.email,
                role: 'admin',
                token: generateToken(admin._id, 'admin'),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
