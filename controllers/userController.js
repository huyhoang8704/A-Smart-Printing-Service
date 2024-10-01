const userService = require("../services/userService");
const User = require("../models/User");

class UserController {
    async createUser(req, res) {
        const { id, username, password, name } = req.body;
        try {
            const newUser = User.build({ id, username, password, name });
            // console.log(newUser);
            // Validate the user data
            // const err1 = await newUser.validate();
            // if (err1) {
            //     res.status(400).json({ error: err1 });
            //     return;
            // }

            // Save the user to the database
            await newUser.save();

            res.status(201).json(User);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    async getUser(req, res) {
        try {
            const user = await userService.getUserById(req.params.id);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateUser(req, res) {
        const { id } = req.params;
        const updates = req.body;

        try {
            const updatedUser = await userService.updateUser(id, updates);
            res.status(200).json(updatedUser);
        } catch (error) {
            // Log the error details
            console.error("Update error:", error);

            // Handle not found error
            if (error.message === "User not found") {
                return res.status(404).json({ error: error.message });
            }

            // Handle other errors
            res.status(500).json({ error: error.message });
        }
    }

    // Add more controller methods as needed
}

module.exports = new UserController();
