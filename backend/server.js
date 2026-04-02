const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => res.json({ message: 'MediConnect API is running!' }));
app.get('/seed', async (req, res) => {
    const bcrypt = require('bcryptjs');
    const Admin = require('./models/Admin');
    try {
        let admin = await Admin.findOne({ email: 'admin@mediconnect.com' });
        if (!admin) {
            const hashed = await bcrypt.hash('admin123', 12);
            admin = await Admin.create({
                username: 'admin',
                email: 'admin@mediconnect.com',
                password: 'admin123' // Mongoose pre-save hook will hash it since we fixed it
            });
            return res.json({ message: '✅ Admin created!' });
        }
        res.json({ message: '✅ Admin already exists' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Global error handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 MediConnect Server running on http://localhost:${PORT}`);
});
