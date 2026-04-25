import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';

export async function tenantIsolation(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const businessId = req.headers['x-business-id'] as string | undefined;

  if (!businessId) {
    res.status(400).json({ success: false, message: 'X-Business-Id header is required' });
    return;
  }

  if (!(req as any).user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  // Ensure the user belongs to this business
  if ((req as any).user.businessId !== businessId) {
    res.status(403).json({ success: false, message: 'Access denied to this business' });
    return;
  }

  // Verify business exists
  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) {
    res.status(404).json({ success: false, message: 'Business not found' });
    return;
  }

  (req as any).businessId = businessId;
  next();
}
