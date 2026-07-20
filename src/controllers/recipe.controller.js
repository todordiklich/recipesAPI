import * as recipeService from '../services/recipe.service.js';

export const getRecipe = async (req, res, next) => {
  try {
    const data = await recipeService.getRecipe(req.params);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getRecipes = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const data = await recipeService.getRecipes(req.query, userId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const createRecipe = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const data = await recipeService.createRecipe(req.body, userId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const updatedRecipe = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user?.id;
    const data = await recipeService.updatedRecipe(id, userId, req.body);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateIngredient = async (req, res, next) => {
  try {
    const ingredientId = Number(req.params.id);
    const data = await recipeService.updateIngredient(ingredientId, req.body);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const saveToFavorites = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const recipeId = Number(req.params.id);
    const data = await recipeService.saveToFavorites(userId, recipeId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getFavourites = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const data = await recipeService.getFavourites(userId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getFavourite = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const recipeId = Number(req.params.id);
    const data = await recipeService.getFavourite(userId, recipeId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const recipeId = Number(req.params.id);
    const userId = req.user?.id;
    const data = await recipeService.addComment(recipeId, userId, req.body);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const commentId = Number(req.params.id);
    const userId = req.user?.id;
    const data = await recipeService.editComment(commentId, userId, req.body);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const commentId = Number(req.params.id);
    const userId = req.user?.id;
    const data = await recipeService.deleteComment(commentId, userId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
