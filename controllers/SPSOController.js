const SPSO = require('../models/SPSO');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const generateToken = (user) =>{
    const token = jwt.sign(
        { 
            // id: user.id,
            username: user.username,
            role : user.role,
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
    );
    return token;
}


const register = async (req, res) => {
    try {
        const { username , name , password , role } = req.body;

        const existingUser = await SPSO.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại.' });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create new user
        const newSPSO = await SPSO.create({
            // id: uuidv4(), // Random ID
            username,
            name,
            password: hashedPassword,
            role: role,
        });
        newSPSO.token = generateToken(newSPSO);
        await newSPSO.save();
    
        // Set cookie
        res.cookie("token", newSPSO.token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,  
            secure: true     
        });
    
        res.status(201).json({
            message: 'Đăng ký thành công!',
            user: {
                // id: newSPSO.id,
                name: newSPSO.name,
            },
            token : newSPSO.token
        });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra.', error: error.message });
    } 
}
const login = async (req, res) => {

}

const logout = async (req, res) => {
    
}

module.exports = {
    register,
    login,
    logout
}