/**
 * Tests for Zod schema validation
 */

import { describe, it, expect } from 'vitest';
import { ZodError } from 'zod';
import {
  ConfigSchema,
  ProviderSchema,
  ProviderNameSchema,
  ProviderTypeSchema,
  ProjectConfigSchema,
} from '../../../src/config/schema.js';
import { validConfig, validProviders, invalidConfigs } from '../../fixtures/config.js';

describe('ProviderNameSchema', () => {
  it('should accept valid provider names', () => {
    expect(ProviderNameSchema.parse('claude-pro-max')).toBe('claude-pro-max');
    expect(ProviderNameSchema.parse('anthropic')).toBe('anthropic');
    expect(ProviderNameSchema.parse('z.ai')).toBe('z.ai');
  });

  it('should reject invalid provider names', () => {
    expect(() => ProviderNameSchema.parse('invalid-provider')).toThrow(ZodError);
    expect(() => ProviderNameSchema.parse('openai')).toThrow(ZodError);
    expect(() => ProviderNameSchema.parse('')).toThrow(ZodError);
  });

  it('should be case-sensitive', () => {
    expect(() => ProviderNameSchema.parse('Claude-Pro-Max')).toThrow(ZodError);
    expect(() => ProviderNameSchema.parse('ANTHROPIC')).toThrow(ZodError);
  });
});

describe('ProviderTypeSchema', () => {
  it('should accept valid provider types', () => {
    expect(ProviderTypeSchema.parse('subscription')).toBe('subscription');
    expect(ProviderTypeSchema.parse('api')).toBe('api');
  });

  it('should reject invalid provider types', () => {
    expect(() => ProviderTypeSchema.parse('free')).toThrow(ZodError);
    expect(() => ProviderTypeSchema.parse('trial')).toThrow(ZodError);
  });
});

describe('ProviderSchema', () => {
  it('should validate a valid provider', () => {
    const result = ProviderSchema.parse(validProviders['claude-pro-max']);
    expect(result.type).toBe('subscription');
    expect(result.description).toBeDefined();
  });

  it('should require type field', () => {
    const invalidProvider = {
      description: 'Missing type',
      settings: { env: {} },
    };
    expect(() => ProviderSchema.parse(invalidProvider)).toThrow(ZodError);
  });

  it('should require description field', () => {
    const invalidProvider = {
      type: 'api',
      settings: { env: {} },
    };
    expect(() => ProviderSchema.parse(invalidProvider)).toThrow(ZodError);
  });

  it('should require settings with env', () => {
    const invalidProvider = {
      type: 'api',
      description: 'Missing settings',
    };
    expect(() => ProviderSchema.parse(invalidProvider)).toThrow(ZodError);
  });

  it('should allow empty env object', () => {
    const provider = {
      type: 'subscription',
      description: 'Empty env',
      settings: { env: {} },
    };
    const result = ProviderSchema.parse(provider);
    expect(result.settings.env).toEqual({});
  });

  it('should accept env with multiple keys', () => {
    const provider = {
      type: 'api',
      description: 'Multiple env vars',
      settings: {
        env: {
          ANTHROPIC_API_KEY: 'test-key',
          API_TIMEOUT_MS: '30000',
          CUSTOM_VAR: 'custom-value',
        },
      },
    };
    const result = ProviderSchema.parse(provider);
    expect(Object.keys(result.settings.env)).toHaveLength(3);
  });
});

describe('ConfigSchema', () => {
  it('should validate a valid configuration', () => {
    const result = ConfigSchema.parse(validConfig);
    expect(result.version).toBe('1.0');
    expect(result.currentProvider).toBe('claude-pro-max');
    expect(result.providers).toBeDefined();
  });

  it('should require version 1.0', () => {
    expect(() => ConfigSchema.parse(invalidConfigs.wrongVersion)).toThrow(ZodError);
  });

  it('should reject missing version', () => {
    expect(() => ConfigSchema.parse(invalidConfigs.missingVersion)).toThrow(ZodError);
  });

  it('should require valid currentProvider', () => {
    expect(() => ConfigSchema.parse(invalidConfigs.invalidProvider)).toThrow(ZodError);
  });

  it('should require providers object', () => {
    const configWithoutProviders = {
      version: '1.0',
      currentProvider: 'claude-pro-max',
    };
    expect(() => ConfigSchema.parse(configWithoutProviders)).toThrow(ZodError);
  });

  it('should validate all providers in the config', () => {
    const result = ConfigSchema.parse(validConfig);
    expect(result.providers['claude-pro-max']).toBeDefined();
    expect(result.providers['anthropic']).toBeDefined();
    expect(result.providers['z.ai']).toBeDefined();
  });

  it('should allow partial providers', () => {
    const partialConfig = {
      version: '1.0',
      currentProvider: 'claude-pro-max',
      providers: {
        'claude-pro-max': validProviders['claude-pro-max'],
      },
    };
    const result = ConfigSchema.parse(partialConfig);
    expect(Object.keys(result.providers)).toHaveLength(1);
  });
});

describe('ProjectConfigSchema', () => {
  it('should validate project config with provider', () => {
    const projectConfig = { provider: 'anthropic' };
    const result = ProjectConfigSchema.parse(projectConfig);
    expect(result.provider).toBe('anthropic');
  });

  it('should allow inherits field', () => {
    const projectConfig = {
      provider: 'z.ai',
      inherits: 'global',
    };
    const result = ProjectConfigSchema.parse(projectConfig);
    expect(result.inherits).toBe('global');
  });

  it('should require valid provider name', () => {
    const invalidProject = { provider: 'invalid' };
    expect(() => ProjectConfigSchema.parse(invalidProject)).toThrow(ZodError);
  });

  it('should allow optional inherits', () => {
    const projectConfig = { provider: 'claude-pro-max' };
    const result = ProjectConfigSchema.parse(projectConfig);
    expect(result.inherits).toBeUndefined();
  });
});
