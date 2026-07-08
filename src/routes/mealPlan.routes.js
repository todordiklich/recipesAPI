import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import * as mealPlanController from '../controllers/mealPlan.controller.js';

const router = express.Router();

router.get('/:id', authenticate, mealPlanController.getMealPlan);
router.get('/', authenticate, mealPlanController.getMealPlans);
router.post('/', authenticate, mealPlanController.createMealPlan);
router.patch('/:id', authenticate, mealPlanController.editMealPlan);
router.delete('/:id', authenticate, mealPlanController.deleteMealPlan);

export default router;
