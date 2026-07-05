import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

const REFRESH_TOKEN_BYTES = 32;
const JWT_ACCESS_EXPIRES_IN = 1000 * 60 * 60 * 24; // 24h
const JWT_REFRESH_EXPIRES_IN = 1000 * 60 * 60 * 24 * 7; // 7d

export const generateAccessToken = (payload) => {
  return jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      type: 'access',
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: JWT_ACCESS_EXPIRES_IN },
  );
};

export const generateRefreshToken = () => {
  return randomBytes(REFRESH_TOKEN_BYTES).toString('hex');
};

export const getRefreshTokenExpiry = () => {
  // Parse the refresh token expiry from config (e.g., "7d" = 7 days)
  const expiryDays = parseInt(JWT_REFRESH_EXPIRES_IN);
  return new Date(Date.now() + expiryDays);
};

export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    if (decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Access token expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid access token');
    } else {
      throw error;
    }
  }
};
