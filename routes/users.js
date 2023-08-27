const userRouter = require('express').Router();

const {
  getUserList, getUserId, updateUserAvatar,
  updateUserData, getMe,
} = require('../controllers/users');

// возвращает всех пользователей
userRouter.get('/', getUserList);
// возвращает пользователя по _id
userRouter.get('/:userId', getUserId);
// обновляет профиль
userRouter.patch('/me', updateUserData);
// обновляет аватар
userRouter.patch('/me/avatar', updateUserAvatar);
// возвращает информацию о текущем пользователе
userRouter.get('/me', getMe);

module.exports = userRouter;
