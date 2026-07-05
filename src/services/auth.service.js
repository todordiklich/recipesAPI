import * as userModel from '../models/user.model.js';
import {
  loginSchema,
  signupSchema,
  refreshTokenSchema,
} from '../utils/valudation.js';
import { hashPassword } from '../utils/password.js';

export const signup = async (payload) => {
  try {
    const validationResult = signupSchema.safeParse(payload);
    if (!validationResult.success) {
      throw new Error({
        status: 400,
        message: 'Invalid request data',
        details: validationResult.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const { email, password, name } = validationResult.data;

    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      throw new Error({ status: 409, message: 'Email already exists' });
    }

    const passwordHash = await hashPassword(password);

    // Create user and refresh token so neither exists without the other
    const { user, accessToken, refreshToken } =
      await userModel.createUserAndRefreshToken(email, name, passwordHash);

    return { user, accessToken, refreshToken };
  } catch (error) {
    throw new Error({ status: 500, message: 'Failed to signup' });
  }
};

export const login = async (payload) => {
  try {
    const validationResult = loginSchema.safeParse(payload);
    if (!validationResult.success) {
      throw new Error({
        status: 400,
        message: 'Invalid request data',
        details: validationResult.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
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
  } catch (error) {
    throw new Error({ status: 500, message: 'Failed to login' });
  }
};

export const refresh = async (payload) => {
  try {
    const validationResult = refreshTokenSchema.safeParse(payload);
    if (!validationResult.success) {
      throw new Error({
        status: 400,
        message: 'Invalid request data',
        details: validationResult.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const { refreshToken } = validationResult.data;
    const result = await userModel.refreshToken(refreshToken);

    return {
      accessToken: result.accessToken,
      refreshToken: result.newRefreshToken,
      user: result.user,
    };
  } catch (error) {
    if (error.status && error.message) throw new Error(...error);
    throw new Error({ status: 500, message: 'Failed to refresh token' });
  }
};

export const logout = async (payload) => {
  try {
    const { id: userId } = payload;

    await userModel.deleteRefreshToken(userId);
    return { message: 'Logged out successfully' };
  } catch (error) {
    throw new Error({ status: 500, message: 'Failed to logout' });
  }
};
