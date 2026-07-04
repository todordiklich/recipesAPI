import * as userService from '../services/user.service.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();

    res.status(201).json(users);
  } catch (error) {
    next(error);
  }
};
