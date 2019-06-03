'use strict';

const mongoose = require('mongoose');
const User = require('../models/user');
const Program = require('../models/program');
const Event = require('../models/event');
const bcrypt = require('bcrypt');

async function run() {

  /* **********Answer 1*************
   * 
   * Creating connection to database
   * 
   * *******************************/
  await mongoose.connect('mongodb://localhost/SciCafeHW4');

  /* *********************Answer 2***************************
   * 
   * Removing data from Users and Events from database if any
   * 
   * *******************************************************/
  await User.remove();
  await Program.remove();
  await Event.remove();

  /* ************************
   * Objects for new user
   * John Doe 
   * Jane Doe
   * ***********************/ 
  const passhash = bcrypt.hashSync('abcd', 10);
  let user1 = new User({
    _id : mongoose.Types.ObjectId('56955ca46063c5600627f392'),
    firstName: 'John',
    lastName: 'Doe',
    email: 'jdoe1@localhost',
    username: 'jdoe',
    password: passhash
  });

  let user2 = new User({
    _id : mongoose.Types.ObjectId('56955ca46063c5600627f393'),
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jdoe2@localhost',
    username: 'jdoe2',
    password: passhash,
    userType: 'Administrator'
  });

  let user3 = new User({
    _id : mongoose.Types.ObjectId('56955ca46063c5600627f398'),
    firstName: 'Shivam',
    lastName: 'Kapoor',
    email: 'skapoor@localhost',
    username: 'skapoor2',
    password: passhash,
    userType: 'Administrator'
  });

  
  /* **********Answer 3*************
   * 
   * Inserting two users
   * John Doe
   * Jane Doe
   *  
   * *******************************/
  let savedUser1 = await user1.save();

  let savedUser2 = await user2.save();

  await user3.save();


  let program1 = new Program({
    _id : mongoose.Types.ObjectId('56955ca46063c5600627f394'),
    programName: "LSAMP",
    programFullName: "LSAMP",
    programDescription: "CSULA LSAMP"
  });

  let program2 = new Program({
    _id : mongoose.Types.ObjectId('56955ca46063c5600627f395'),
    programName: "ROBOTICS",
    programFullName: "ROBOTICS",
    programDescription: "CSULA ROBOTICS WORKSHOP"
  });

  await program1.save();
  await program2.save();

  /* **********Answer 4*************
   * 
   * Objects for two events
   * SciCafe1
   * SciCafe2
   * 
   * Both events held on 11/1/2018
   *  
   * *******************************/
  let event1 = new Event({
    _id : mongoose.Types.ObjectId('56955ca46063c5600627f396'),
    eventName: 'SciCafe1',
    startDate: new Date(2018, 10, 1), // startDate 11/1/2018
    endDate: new Date(2018, 10, 1), // endDate 11/1/2018
    /*******************
     * 
     * organizedBy John
     * 
     ******************/
    organizedBy: {
        id: savedUser1._id
    },

    /********************
     * 
     * attendedBy Jane
     * 
     *******************/
    attendedBy: [{
        id: savedUser2._id
    }]
  });

  let event2 = new Event({
    _id : mongoose.Types.ObjectId('56955ca46063c5600627f397'),
    eventName: 'SciCafe2',
    startDate: new Date(2018, 10, 1), // startDate 11/1/2018
    endDate: new Date(2018, 10, 1), // endDate 11/1/2018
    /********************
     * 
     * organizedBy Jane
     * 
     *******************/
    organizedBy: {
        id: mongoose.Types.ObjectId(savedUser2._id)
    },

    /********************
     * 
     * attendedBy John
     * 
     *******************/
    attendedBy: [{
        id: mongoose.Types.ObjectId(savedUser1._id)
    },{
      id: mongoose.Types.ObjectId(savedUser2._id)
  }],
    posted: true
  });

  /**********************************
   * 
   * Inserting two events in database
   * 
   *********************************/
  await event1.save();

  await event2.save();

   /* **********Answer 6*************
   * 
   * Disconnecting from database
   * 
   * *******************************/
  await mongoose.disconnect();
}

run();