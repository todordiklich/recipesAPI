import * as userModel from '../models/user.model.js';
import {
  loginSchema,
  signupSchema,
  refreshTokenSchema,
} from '../utils/valudation.js';
import { hashPassword } from '../utils/password.js';
import AppError from '../utils/AppError.js';

export const signup = async (payload) => {
  const validationResult = signupSchema.safeParse(payload);
  if (!validationResult.success) {
    throw new AppError(
      'Invalid request data',
      400,
      validationResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    );
  }

  const { email, password, name } = validationResult.data;

  const existingUser = await userModel.findByEmail(email);
  if (existingUser) {
    throw new AppError('Email already exists', 400);
  }

  const passwordHash = await hashPassword(password);

  // Create user and refresh token so neither exists without the other
  const { user, accessToken, refreshToken } =
    await userModel.createUserAndRefreshToken(email, name, passwordHash);

  return { user, accessToken, refreshToken };
};

export const login = async (payload) => {
  const validationResult = loginSchema.safeParse(payload);
  if (!validationResult.success) {
    throw new AppError(
      'Invalid request data',
      400,
      validationResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    );
  }

  const { email, password } = validationResult.data;

  const result = await userModel.userLogin(email, password);
  const data = {
    user: {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
    },
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  };

  return data;
};

export const refresh = async (payload) => {
  const validationResult = refreshTokenSchema.safeParse(payload);
  if (!validationResult.success) {
    throw new AppError(
      'Invalid request data',
      400,
      validationResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    );
  }

  const { refreshToken } = validationResult.data;
  const result = await userModel.refreshToken(refreshToken);

  return {
    accessToken: result.accessToken,
    refreshToken: result.newRefreshToken,
    user: result.user,
  };
};

export const logout = async (payload) => {
  const { id: userId } = payload;

  await userModel.deleteRefreshToken(userId);
  return { message: 'Logged out successfully' };
};
