import express from 'express';
import apiRouter from './api/index.js';
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

app.use('/api', apiRouter);
app.use(notFound);

export default app;
