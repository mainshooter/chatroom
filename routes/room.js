const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const Room = mongoose.model('Room');
const Line = mongoose.model('Line');

router.get('/', (req, res) => {
  Room.find().then(data => {
    res.json({
      rooms: data,
    });
  })
});

router.post('/', (req, res) => {
  if (!validateRequest(req)) {
    res.status(402);
    res.json({ message: 'missing params' });
    return;
  }

  new Room(req.body).save().then(addedRoom => {
    res.status(201);
    res.json({
      message: 'Done',
      room: addedRoom
    });
  });
});

router.put('/:id', async(req, res) => {
  const room = await Room.findById(req.params.id);
  if (room) {
    room.name = req.body.name;
    room.save().then(updatedRoom => {
      res.status(200);
      res.json({
        message: 'Done',
        room: updatedRoom,
      });
    });
  }
  else {
    new Room(req.body).save().then(addedRoom => {
      res.status(201);
      res.json({
        message: 'Done',
        room: addedRoom,
      });
    });
  }
});

router.delete('/:id', async(req, res) => {
  const room = await Room.findById(req.params.id);
  if (room) {
    room.delete();
    res.status(200);
    res.json({
      message: 'Room deleted',
      room: room,
    });
  }
  else {
    res.status(404);
    res.json({
      message: 'Not found',
    });
  }
});

router.get('/:id/lines', async(req, res) => {
  const room = await Room.findById(req.params.id).populate('Line');
  if (room) {
    res.json({
      room: room,
    });
  }
  else {
    res.status(404);
    res.json({
      message: 'Not found',
    });
  }
});
router.post('/:id/lines', async(req, res) => {
  const room = await Room.findById(req.params.id);
  if (room) {
    if (validateLineRequest(req)) {
      new Line(req.body).save().then(newLine => {
        room.lines.push(newLine);
        room.save().then(() => {
          res.status(201);
          res.json({
            message: 'Done',
            line: newLine,
          });
        });
      });
    }
    else {
      res.status(402);
      res.json({
        message: 'Missing params',
      });
    }
  }
  else {
    res.status(404);
    res.json({
      message: 'Not found',
    });
  }
});

function validateLineRequest(req) {
  const body = req.body;
  if (body.message && body.message != '') {
    return true;
  }
  return false;
}

function validateRequest(req) {
  const body = req.body;
  if (body.name && body.name != '') {
    return true;
  }
  return false;
}

module.exports = router;
