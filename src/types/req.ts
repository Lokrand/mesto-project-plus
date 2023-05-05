import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface IReq extends Request {
  user: {_id: JwtPayload},
}
