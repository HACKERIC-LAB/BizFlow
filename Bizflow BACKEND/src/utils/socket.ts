import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { logger } from './logger';

let io: SocketIOServer | null = null;

export function initSocket(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: config.FRONTEND_URL,
      methods: ['GET', 'POST'],
    },
  });

  // Queue namespace
  const queueNs = io.of('/queue');

  queueNs.use((socket: Socket, next: any) => {
    const token = socket.handshake.auth?.token as string | undefined;
    const businessId = socket.handshake.query?.businessId as string | undefined;

    if (!token || !businessId) {
      return next(new Error('Authentication required'));
    }

    try {
      const payload = jwt.verify(token, config.JWT_SECRET) as { businessId: string };
      if (payload.businessId !== businessId) {
        return next(new Error('Business ID mismatch'));
      }
      socket.data.businessId = businessId;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  queueNs.on('connection', (socket: Socket) => {
    const businessId = socket.data.businessId as string;
    socket.join(`business:${businessId}`);
    logger.debug(`Socket connected: ${socket.id} for business ${businessId}`);

    socket.on('disconnect', () => {
      logger.debug(`Socket disconnected: ${socket.id}`);
    });
  });

  logger.info('✅ Socket.io initialized');
  return io;
}

export function getIO(): SocketIOServer {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}

export function emitQueueUpdate(businessId: string, data: unknown): void {
  if (io) {
    io.of('/queue').to(`business:${businessId}`).emit('queue-updated', data);
  }
}

export function emitNowServing(businessId: string, data: unknown): void {
  if (io) {
    io.of('/queue').to(`business:${businessId}`).emit('now-serving', data);
  }
}
