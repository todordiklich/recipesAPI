import { prisma } from '../db/prisma/client.js';
import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
} from '../utils/tokens.js';
import { comparePassword } from '../utils/password.js';
import AppError from '../utils/AppError.js';

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  if (!users) {
    throw new AppError('Users not found', 404);
  }

  return users;
};

export const findUser = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
    select: {
      id: true,
      email: true,
      name: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (!user.isActive) {
    throw new AppError('User account is inactive', 403);
  }

  return user;
};

export const deleteExpiredRefreshTokens = async () => {
  await prisma.refreshToken.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
};

export const findByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const createUserAndRefreshToken = async (email, name, passwordHash) => {
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email, name, passwordHash },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
    const accessToken = generateAccessToken({ id: user.id });
    const refreshToken = generateRefreshToken();
    await tx.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    });
    return { user, accessToken, refreshToken };
  });

  return result;
};

export const userLogin = async (email, password) => {
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { email } });
    if (!user) {
      throw Object.assign(new Error('Invalid credentials'), {
        statusCode: 401,
      });
    }

    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw Object.assign(new Error('Invalid credentials'), {
        statusCode: 401,
      });
    }

    if (!user.isActive) {
      throw Object.assign(new Error('Account is inactive'), {
        statusCode: 401,
      });
    }

    await tx.refreshToken.deleteMany({ where: { userId: user.id } });

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
    });
    const refreshToken = generateRefreshToken();
    const expiresAt = getRefreshTokenExpiry();
    await tx.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt },
    });

    return { user, accessToken, refreshToken };
  });

  return result;
};

export const refreshToken = async (refreshToken) => {
  const result = await prisma.$transaction(async (tx) => {
    const storedToken = await tx.refreshToken.findUnique({
      where: { token: refreshToken },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!storedToken) {
      throw new AppError('Invalid refresh token', 400);
    }

    if (storedToken.expiresAt < new Date()) {
      await tx.refreshToken.delete({ where: { id: storedToken.id } });
      throw new AppError('Refresh token expired', 400);

      if (!storedToken.user.isActive) {
        await tx.refreshToken.delete({ where: { id: storedToken.id } });
        throw new AppError('Account is inactive', 400);
      }
    }
    const accessToken = generateAccessToken({
      id: storedToken.user.id,
      email: storedToken.user.email,
    });
    const newRefreshToken = generateRefreshToken();
    const expiresAt = getRefreshTokenExpiry();

    await tx.refreshToken.delete({ where: { id: storedToken.id } });
    await tx.refreshToken.create({
      data: { token: newRefreshToken, userId: storedToken.userId, expiresAt },
    });

    return { accessToken, newRefreshToken, user: storedToken.user };
  });

  return result;
};

export const deleteRefreshToken = async (userId) => {
  await prisma.refreshToken.deleteMany({ where: { userId: userId } });
};
