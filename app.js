var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var multer = require("multer");
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
var SPSORouter = require("./routes/SPSO");
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
var whitelist = ["http://localhost:3000"];
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};
app.use(cors(corsOptions));

app.use("/printers", printerRouter);
app.use("/system-config", systemConfigRouter);
app.use("/users", userRouter);
app.use("/report", reportRouter);
app.use("/logs", logRoute);
app.use("/print", printRouter);
app.use("/page", pageRouter);
app.use("/admin", SPSORouter);

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

module.exports = app;
