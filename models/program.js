'use strict';

const mongoose = require('mongoose');

let programSchema = new mongoose.Schema({
  programName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  programFullName: {
    type: String,
    trim: true,
  },
  programDescription:{
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('Program', programSchema);