import express from 'express';
import userRoutes from '../../routes/user.routes.js';

const router = express.Router();

router.use('/v1', userRoutes);

export default router;
