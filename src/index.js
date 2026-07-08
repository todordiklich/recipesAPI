import express from 'express';
import cors from 'cors';
import { generalRateLimit } from './middlewares/rateLimit.js';
import v1Router from './api/index.js';
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(generalRateLimit);

app.get('/', (req, res) => {
  res.json({
    message: 'Task Management API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/auth',
      users: '/users',
      recipes: '/recipes',
      mealPlans: '/mealPlans',
    },
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 200, timestamp: new Date().toISOString() });
});

app.use('/api', v1Router);
app.use(notFound);
app.use(errorHandler);

export default app;
