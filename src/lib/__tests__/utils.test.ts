import {
  cn,
  formatDate,
  formatTime,
  formatRelativeTime,
  generateId,
  debounce,
  throttle,
  isValidEmail,
  validatePassword,
  copyToClipboard,
  formatFileSize,
  delay,
} from '../utils';

describe('Utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
      expect(cn('class1', undefined, 'class2')).toBe('class1 class2');
      expect(cn('class1', false && 'class2', 'class3')).toBe('class1 class3');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date);
      expect(result).toContain('15');
      expect(result).toContain('января');
      expect(result).toContain('2024');
    });

    it('should handle string dates', () => {
      const result = formatDate('2024-01-15');
      expect(result).toContain('15');
      expect(result).toContain('января');
    });
  });

  describe('formatTime', () => {
    it('should format time correctly', () => {
      const date = new Date('2024-01-15T14:30:00');
      const result = formatTime(date);
      expect(result).toBe('14:30');
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15T12:00:00'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return "только что" for recent times', () => {
      const recent = new Date('2024-01-15T11:59:30');
      expect(formatRelativeTime(recent)).toBe('только что');
    });

    it('should return minutes for times within an hour', () => {
      const minutesAgo = new Date('2024-01-15T11:30:00');
      expect(formatRelativeTime(minutesAgo)).toBe('30 мин назад');
    });

    it('should return hours for times within a day', () => {
      const hoursAgo = new Date('2024-01-15T08:00:00');
      expect(formatRelativeTime(hoursAgo)).toBe('4 ч назад');
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBe(9);
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should debounce function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should throttle function calls', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('StrongPass123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject weak passwords', () => {
      const result = validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Пароль должен содержать минимум 8 символов'
      );
      expect(result.errors).toContain(
        'Пароль должен содержать заглавную букву'
      );
      expect(result.errors).toContain('Пароль должен содержать цифру');
    });
  });

  describe('copyToClipboard', () => {
    it('should copy text to clipboard', async () => {
      const mockClipboard = {
        writeText: jest.fn().mockResolvedValue(undefined),
      };
      Object.assign(navigator, { clipboard: mockClipboard });

      const result = await copyToClipboard('test text');
      expect(result).toBe(true);
      expect(mockClipboard.writeText).toHaveBeenCalledWith('test text');
    });

    it('should fallback to execCommand for older browsers', async () => {
      const mockClipboard = {
        writeText: jest.fn().mockRejectedValue(new Error('Not supported')),
      };
      Object.assign(navigator, { clipboard: mockClipboard });

      // Mock document.execCommand
      Object.defineProperty(document, 'execCommand', {
        value: jest.fn().mockReturnValue(true),
        writable: true,
      });

      const result = await copyToClipboard('test text');
      expect(result).toBe(true);
    });
  });

  describe('formatFileSize', () => {
    it('should format file sizes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Б');
      expect(formatFileSize(1024)).toBe('1 КБ');
      expect(formatFileSize(1048576)).toBe('1 МБ');
      expect(formatFileSize(1073741824)).toBe('1 ГБ');
    });
  });

  describe('delay', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should delay execution', async () => {
      const promise = delay(100);

      jest.advanceTimersByTime(100);
      await promise;
    });
  });
});
