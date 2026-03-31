import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import SequelizeConfig from './config/db.config.js';
import TaskRoutes from './routes/TaskRoutes.js';
import { clerkAuth } from './middleware/auth.js';
import rateLimit from 'express-rate-limit';
import  Redis  from 'ioredis';
import { RedisStore } from 'rate-limit-redis';


dotenv.config();
const redisClient = new (Redis as any)({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});
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

const apiLimiter = rateLimit({
  store: new RedisStore({
  sendCommand: (...args: any[]) => redisClient.call(...args),
  }),
  windowMs: 15 * 60 * 1000,
  max: 6,
   handler: (req, res) => {
    console.log("Rate limit exceeded for:", req.ip);
    res.status(429).json({
      success: false,
      message: "Too many requests"
    });
  }
});

app.use('/api/task',clerkAuth,apiLimiter,TaskRoutes);

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


