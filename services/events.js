var express = require("express");
var router = express.Router();
var Event = require('../models/event');
var User = require('../models/user');
var mongoose = require('mongoose');

// Create and Save a new Event
router.post("/", (req, res, next) => {
  // Validate request
  if (!req.body.eventName) {
    return res.status(400).send({
      message: "Event name can not be empty"
    });
  } else if (!req.body.startDate) {
    return res.status(400).send({
      message: "Start Date can not be empty"
    });
  } else if (!req.body.endDate) {
    return res.status(400).send({
      message: "End Date can not be empty"
    });
  } else if (!req.body.organizedBy) {
    return res.status(400).send({
      message: "Organizer can not be empty"
    });
  }
  var id = mongoose.Types.ObjectId(req.body.organizedBy.id);
  User.findById(id)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "User not found with id " + req.body.organizedBy.id
        });
      } else {
        // Create a Event
        const event = new Event({
          eventName: req.body.eventName,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          organizedBy: req.body.organizedBy
        });

        // Save Event in the database
        event.save()
          .then(data => {
            res.status(201).send(data);
          }).catch(err => {
            res.status(500).send({
              message: err.message || "Some error occurred while creating the Event."
            });
          });
      }
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving the User."
      });
    });


});

// Post an Event identified by the eventId in the request
router.put("/:eventId/approveOrReject/:userId", (req, res, next) => {
  // Validate request
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
        // Find event and update it with the request body
        Event.findByIdAndUpdate(req.params.eventId, {
            posted: req.body.posted
          }, {
            new: true
          })
          .then(event => {
            if (!event) {
              return res.status(404).send({
                message: "Event not found with id " + req.params.eventId
              });
            }
            res.send();
          }).catch(err => {
            if (err.kind === 'ObjectId') {
              return res.status(404).send({
                message: "Event not found with id " + req.params.eventId
              });
            }
            return res.status(500).send({
              message: "Error updating Event with id " + req.params.eventId
            });
          });
      }
    });
});

// Add event attendees to an Event identified by the eventId in the request
router.put("/:eventId/attendee/:userId", (req, res, next) => {
  // Validate request
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
        var uId = mongoose.Types.ObjectId(req.body.userId);
        User.findById(uId)
          .then(user => {
            if (!user) {
              return res.status(404).send({
                message: "User not found with id " + uId
              });
            } else if (user.userType != 'Administrator') {
              return res.status(401).send({
                message: "Unauthorized User"
              });
            } else {
              // Find event and update it with the request body
              Event.findByIdAndUpdate(req.params.eventId, {
                  $push: {
                    attendedBy: {
                      id: uId
                    }
                  }

                }, {
                  new: true
                })
                .then(event => {
                  if (!event) {
                    return res.status(404).send({
                      message: "Event not found with id " + req.params.eventId
                    });
                  } else if (event.posted == false) {
                    return res.status(404).send({
                      message: "Event with id " + req.params.eventId + " is not posted"
                    });
                  }
                  res.send();
                }).catch(err => {
                  // console.log(err);
                  return res.status(500).send({
                    // message: "Error updating Event with id " + req.params.eventId
                    message: err
                  });
                });
            }
          });
      }
    });
});

// Find all attendees for an event
router.get("/:eventId/attendees/:userId", (req, res, next) => {
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
        Event.findById(req.params.eventId)
          .then(event => {
            if (!event) {
              return res.status(404).send({
                message: "Event not found with id " + req.params.eventId
              });
            }
            var response = [];
            event.attendedBy.forEach(attendedBy => {
              response.push(attendedBy.id);
            });
            res.send(response);
          }).catch(err => {
            if (err.kind === 'ObjectId') {
              return res.status(404).send({
                message: "Event not found with id " + req.params.eventId
              });
            }
            return res.status(500).send({
              message: "Internal Server Error occured for Event with id " + req.params.eventId
            });
          });
      }
    });
});

module.exports = router;
