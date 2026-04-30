import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import bcrypt from 'bcrypt';
import { AppError } from '../middlewares/errorHandler';

const SALT_ROUNDS = 12;

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        profilePhoto: true,
        commission: true,
        business: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        }
      }
    });

    if (!user) throw new AppError('User not found', 404);
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
}

export async function updateMe(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.userId;
    const { name, email, profilePhoto } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, email, profilePhoto },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        profilePhoto: true,
      }
    });

    res.json({ success: true, data: user });
  } catch (error) { next(error); }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.userId;
    const { oldPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('User not found', 404);

    const isValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isValid) throw new AppError('Invalid current password', 401);

    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash }
    });

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) { next(error); }
}

export async function uploadPhoto(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.userId;
    if (!req.file) throw new AppError('No file uploaded', 400);

    const photoUrl = `/uploads/profiles/${req.file.filename}`;
    
    await prisma.user.update({
      where: { id: userId },
      data: { profilePhoto: photoUrl }
    });

    res.json({ success: true, data: { photoUrl } });
  } catch (error) { next(error); }
}
