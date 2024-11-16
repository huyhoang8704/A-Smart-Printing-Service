// Author: THAI
const { Op } = require("sequelize");
const sequelize = require("../config/mysql.database");
const { PermittedFileType } = require("../models/PermittedFileType");
const { SystemConfig } = require("../models/SystemConfig");
const { MIME_MAPPING, getTypeExtension } = require("../utils/mimeMapping");

async function getAllSystemConfigs() {
    try {
        const response = await SystemConfig.findAll({
            attributes: ["id", "year", "quarter", "defaultNoPages", "startDate", "endDate"],
        });
        return { status: "success", data: response };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getSystemConfig(id) {
    try {
        const response = await SystemConfig.findOne({
            where: {
                id: id,
            },
            include: [
                {
                    model: PermittedFileType,
                    as: "permittedFileTypes",
                    required: true,
                },
            ],
        });
        return { status: "success", data: response };
    } catch (error) {
        console.log(error);
        return { status: "failed", error };
    }
}

async function updateSystemConfig(id, data) {
    let { permittedFileTypes, defaultNoPages, renewDate } = data;
    console.log(data);

    permittedFileTypes = JSON.parse(permittedFileTypes);

    const transaction = await sequelize.transaction();
    try {
        await SystemConfig.update(
            {
                defaultNoPages: defaultNoPages,
                renewDate: renewDate,
            },
            { where: { id: id }, transaction: transaction }
        );

        if (permittedFileTypes && permittedFileTypes.length > 0) {
            // delete all the old values
            await PermittedFileType.destroy({
                where: {
                    configId: id,
                },
                transaction: transaction,
            });
            // add new values
            const createPromises = permittedFileTypes.map((type) => {
                if(getTypeExtension(type)) // if the mime type exist in the valid list then create
                {
                    return PermittedFileType.create(
                        {
                            fileType: type,
                            configId: id,
                        },
                        { transaction: transaction }
                    );
                }
            });
            await Promise.all(createPromises);
        }
        await transaction.commit(); // commit the transaction

        const getResponse = await getSystemConfig(id);
        return getResponse;
    } catch (error) {
        console.log(error);
        await transaction.rollback(); // rollback if there's error
        return { status: "failed", error };
    }
}

async function addPermittedFileType(id, data) {
    const { fileType } = data;
    try {
        const response = await PermittedFileType.create({
            configId: id,
            fileType: fileType,
        });
        return { status: "success", data: response };
    } catch (error) {
        console.log(error);
        return { status: "failed", error };
    }
}

async function deletePermittedFileType(id, fileType) {
    try {
        const response = await PermittedFileType.destroy({
            where: {
                configId: id,
                fileType: fileType,
            },
        });
        return { status: "success", data: `Delete ${response} rows successfully` };
    } catch (error) {
        console.log(error);
        return { status: "failed", error };
    }
}

async function getPermittedFileTypes() {
    try {
        const systemConfig = await SystemConfig.findOne({
            where: {
                [Op.and]: [
                    { startDate: { [Op.lte]: new Date(Date.now()) } },
                    { endDate: { [Op.gte]: new Date(Date.now()) } },
                ],
            },

            include: [
                {
                    model: PermittedFileType,
                    as: "permittedFileTypes",
                },
            ],
        });
        const types =
            systemConfig.permittedFileTypes.length > 0 &&
            systemConfig.permittedFileTypes.map((type) => {
                return { ...type.toJSON(), extension: getTypeExtension(type.fileType) };
            });
        return {
            permittedFileTypes: types,
            year: systemConfig.year,
            quarter: systemConfig.quarter,
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getCurrentDefaultPageNum() {
    const systemConfig = await SystemConfig.findOne({
        where: {
            [Op.and]: [
                { startDate: { [Op.lte]: new Date(Date.now()) } },
                { endDate: { [Op.gte]: new Date(Date.now()) } },
            ],
        },
    });
    return systemConfig?.defaultNoPages || 0;
}

function getAllPossibleFileTypes() {
    return MIME_MAPPING;
}

exports.getSystemConfig = getSystemConfig;
exports.updateSystemConfig = updateSystemConfig;
exports.addPermittedFileType = addPermittedFileType;
exports.deletePermittedFileType = deletePermittedFileType;
exports.getPermittedFileTypes = getPermittedFileTypes;
exports.getAllPossibleFileTypes = getAllPossibleFileTypes;
exports.getCurrentDefaultPageNum = getCurrentDefaultPageNum;
exports.getAllSystemConfigs = getAllSystemConfigs;
