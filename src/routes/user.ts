import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
// eslint-disable-next-line import/no-extraneous-dependencies
import validator from 'validator';
import {
  getMe,
  getSingleUser,
  getUsers,
  updateMe,
  updateMyAvatar,
} from '../controllers/user';
import BadRequest from '../errors/bad-request';

const router = Router();

router.get('/', getUsers);
router.get('/me', getMe);
router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().length(24),
    }),
  }),
  getSingleUser,
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().custom((value) => {
        if (!validator.isURL(value)) {
          throw new BadRequest('Невалидная ссылка');
        }
        return value;
      }).required(),

    }),
  }),
  updateMyAvatar,
);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateMe,
);

export default router;
