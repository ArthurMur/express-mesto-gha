const cardRouter = require('express').Router();

const {
  getCards, createCard, deleteCard,
  likeCard, dislikeCard,
} = require('../controllers/cards');

// возвращает все карточки
cardRouter.get('/', getCards);
// создает карточку по _id
cardRouter.post('/', createCard);
// удаляет карточку
cardRouter.delete('/:cardId', deleteCard);
// поставить лайк
cardRouter.put('/:cardId/likes', likeCard);
// убрать лайк
cardRouter.delete('/:cardId/likes', dislikeCard);

module.exports = cardRouter;
