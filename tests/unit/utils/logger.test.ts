/**
 * Tests for logger utilities
 */

import { describe, it, expect } from 'vitest';
import { redactApiKey } from '../../../src/utils/logger.js';

describe('redactApiKey', () => {
  it('should redact API keys', () => {
    const input = 'The key is sk-ant-api03-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcd here';
    const redacted = redactApiKey(input);

    expect(redacted).not.toContain('sk-ant');
    expect(redacted).toContain('sk-***REDACTED***');
  });

  it('should handle strings without API keys', () => {
    const input = 'No API key here';
    const redacted = redactApiKey(input);

    expect(redacted).toBe(input);
  });

  it('should handle multiple API keys', () => {
    const input = 'Key 1: sk-ant-api03-abcdefghijklmnopqrstuvwxyz1234567890abcdefghijkl and Key 2: sk-ant-sid01-zyxwvutsrqponmlkjihgfedcba0987654321zyxwvu';
    const redacted = redactApiKey(input);

    expect(redacted).not.toContain('sk-ant-api03');
    expect(redacted).not.toContain('sk-ant-sid01');
    const matches = redacted.match(/sk-\*\*\*REDACTED\*\*\*/g);
    expect(matches).toHaveLength(2);
  });

  it('should handle empty strings', () => {
    const redacted = redactApiKey('');
    expect(redacted).toBe('');
  });

  it('should handle short key-like strings', () => {
    const input = 'Short key: sk-short';
    const redacted = redactApiKey(input);
    // Short keys shouldn't be redacted
    expect(redacted).toBe(input);
  });
});
