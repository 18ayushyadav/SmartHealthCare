const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const availabilitySlotSchema = new mongoose.Schema({
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
    slots: [{ time: String, isBooked: { type: Boolean, default: false } }],
});

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    specialization: { type: String, required: true },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
    experience: { type: Number, default: 0 },
    bio: { type: String },
    fee: { type: Number, default: 0 },
    phone: { type: String },
    avatar: { type: String, default: '' },
    availability: [availabilitySlotSchema],
    rating: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

doctorSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

doctorSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Doctor', doctorSchema);
