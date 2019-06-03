var express = require("express");
var router = express.Router();
var createError = require("http-errors");
var bcrypt = require("bcrypt");

var User = require("../models/user");

// Create and Save a new User
router.post("/", (req, res, next) => {
  // Validate request
  if(!req.body.email) {
      return res.status(400).send({
          message: "User email can not be empty"
      });
  }else if(!req.body.username) {
      return res.status(400).send({
          message: "Username can not be empty"
      });
  }else if(!req.body.password) {
      return res.status(400).send({
          message: "Password can not be empty"
      });
  }

  const passhash = bcrypt.hashSync(req.body.password, 10);
  // Create a User
  const user = new User({
      firstName: req.body.firstName, 
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      password: passhash,
      userType: req.body.userType
  });

  // Save User in the database
  user.save()
  .then(data => {
      res.status(201).send(data);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while creating the User."
      });
  });
});

module.exports = router;
