import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import * as recipeController from '../controllers/recipe.controller.js';

const router = express.Router();

router.get('/favourites', authenticate, recipeController.getFavourites);
router.get('/favourite/:id', authenticate, recipeController.getFavourite);

router.post(
  '/addToFavourites/:id',
  authenticate,
  recipeController.saveToFavorites,
);

router.patch(
  '/ingredient/:id',
  authenticate,
  recipeController.updateIngredient,
);

router.patch('/comment/:id', authenticate, recipeController.editComment);

router.delete('/comment/:id', authenticate, recipeController.deleteComment);

router.post('/:id/comment', authenticate, recipeController.addComment);

router.get('/', authenticate, recipeController.getRecipes);
router.post('/', authenticate, recipeController.createRecipe);

router.get('/:id', authenticate, recipeController.getRecipe);
router.patch('/:id', authenticate, recipeController.updatedRecipe);

export default router;
