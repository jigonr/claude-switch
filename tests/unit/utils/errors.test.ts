/**
 * Tests for custom error classes
 */

import { describe, it, expect } from 'vitest';
import { ErrorCode, ClaudeSwitchError, SecurityError } from '../../../src/utils/errors.js';

describe('ErrorCode', () => {
  it('should have all expected error codes', () => {
    expect(ErrorCode.CONFIG_NOT_FOUND).toBe('CONFIG_NOT_FOUND');
    expect(ErrorCode.INVALID_CONFIG).toBe('INVALID_CONFIG');
    expect(ErrorCode.PROVIDER_NOT_FOUND).toBe('PROVIDER_NOT_FOUND');
    expect(ErrorCode.CREDENTIAL_NOT_FOUND).toBe('CREDENTIAL_NOT_FOUND');
    expect(ErrorCode.PERMISSION_ERROR).toBe('PERMISSION_ERROR');
    expect(ErrorCode.SECURITY_ERROR).toBe('SECURITY_ERROR');
  });
});

describe('ClaudeSwitchError', () => {
  it('should create error with message and code', () => {
    const error = new ClaudeSwitchError('Test error', ErrorCode.CONFIG_NOT_FOUND);

    expect(error.message).toBe('Test error');
    expect(error.code).toBe(ErrorCode.CONFIG_NOT_FOUND);
    expect(error.name).toBe('ClaudeSwitchError');
    expect(error.details).toBeUndefined();
  });

  it('should include details when provided', () => {
    const details = { path: '/some/path', reason: 'file not found' };
    const error = new ClaudeSwitchError('Test error', ErrorCode.PROVIDER_NOT_FOUND, details);

    expect(error.details).toEqual(details);
  });

  it('should be an instance of Error', () => {
    const error = new ClaudeSwitchError('Test', ErrorCode.INVALID_CONFIG);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ClaudeSwitchError);
  });

  it('should have a stack trace', () => {
    const error = new ClaudeSwitchError('Test', ErrorCode.CREDENTIAL_NOT_FOUND);

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('ClaudeSwitchError');
  });

  it('should work with try/catch', () => {
    const throwError = () => {
      throw new ClaudeSwitchError('Thrown error', ErrorCode.PROVIDER_NOT_FOUND);
    };

    expect(throwError).toThrow(ClaudeSwitchError);
    expect(throwError).toThrow('Thrown error');
  });

  it('should preserve error details through catch', () => {
    try {
      throw new ClaudeSwitchError('Test', ErrorCode.PERMISSION_ERROR, { file: 'test.json' });
    } catch (error) {
      expect((error as ClaudeSwitchError).details).toEqual({ file: 'test.json' });
    }
  });
});

describe('SecurityError', () => {
  it('should create security error with message', () => {
    const error = new SecurityError('Path traversal detected');

    expect(error.message).toBe('Path traversal detected');
    expect(error.code).toBe(ErrorCode.SECURITY_ERROR);
    expect(error.name).toBe('SecurityError');
  });

  it('should include details when provided', () => {
    const details = { attemptedPath: '../../../etc/passwd' };
    const error = new SecurityError('Path traversal', details);

    expect(error.details).toEqual(details);
  });

  it('should be an instance of ClaudeSwitchError', () => {
    const error = new SecurityError('Test');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ClaudeSwitchError);
    expect(error).toBeInstanceOf(SecurityError);
  });

  it('should inherit error code from parent', () => {
    const error = new SecurityError('Security violation');

    expect(error.code).toBe(ErrorCode.SECURITY_ERROR);
  });
});
