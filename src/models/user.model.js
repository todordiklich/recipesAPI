import { prisma } from '../db/prisma/client.js';

export const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!users) {
      throw new Error('Users not found');
    }

    return users;
  } catch (error) {
    throw new Error('Failed to get users');
  }
};
