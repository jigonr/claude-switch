/**
 * Tests for logger utilities
 */

import test from 'ava';
import { redactApiKey } from '../../../src/utils/logger.js';

test('redactApiKey redacts API keys', (t) => {
  const input = 'The key is sk-ant-api03-1234567890abcdefghijklmnopqrstuvwxyz1234567890abcd here';
  const redacted = redactApiKey(input);

  t.false(redacted.includes('sk-ant'));
  t.true(redacted.includes('sk-***REDACTED***'));
});

test('redactApiKey handles strings without API keys', (t) => {
  const input = 'No API key here';
  const redacted = redactApiKey(input);

  t.is(redacted, input);
});

test('redactApiKey handles multiple API keys', (t) => {
  const input = 'Key 1: sk-ant-api03-abcdefghijklmnopqrstuvwxyz1234567890abcdefghijkl and Key 2: sk-ant-sid01-zyxwvutsrqponmlkjihgfedcba0987654321zyxwvu';
  const redacted = redactApiKey(input);

  t.false(redacted.includes('sk-ant-api03'));
  t.false(redacted.includes('sk-ant-sid01'));
  const matches = redacted.match(/sk-\*\*\*REDACTED\*\*\*/g);
  t.is(matches?.length, 2);
});
