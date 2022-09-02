const cors = require('cors');

const allowedCors = [
  'http://localhost:3000',
];

const corsOption = {
  origin: allowedCors,
  credentials: true,
};

module.exports = cors(corsOption);
