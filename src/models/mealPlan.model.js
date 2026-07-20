import { prisma } from '../db/prisma/client.js';

export const getMealPlan = async (id) => {
  const result = await prisma.mealPlan.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      date: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      recipe: {
        select: {
          id: true,
          title: true,
          description: true,
          cookingTime: true,
          difficulty: true,
          imageUrl: true,
        },
      },
    },
  });
  return result;
};

export const getMealPlans = async (userId) => {
  const result = await prisma.mealPlan.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      date: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      recipe: {
        select: {
          id: true,
          title: true,
          description: true,
          cookingTime: true,
          difficulty: true,
          imageUrl: true,
        },
      },
    },
  });
  return result;
};

export const createMealPlan = async (data) => {
  const result = await prisma.mealPlan.create({
    data,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      recipe: {
        select: {
          title: true,
          description: true,
          cookingTime: true,
          difficulty: true,
          imageUrl: true,
        },
      },
    },
  });

  return result;
};

export const editMealPlan = async (id, data) => {
  const result = await prisma.mealPlan.update({
    where: { id },
    data,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      recipe: {
        select: {
          title: true,
          description: true,
          cookingTime: true,
          difficulty: true,
          imageUrl: true,
        },
      },
    },
  });
  return result;
};

export const deleteMealPlan = async (id) => {
  const result = await prisma.mealPlan.delete({
    where: {
      id,
    },
  });
  return result;
};
