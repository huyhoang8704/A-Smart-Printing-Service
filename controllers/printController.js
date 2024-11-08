const printService = require("../services/printService")
async function printHandler(req, res) 
{
    console.log(req.file);
    console.log(req.user);
    console.log(req.body)
    
     
    const result = await printService.printRequest({...req.body, userId: req.user.id}, req.file)
    res.send(result)
}

exports.printHandler = printHandler;    