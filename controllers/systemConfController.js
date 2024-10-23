const systemConfigService = require("../services/systemConfigService")
async function getSystemConfigHandler (req, res) {
    const response = await systemConfigService.getSystemConfig(req.params.id);
    res.send(response)
}

async function updateSystemConfigHandler (req, res) {
    const response = await systemConfigService.updateSystemConfig(req.params.id, req.body);
    res.send(response)
    
}

async function deletePermittedFileTypeHandler (req, res) {
    const response = await systemConfigService.deletePermittedFileType(req.params.id, req.params.fileType);
    res.send(response)
    
}

async function addPermittedFileTypeHandler (req, res) {
    const response = await systemConfigService.addPermittedFileType(req.params.id, req.body);
    res.send(response)
    
}

exports.getSystemConfigHandler = getSystemConfigHandler
exports.updateSystemConfigHandler = updateSystemConfigHandler
exports.deletePermittedFileTypeHandler = deletePermittedFileTypeHandler
exports.addPermittedFileTypeHandler = addPermittedFileTypeHandler