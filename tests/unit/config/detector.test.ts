/**
 * Tests for project config detection
 *
 * These tests cover real-world scenarios for detecting and loading
 * project-specific configurations that override global settings.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
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
  },
}));

describe('Project Config Detection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('detectConfig', () => {
    it('should return null when no project config exists', async () => {
      vi.mocked(fs.access).mockRejectedValue(new Error('ENOENT'));

      const { detectConfig } = await import('../../../src/config/detector.js');
      const result = await detectConfig();

      expect(result).toBeNull();
    });

    it('should detect .claude-switch.json in current directory', async () => {
      // First call succeeds (.claude-switch.json exists)
      vi.mocked(fs.access).mockResolvedValueOnce(undefined);

      const { detectConfig } = await import('../../../src/config/detector.js');
      const result = await detectConfig();

      expect(result).toContain('.claude-switch.json');
    });

    it('should detect .claude/config.json when .claude-switch.json does not exist', async () => {
      // First call fails (.claude-switch.json not found)
      vi.mocked(fs.access).mockRejectedValueOnce(new Error('ENOENT'));
      // Second call succeeds (.claude/config.json exists)
      vi.mocked(fs.access).mockResolvedValueOnce(undefined);

      const { detectConfig } = await import('../../../src/config/detector.js');
      const result = await detectConfig();

      expect(result).toContain('.claude/config.json');
    });

    it('should prefer .claude-switch.json over .claude/config.json', async () => {
      // Both exist, but .claude-switch.json is checked first
      vi.mocked(fs.access).mockResolvedValue(undefined);

      const { detectConfig } = await import('../../../src/config/detector.js');
      const result = await detectConfig();

      expect(result).toContain('.claude-switch.json');
    });
  });

  describe('hasProjectConfig', () => {
    it('should return false when no config exists', async () => {
      vi.mocked(fs.access).mockRejectedValue(new Error('ENOENT'));

      const { hasProjectConfig } = await import('../../../src/config/detector.js');
      const result = await hasProjectConfig();

      expect(result).toBe(false);
    });

    it('should return true when project config exists', async () => {
      vi.mocked(fs.access).mockResolvedValueOnce(undefined);

      const { hasProjectConfig } = await import('../../../src/config/detector.js');
      const result = await hasProjectConfig();

      expect(result).toBe(true);
    });
  });

  describe('loadConfigWithOverride', () => {
    it('should load global config when no project config exists', async () => {
      // Mock no project config
      vi.mocked(fs.access).mockRejectedValue(new Error('ENOENT'));

      // Mock loading global config - file doesn't exist so creates default
      const enoent: NodeJS.ErrnoException = new Error('ENOENT');
      enoent.code = 'ENOENT';
      vi.mocked(fs.readFile).mockRejectedValue(enoent);
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      const { loadConfigWithOverride } = await import('../../../src/config/detector.js');
      const config = await loadConfigWithOverride();

      expect(config.version).toBe('1.0');
      expect(config.providers).toBeDefined();
      expect(config.currentProvider).toBe('claude-pro-max');
    });

    it('should override currentProvider with project config', async () => {
      // Project config exists
      vi.mocked(fs.access).mockResolvedValueOnce(undefined);

      // Project config content
      const projectConfig = JSON.stringify({ provider: 'anthropic' });

      // Global config content
      const globalConfig = JSON.stringify({
        version: '1.0',
        currentProvider: 'claude-pro-max',
        providers: {
          'claude-pro-max': {
            type: 'subscription',
            description: 'Test',
            settings: { env: {} },
          },
          anthropic: {
            type: 'api',
            description: 'Test',
            settings: { env: {} },
          },
        },
      });

      vi.mocked(fs.readFile)
        .mockResolvedValueOnce(projectConfig) // Project config
        .mockResolvedValueOnce(globalConfig); // Global config

      const { loadConfigWithOverride } = await import('../../../src/config/detector.js');
      const config = await loadConfigWithOverride();

      expect(config.currentProvider).toBe('anthropic');
    });

    it('should preserve all providers from global config when using project override', async () => {
      // Project config exists
      vi.mocked(fs.access).mockResolvedValueOnce(undefined);

      const projectConfig = JSON.stringify({ provider: 'z.ai' });
      const globalConfig = JSON.stringify({
        version: '1.0',
        currentProvider: 'claude-pro-max',
        providers: {
          'claude-pro-max': {
            type: 'subscription',
            description: 'Claude Pro',
            settings: { env: { API_TIMEOUT_MS: '3000000' } },
          },
          anthropic: {
            type: 'api',
            description: 'Anthropic',
            settings: { env: {} },
          },
          'z.ai': {
            type: 'api',
            description: 'z.ai',
            settings: { env: {} },
          },
        },
      });

      vi.mocked(fs.readFile)
        .mockResolvedValueOnce(projectConfig)
        .mockResolvedValueOnce(globalConfig);

      const { loadConfigWithOverride } = await import('../../../src/config/detector.js');
      const config = await loadConfigWithOverride();

      // All providers should still be available
      expect(Object.keys(config.providers)).toHaveLength(3);
      expect(config.providers['claude-pro-max']).toBeDefined();
      expect(config.providers.anthropic).toBeDefined();
      expect(config.providers['z.ai']).toBeDefined();
      // But current provider is overridden
      expect(config.currentProvider).toBe('z.ai');
    });
  });
});
