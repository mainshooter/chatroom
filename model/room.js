const mongoose = require('mongoose');

const linesSchema = new mongoose.Schema({
  message: String,
  room: {
    type: mongoose.ObjectId,
    ref: 'Room',
  }
});

mongoose.model('Line', linesSchema);

const roomSchema = new mongoose.Schema({
  name: String,
  lines: [linesSchema]
});

mongoose.model('Room', roomSchema);
