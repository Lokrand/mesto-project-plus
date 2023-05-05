import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import NotFoundError from '../errors/not-found-err';

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => {
    if (users.length === 0) throw new NotFoundError('Пользователи не найдены');
    else res.status(200).send({ data: users });
  })
  .catch(next);

export const getSingleUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => User.findById({ _id: req.params.userId })
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    }
    res.status(200).send({ data: user });
  })
  .catch(next);

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch(next);
};

export const updateMe = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    // @ts-expect-error
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      res.status(200).send({ data: user });
    })
    .catch(next);
};

export const updateMyAvatar = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;
  // @ts-expect-error
  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      res.status(200).send({ data: user });
    })
    .catch(next);
};
