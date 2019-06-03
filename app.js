require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cors = require("cors");

var app = express();

mongoose.connection.on("connected", () =>
  console.log(`Mongoose connected to ${process.env.DBURL}`)
);
mongoose.connection.on("disconnected", () =>
  console.log(`Mongoose disconnected from ${process.env.DBURL}.`)
);
mongoose.connect(process.env.DBURL);

var loginService = require("./services/login");
var passport = require("./passport");
var usersService = require("./services/users");
var eventService = require("./services/events");
var programService = require("./services/programs");


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use( cors() );

app.use("/api/login", loginService);
app.use("/api/users", usersService);
app.use("/api/programs", programService);

app.use(passport.initialize());
app.use(
  "/api/",
  passport.authenticate("jwt", {
    session: false,
    failWithError: true
  })
);

app.use("/api/events", eventService);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  if (req.app.get("env") === "development") res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.json(res.locals);
});

async function shutdown(callback) {
  await mongoose.disconnect();
  if (callback) callback();
  else process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.once("SIGUSR2", () => {
  shutdown(() => process.kill(process.pid, "SIGUSR2"));
});

module.exports = app;