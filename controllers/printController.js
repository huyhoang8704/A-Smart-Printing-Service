const printService = require("../services/printService");
async function printHandler(req, res) {
    console.log(req.file);
    console.log(req.user);
    console.log(req.body);

    try {
        const result = await printService.printRequest({ ...req.body, userId: req.user.id }, req.file);
        res.send(result);
    } catch (error) {
        res.status(error.status).send({ status: "failed", msg: error.message });
    }
}

exports.printHandler = printHandler;
