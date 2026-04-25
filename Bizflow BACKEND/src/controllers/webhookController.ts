import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';

export async function mpesaCallback(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    const stkCallback = body?.Body?.stkCallback;

    if (!stkCallback) {
      res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
      return;
    }

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

    let mpesaRef: string | undefined;
    let amount: number | undefined;
    let phoneNumber: string | undefined;

    if (CallbackMetadata?.Item) {
      for (const item of CallbackMetadata.Item) {
        if (item.Name === 'MpesaReceiptNumber') mpesaRef = item.Value;
        if (item.Name === 'Amount') amount = item.Value;
        if (item.Name === 'PhoneNumber') phoneNumber = String(item.Value);
      }
    }

    // Find the pending transaction by checkoutRequestId
    const existing = await prisma.mpesaCallback.findFirst({
      where: { checkoutRequestId: CheckoutRequestID },
    });

    if (!existing) {
      await prisma.mpesaCallback.create({
        data: {
          merchantRequestId: MerchantRequestID,
          checkoutRequestId: CheckoutRequestID,
          resultCode: ResultCode,
          resultDesc: ResultDesc,
          mpesaRef,
          amount,
          phoneNumber,
          rawPayload: body,
        },
      });
    }

    if (ResultCode === 0 && mpesaRef) {
      // Find and complete the pending transaction
      const transaction = await prisma.transaction.findFirst({
        where: { mpesaPhone: phoneNumber, status: 'PENDING', paymentMethod: 'MPESA' },
        orderBy: { createdAt: 'desc' },
      });

      if (transaction) {
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: 'COMPLETED', mpesaRef },
        });

        if (transaction.customerId) {
          await prisma.customer.update({
            where: { id: transaction.customerId },
            data: { totalVisits: { increment: 1 }, lastVisit: new Date() },
          });
        }
      }
    }

    logger.info('M-PESA callback processed', { ResultCode, MerchantRequestID });
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (error) {
    logger.error('M-PESA callback error', error);
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' }); // Always 200 to Safaricom
  }
}

export async function whatsappWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const { mode, token, challenge } = req.query;
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    if (mode === 'subscribe' && token === verifyToken) {
      res.status(200).send(challenge);
      return;
    }

    // Process incoming messages
    const body = req.body;
    if (body.object === 'whatsapp_business_account') {
      logger.info('WhatsApp webhook received', { body: JSON.stringify(body).slice(0, 200) });
    }

    res.status(200).json({ success: true });
  } catch (error) { next(error); }
}
