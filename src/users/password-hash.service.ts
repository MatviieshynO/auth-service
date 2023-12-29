import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHashService {
  constructor() {}

  // Hash the given password using bcrypt
  async hashPassword(password: string): Promise<string> {
    try {
      const salt: string = await bcrypt.genSalt();
      const hashedPassword: string = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw error;
    }
  }

  // Compare a plain password with a hashed password
  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw error;
    }
  }
}
