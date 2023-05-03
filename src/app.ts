import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import NotFoundError from './errors/not-found-err';
import routerUser from './routes/user';
import routerCard from './routes/card';

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

// Middleware - для добавления тестового id
app.use((req: Request, res: Response, next) => {
  // @ts-expect-error
  req.user = {
    _id: '643eed2e20b1ed741ac2582d',
  };
  next();
});

// роуты
app.use('/users', routerUser);
app.use('/cards', routerCard);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Страница не найдена'));
});

// обработчики ошибок
app.use(errors());

app.use((err: any, req: Request, res: Response) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
});

app.listen(PORT);
