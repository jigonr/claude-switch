/**
 * Custom error classes for claude-switch
 */

export enum ErrorCode {
  CONFIG_NOT_FOUND = 'CONFIG_NOT_FOUND',
  INVALID_CONFIG = 'INVALID_CONFIG',
  PROVIDER_NOT_FOUND = 'PROVIDER_NOT_FOUND',
  CREDENTIAL_NOT_FOUND = 'CREDENTIAL_NOT_FOUND',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  SECURITY_ERROR = 'SECURITY_ERROR',
}

export class ClaudeSwitchError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ClaudeSwitchError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class SecurityError extends ClaudeSwitchError {
  constructor(message: string, details?: unknown) {
    super(message, ErrorCode.SECURITY_ERROR, details);
    this.name = 'SecurityError';
  }
}
