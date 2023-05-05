import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import validator from 'validator';
import ICard from '../types/card';

const CardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    validate: [
      validator.isURL,
      'Введена не корректная ссылка',
    ],
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ICard>('card', CardSchema);
