import express from 'express';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

router.get('/users', userController.getAllUsers);

export default router;
