const userRouter = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUserList, getUserId, updateUserAvatar,
  updateUserData, getMe,
} = require('../controllers/users');

// возвращает всех пользователей
userRouter.get('/', auth, getUserList);
// возвращает пользователя по _id
userRouter.get('/:userId', auth, getUserId);
// обновляет профиль
userRouter.patch('/me', auth, updateUserData);
// обновляет аватар
userRouter.patch('/me/avatar', auth, updateUserAvatar);
// возвращает информацию о текущем пользователе
userRouter.get('/me', auth, getMe);

module.exports = userRouter;
