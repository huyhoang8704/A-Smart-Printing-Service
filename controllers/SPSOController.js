const SPSO = require("../models/SPSO");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");

dotenv.config();

const generateToken = (user) => {
    const token = jwt.sign(
        {
            // id: user.id,
            username: user.username,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
    return token;
};

const register = async (req, res) => {
    try {
        const { username, name, password, role = "SPSO" } = req.body;
        if (!username || !name || !password) {
            return res.status(400).json({
                status: "failed",
                message: `${!username ? "username" : ""} ${!name ? "name" : ""}${
                    !password ? ", password" : ""
                } is required.`,
            });
        }
        const existingUser = await SPSO.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ status: "failed", message: "Email đã tồn tại." });
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
        // res.cookie("token", newSPSO.token, {
        //     maxAge: 24 * 60 * 60 * 1000,
        //     httpOnly: true,
        //     secure: true,
        // });

        res.status(201).json({
            status: "success",
            message: "Đăng ký thành công!",
            user: {
                // id: newSPSO.id,
                name: newSPSO.name,
                role: newSPSO.role,
            },
            token: newSPSO.token,
        });
    } catch (error) {
        res.status(500).json({ status: "failed", message: "Có lỗi xảy ra.", error: error.message });
    }
};
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await SPSO.findOne({ where: { username: username } });
        // Check Email
        if (!user) {
            return res.status(400).json({ status: "failed", message: "Email đăng nhập không chính xác." });
        }
        // Check Password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ status: "failed", message: "Sai mật khẩu." });
        }
        const token = generateToken(user);
        // Save JWT token
        user.token = token;
        await user.save();
        // Set cookie
        // res.cookie("token", token, {
        //     maxAge: 24 * 60 * 60 * 1000,
        //     httpOnly: true,
        //     secure: true,
        // });

        res.status(200).json({
            status: "success",
            message: `Chúc mừng ${user.name} đăng nhập thành công`,
            user: {
                name: user.name,
                role: user.role,
            },
            token: user.token,
        });
    } catch (error) {
        res.status(500).json({ status: "failed", message: "Có lỗi xảy ra.", error: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        console.log(req.user);
        
        const SPSOProfile = await SPSO.findByPk(req.user.username);
        res.send({ status: "success", user: { name: SPSOProfile.name, role: SPSOProfile.role } });
    } catch (error) {
        res.status(403).send({ status: "success", error: error.message});
    }
};

const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Đăng xuất thành công!" });
};

module.exports = {
    register,
    login,
    logout,
    getProfile,
};
