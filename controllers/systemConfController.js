const systemConfigService = require("../services/systemConfigService");
async function getAllSystemConfigHandler (req, res)
{
    try {
        const response = await systemConfigService.getAllSystemConfigs();
        res.send(response)
    } catch (error) {
        res.status(403).send({status: "failed", error: error.message})
    }
}

async function getSystemConfigHandler(req, res) {
    try {
        const response = await systemConfigService.getSystemConfig(req.params.id);
        res.send(response);
    } catch (error) {
        res.status(400).send({ status: "failed", error: error.message });
    }
}

async function updateSystemConfigHandler(req, res) {
    try {
        const response = await systemConfigService.updateSystemConfig(req.params.id, req.body);
        res.send(response);
    } catch (error) {
        res.status(400).send({ status: "failed", error: error.message });
    }
}

async function deletePermittedFileTypeHandler(req, res) {
    try {
        const response = await systemConfigService.deletePermittedFileType(req.params.id, req.params.fileType);
        res.send(response);
    } catch (error) {
        res.status(400).send({ status: "failed", error: error.message });
    }
}

async function addPermittedFileTypeHandler(req, res) {
    try {
        const response = await systemConfigService.addPermittedFileType(req.params.id, req.body);
        res.status(201).send(response);
    } catch (error) {
        res.status(error.status).send({ status: "failed", error: error.message });
    }
}

async function getPermittedFileTypeHandler(req, res) {
    try {
        const response = await systemConfigService.getPermittedFileTypes();
        res.send({
            status: "success",
            data: response,
        });
    } catch (error) {
        res.status(403).send({ status: "failed", error: error.message });
    }
}

function getAllPossibleFileTypesHandler(req, res) {
    const response = systemConfigService.getAllPossibleFileTypes();
    res.send({ status: "success", data: response });
}

exports.getSystemConfigHandler = getSystemConfigHandler;
exports.updateSystemConfigHandler = updateSystemConfigHandler;
exports.deletePermittedFileTypeHandler = deletePermittedFileTypeHandler;
exports.addPermittedFileTypeHandler = addPermittedFileTypeHandler;
exports.getPermittedFileTypeHandler = getPermittedFileTypeHandler;
exports.getAllPossibleFileTypesHandler = getAllPossibleFileTypesHandler;
exports.getAllSystemConfigHandler = getAllSystemConfigHandler