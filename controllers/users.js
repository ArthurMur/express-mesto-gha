/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable consistent-return */
// eslint-disable-next-line import/no-unresolved
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const { JWT_SECRET = 'JWT_SECRET' } = process.env;

// классы с ответами об ошибках
const RequestError = require('../errors/requestError'); // 400
const AuthorizationError = require('../errors/authorizationError'); // 401
const NotFoundError = require('../errors/notFoundError'); // 404
const EmailExistenceError = require('../errors/emailExistenceError'); // 409

// возвращает информацию о текущем пользователе
const getMe = (req, res, next) => {
  const { _id } = req.user;
  User.find({ _id })
    .then((user) => {
      if (user) return res.status(200).send(...user);
    })
    .catch(next);
};

// Получение списка пользователей
const getUserList = (req, res, next) => {
  User.find({})
    .then((userList) => res.status(200).send({ data: userList }))
    .catch(next);
};

// Получение пользователя по ID
const getUserId = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((selectedUser) => {
      if (!selectedUser) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send({ data: selectedUser });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Некорректный Id пользователя'));
      }
      return next(err);
    });
};

// Создание пользователя (Регистрация)
const registerUser = (req, res, next) => {
  const { email, password } = req.body; // обязательные поля
  const { name, about, avatar } = req.body; // необязательные

  if (!email || !password) {
    throw new RequestError('Все поля должны быть заполнены');
  }
  bcrypt.hash(password, 10, (error, hash) => {
    User.findOne({ email }).select('+password')
      .then((user) => {
        if (user) {
          throw new EmailExistenceError('Даный email уже зарегистрирован');
        }
        return User.create({
          name, about, avatar, email, password: hash,
        });
      })
      .then(() => {
        res
          .status(201)
          .send({
            name, about, avatar, email,
          });
      })
      .catch((err) => next(err));
  });
};

// Обновление аватара пользователя
const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Переданы некорректные данные'));
      } else {
        return next(err);
      }
    });
};

// Обновление профиля пользователя
const updateUserData = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((updatedData) => res.status(200).send({ data: updatedData }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Переданы некорректные данные пользователя'));
      } else {
        return next(err);
      }
    });
};

// Проверка почты и пароля
const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
      });
      res.send({ token });
    })
    .catch(() => {
      throw new AuthorizationError('Ошибка аутентификации');
    });
};

module.exports = {
  getUserList,
  getUserId,
  registerUser,
  updateUserAvatar,
  updateUserData,
  login,
  getMe,
};
