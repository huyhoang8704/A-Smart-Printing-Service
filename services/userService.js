// LEGACY
const User = require("../models/User");
var createError = require("http-errors");
const bcrypt = require("bcryptjs");
const { getHashedPassword } = require("../utils/password");
const { Op } = require("sequelize");
class UserService {
    async createUser(username, password, name) {
        console.log("Creating user");
        return await User.create({ username, password, name });
    }

    async getUserById(id) {
        return await User.findByPk(id);
    }

    async getUserByName(name) {
        return await User.findOne({ where: { name } });
    }

    async getUserByUniId(uniId) {
        return await User.findOne({ where: { uniId: uniId } });
    }

    async getUsersByUniIdRegex(regex) {
        return await User.findAll({ where: { uniId: { [Op.like]: `%${regex}%` } } });
    }

    async updateUser(id, updates) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error("User not found");
        }
        return await user.update(updates);
    }

    async getUserByEmail(email) {
        try {
            return await User.findOne({
                where: {
                    email: email,
                },
            });
        } catch (error) {
            error.status = 400;
            throw error;
        }
    }

    async changeUserPassword(data) {
        let { email, oldPassword, newPassword } = data;
        if (!email) {
            let error = createError(400, "Email is required");
            throw error;
        }
        if (!oldPassword) {
            let error = createError(400, "oldPassword is required");
            throw error;
        }
        if (!newPassword) {
            let error = createError(400, "newPassword is required");
            throw error;
        }

        try {
            const user = await this.getUserByEmail(email);
            if (user) {
                let isPassCorrect = await bcrypt.compare(oldPassword, user.password);
                console.log(isPassCorrect);

                if (isPassCorrect) {
                    let newPasswordHashed = await getHashedPassword(newPassword);
                    try {
                        await user.update({ password: newPasswordHashed });
                        return { status: "success", message: `Đổi mật khẩu cho tài khoản ${email} thành công!` };
                    } catch (error) {
                        let httpErr = createError(500, error.message);
                        throw httpErr;
                    }
                } else {
                    let error = createError(403, "Wrong password");
                    throw error;
                }
            } else {
                let error = createError(400, "Email does not exist");
                throw error;
            }
        } catch (error) {
            if (error.status && error.message) {
                throw error; // Keeps the original error intact
            }
            let httpErr = createError(500, error.message);
            throw httpErr;
        }
    }
}

module.exports = new UserService();
