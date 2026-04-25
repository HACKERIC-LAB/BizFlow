import { prisma } from '../utils/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from '../middlewares/errorHandler';
import { sendSMS } from '../utils/africasTalking';

const SALT_ROUNDS = 12;

function generateToken(payload: object, secret: string, expiresIn: string): string {
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function registerOwner(data: {
  businessName: string;
  businessType: string;
  businessPhone: string;
  fullName: string;
  ownerPhone: string;
  email?: string;
  password: string;
  services: { name: string; price: number; duration: number }[];
}) {
  const existingUser = await prisma.user.findFirst({
    where: { phone: data.ownerPhone },
  });
  if (existingUser) {
    throw new AppError('A user with this phone number already exists', 409);
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  const result = await prisma.$transaction(async (tx) => {
    const business = await tx.business.create({
      data: {
        name: data.businessName,
        type: data.businessType as any,
        phone: data.businessPhone,
      },
    });

    const user = await tx.user.create({
      data: {
        businessId: business.id,
        name: data.fullName,
        phone: data.ownerPhone,
        email: data.email,
        passwordHash,
        role: 'OWNER',
      },
    });

    // Bulk create services
    if (data.services.length > 0) {
      await tx.service.createMany({
        data: data.services.map((s) => ({
          businessId: business.id,
          name: s.name,
          price: s.price,
          duration: s.duration,
        })),
      });
    }

    return { business, user };
  });

  const jwtPayload = {
    userId: result.user.id,
    businessId: result.business.id,
    role: result.user.role,
    phone: result.user.phone,
  };

  const accessToken = generateToken(jwtPayload, config.JWT_SECRET, config.JWT_EXPIRES_IN);
  const refreshToken = generateToken(
    jwtPayload,
    config.REFRESH_TOKEN_SECRET,
    config.REFRESH_TOKEN_EXPIRES_IN
  );

  await prisma.user.update({
    where: { id: result.user.id },
    data: { refreshToken },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: result.user.id,
      name: result.user.name,
      phone: result.user.phone,
      email: result.user.email,
      role: result.user.role,
      businessId: result.business.id,
      businessName: result.business.name,
      businessType: result.business.type,
    },
  };
}

export async function login(phone: string, password: string) {
  const user = await prisma.user.findFirst({
    where: { phone, isActive: true },
    include: { business: true },
  });

  if (!user) throw new AppError('Invalid phone number or password', 401);
  if (!user.isActive) throw new AppError('Account is deactivated', 403);

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new AppError('Invalid phone number or password', 401);

  const jwtPayload = {
    userId: user.id,
    businessId: user.businessId,
    role: user.role,
    phone: user.phone,
  };

  const accessToken = generateToken(jwtPayload, config.JWT_SECRET, config.JWT_EXPIRES_IN);
  const refreshToken = generateToken(
    jwtPayload,
    config.REFRESH_TOKEN_SECRET,
    config.REFRESH_TOKEN_EXPIRES_IN
  );

  await prisma.user.update({ where: { id: user.id }, data: { refreshToken } });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      businessId: user.businessId,
      businessName: user.business.name,
      businessType: user.business.type,
    },
  };
}

export async function refreshToken(token: string) {
  try {
    const payload = jwt.verify(token, config.REFRESH_TOKEN_SECRET) as any;
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user || user.refreshToken !== token) {
      throw new AppError('Invalid refresh token', 401);
    }

    const newPayload = {
      userId: user.id,
      businessId: user.businessId,
      role: user.role,
      phone: user.phone,
    };
    const accessToken = generateToken(newPayload, config.JWT_SECRET, config.JWT_EXPIRES_IN);
    return { accessToken };
  } catch {
    throw new AppError('Invalid refresh token', 401);
  }
}

export async function logout(userId: string) {
  await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
}

export async function forgotPassword(phone: string) {
  const user = await prisma.user.findFirst({ where: { phone, isActive: true } });
  if (!user) return; // silent — don't reveal if user exists

  const otp = generateOtp();
  const otpExp = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await prisma.user.update({
    where: { id: user.id },
    data: { resetOtp: otp, resetOtpExp: otpExp },
  });

  await sendSMS(phone, `Your BizFlow OTP is: ${otp}. Valid for 15 minutes.`);
}

export async function resetPassword(phone: string, otp: string, newPassword: string) {
  const user = await prisma.user.findFirst({
    where: {
      phone,
      resetOtp: otp,
      resetOtpExp: { gt: new Date() },
    },
  });

  if (!user) throw new AppError('Invalid or expired OTP', 400);

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetOtp: null, resetOtpExp: null },
  });
}
