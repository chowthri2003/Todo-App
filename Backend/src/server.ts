import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import SequelizeConfig from './config/db.config.js';
import TaskRoutes from './routes/TaskRoutes.js';
import { clerkAuth } from './middleware/auth.js';

dotenv.config();
const app = express();
const port = process.env.PORT;
const origin = process.env.CORS_ORIGIN;

app.use ( cors({
    origin,
    credentials: true,
}));

app.use(express.json());

app.get('/health', async (_req, res) => {
  try {
    await SequelizeConfig.authenticate();

    res.status(200).json({
      status: 'UP',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        server: 'healthy'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'DOWN',
      timestamp: new Date().toISOString(),
      services: {
        database: 'disconnected',
        server: 'unhealthy'
      }
    });
  }
});

app.use(clerkAuth);
app.use('/api/task',TaskRoutes);

const startServer = async (): Promise<void> => {
  try {
    await SequelizeConfig.authenticate();
    console.log('PostgreSQL connected successfully');
    await SequelizeConfig.sync({ alter: true });
    app.listen(port, () => console.log('Server is Running on port ' + port));
  } catch (error) {
    console.error('Unable to connect to DB:', error);
    process.exit(1);
  }
};

startServer();


