import IUser from './user';

export default interface ICard {
  name: string;
  link: string;
  owner: IUser;
  likes: IUser[];
  createdAt: Date;
// eslint-disable-next-line semi
}
