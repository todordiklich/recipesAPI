import express from 'express';
import userRoutes from '../../routes/user.routes.js';
import authRoutes from '../../routes/auth.routes.js';
import recipesRouter from '../../routes/recipe.routes.js';
import mealPlansRouter from '../../routes/mealPlan.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/recipes', recipesRouter);
router.use('/mealPlans', mealPlansRouter);

export default router;
