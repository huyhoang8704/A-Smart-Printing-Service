const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const { getCurrentDefaultPageNum } = require("../services/systemConfigService");
const systemConfService = require("../services/systemConfigService.js");
const sendMail = require("../utils/sendMail.js");
const { generateRandomPassword, getHashedPassword } = require("../utils/password.js");
const userService = require("../services/userService.js");
const sequelize = require("../config/mysql.database.js");
dotenv.config();

const COOKIE_OPTION = {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    path: "/",
};

const register = async (req, res) => {
    try {
        const { fullName, email, password, role, uniId } = req.body;

        // Check existing email
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã được sử dụng." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        let currentSemConfig = await systemConfService.getCurrentSemesterConfig();
        console.log(currentSemConfig.quarter);

        const newUser = await User.create({
            id: uuidv4(), // Random ID
            fullName,
            email,
            numberPage: await getCurrentDefaultPageNum(),
            lastSemPaperReceive: currentSemConfig.quarter,
            uniId,
            password: hashedPassword,
            role: role || "student",
        });

        // Create JWT token
        const token = jwt.sign(
            {
                id: newUser.id,
                fullName: newUser.fullName,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Save MySQL
        newUser.token = token;
        await newUser.save();

        // Set cookie
        res.cookie("token", token, COOKIE_OPTION);

        res.status(201).json({
            message: "Đăng ký thành công!",
            user: {
                id: newUser.id,
                fullName: newUser.fullName,
                email: newUser.email,
                role: newUser.role,
                uniId: newUser.uniId,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: "Có lỗi xảy ra.", error: error.message });
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        // Check Email
        if (!user) {
            return res.status(400).json({ message: "Email đăng nhập không chính xác." });
        }
        // Check Password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Sai mật khẩu." });
        }

        //TODO: check and issue default paper for user
        const transaction = await sequelize.transaction();

        try {
            let currentConfig = await systemConfService.getCurrentSemesterConfig();
            // if this user does not receive pages this semester, then issue it
            if (user.lastSemPaperReceive !== currentConfig.quarter) {
                await user.increment("numberPage", {
                    by: await systemConfService.getCurrentDefaultPageNum(),
                    transaction: transaction,
                });

                await user.update(
                    { lastSemPaperReceive: currentConfig.quarter },
                    {
                        transaction: transaction,
                    }
                );
                await transaction.commit();
            }
        } catch (error) {
            await transaction.rollback();
            console.log("cannot set current semesterconfig");
        }

        // Create JWT token
        const token = jwt.sign(
            {
                id: user.id,
                fullName: user.fullName,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        // Save JWT token
        user.token = token;
        await user.save();
        // Set cookie
        // res.cookie("token", token, COOKIE_OPTION);

        res.status(200).json({
            message: "Đăng nhập thành công!",
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                uniId: user.uniId,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ status: "failed", message: "Có lỗi xảy ra.", error: error.message });
    }
};
const getUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByPk(userId, {
            attributes: ["id", "fullName", "email", "role", "numberPage", "uniId"], // Chỉ lấy các trường cần thiết
        });

        if (!user) {
            return res.status(404).json({ status: "failed", message: "Người dùng không tồn tại." });
        }

        res.status(200).json({
            status: "success",
            message: "Lấy thông tin người dùng thành công!",
            user,
        });
    } catch (error) {
        res.status(500).json({ status: "failed", message: "Có lỗi xảy ra.", error: error.message });
    }
};
const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Đăng xuất thành công!" });
};

const forgetPassword = async (req, res) => {
    if (!req.body.email) {
        res.status(400).json({
            status: "failed",
            message: "Vui lòng điền email của bạn.",
        });
        return;
    }

    try {
        const user = await User.findOne({ where: { email: req.body.email } });

        if (!user) {
            res.status(400).json({
                status: "failed",
                message: "Email không tồn tại.",
            });
            return;
        }
        let dummyPassword = generateRandomPassword(); // generate a dummy password
        let hashedPassword = await getHashedPassword(dummyPassword);
        await user.update({ password: hashedPassword }); // update that new password to database

        const subject = "Khôi phục mật khẩu";
        const text = `${dummyPassword}`;
        await sendMail(req.body.email, subject, text);

        res.json({
            status: "success",
            message: "Đã gửi mật khẩu thành công",
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            status: "failed",
            message: "Có lỗi xảy ra, vui lòng thử lại sau.",
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const response = await userService.changeUserPassword(req.body);
        res.send(response);
    } catch (error) {
        res.status(error.status).send({ status: "failed", error: error.message });
    }
};

module.exports = {
    register,
    login,
    getUser,
    logout,
    forgetPassword,
    changePassword,
};
