const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const User = mongoose.model('User');

router.get('/', (req, res) => {
  User.find().then(data => {
    res.json({
      users: data,
    });
  });
});

router.post('/', (req, res) => {
  if (!validateRequest(req)) {
    res.status(402);
    res.json({ message: 'missing params' });
    return;
  }
  new User(req.body).save().then(addedUser => {
    res.status(201);
    res.json({
      message: 'done',
      user: addedUser,
    });
  });
});

router.put('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    // Update
    user.name = req.body.name;
    user.save().then(updatedUser => {
      res.status(200);
      res.json({
        message: 'done',
        user: updatedUser,
      });
    });
  }
  else {
    // Create user
    new User(req.body).save().then(addedUser => {
      res.status(201);
      res.json({
        message: 'done',
        user: addedUser,
      });
    });
  }
});

router.delete('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.delete();
    res.status(200);
    res.json({
      message: 'User deleted',
      user: user,
    });
  }
  else {
    res.status(404);
    res.json({
      message: 'Not found',
    });
  }

});

function validateRequest(req) {
  const body = req.body;
  if (body.name && body.name != '') {
    return true;
  }
  return false;
}

module.exports = router;
