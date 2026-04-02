/**
 * Run once: node seed.js
 */
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if admin exists
        const db = mongoose.connection.db;
        const admins = db.collection('admins');
        const existing = await admins.findOne({ email: 'admin@mediconnect.com' });
        if (existing) {
            console.log('✅ Admin already exists');
        } else {
            const hashed = await bcrypt.hash('admin123', 12);
            await admins.insertOne({
                username: 'admin',
                email: 'admin@mediconnect.com',
                password: hashed,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log('✅ Admin created!');
            console.log('   Email:    admin@mediconnect.com');
            console.log('   Password: admin123');
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
})();
