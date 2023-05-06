import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import {
  getMe,
  getSingleUser,
  getUsers,
  updateMe,
  updateMyAvatar,
} from '../controllers/user';

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
      avatar: Joi.string().required().uri(),
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
