import express from 'express';
import userRoutes from '../../routes/user.routes.js';
import authRoutes from '../../routes/auth.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
