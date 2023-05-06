import { NextFunction } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
import jwt, { JwtPayload } from 'jsonwebtoken';
import WrongData from '../errors/wrong-data';

require('dotenv').config();

const { JWT_SECRET = 'super-secret-key' } = process.env;
interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

const extractBearerToken = (header: string) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
export default (req: SessionRequest, res: Response, next: NextFunction) => {
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
    payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    req.user = { ...payload };
  } catch (err) {
    return next(new WrongData('Необходима авторизация'));
  }

  next();
};
