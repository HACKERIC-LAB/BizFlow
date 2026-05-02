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

router.post('/monthly-comparison', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { months } = req.body as { months: { year: number; month: number }[] };
    if (!months || !Array.isArray(months) || months.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid months array' });
    }

    const results = await Promise.all(
      months.map(async ({ year, month }) => {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59);

        const transactions = await prisma.transaction.findMany({
          where: {
            businessId: (req as any).businessId!,
            status: 'COMPLETED',
            createdAt: { gte: start, lte: end },
          },
          include: {
            services: { include: { service: { select: { name: true } } } },
          },
        });

        const totalRevenue = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
        const cashRevenue = transactions
          .filter((t) => t.paymentMethod === 'CASH')
          .reduce((sum, t) => sum + t.totalAmount, 0);
        const mpesaRevenue = transactions
          .filter((t) => t.paymentMethod === 'MPESA')
          .reduce((sum, t) => sum + t.totalAmount, 0);
        const transactionCount = transactions.length;

        // Top services
        const serviceMap = new Map<string, { name: string; count: number; revenue: number }>();
        for (const t of transactions) {
          for (const ts of t.services) {
            const key = ts.serviceId;
            const existing = serviceMap.get(key) || { name: ts.service.name, count: 0, revenue: 0 };
            serviceMap.set(key, {
              name: ts.service.name,
              count: existing.count + 1,
              revenue: existing.revenue + ts.price,
            });
          }
        }

        const topServices = Array.from(serviceMap.values())
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        return {
          year,
          month,
          period: `${year}-${String(month).padStart(2, '0')}`,
          totalRevenue,
          cashRevenue,
          mpesaRevenue,
          transactionCount,
          topServices,
        };
      })
    );

    // Sort chronologically
    results.sort((a, b) => a.year === b.year ? a.month - b.month : a.year - b.year);

    res.json({ success: true, data: results });
  } catch (error) { next(error); }
});

export default router;
