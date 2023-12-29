import { Test, TestingModule } from '@nestjs/testing';
import { PasswordHashService } from './password-hash.service';

describe('PasswordHashService', () => {
  let passwordHashService: PasswordHashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordHashService],
    }).compile();

    passwordHashService = module.get<PasswordHashService>(PasswordHashService);
  });

  describe('hashPassword', () => {
    it('should hash the given password', async () => {
      const password = 'testPassword';

      // Call the 'hashPassword' method and get the hashed password
      const hashedPassword = await passwordHashService.hashPassword(password);

      // Assert that the hashed password is defined and is a string
      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
    });
  });

  describe('comparePasswords', () => {
    it('should return true when comparing a plain password with its hashed version', async () => {
      const password = 'testPassword';

      // Hash the sample password
      const hashedPassword = await passwordHashService.hashPassword(password);

      // Call the 'comparePasswords' method and check if it returns true
      const isMatch = await passwordHashService.comparePasswords(
        password,
        hashedPassword,
      );

      // Assert that the result is true
      expect(isMatch).toBe(true);
    });

    it('should return false when comparing different passwords', async () => {
      const password1 = 'testPassword1';
      const password2 = 'testPassword2';

      // Hash the first sample password
      const hashedPassword = await passwordHashService.hashPassword(password1);

      // Call the 'comparePasswords' method with the second sample password and the hashed version of the first password
      const isMatch = await passwordHashService.comparePasswords(
        password2,
        hashedPassword,
      );

      // Assert that the result is false
      expect(isMatch).toBe(false);
    });
  });
});
