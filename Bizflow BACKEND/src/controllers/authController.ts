import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { z } from 'zod';

const registerSchema = z.object({
  businessName: z.string().min(2),
  businessType: z.enum(['BARBERSHOP', 'SALON', 'GYM', 'SPA', 'OTHER']),
  businessPhone: z.string().min(9),
  fullName: z.string().min(2),
  ownerPhone: z.string().min(9),
  email: z.string().email().optional().or(z.literal('')),
  password: z.string().min(6),
  services: z.array(z.object({
    name: z.string().min(1),
    price: z.number().min(0),
    duration: z.number().min(0),
  })).min(1),
});

export async function registerOwner(req: Request, res: Response, next: NextFunction) {
  try {
    const data = registerSchema.parse(req.body);
    const result = await authService.registerOwner(data);
    res.status(201).json({ success: true, data: result });
  } catch (error) { next(error); }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { phone, password } = req.body;
    const result = await authService.login(phone, password);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.logout((req as any).user!.userId);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) { next(error); }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { phone } = req.body;
    await authService.forgotPassword(phone);
    res.json({ success: true, message: 'OTP sent if account exists' });
  } catch (error) { next(error); }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { phone, otp, newPassword } = req.body;
    await authService.resetPassword(phone, otp, newPassword);
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) { next(error); }
}
