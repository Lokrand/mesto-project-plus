import {
  createCard,
  deleteCard,
  dislikeCard,
  getCards,
  likeCard,
} from "../controllers/card";
import { Router } from "express";
import { Joi, celebrate } from "celebrate";

const router = Router();

router.get("/", getCards);
router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required(),
    }),
  }),
  createCard
);
router.delete("/:cardId", deleteCard);
router.put("/:cardId/likes", likeCard);
router.delete("/:cardId/likes", dislikeCard);

export default router;
