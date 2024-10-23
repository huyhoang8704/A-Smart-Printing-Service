const {v4: uuidv4} = require("uuid")
function generateUUIDV4 ()
{
    return uuidv4();
}

module.exports = {generateUUIDV4}