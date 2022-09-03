require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const router = require('./routes');

const { PORT = 3001 } = process.env;
const DATABASE_URL = 'mongodb://localhost:27017/mestodb';

const app = express();
const limiter = rateLimit({
  windowsMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeader: false,
});

app.use(cors);
app.use(requestLogger);
app.use(helmet());
app.use(limiter);
// app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
mongoose.connect(DATABASE_URL);
app.use('/', router);
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (err) {
    return res.status(statusCode);
  }
  return res.send({
    message: statusCode === 500 ? 'Ошибка сервера' : message,
  })
    .catch(next);
});
// app.use((err, req, res, next) => {
//   const { statusCode = 500, message } = err;
//   res.status(statusCode).send({
//     message: statusCode === 500 ? 'Ошибка сервера' : message,
//   });
//   next();
// });

app.listen(PORT);
