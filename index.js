const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/chat', { useNewUrlParser: true, useUnifiedTopology: true });

require('./model/user');
require('./model/room');

const upload = multer();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array())

app.use('/user', require('./routes/user'));
app.use('/room', require('./routes/room'));

app.listen(3000);
