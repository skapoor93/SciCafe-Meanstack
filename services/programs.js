var express = require("express");
var router = express.Router();
var Program = require('../models/program');
var User = require("../models/user");
var mongoose = require('mongoose');

// Get all Programs.
router.get("/", (req, res, next) => {
  Program.find()
    .then(programs => {
      res.send(programs);
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving programs."
      });
    });
});

// Find a single Program with a programId
router.get("/:programId", (req, res, next) => {
  Program.findById(req.params.programId)
    .then(program => {
      if (!program) {
        return res.status(404).send({
          message: "Program not found with id " + req.params.programId
        });
      }
      res.send(program);
    }).catch(err => {
      return res.status(500).send({
        message: "Error retrieving program with id " + req.params.programId
      });
    });
});

// Create and Save a new Program
router.post("/:userId", (req, res, next) => {
  // Validate request
  if (!req.body.programName) {
    return res.status(400).send({
      message: "Program name can not be empty"
    });
  } else {
    var id = mongoose.Types.ObjectId(req.params.userId);
    User.findById(id)
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: "User not found with id " + req.params.userId
          });
        } else if (user.userType != 'Administrator') {
          return res.status(401).send({
            message: "Unauthorized User"
          });
        } else {
          // Create a Program
          const program = new Program({
            programName: req.body.programName,
            programFullName: req.body.programFullName,
            programDescription: req.body.programDescription
          });

          // Save Program in the database
          program.save()
            .then(data => {
              res.status(201).send(data);
            }).catch(err => {
              res.status(500).send({
                message: err.message || "Some error occurred while creating the User."
              });
            });
        }
      });
  }
});

// Update a Program identified by the programId in the request
router.put("/:programId/edit/:userId", (req, res, next) => {

  var id = mongoose.Types.ObjectId(req.params.userId);
  User.findById(id)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "User not found with id " + req.params.userId
        });
      } else if (user.userType != 'Administrator') {
        return res.status(401).send({
          message: "Unauthorized User"
        });
      } else {
        // Find program and update it with the request body
        Program.findByIdAndUpdate(req.params.programId, {
            //programName: req.body.programName,
            programFullName: req.body.programFullName,
            programDescription: req.body.programDescription
          }, {
            new: true
          })
          .then(program => {
            if (!program) {
              return res.status(404).send({
                message: "Program not found with id " + req.params.programId
              });
            }
            res.send();
          }).catch(err => {
            if (err.kind === 'ObjectId') {
              return res.status(404).send({
                message: "Program not found with id " + req.params.programId
              });
            }
            return res.status(500).send({
              message: "Error updating program with id " + req.params.programId
            });
          });
      }
    });
});

module.exports = router;
