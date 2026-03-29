import crypto from 'crypto';

export const hashToken = (token: string) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const randomToken = (size = 48) => {
  return crypto.randomBytes(size).toString('hex');
};

export const randomNumericCode = (length = 6) => {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
};
