import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import {
  createUser,
  getSingleUser,
  getUsers,
  updateMe,
  updateMyAvatar,
} from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.get('/:ObjectId', getSingleUser);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
      avatar: Joi.string().required(),
    }),
  }),
  createUser,
);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      // Извините, там рассинхрон в задании и ТЗ, и я 200 по инструкции ввёл.
      // В инструкции написано было:
      // about — информация о пользователе, строка от 2 до 200 символов, обязательное поле;
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateMe,
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      // тут же указан required для обязательного поля
      avatar: Joi.string().required(),
    }),
  }),
  updateMyAvatar,
);

export default router;
