'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let eventSchema = new Schema({
  eventName: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    default: new Date(),
    required: true
  },
  endDate: {
    type: Date,
    default: new Date(),
    required: true
  },
  organizedBy: {
      id: Schema.Types.ObjectId
  },
  attendedBy: [{
    id: Schema.Types.ObjectId
}],
posted: {
    type: Boolean,
    default: false
}
});

module.exports = mongoose.model('events', eventSchema);