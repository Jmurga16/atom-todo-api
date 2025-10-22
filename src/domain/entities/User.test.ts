import { UserFactory } from './User';

describe('UserFactory', () => {
  describe('create', () => {
    it('should create a user with lowercase and trimmed email', () => {
      const email = '  TEST@EXAMPLE.COM  ';
      const user = UserFactory.create(email);

      expect(user.email).toBe('test@example.com');
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should create a user with valid timestamps', () => {
      const email = 'user@example.com';
      const before = new Date();
      const user = UserFactory.create(email);
      const after = new Date();

      expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(user.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('validate', () => {
    it('should validate correct email formats', () => {
      expect(UserFactory.validate('user@example.com')).toBe(true);
      expect(UserFactory.validate('test.user@example.co.uk')).toBe(true);
      expect(UserFactory.validate('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(UserFactory.validate('')).toBe(false);
      expect(UserFactory.validate('invalid')).toBe(false);
      expect(UserFactory.validate('invalid@')).toBe(false);
      expect(UserFactory.validate('@example.com')).toBe(false);
      expect(UserFactory.validate('user@')).toBe(false);
      expect(UserFactory.validate('user @example.com')).toBe(false);
    });
  });
});
