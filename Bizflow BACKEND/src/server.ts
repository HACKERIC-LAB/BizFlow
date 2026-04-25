import http from 'http';
import app from './app';
import { config } from './config';
import { logger } from './utils/logger';
import { connectDB, disconnectDB } from './utils/prisma';
import { initSocket } from './utils/socket';
import { startReminderJob } from './jobs/reminderJob';
import { startMpesaReconciliationJob, startDataRetentionJob } from './jobs/mpesaReconciliationJob';

const PORT = Number(config.PORT) || 3000;

async function main() {
  // Connect to database
  await connectDB();

  // Create HTTP server
  const httpServer = http.createServer(app);

  // Initialize Socket.io
  initSocket(httpServer);

  // Start background jobs
  startReminderJob();
  startMpesaReconciliationJob();
  startDataRetentionJob();

  // Start server
  httpServer.listen(PORT, () => {
    logger.info(`🚀 BizFlow API running at http://localhost:${PORT}`);
    logger.info(`📚 API Docs: http://localhost:${PORT}/api-docs`);
    logger.info(`🏥 Health: http://localhost:${PORT}/health`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`);
    httpServer.close(async () => {
      await disconnectDB();
      logger.info('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception', err);
    process.exit(1);
  });
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled rejection', reason);
    process.exit(1);
  });
}

main().catch((err) => {
  logger.error('Failed to start server', err);
  process.exit(1);
});
