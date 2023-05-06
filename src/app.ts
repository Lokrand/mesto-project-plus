import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Joi, celebrate } from 'celebrate';
// eslint-disable-next-line import/no-extraneous-dependencies
import validator from 'validator';
import BadRequest from './errors/bad-request';
import auth from './middlewares/auth';
import { createUser, login } from './controllers/user';
import NotFoundError from './errors/not-found-err';
import routerUser from './routes/user';
import routerCard from './routes/card';
// eslint-disable-next-line import/named
import { requestLogger, errorLogger } from './middlewares/logger';

require('dotenv').config();
const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;

const url = process.env.MONGO_URL
  ? process.env.MONGO_URL
  : 'mongodb://127.0.0.1:27017/mestodb';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(url, {});

// Логгер запросов
app.use(requestLogger);

// Роуты для авторизации
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().custom((value) => {
        if (!validator.isURL(value)) {
          throw new BadRequest('Невалидная ссылка');
        }
        return value;
      }),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

// Основные роуты для базы данных
// @ts-expect-error
app.use('/', auth);

app.use('/users', routerUser);
app.use('/cards', routerCard);

// Обработчик несуществующей страницы
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Страница не найдена'));
});

// Логгер ошибок
app.use(errorLogger);

// Обработчики ошибок
app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
});

app.listen(PORT);
