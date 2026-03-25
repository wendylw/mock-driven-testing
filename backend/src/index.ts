import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { errorHandler } from './middleware/error.middleware';
import { requestLogger } from './middleware/logger.middleware';
import baselineRoutes from './routes/baseline.routes';
import analysisRoutes from './routes/analysis.routes';
import baselineDetailsRoutes from './routes/baseline-details.route';
// import batchRoutes from './routes/batch.routes';
import { wsService } from './services/websocket.service';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

// 动态导入数据库和缓存服务
const getDatabaseService = async () => {
  if (process.env.DATABASE_TYPE === 'sqlite') {
    const { DatabaseService } = await import('./services/database-sqlite.service');
    return DatabaseService;
  } else {
    const { DatabaseService } = await import('./services/database.service');
    return DatabaseService;
  }
};

const getRedisService = async () => {
  if (process.env.USE_MEMORY_CACHE === 'true') {
    const { RedisService } = await import('./services/redis-memory.service');
    return RedisService;
  } else {
    const { RedisService } = await import('./services/redis.service');
    return RedisService;
  }
};

const app = express();
const server = createServer(app);

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3001',
    'http://localhost:5173',  // Vite dev server
    'http://localhost:3000'   // Alternative port
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/baselines', baselineRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api', baselineDetailsRoutes);  // 基准详情路由
// app.use('/api/batch', batchRoutes);

// Error handling
app.use(errorHandler);

// Initialize services and start server
async function startServer() {
  try {
    // Get services
    const DatabaseService = await getDatabaseService();
    const RedisService = await getRedisService();
    
    // Initialize database
    await DatabaseService.initialize();
    logger.info('Database connected');
    
    // Initialize Redis/Cache
    await RedisService.initialize();
    logger.info('Cache service connected');
    
    // Initialize WebSocket service
    wsService.initialize(server);
    logger.info('WebSocket service initialized');
    
    // Start server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('HTTP server closed');
  });
  
  const DatabaseService = await getDatabaseService();
  const RedisService = await getRedisService();
  await DatabaseService.close();
  await RedisService.close();
  process.exit(0);
});

startServer(); 
