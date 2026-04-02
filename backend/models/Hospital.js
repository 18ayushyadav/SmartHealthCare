const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    hospital_name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String },
    description: { type: String },
    image: { type: String, default: '' },
    doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }],
    specializations: [String],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema);
