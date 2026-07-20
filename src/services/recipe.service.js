import * as recipeModel from '../models/recipe.model.js';
import * as commentModel from '../models/comment.model.js';
import AppError from '../utils/AppError.js';

export const getRecipe = async (params) => {
  const id = Number(params.id);
  return await recipeModel.findRecipe(id);
};

export const getRecipes = async (query, userId) => {
  let {
    page,
    limit,
    title = '',
    difficulty = '',
    cookingTime = '',
    ingredients = '',
    favorites = '',
    favourites = '',
  } = query;

  const shouldFilterFavorites =
    favorites === true ||
    favorites === 'true' ||
    favorites === '1' ||
    favourites === true ||
    favourites === 'true' ||
    favourites === '1';

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  difficulty = difficulty.toUpperCase();
  cookingTime = cookingTime ? parseInt(cookingTime) : undefined;
  const [recipes, total] = await recipeModel.findRecipes(
    page,
    limit,
    title,
    difficulty,
    cookingTime,
    ingredients,
    shouldFilterFavorites,
    userId,
  );

  return {
    recipes: recipes,
    pages: Math.floor(total / limit),
  };
};

export const createRecipe = async (data, userId) => {
  const ingredients = data.ingredients;
  delete data.ingredients;
  const recipeData = {
    ...data,
    authorId: userId,
    difficulty: data.difficulty.toUpperCase(),
  };

  const recipe = await recipeModel.createRecipe(recipeData, ingredients);

  return recipe;
};

export const updatedRecipe = async (recipeId, userId, data) => {
  const ingredients = data.ingredients;
  delete data.ingredients;
  const recipeData = {
    ...data,
    ...(data.difficulty && {
      difficulty: data.difficulty.toUpperCase(),
    }),
  };
  const recipe = await recipeModel.updatedRecipe(
    recipeId,
    userId,
    recipeData,
    ingredients,
  );

  return recipe;
};

export const updateIngredient = async (ingredientId, data) => {
  const ingredient = await recipeModel.updateIngredient(ingredientId, data);

  return ingredient;
};

export const saveToFavorites = async (userId, recipeId) => {
  const isAlreadySaved = await recipeModel.getFavourite(userId, recipeId);

  if (isAlreadySaved) {
    const remove = await recipeModel.removeFromFavourites(userId, recipeId);
    return remove;
  }

  const saved = await recipeModel.saveToFavorites(userId, recipeId);

  if (saved) {
    return saved;
  } else {
    throw new AppError(
      'You were not able to add the recipe to favoutires.',
      400,
    );
  }
};

export const getFavourites = async (userId) => {
  const favourites = await recipeModel.getFavourites(userId);

  return favourites;
};

export const getFavourite = async (userId, recipeId) => {
  const favourite = await recipeModel.getFavourite(userId, recipeId);

  return favourite;
};

export const addComment = async (recipeId, authorId, reqData) => {
  const data = {
    recipeId,
    authorId,
    content: reqData.content,
  };

  const comment = await commentModel.addComment(data);

  return comment;
};

export const editComment = async (commentId, userId, reqData) => {
  const comment = await commentModel.getComment(commentId);
  if (comment) {
    if (userId != comment.authorId) {
      throw new AppError(
        'You are not the author of this comment, thus you can not edit it.',
        401,
      );
    }

    const data = { content: reqData.content };
    const edittedComment = await commentModel.editComment(commentId, data);

    return edittedComment;
  } else {
    throw new AppError('This comment does not exist.', 400);
  }
};

export const deleteComment = async (commentId, userId) => {
  const comment = await commentModel.getComment(commentId);
  if (comment) {
    if (userId != comment.authorId) {
      throw new AppError(
        'You are not the author of this comment, thus you can not delete it.',
        401,
      );
    }

    const deleatedComment = await commentModel.deleteComment(commentId);

    return deleatedComment;
  } else {
    throw new AppError('This comment does not exist.', 400);
  }
};
