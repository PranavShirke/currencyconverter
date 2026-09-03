import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import apiRoutes from './routes/index.js';
import { attachUser } from './middleware/attachUser.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api', attachUser, apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
