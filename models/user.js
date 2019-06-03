"use strict";

const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    trim: true,
  },
  firstName: String,
  lastName: String,
  userType: {
    type: String,
    trim: true,
    default: 'Regular'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  enabled:{
    type: Boolean,
    default: true
  }
});

userSchema.statics.getUserById = function(id, fieldFilter, callback) {
  return this.findOne({ _id: id }, fieldFilter ? fieldFilter : { password: 0 })

    .exec(callback);
};

userSchema.statics.getUserByUsername = function(
  username,
  fieldFilter,
  callback
) {
  return this.findOne(
    { username: username },
    fieldFilter ? fieldFilter : { password: 0 }
  )

    .exec(callback);
};

userSchema.statics.getUsers = function(fieldFilter, callback) {
  return this.find({}, fieldFilter ? fieldFilter : { password: 0 })

    .exec(callback);
};

userSchema.statics.saveUser = function(user, callback) {
  return user.save(callback);
};

userSchema.statics.search = function(fieldFilter, query, callback) {
  return this.find({ $text: { $search: query } }, fieldFilter ? fieldFilter : { password: 0 })
  .exec(callback);
}

module.exports = mongoose.model("User", userSchema);

