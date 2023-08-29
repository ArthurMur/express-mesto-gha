const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const reg = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const {
  getUserList, getUserId, updateUserAvatar,
  updateUserData, getMe,
} = require('../controllers/users');

// возвращает всех пользователей
userRouter.get('/', auth, getUserList);
// возвращает информацию о текущем пользователе
userRouter.get('/me', auth, getMe);
// обновляет профиль
userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  auth,
  updateUserData,
);
// обновляет аватар
userRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi
        .string()
        .pattern(reg),
    }),
  }),
  auth,
  updateUserAvatar,
);
// возвращает пользователя по _id
userRouter.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24).hex().required(),
    }),
  }),
  auth,
  getUserId,
);

module.exports = userRouter;
