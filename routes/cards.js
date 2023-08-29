const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const reg = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const {
  getCards, createCard, deleteCard,
  likeCard, dislikeCard,
} = require('../controllers/cards');

// возвращает все карточки
cardRouter.get('/', auth, getCards);
// создает карточку по _id
cardRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(reg),
    }),
  }),
  auth,
  createCard,
);
// удаляет карточку
cardRouter.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  auth,
  deleteCard,
);
// поставить лайк
cardRouter.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  auth,
  likeCard,
);
// убрать лайк
cardRouter.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  auth,
  dislikeCard,
);

module.exports = cardRouter;
