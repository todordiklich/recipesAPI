import * as userModel from '../models/user.model.js';

export const getAllUsers = async () => {
  return await userModel.getAllUsers();
};
