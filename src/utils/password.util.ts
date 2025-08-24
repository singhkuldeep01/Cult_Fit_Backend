import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12; // Higher number = more secure but slower

export class PasswordUtil {
  /**
   * Hash a plain text password
   */
  static async hashPassword(plainPassword: string): Promise<string> {
    try {
      const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
      return hashedPassword;
    } catch (error) {
      throw new Error('Failed to hash password');
    }
  }

  /**
   * Compare a plain text password with a hashed password
   */
  static async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
      return isMatch;
    } catch (error) {
      throw new Error('Failed to compare passwords');
    }
  }
}
