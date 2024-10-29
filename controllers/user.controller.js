const UserService = require('../services/userService');


const register = async (req, res) => {
    try {
        const { fullName , username, password , role } = req.body;
        res.json({
            code : 200,
            message : "Success!",
            data : req.body
        })
    } catch (error) {
        res.json({
            code : 400,
            message : "Error!",
            error : error
        })
    } 
}



module.exports = {
    register,
}