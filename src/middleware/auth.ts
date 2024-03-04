import { NextFunction, Request, Response } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import jwt from 'jsonwebtoken';
import User from '../models/user';

declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
    }
  }
}

// Check to see if the request is coming from an auth0 server.
export const jwtCheck = auth({
  audience: process.env.Auth0_AUDIENCE,
  issuerBaseURL: process.env.Auth0_ISSUER_BASE_URL,
  tokenSigningAlg: process.env.Auth0_TOKEN_SIGNING_ALG,
});

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.sendStatus(401);
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    // console.log('Decoded token', decoded);
    const auth0Id = decoded.sub;

    const user = await User.findOne({
      auth0Id,
    });

    if (!user) {
      return res.sendStatus(401);
    }

    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    res.sendStatus(401);
  }
};
