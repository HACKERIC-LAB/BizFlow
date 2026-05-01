import { Router } from 'express';
import { prisma } from '../../utils/prisma';
import { Request, Response, NextFunction } from 'express';

const router = Router();

router.get('/daily', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date } = req.query;
    const day = date ? new Date(date as string) : new Date();
    day.setHours(0, 0, 0, 0);
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);

    const transactions = await prisma.transaction.findMany({
      where: {
        businessId: (req as any).businessId!,
        status: 'COMPLETED',
        createdAt: { gte: day, lt: nextDay },
      },
      include: {
        customer: { select: { name: true, phone: true } },
        services: { include: { service: { select: { name: true } } } },
        user: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: transactions, date: day.toISOString() });
  } catch (error) { next(error); }
});

router.get('/monthly', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { year, month } = req.query;
    const y = Number(year) || new Date().getFullYear();
    const m = Number(month) || new Date().getMonth() + 1;
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0, 23, 59, 59);

    const transactions = await prisma.transaction.findMany({
      where: {
        businessId: (req as any).businessId!,
        status: 'COMPLETED',
        createdAt: { gte: start, lte: end },
      },
      include: {
        customer: { select: { name: true, phone: true } },
        services: { include: { service: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalRevenue = transactions.reduce((s, t) => s + t.totalAmount, 0);
    res.json({ success: true, data: transactions, totalRevenue, period: `${y}-${m}` });
  } catch (error) { next(error); }
});

export default router;
