/**
 * Tests for application constants
 */

import { describe, it, expect } from 'vitest';
import {
  CLAUDE_DIR_NAME,
  CONFIG_FILE_NAME,
  SETTINGS_FILE_NAME,
  CREDENTIALS_DIR_NAME,
  LEGACY_GLM_CONFIG_FILE,
  PROJECT_CONFIG_FILES,
  CONFIG_VERSION,
  PROVIDER_NAMES,
  PROVIDER_TYPES,
  API_TIMEOUT_MS,
  ZAI_DEFAULT_MODELS,
  ANTHROPIC_DEFAULT_MODELS,
  API_KEY_MIN_LENGTH,
  API_KEY_REDACTION_PATTERN,
  API_KEY_REDACTED_TEXT,
  SECURE_FILE_MODE,
  DIRECTORY_MODE,
  ENV_VARS,
} from '../../../src/core/constants.js';

describe('Configuration Paths', () => {
  it('should have correct Claude directory name', () => {
    expect(CLAUDE_DIR_NAME).toBe('.claude');
    expect(CLAUDE_DIR_NAME).toMatch(/^\./); // Should be hidden directory
  });

  it('should have correct config file name', () => {
    expect(CONFIG_FILE_NAME).toBe('switch-config.json');
    expect(CONFIG_FILE_NAME).toMatch(/\.json$/);
  });

  it('should have correct settings file name', () => {
    expect(SETTINGS_FILE_NAME).toBe('settings.json');
  });

  it('should have correct credentials directory name', () => {
    expect(CREDENTIALS_DIR_NAME).toBe('credentials');
  });

  it('should have legacy GLM config file name', () => {
    expect(LEGACY_GLM_CONFIG_FILE).toBe('glm-config.json');
  });

  it('should have project config files array', () => {
    expect(PROJECT_CONFIG_FILES).toContain('.claude-switch.json');
    expect(PROJECT_CONFIG_FILES).toContain('.claude/config.json');
    expect(PROJECT_CONFIG_FILES).toHaveLength(2);
  });
});

describe('Configuration Constants', () => {
  it('should have correct version', () => {
    expect(CONFIG_VERSION).toBe('1.0');
  });
});

describe('Provider Names', () => {
  it('should have all expected provider names', () => {
    expect(PROVIDER_NAMES).toContain('claude-pro-max');
    expect(PROVIDER_NAMES).toContain('anthropic');
    expect(PROVIDER_NAMES).toContain('z.ai');
    expect(PROVIDER_NAMES).toHaveLength(3);
  });

  it('should be an immutable tuple at compile time', () => {
    // TypeScript `as const` ensures immutability at compile time
    // At runtime, we can verify it's an array with expected values
    expect(Array.isArray(PROVIDER_NAMES)).toBe(true);
    expect(PROVIDER_NAMES).toHaveLength(3);
  });
});

describe('Provider Types', () => {
  it('should have subscription and api types', () => {
    expect(PROVIDER_TYPES).toContain('subscription');
    expect(PROVIDER_TYPES).toContain('api');
    expect(PROVIDER_TYPES).toHaveLength(2);
  });
});

describe('API Configuration', () => {
  it('should have reasonable API timeout (50 minutes)', () => {
    expect(API_TIMEOUT_MS).toBe(3_000_000);
    expect(API_TIMEOUT_MS).toBeGreaterThan(0);
  });
});

describe('Default Model Names', () => {
  it('should have z.ai default models', () => {
    expect(ZAI_DEFAULT_MODELS.opus).toBe('glm-4.7');
    expect(ZAI_DEFAULT_MODELS.sonnet).toBe('glm-4.7');
    expect(ZAI_DEFAULT_MODELS.haiku).toBe('glm-4.5-air');
  });

  it('should have Anthropic default models', () => {
    expect(ANTHROPIC_DEFAULT_MODELS.opus).toBe('claude-3-opus-20240229');
    expect(ANTHROPIC_DEFAULT_MODELS.sonnet).toBe('claude-3-5-sonnet-20241022');
    expect(ANTHROPIC_DEFAULT_MODELS.haiku).toBe('claude-3-5-haiku-20241022');
  });

  it('should have claude model naming pattern for Anthropic', () => {
    expect(ANTHROPIC_DEFAULT_MODELS.opus).toMatch(/^claude-/);
    expect(ANTHROPIC_DEFAULT_MODELS.sonnet).toMatch(/^claude-/);
    expect(ANTHROPIC_DEFAULT_MODELS.haiku).toMatch(/^claude-/);
  });

  it('should have glm model naming pattern for z.ai', () => {
    expect(ZAI_DEFAULT_MODELS.opus).toMatch(/^glm-/);
    expect(ZAI_DEFAULT_MODELS.sonnet).toMatch(/^glm-/);
    expect(ZAI_DEFAULT_MODELS.haiku).toMatch(/^glm-/);
  });
});

describe('Security Constants', () => {
  it('should have API key minimum length', () => {
    expect(API_KEY_MIN_LENGTH).toBe(40);
    expect(API_KEY_MIN_LENGTH).toBeGreaterThan(0);
  });

  it('should match sk-* API key format', () => {
    const testKey = 'sk-ant-api03-1234567890abcdef1234567890abcdef1234567890';
    expect(testKey).toMatch(API_KEY_REDACTION_PATTERN);
  });

  it('should not match short keys', () => {
    expect('sk-short').not.toMatch(API_KEY_REDACTION_PATTERN);
  });

  it('should not match non-sk prefixed strings', () => {
    expect('api-key-1234567890abcdef1234567890abcdef1234567890').not.toMatch(API_KEY_REDACTION_PATTERN);
  });

  it('should have redaction text', () => {
    expect(API_KEY_REDACTED_TEXT).toBe('sk-***REDACTED***');
  });
});

describe('File Permissions', () => {
  it('should have secure file mode (600)', () => {
    expect(SECURE_FILE_MODE).toBe(0o600);
  });

  it('should have directory mode (755)', () => {
    expect(DIRECTORY_MODE).toBe(0o755);
  });
});

describe('Environment Variables', () => {
  it('should have all expected env var names', () => {
    expect(ENV_VARS.ANTHROPIC_API_KEY).toBe('ANTHROPIC_API_KEY');
    expect(ENV_VARS.ANTHROPIC_BASE_URL).toBe('ANTHROPIC_BASE_URL');
    expect(ENV_VARS.API_TIMEOUT_MS).toBe('API_TIMEOUT_MS');
  });

  it('should have model override env vars', () => {
    expect(ENV_VARS.ANTHROPIC_DEFAULT_OPUS_MODEL).toBe('ANTHROPIC_DEFAULT_OPUS_MODEL');
    expect(ENV_VARS.ANTHROPIC_DEFAULT_SONNET_MODEL).toBe('ANTHROPIC_DEFAULT_SONNET_MODEL');
    expect(ENV_VARS.ANTHROPIC_DEFAULT_HAIKU_MODEL).toBe('ANTHROPIC_DEFAULT_HAIKU_MODEL');
  });
});
