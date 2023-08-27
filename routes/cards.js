const cardRouter = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getCards, createCard, deleteCard,
  likeCard, dislikeCard,
} = require('../controllers/cards');

// возвращает все карточки
cardRouter.get('/', auth, getCards);
// создает карточку по _id
cardRouter.post('/', auth, createCard);
// удаляет карточку
cardRouter.delete('/:cardId', auth, deleteCard);
// поставить лайк
cardRouter.put('/:cardId/likes', auth, likeCard);
// убрать лайк
cardRouter.delete('/:cardId/likes', auth, dislikeCard);

module.exports = cardRouter;
