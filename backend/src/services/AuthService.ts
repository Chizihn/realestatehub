import { UserRepository } from "../repositories/UserRepository";
import {
  UserRegisterInput,
  UserLoginInput,
  AuthResponse,
  ResetPasswordInput,
} from "../types";
import {
  hashPassword,
  comparePassword,
  generateTokenWithExpiry,
} from "../utils/crypto";
import { generateTokens, verifyToken } from "../utils/jwt";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/email";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(
    data: UserRegisterInput
  ): Promise<{ user: any; message: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Generate email verification token
    const emailVerifyToken = generateTokenWithExpiry(24).token; // 24 hours

    // Create user
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
      emailVerifyToken,
    });

    // Send verification email
    try {
      await sendVerificationEmail(user.email, user.name, emailVerifyToken);
    } catch (error) {
      console.error("Failed to send verification email:", error);
      // Don't fail registration if email fails
    }

    return {
      user,
      message:
        "Registration successful. Please check your email to verify your account.",
    };
  }

  async login(data: UserLoginInput): Promise<AuthResponse> {
    // Find user by email
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check password
    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Update refresh token in database
    await this.userRepository.updateRefreshToken(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const decoded = verifyToken(refreshToken);

      // Find user with this refresh token
      const user = await this.userRepository.findByRefreshToken(refreshToken);
      if (!user || user.id !== decoded.userId) {
        throw new Error("Invalid refresh token");
      }

      // Generate new tokens
      const tokens = generateTokens(user);

      // Update refresh token in database
      await this.userRepository.updateRefreshToken(
        user.id,
        tokens.refreshToken
      );

      return tokens;
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.updateRefreshToken(userId, null);
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const result = await this.userRepository.verifyEmail(token);

    if (result.count === 0) {
      throw new Error("Invalid or expired verification token");
    }

    return { message: "Email verified successfully" };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not
      return {
        message:
          "If an account with that email exists, we have sent a password reset link.",
      };
    }

    // Generate reset token
    const { token, expires } = generateTokenWithExpiry(1); // 1 hour

    // Save reset token
    await this.userRepository.setPasswordResetToken(email, token, expires);

    // Send reset email
    try {
      await sendPasswordResetEmail(user.email, user.name, token);
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      throw new Error("Failed to send password reset email");
    }

    return {
      message:
        "If an account with that email exists, we have sent a password reset link.",
    };
  }

  async resetPassword(data: ResetPasswordInput): Promise<{ message: string }> {
    // Find user by reset token
    const user = await this.userRepository.findByResetToken(data.token);
    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    // Hash new password
    const hashedPassword = await hashPassword(data.newPassword);

    // Update password and clear reset token
    await this.userRepository.resetPassword(user.id, hashedPassword);

    return { message: "Password reset successfully" };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    // Get user with password
    const user = await this.userRepository.findByEmail(
      (await this.userRepository.findById(userId))?.email || ""
    );
    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await this.userRepository.updatePassword(userId, hashedPassword);

    return { message: "Password changed successfully" };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async updateProfile(
    userId: string,
    data: { name?: string; role?: "BUYER" | "SELLER" | "AGENT" }
  ) {
    const user = await this.userRepository.updateProfile(userId, data);
    return user;
  }
}
