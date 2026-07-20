import { prisma } from '../db/prisma/client.js';

export const findRecipe = async (id) => {
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      cookingTime: true,
      difficulty: true,
      imageUrl: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      ingredients: {
        select: {
          name: true,
          quantity: true,
        },
      },
      comments: {
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return recipe;
};

export const findRecipes = async (
  page,
  limit,
  title,
  difficulty,
  cookingTime,
  ingredients,
  shouldFilterFavorites = false,
  userId,
) => {
  const where = {
    ...(title && {
      title: {
        contains: title,
        mode: 'insensitive',
      },
    }),
    ...(difficulty && {
      difficulty: {
        equals: difficulty,
      },
    }),
    ...(cookingTime && {
      cookingTime: {
        equals: cookingTime,
      },
    }),
    ...(ingredients && {
      ingredients: {
        some: {
          name: {
            contains: ingredients,
            mode: 'insensitive',
          },
        },
      },
    }),
    ...(shouldFilterFavorites && userId
      ? {
          favorites: {
            some: {
              userId,
            },
          },
        }
      : {}),
  };

  const [recipes, total] = await Promise.all([
    prisma.recipe.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        cookingTime: true,
        difficulty: true,
        imageUrl: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ingredients: {
          select: {
            name: true,
            quantity: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    }),

    prisma.recipe.count({ where }),
  ]);

  return [recipes, total];
};

export const createRecipe = async (recipeData, ingredients) => {
  const recipe = await prisma.recipe.create({
    data: {
      ...recipeData,
      ingredients: {
        create: ingredients,
      },
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      ingredients: {
        select: {
          name: true,
          quantity: true,
        },
      },
    },
  });

  return recipe;
};

export const updatedRecipe = async (
  recipeId,
  authorId,
  recipeData,
  ingredients,
) => {
  const recipe = await prisma.recipe.update({
    where: {
      id: recipeId,
      authorId,
    },
    data: {
      ...recipeData,
      ingredients: {
        create: ingredients,
      },
    },
  });

  return recipe;
};

export const updateIngredient = async (id, data) => {
  const ingredient = await prisma.ingredient.update({
    where: { id },
    data,
  });

  return ingredient;
};

export const saveToFavorites = async (userId, recipeId) => {
  const saved = await prisma.favoriteRecipe.create({
    data: {
      userId,
      recipeId,
    },
  });

  return saved;
};

export const getFavourite = async (userId, recipeId) => {
  const result = await prisma.favoriteRecipe.findUnique({
    where: {
      userId_recipeId: {
        userId,
        recipeId,
      },
    },
  });

  return result;
};

export const removeFromFavourites = async (userId, recipeId) => {
  const result = await prisma.favoriteRecipe.delete({
    where: {
      userId_recipeId: {
        userId,
        recipeId,
      },
    },
  });

  return result;
};

export const getFavourites = async (userId) => {
  const favourites = await prisma.favoriteRecipe.findMany({
    where: {
      userId,
    },
    include: {
      recipe: {
        select: {
          id: true,
          title: true,
          description: true,
          cookingTime: true,
          difficulty: true,
          imageUrl: true,
          ingredients: {
            select: {
              id: true,
              name: true,
              quantity: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return favourites;
};
