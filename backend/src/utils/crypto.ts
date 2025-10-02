import crypto from "crypto";
import bcrypt from "bcryptjs";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateRandomToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

export const generateTokenWithExpiry = (hours: number = 1) => {
  const token = generateRandomToken();
  const expires = new Date();
  expires.setHours(expires.getHours() + hours);
  return { token, expires };
};
