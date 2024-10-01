const User = require("../models/User");

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

    async updateUser(id, updates) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error("User not found");
        }
        return await user.update(updates);
    }
}

module.exports = new UserService();
