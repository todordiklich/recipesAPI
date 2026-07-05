import { verifyAccessToken } from '../utils/tokens.js';
import * as userModel from '../models/user.model.js';

// Verify JWT access token and attach user to request
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);

    // Fetch user from database to ensure they exist and are active
    const user = await userModel.findUser(decoded.id);

    // Warn client when token is close to expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if ((decoded.exp - currentTime) * 1000 < 300000) {
      // 5 minutes
      res.set('X-Token-Refresh-Warning', 'true');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);

    // Fetch user from database
    const user = await userModel.findUser(decoded.id);

    if (user && user.isActive) {
      req.user = user;
    }
  } catch (error) {
    // Ignore invalid tokens for optional auth
  }

  next();
};
