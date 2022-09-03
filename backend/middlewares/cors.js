const cors = require('cors');

const allowedCors = [
  'https://stdem11.nomoredomains.sbs',
  'http://stdem11.nomoredomains.sbs',
];

const corsOption = {
  origin: allowedCors,
  credentials: true,
};

module.exports = cors(corsOption);
