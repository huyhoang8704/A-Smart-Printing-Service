var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var multer = require("multer");
const sequelize = require("./config/mysql.database");
const { SystemConfig } = require("./models/SystemConfig");
const { PermittedFileType } = require("./models/PermittedFileType");
const { PaperBoughtHistory } = require("./models/PaperBoughtHistory");
const { Printer } = require("./models/Printer");
const { PrintingLog } = require("./models/PrintingLog");
const { SPSO } = require("./models/SPSO");
const { File } = require("./models/File");
const { SelectedPrintPage } = require("./models/SelectedPrintPage");

require("./models/associations");
require("dotenv").config();
var cors = require("cors");
var upload = multer();
var printerRouter = require("./routes/printerRoute");
var systemConfigRouter = require("./routes/systemConfigRoute");
var userRouter = require("./routes/userRoute");
var systemConfigRouter = require("./routes/systemConfigRoute");
const reportRouter = require("./routes/reportRoute");
var logRoute = require("./routes/logRoute");
var printRouter = require("./routes/printRoute");
var pageRouter = require("./routes/pageBoughtRoute");
var app = express();

upload.single("file");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// app.use(upload.none()); // parse multipart/form-data
app.use(upload.single("file"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use("/printers", printerRouter);
app.use("/system-config", systemConfigRouter);
app.use("/users", userRouter);
app.use("/report", reportRouter);
app.use("/logs", logRoute);
app.use("/print", printRouter);
app.use("/page", pageRouter);
app.use("/admin", SPSORouter);

// app.post("/fake", (req, res) => {
//     res.send("ok")
// })
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

sequelize
    .authenticate()
    .then(() => {
        console.log("Database synchronized");
        app.listen(3001, () => {
            console.log("Server running at port 3001");
        });
    })
    .catch((error) => {
        console.error("Unable to synchronize the database:", error);
    });
// module.exports = app;
