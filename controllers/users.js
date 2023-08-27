/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable consistent-return */
// eslint-disable-next-line import/no-unresolved
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

// возвращает информацию о текущем пользователе
const getMe = (req, res) => {
  const { _id } = req.params;
  User.find(_id)
    .then((user) => {
      if (user) return res.status(200).send({ user });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Получение списка пользователей
const getUserList = (req, res, next) => {
  User.find({})
    .then((userList) => res.status(200).send({ data: userList }))
    .catch(next);
};

// Получение пользователя по ID
const getUserId = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((selectedUser) => {
      if (!selectedUser) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      res.status(200).send({ data: selectedUser });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Неверный ID' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

// Создание пользователя (Регистрация)
const registerUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      message: 'Заполните все обязательные поля (почта и пароль)',
    });
  }
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(409).send({
          message: 'Пользователь с таким электронным адресом уже зарегистрирован',
        });
      }
      bcrypt
        .hash(password, 10)
        .then((hash) => User.create({
          name, about, avatar, email, password: hash,
        })
          .then((user) => res.status(201).send({ data: user }))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              return res.status(400).send({
                message: 'Переданы некорректные данные в метод создания пользователя',
              });
            }
            return res.status(500).json({ message: 'Не удалось создать пользователя', err });
          })
          .catch((err) => res.status(500).json({ message: 'Не удалось проверить существующих пользователей', err })));
    });
};

// Обновление аватара пользователя
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((updatedAvatar) => res.status(200).send({ data: updatedAvatar }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

// Обновление профиля пользователя
const updateUserData = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((updatedData) => res.status(200).send({ data: updatedData }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(500).send({ message: err.message });
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
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
      });
      res.send({ token });
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
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
