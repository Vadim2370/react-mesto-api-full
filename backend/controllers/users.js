const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthError = require('../errors/UnauthError');
const EmailError = require('../errors/EmailError');

// const JWT_KEY = 'super-strong-secret';

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет такого пользователя');
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет такого пользователя');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверный запрос'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((newUser) => res.status(201).send(
      {
        _id: newUser._id,
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        email: newUser.email,
      },
    ))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неверный запрос'));
      } else if (err.code === 11000) {
        next(new EmailError('Неверный email'));
      } else {
        next(err);
      }
    });
};

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((updateUser) => {
      if (!updateUser) {
        throw new NotFoundError('Нет такого пользователя');
      } else {
        res.send(updateUser);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неверный запрос'));
      } else {
        next(err);
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((updateUser) => {
      if (!updateUser) {
        throw new NotFoundError('Нет такого пользователя');
      } else {
        res.send(updateUser);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неверный запрос'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthError('Неверный пароль или email');
      }
      return Promise.all([user, bcrypt.compare(password, user.password)]);
    })
    .then(([user, isLoggedIn]) => {
      if (!isLoggedIn) {
        throw new UnauthError('Неверный пароль или email');
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ token });
    })
    .catch(next);
};

const logout = (req, res, next) => {
  res.send({ message: 'Выход' })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserInfo,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
  logout,
  JWT_SECRET,
};
