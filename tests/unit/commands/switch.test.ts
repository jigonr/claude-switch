/**
 * Tests for switch command
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'node:fs/promises';

// Mock fs module
vi.mock('node:fs/promises');

// Mock logger
vi.mock('../../../src/utils/logger.js', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Use vi.hoisted to define mock config before vi.mock hoisting
const { mockConfig } = vi.hoisted(() => ({
  mockConfig: {
    version: '1.0',
    currentProvider: 'claude-pro-max',
    providers: {
      'claude-pro-max': {
        type: 'subscription',
        description: 'Claude Pro subscription',
        settings: { env: { API_TIMEOUT_MS: '3000000' } },
      },
      'anthropic': {
        type: 'api',
        description: 'Anthropic API',
        settings: { env: { ANTHROPIC_API_KEY: 'test-key' } },
      },
      'z.ai': {
        type: 'api',
        description: 'z.ai API',
        settings: { env: { ANTHROPIC_API_KEY: 'zai-key' } },
      },
    },
  },
}));

// Mock the detector module to return valid config
vi.mock('../../../src/config/detector.js', () => ({
  loadConfigWithOverride: vi.fn().mockResolvedValue({
    version: '1.0',
    currentProvider: 'claude-pro-max',
    providers: {
      'claude-pro-max': {
        type: 'subscription',
        description: 'Claude Pro subscription',
        settings: { env: { API_TIMEOUT_MS: '3000000' } },
      },
      'anthropic': {
        type: 'api',
        description: 'Anthropic API',
        settings: { env: { ANTHROPIC_API_KEY: 'test-key' } },
      },
      'z.ai': {
        type: 'api',
        description: 'z.ai API',
        settings: { env: { ANTHROPIC_API_KEY: 'zai-key' } },
      },
    },
  }),
  detectConfig: vi.fn().mockResolvedValue(null),
  hasProjectConfig: vi.fn().mockResolvedValue(false),
}));

// Mock ConfigManager
vi.mock('../../../src/config/manager.js', () => ({
  ConfigManager: vi.fn().mockImplementation(() => ({
    load: vi.fn().mockResolvedValue({
      version: '1.0',
      currentProvider: 'claude-pro-max',
      providers: {
        'claude-pro-max': {
          type: 'subscription',
          description: 'Claude Pro subscription',
          settings: { env: { API_TIMEOUT_MS: '3000000' } },
        },
        'anthropic': {
          type: 'api',
          description: 'Anthropic API',
          settings: { env: { ANTHROPIC_API_KEY: 'test-key' } },
        },
        'z.ai': {
          type: 'api',
          description: 'z.ai API',
          settings: { env: { ANTHROPIC_API_KEY: 'zai-key' } },
        },
      },
    }),
    save: vi.fn().mockResolvedValue(undefined),
    updateProvider: vi.fn().mockResolvedValue(undefined),
  })),
}));

// Import after mocks
import { getStatus, switchProvider } from '../../../src/commands/switch.js';

describe('Switch Command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getStatus', () => {
    it('should return current provider info', async () => {
      const status = await getStatus();

      expect(status.provider).toBeDefined();
      expect(status.description).toBeDefined();
      expect(status.type).toBeDefined();
      expect(['subscription', 'api']).toContain(status.type);
    });

    it('should return provider name', async () => {
      const status = await getStatus();

      expect(status.provider).toBe('claude-pro-max');
    });

    it('should return provider type', async () => {
      const status = await getStatus();

      expect(status.type).toBe('subscription');
    });
  });

  describe('switchProvider', () => {
    it('should throw error for invalid provider', async () => {
      await expect(switchProvider('invalid' as any)).rejects.toThrow(/not found/);
    });

    it('should switch to valid provider', async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readFile).mockRejectedValue(new Error('ENOENT'));
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      await expect(switchProvider('anthropic')).resolves.not.toThrow();
    });

    it('should write settings file when switching', async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readFile).mockRejectedValue(new Error('ENOENT'));
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      await switchProvider('z.ai');

      expect(fs.writeFile).toHaveBeenCalled();
    });
  });
});
