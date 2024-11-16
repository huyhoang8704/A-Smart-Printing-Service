const MIME_MAPPING = {
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "application/pdf": ".pdf",
    "application/vnd.ms-powerpoint": ".ppt",
    "text/csv": ".csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
};

function getTypeExtension(mime) {
    return MIME_MAPPING[mime] || "";
}

module.exports = { MIME_MAPPING, getTypeExtension };
