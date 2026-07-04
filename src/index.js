import express from 'express';
import v1Router from './api/v1/index.js';
import notFound from './middlewares/notFound.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Task Management API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
    },
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', v1Router);
app.use(notFound);

export default app;
