import bcrypt from 'bcryptjs';
import AppError from './AppError.js';

const SALT_ROUNDS = 12;

export const hashPassword = async (password) => {
  if (!password || typeof password !== 'string') {
    throw new AppError('Password must be a non-empty string', 400);
  }

  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password, hashedPassword) => {
  if (
    !password ||
    !hashedPassword ||
    typeof password !== 'string' ||
    typeof hashedPassword !== 'string'
  ) {
    return false;
  }

  return bcrypt.compare(password, hashedPassword);
};
