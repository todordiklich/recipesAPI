import { json } from 'zod';
import * as authService from '../services/auth.service.js';

export const signup = async (req, res, next) => {
  try {
    const data = await authService.signup(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const data = await authService.refresh(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const data = await authService.logout(req.user);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};
