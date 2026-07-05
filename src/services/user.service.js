import * as userModel from '../models/user.model.js';

export const getAllUsers = async () => {
  try {
    return await userModel.getAllUsers();
  } catch (error) {
    throw new Error(error);
  }
};
