/* POST BODY
    printerId string
    userId string
    noOfCopies int
    printPages: []
    filename string
    filesize float
*/

/*
 'text/csv',
 'application/pdf',
 */

const createHttpError = require("http-errors");
const sequelize = require("../config/mysql.database");
const { File } = require("../models/File");
const { PrintingLog } = require("../models/PrintingLog");
const { SelectedPrintPage } = require("../models/SelectedPrintPage");
const User = require("../models/User");
const { formatDateTimeForDB } = require("../utils/dateFormat");
const { generateUUIDV4 } = require("../utils/idManager");
const userService = require("./userService");
const { default: axios } = require("axios");
require("dotenv").config();
// [1,2] double sided

function pagesCalculator(printPages, pageSize, printOption, noOfCopies) {
    if (pageSize === "A3") {
        if (printOption === "double-sided") {
            console.log("length", printPages.length);

            return printPages.length * noOfCopies;
        } else {
            return printPages.length * 2 * noOfCopies;
        }
    } else {
        if (printOption === "double-sided") {
            return Math.round(printPages.length / 2) * noOfCopies;
        } else {
            return printPages.length * noOfCopies;
        }
    }
}

async function printRequest(data, file) {
    let { printerId, userId, noOfCopies, printPages, printOption = "double-sided", pageSize = "A4" } = data;
    if (!printerId) {
        throw createHttpError(400, "printerId is required");
    }
    if (!userId) {
        throw createHttpError(400, "userId is required");
    }
    if (!file) {
        throw createHttpError(400, "No file is selected");
    }
    if (!printPages || printPages.length === 0) {
        throw createHttpError(400, "No pages are selected");
    }
    printPages = JSON.parse(printPages); // parse array
    noOfCopies = parseInt(noOfCopies); // convert noOfCopies to Number
    let pages = pagesCalculator(printPages, pageSize, printOption, noOfCopies); // pages in a4 quantity
    // console.log("pages", pages);

    const transaction = await sequelize.transaction();
    try {
        const user = await userService.getUserById(userId);
        if (user.numberPage >= pages) {
            // minus used pages
            await User.update(
                {
                    numberPage: user.numberPage - pages,
                },
                {
                    where: {
                        id: userId,
                    },
                    transaction,
                }
            );

            const newFile = await File.create(
                {
                    // create new file
                    id: generateUUIDV4(),
                    fileName: decodeURIComponent(file.originalname),
                    fileType: file.mimetype,
                    noOfPages: 100,
                    userId: userId,
                },
                {
                    transaction,
                }
            );
            // console.log("newFileID", newFile.id);
            let logId = generateUUIDV4();
            const newLog = await PrintingLog.create(
                {
                    // create new log
                    id: logId,
                    userId,
                    fileId: newFile.id,
                    printerId,
                    noOfCopies,
                    printOption,
                    pageSize,
                    pages,
                    startTime: formatDateTimeForDB(new Date(Date.now())),
                },
                {
                    transaction,
                }
            );
            // console.log("newLogId", newLog.id);

            const selectedPages = await SelectedPrintPage.bulkCreate(
                // create new selectedPage
                printPages.map((page) => ({
                    pageNumber: page,
                    fileId: newFile.id,
                    printLogId: newLog.id,
                })),
                {
                    transaction,
                }
            );

            await transaction.commit();

            // mock up update print log
            setTimeout(async () => {
                const body = {
                    action: "finish",
                };
                await axios.patch(`${process.env.SERVER_URL}/logs/${logId}`, body);
            }, pages * 1000);
            return { status: "success", msg: "Successfully" };
        } else {
            throw createHttpError(403, "User does not have enough pages");
        }
    } catch (error) {
        console.log(error);
        if (error.status) throw error;
        await transaction.rollback();
        throw createHttpError(500, error.message);
    }
}

exports.printRequest = printRequest;
