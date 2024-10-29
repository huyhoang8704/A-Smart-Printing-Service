const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

dotenv.config();


const register = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        // Check existing email
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được sử dụng.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            id: uuidv4(), // Random ID
            fullName,
            email,
            password: hashedPassword,
            role: role || 'student',
        });

        // Create JWT token
        const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Save MySQL
        newUser.token = token;
        await newUser.save();

        res.status(201).json({
            message: 'Đăng ký thành công!',
            user: {
                id: newUser.id,
                fullName: newUser.fullName,
                email: newUser.email,
                role: newUser.role,
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra.', error: error.message });
    }
};



module.exports = {
    register,
}