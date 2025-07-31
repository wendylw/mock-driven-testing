import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { errorHandler } from './middleware/error.middleware';
import { requestLogger } from './middleware/logger.middleware';
import baselineRoutes from './routes/baseline.routes';
import analysisRoutes from './routes/analysis.routes';
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
const wss = new WebSocketServer({ server });

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

// Error handling
app.use(errorHandler);

// WebSocket handling
wss.on('connection', (ws) => {
  logger.info('New WebSocket connection');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.type === 'auth') {
        // Handle authentication
        logger.info('WebSocket authentication attempt');
      }
    } catch (error) {
      logger.error('WebSocket message error:', error);
    }
  });
  
  ws.on('close', () => {
    logger.info('WebSocket connection closed');
  });
});

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