import mongoose, { Model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import IUser from '../types/user';

interface UserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

const UserSchema = new mongoose.Schema<IUser, UserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

UserSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      return Promise.reject(new Error('Неправильные почта или пароль'));
    }

    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return user;
    });
  });
});

export default mongoose.model<IUser, UserModel>('user', UserSchema);
