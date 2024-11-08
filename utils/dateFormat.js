function formatDateForDB(date) {
    if (date) {
        let formattedDate = new Date(date);
        formattedDate = `${formattedDate.getFullYear()}-${String(formattedDate.getMonth() + 1).padStart(
            2,
            "0"
        )}-${String(formattedDate.getDate()).padStart(2, "0")}`;
        return formattedDate;
    }
    console.log("Date is");
    return "";
}

function formatDateTimeForDB(date)
{
    if(date)
    {
        return new Date(date).toISOString()
    }
    return ""
}
module.exports = {formatDateForDB, formatDateTimeForDB}