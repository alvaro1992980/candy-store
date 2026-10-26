import bcrypt from "bcryptjs";

export function verifyAdminPassword(plain: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) return Promise.resolve(false);
  return bcrypt.compare(plain, hash);
}
