const systemConfigService = require("../services/systemConfigService");
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
        res.send(response);
    } catch (error) {
        res.status(400).send({ status: "failed", error: error.message });
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

exports.getSystemConfigHandler = getSystemConfigHandler;
exports.updateSystemConfigHandler = updateSystemConfigHandler;
exports.deletePermittedFileTypeHandler = deletePermittedFileTypeHandler;
exports.addPermittedFileTypeHandler = addPermittedFileTypeHandler;
exports.getPermittedFileTypeHandler = getPermittedFileTypeHandler;
