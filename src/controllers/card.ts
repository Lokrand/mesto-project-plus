import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import NoRights from '../errors/no-rights';
import Card from '../models/card';
import NotFoundError from '../errors/not-found-err';

interface SessionRequest extends Request {
  user?: JwtPayload;
}

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((card) => res.send({ data: card }))
  .catch(next);

export const deleteCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
      if (String(card.owner) !== req.user?._id) {
        throw new NoRights('Нет доступа');
      }
      res.status(200).send({ data: card });
    })
    .catch(next);
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  // @ts-expect-error
  await Card.create({ owner: req.user._id, name, link })
    .then((card) => res.status(201).send({ data: card }))
    .catch(next);
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => Card.findByIdAndUpdate(
  req.params.cardId,
  // @ts-expect-error
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Передан несуществующий _id карточки.');
    }
    res.status(200).send({ data: card });
  })
  .catch(next);

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // @ts-expect-error
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      res.status(200).send({ data: card });
    })
    .catch(next);
};
