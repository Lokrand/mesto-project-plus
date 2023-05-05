import { NextFunction } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from 'jsonwebtoken';
import { IReq } from '../types/req';
import WrongData from '../errors/wrong-data';

// eslint-disable-next-line consistent-return
export default (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error
  const reqWithId = req as IReq;
  // @ts-expect-error
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return (
      res
        // @ts-expect-error
        .status(401)
        .send({ message: 'Необходима авторизация' })
    );
  }

  const token = authorization.replace('Bearer ', '');
  let payload: jwt.JwtPayload;

  try {
    payload = jwt.verify(token, 'super-secret-key') as jwt.JwtPayload;
    reqWithId.user = {
      _id: payload._id,
    };
  } catch (err) {
    return next(new WrongData('Необходима авторизация'));
  }
  // @ts-expect-error
  req.user = payload;

  next();
};
