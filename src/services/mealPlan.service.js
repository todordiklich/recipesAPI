import * as mealPlanModel from '../models/mealPlan.model.js';
import AppError from '../utils/AppError.js';

export const getMealPlan = async (id) => {
  return await mealPlanModel.getMealPlan(id);
};

export const getMealPlans = async (userId) => {
  return await mealPlanModel.getMealPlans(userId);
};

export const createMealPlan = async (userId, data) => {
  const mealPlanData = {
    date: new Date(data.date),
    recipeId: Number(data.recipeId),
    userId,
  };

  const mealPlan = await mealPlanModel.createMealPlan(mealPlanData);

  return mealPlan;
};

export const editMealPlan = async (id, userId, data) => {
  const mealPlan = await mealPlanModel.getMealPlan(id);
  if (mealPlan) {
    if (mealPlan.user.id != userId) {
      throw new AppError(
        'This meal plan is not yours, thus you can not edit it.',
        400,
      );
    }
    const mealPlanData = {
      date: new Date(data.date),
      recipeId: Number(data.recipeId),
    };

    const edittedMealPlan = await mealPlanModel.editMealPlan(id, mealPlanData);

    return edittedMealPlan;
  } else {
    throw new AppError('This meal plan does not exist.', 400);
  }
};

export const deleteMealPlan = async (id, userId) => {
  const mealPlan = await mealPlanModel.getMealPlan(id);
  if (mealPlan) {
    if (mealPlan.user.id != userId) {
      throw new AppError(
        'This meal plan is not yours, thus you can not delete it.',
        400,
      );
    }

    const deletedMealPlan = await mealPlanModel.deleteMealPlan(id);

    return deletedMealPlan;
  } else {
    throw new AppError('This meal plan does not exist.', 400);
  }
};
