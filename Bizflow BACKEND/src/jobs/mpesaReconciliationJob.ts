import cron from 'node-cron';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';

// Run daily at 2am — reconcile pending M-PESA transactions
export function startMpesaReconciliationJob(): void {
  cron.schedule('0 2 * * *', async () => {
    try {
      logger.info('Starting M-PESA reconciliation...');

      // Find transactions pending > 1 hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const pendingTransactions = await prisma.transaction.findMany({
        where: {
          paymentMethod: 'MPESA',
          status: 'PENDING',
          createdAt: { lt: oneHourAgo },
        },
      });

      for (const tx of pendingTransactions) {
        // Check if there's a matching callback
        const callback = await prisma.mpesaCallback.findFirst({
          where: { phoneNumber: tx.mpesaPhone ?? undefined, resultCode: 0 },
          orderBy: { createdAt: 'desc' },
        });

        if (callback?.mpesaRef) {
          await prisma.transaction.update({
            where: { id: tx.id },
            data: { status: 'COMPLETED', mpesaRef: callback.mpesaRef },
          });
          logger.info('Reconciled transaction', { transactionId: tx.id });
        } else {
          // Mark as failed if no callback after 1 hour
          await prisma.transaction.update({
            where: { id: tx.id },
            data: { status: 'FAILED' },
          });
        }
      }

      logger.info(`M-PESA reconciliation done. Processed ${pendingTransactions.length} transactions.`);
    } catch (error) {
      logger.error('M-PESA reconciliation error', error);
    }
  });

  logger.info('💳 M-PESA reconciliation job started (daily 2am)');
}

// Monthly data retention job
export function startDataRetentionJob(): void {
  cron.schedule('0 3 1 * *', async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const oneEightyDaysAgo = new Date();
      oneEightyDaysAgo.setDate(oneEightyDaysAgo.getDate() - 180);

      // Delete old queue entries (30 days)
      await prisma.queueEntry.deleteMany({
        where: {
          status: { in: ['COMPLETED', 'SKIPPED'] },
          createdAt: { lt: thirtyDaysAgo },
        },
      });

      // Delete old audit logs (90 days)
      await prisma.auditLog.deleteMany({
        where: { createdAt: { lt: ninetyDaysAgo } },
      });

      // Delete old AI interactions (180 days)
      await prisma.aIInteraction.deleteMany({
        where: { createdAt: { lt: oneEightyDaysAgo } },
      });

      logger.info('Data retention job completed');
    } catch (error) {
      logger.error('Data retention job error', error);
    }
  });

  logger.info('🗑️ Data retention job started (monthly 1st at 3am)');
}
