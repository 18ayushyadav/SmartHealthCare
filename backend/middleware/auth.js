const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (decoded.role === 'patient') {
                req.user = await Patient.findById(decoded.id).select('-password');
            } else if (decoded.role === 'doctor') {
                req.user = await Doctor.findById(decoded.id).select('-password');
            } else if (decoded.role === 'admin') {
                req.user = await Admin.findById(decoded.id).select('-password');
            }

            req.user.role = decoded.role;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Role '${req.user.role}' is not authorized` });
        }
        next();
    };
};

module.exports = { protect, authorize };
