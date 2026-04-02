import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const accessSecret: Secret = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
const refreshSecret: Secret = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';

export const signAccessToken = (payload: object, expiresIn?: SignOptions['expiresIn']) => {
  const ttl = (expiresIn ?? process.env.ACCESS_TOKEN_TTL ?? '15m') as Exclude<
    SignOptions['expiresIn'],
    undefined
  >;
  const options: SignOptions = { expiresIn: ttl };
  return jwt.sign(payload, accessSecret, options);
};

export const signRefreshToken = (payload: object, expiresIn?: SignOptions['expiresIn']) => {
  const ttl = (expiresIn ?? process.env.REFRESH_TOKEN_TTL ?? '30d') as Exclude<
    SignOptions['expiresIn'],
    undefined
  >;
  const options: SignOptions = { expiresIn: ttl };
  return jwt.sign(payload, refreshSecret, options);
};

export const verifyAccessToken = (token: string) => jwt.verify(token, accessSecret);
export const verifyRefreshToken = (token: string) => jwt.verify(token, refreshSecret);
