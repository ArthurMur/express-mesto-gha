const User = require('../models/user');

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
    // eslint-disable-next-line consistent-return
    .then((selectedUser) => {
      if (!selectedUser) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      res.status(200).send({ data: selectedUser });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Неверный ID' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

// Создание пользователя (Регистрация)
// eslint-disable-next-line consistent-return
const registerUser = (req, res) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) {
    return res.status(400).send({
      message: 'Не заполнено обязательное поле name, about и/или avatar',
    });
  }

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные в метод создания пользователя',
        });
      }
      return res.status(500).json({ message: 'Не удалось создать пользователя', err });
    });
};

// Обновление аватара пользователя
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  // eslint-disable-next-line no-underscore-dangle
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
  // eslint-disable-next-line no-underscore-dangle
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

module.exports = {
  getUserList,
  getUserId,
  registerUser,
  updateUserAvatar,
  updateUserData,
};
