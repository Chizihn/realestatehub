import prisma from "../config/database";
import { UserRegisterInput } from "../types";

export class UserRepository {
  async create(
    data: UserRegisterInput & { password: string; emailVerifyToken?: string }
  ) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    return prisma.user.update({
      where: { id },
      data: {
        refreshToken,
        lastLoginAt: new Date(),
      },
    });
  }

  async verifyEmail(token: string) {
    return prisma.user.updateMany({
      where: {
        emailVerifyToken: token,
        isEmailVerified: false,
      },
      data: {
        isEmailVerified: true,
        emailVerifyToken: null,
      },
    });
  }

  async setPasswordResetToken(email: string, token: string, expires: Date) {
    return prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });
  }

  async findByResetToken(token: string) {
    return prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });
  }

  async resetPassword(id: string, hashedPassword: string) {
    return prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        refreshToken: null, // Invalidate all sessions
      },
    });
  }

  async updatePassword(id: string, hashedPassword: string) {
    return prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        refreshToken: null, // Invalidate all sessions
      },
    });
  }

  async findByRefreshToken(refreshToken: string) {
    return prisma.user.findFirst({
      where: { refreshToken },
    });
  }

  async updateProfile(
    id: string,
    data: { name?: string; role?: "BUYER" | "SELLER" | "AGENT" }
  ) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
