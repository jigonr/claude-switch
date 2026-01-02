/**
 * Tests for project config detection
 *
 * Note: These tests use dynamic imports to avoid module caching issues with mocks.
 * The detector module is re-imported in each test to get fresh instances.
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
  });

  describe('hasProjectConfig', () => {
    it('should return false when no config exists', async () => {
      vi.mocked(fs.access).mockRejectedValue(new Error('ENOENT'));

      const { hasProjectConfig } = await import('../../../src/config/detector.js');
      const result = await hasProjectConfig();

      expect(result).toBe(false);
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
    });
  });
});
