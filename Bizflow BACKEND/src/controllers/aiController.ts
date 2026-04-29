import { Request, Response, NextFunction } from 'express';
import * as aiService from '../services/aiService';

export async function suggestReply(req: Request, res: Response, next: NextFunction) {
  try {
    const { customerMessage } = req.body;
    const data = await aiService.suggestReply((req as any).businessId!, customerMessage);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function chat(req: Request, res: Response, next: NextFunction) {
  try {
    const { message } = req.body;
    const reply = await aiService.chat((req as any).businessId!, message);
    res.json({ success: true, data: { reply } });
  } catch (error) { next(error); }
}

export async function getWeeklySummary(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await aiService.getWeeklySummary((req as any).businessId!);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function getRevenueInsights(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await aiService.getRevenueInsights((req as any).businessId!);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function recordFeedback(req: Request, res: Response, next: NextFunction) {
  try {
    const { interactionId, feedback } = req.body;
    const data = await aiService.recordFeedback((req as any).businessId!, interactionId, feedback);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}
