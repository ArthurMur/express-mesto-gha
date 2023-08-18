const userRouter = require('express').Router();

const {
  getUserList, getUserId, registerUser, updateUserAvatar,
  updateUserData,
} = require('../controllers/users');

// возвращает всех пользователей
userRouter.get('/', getUserList);
// возвращает пользователя по _id
userRouter.get('/:userId', getUserId);
// создаёт пользователя
userRouter.post('/', registerUser);
// обновляет профиль
userRouter.patch('/me', updateUserData);
// обновляет аватар
userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = userRouter;
