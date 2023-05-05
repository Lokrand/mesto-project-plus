import { NextFunction, Request, Response } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import jwt, { JwtPayload } from 'jsonwebtoken';
// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from 'bcryptjs';
// import { IReq } from '../types/req';
import { IReq } from '../types/req';
import BadRequest from '../errors/bad-request';
import AlreadyExist from '../errors/already-exist';
import WrongData from '../errors/wrong-data';
import User from '../models/user';
import NotFoundError from '../errors/not-found-err';

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

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
  const {
    name, about, avatar, email, password,
  } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new AlreadyExist('Пользователь уже существует'));
      }
    });
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

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user: any) => {
      if (!user) {
        throw new WrongData('Передан неверный логин или пароль');
      }
      const token = jwt.sign({ _id: user._id }, 'super-secret-key', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(next);
};
// const { email, password } = req.body;

// return User.findOne({ email })
//   .select('+password')
//   .then((user) => {
//     if (!user) {
//       throw new WrongData('Передан неверный логин или пароль');
//     }
//     // @ts-expect-error
//     return bcrypt.compare(password, user.password);
//   })
//   .then((matched) => {
//     if (!matched) {
//       throw new WrongData('Передан неверный логин или пароль');
//     }

//     const token = jwt.sign({ _id: matched._id }, 'super-secret-key', {
//       expiresIn: '7d',
//     });
//     res.send({ token });
//   })
//   .catch(next);

export const getMe = (req: SessionRequest, res: Response, next: NextFunction) => {
  const reqWithId = req as IReq;
  // eslint-disable-next-line implicit-arrow-linebreak
  // eslint-disable-next-line implicit-arrow-linebreak
  return User.findById({ _id: reqWithId.user._id })
    .then((user) => {
      if (!user) throw new BadRequest('Пользователь не найден');
      res.status(200).send({ data: user });
    })
    .catch(next);
};
