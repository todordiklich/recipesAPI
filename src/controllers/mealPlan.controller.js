import * as mealPlanService from '../services/mealPlan.service.js';

export const getMealPlan = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = await mealPlanService.getMealPlan(id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getMealPlans = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const data = await mealPlanService.getMealPlans(userId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const createMealPlan = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const data = await mealPlanService.createMealPlan(userId, req.body);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const editMealPlan = async (req, res, next) => {
  try {
    const mealPlanId = Number(req.params.id);
    const userId = req.user?.id;
    const data = await mealPlanService.editMealPlan(
      mealPlanId,
      userId,
      req.body,
    );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteMealPlan = async (req, res, next) => {
  try {
    const commentId = Number(req.params.id);
    const userId = req.user?.id;
    const data = await mealPlanService.deleteMealPlan(commentId, userId);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
