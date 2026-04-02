const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { protect, authorize } = require('../middleware/auth');
const { sendEmail, appointmentConfirmationEmail } = require('../utils/email');

// @POST /api/appointments — book
router.post('/', protect, authorize('patient'), async (req, res) => {
    try {
        const { doctor_id, date, time, reason } = req.body;
        const doctor = await Doctor.findById(doctor_id).populate('hospital');
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        const existing = await Appointment.findOne({
            doctor_id, date, time,
            status: { $nin: ['rejected', 'cancelled'] },
        });
        if (existing) return res.status(400).json({ message: 'This slot is already booked' });

        const appointment = await Appointment.create({
            patient_id: req.user._id,
            doctor_id,
            hospital: doctor.hospital?._id,
            date, time, reason,
        });

        // Send confirmation email
        try {
            await sendEmail({
                to: req.user.email,
                subject: 'MediConnect – Appointment Booked',
                html: appointmentConfirmationEmail(req.user.name, doctor.name, date, time),
            });
        } catch (_) { /* email failure shouldn't break the flow */ }

        const populated = await appointment.populate([
            { path: 'doctor_id', select: 'name specialization' },
            { path: 'patient_id', select: 'name email' },
        ]);
        res.status(201).json(populated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/appointments/my — patient history
router.get('/my', protect, authorize('patient'), async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient_id: req.user._id })
            .populate('doctor_id', 'name specialization avatar fee')
            .populate('hospital', 'hospital_name location')
            .sort({ createdAt: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @PATCH /api/appointments/:id/status — doctor accept/reject
router.patch('/:id/status', protect, authorize('doctor'), async (req, res) => {
    try {
        const { status, notes } = req.body;
        const appointment = await Appointment.findById(req.params.id)
            .populate('patient_id', 'name email')
            .populate('doctor_id', 'name');

        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        if (appointment.doctor_id._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        appointment.status = status;
        if (notes) appointment.notes = notes;
        await appointment.save();

        if (status === 'confirmed') {
            try {
                await sendEmail({
                    to: appointment.patient_id.email,
                    subject: 'MediConnect – Appointment Confirmed',
                    html: appointmentConfirmationEmail(
                        appointment.patient_id.name,
                        appointment.doctor_id.name,
                        appointment.date,
                        appointment.time
                    ),
                });
            } catch (_) { }
        }
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @PATCH /api/appointments/:id/cancel — patient cancels
router.patch('/:id/cancel', protect, authorize('patient'), async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        if (appointment.patient_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        appointment.status = 'cancelled';
        await appointment.save();
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
