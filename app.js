/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const signinRouter = require('./routes/signin');
const signupRouter = require('./routes/signup');

const { PORT = 3000, BASE_PATH = 'localhost' } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('База данных подключена.'))
  .catch((err) => console.log('DB error', err));

app.use(errors());

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('/', signupRouter);
app.use('/', signinRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемая страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`Сервер подключен — http://${BASE_PATH}:${PORT}`);
});
