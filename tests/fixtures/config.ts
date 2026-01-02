/**
 * Test fixtures for claude-switch
 */

import type {
  Config,
  Provider,
  ProviderName,
} from '../../src/config/schema.js';

/**
 * Valid minimal configuration for testing
 */
export const validConfig: Config = {
  version: '1.0',
  currentProvider: 'claude-pro-max',
  providers: {
    'claude-pro-max': {
      type: 'subscription',
      description: 'Claude Pro subscription',
      settings: {
        env: {
          API_TIMEOUT_MS: '3000000',
        },
      },
    },
    anthropic: {
      type: 'api',
      description: 'Anthropic API',
      settings: {
        env: {
          ANTHROPIC_API_KEY_FILE: '~/.claude/credentials/anthropic.key',
          API_TIMEOUT_MS: '3000000',
        },
      },
    },
    'z.ai': {
      type: 'api',
      description: 'z.ai API',
      settings: {
        env: {
          ANTHROPIC_API_KEY_FILE: '~/.claude/credentials/zai.key',
          API_TIMEOUT_MS: '3000000',
          ANTHROPIC_DEFAULT_OPUS_MODEL: 'glm-4.7',
          ANTHROPIC_DEFAULT_SONNET_MODEL: 'glm-4.7',
          ANTHROPIC_DEFAULT_HAIKU_MODEL: 'glm-4.5-air',
        },
      },
    },
  },
};

/**
 * Valid provider configurations for testing
 */
export const validProviders: Record<ProviderName, Provider> = {
  'claude-pro-max': {
    type: 'subscription',
    description: 'Claude Pro subscription',
    settings: { env: { API_TIMEOUT_MS: '3000000' } },
  },
  anthropic: {
    type: 'api',
    description: 'Anthropic API',
    settings: { env: { ANTHROPIC_API_KEY: 'test-key' } },
  },
  'z.ai': {
    type: 'api',
    description: 'z.ai API',
    settings: { env: { ANTHROPIC_API_KEY: 'zai-key' } },
  },
};

/**
 * Invalid configuration samples for error testing
 */
export const invalidConfigs = {
  missingVersion: {
    currentProvider: 'claude-pro-max',
    providers: {},
  },
  wrongVersion: {
    version: '2.0',
    currentProvider: 'claude-pro-max',
    providers: {},
  },
  invalidProvider: {
    version: '1.0',
    currentProvider: 'invalid-provider',
    providers: {},
  },
  missingProviderType: {
    version: '1.0',
    currentProvider: 'claude-pro-max',
    providers: {
      'claude-pro-max': {
        description: 'Missing type field',
        settings: { env: {} },
      },
    },
  },
};

/**
 * Mock project configuration
 */
export const validProjectConfig = {
  provider: 'anthropic' as ProviderName,
};

/**
 * Mock environment settings
 */
export const mockEnvSettings = {
  ANTHROPIC_API_KEY: 'sk-test-key-1234567890abcdef1234567890abcdef',
  ANTHROPIC_BASE_URL: 'https://api.anthropic.com',
  API_TIMEOUT_MS: '3000000',
};
