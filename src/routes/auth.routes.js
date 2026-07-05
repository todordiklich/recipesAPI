import express from 'express';
import * as userModel from '../models/user.model.js';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

async function cleanupExpiredTokens() {
  await userModel.deleteExpiredRefreshTokens();
}

// Initial cleanup on server start
cleanupExpiredTokens();

// Schedule periodic cleanup
const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 1d
setInterval(cleanupExpiredTokens, CLEANUP_INTERVAL).unref();

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.post('/refresh', authController.refresh);

router.post('/logout', authenticate, authController.logout);

export default router;
