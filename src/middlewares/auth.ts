import { NextFunction } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IReq } from '../types/req';
import WrongData from '../errors/wrong-data';

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

const extractBearerToken = (header: string) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
export default (req: SessionRequest, res: Response, next: NextFunction) => {
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

  const token = extractBearerToken(authorization);
  let payload: jwt.JwtPayload;

  try {
    payload = jwt.verify(token, 'super-secret-key') as jwt.JwtPayload;
    reqWithId.user = {
      _id: payload._id,
    };
  } catch (err) {
    return next(new WrongData('Необходима авторизация'));
  }

  // req.user = payload;

  next(reqWithId);
};
