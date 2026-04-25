declare namespace Express {
  interface Request {
    user?: import('../middlewares/auth').JwtPayload;
    businessId?: string;
  }
}
