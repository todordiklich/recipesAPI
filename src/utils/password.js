import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export const hashPassword = async (password) => {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
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
