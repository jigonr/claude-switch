/**
 * Tests for ConfigManager
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { ConfigManager } from '../../../src/config/manager.js';
import { ErrorCode, ClaudeSwitchError, SecurityError } from '../../../src/utils/errors.js';
import { validConfig, validProviders } from '../../fixtures/config.js';

// Mock the fs module
vi.mock('node:fs/promises');

// Mock the logger to prevent console output during tests
vi.mock('../../../src/utils/logger.js', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('ConfigManager', () => {
  const testConfigPath = '/tmp/test-config/switch-config.json';
  let manager: ConfigManager;

  beforeEach(() => {
    vi.clearAllMocks();
    manager = new ConfigManager(testConfigPath);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should use provided config path', () => {
      const customPath = '/custom/path/config.json';
      const customManager = new ConfigManager(customPath);
      expect(customManager).toBeDefined();
    });

    it('should use default path when none provided', () => {
      const defaultManager = new ConfigManager();
      expect(defaultManager).toBeDefined();
    });
  });

  describe('load', () => {
    it('should load and parse valid configuration', async () => {
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(validConfig));

      const result = await manager.load();

      expect(result).toEqual(validConfig);
      expect(fs.readFile).toHaveBeenCalledWith(testConfigPath, 'utf-8');
    });

    it('should create default config when file does not exist', async () => {
      const error: NodeJS.ErrnoException = new Error('ENOENT');
      error.code = 'ENOENT';
      vi.mocked(fs.readFile).mockRejectedValue(error);
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      const result = await manager.load();

      expect(result.version).toBe('1.0');
      expect(result.currentProvider).toBe('claude-pro-max');
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should throw INVALID_CONFIG on invalid JSON', async () => {
      vi.mocked(fs.readFile).mockResolvedValue('{ invalid json');

      await expect(manager.load()).rejects.toThrow(ClaudeSwitchError);
      await expect(manager.load()).rejects.toMatchObject({
        code: ErrorCode.INVALID_CONFIG,
      });
    });

    it('should throw INVALID_CONFIG on invalid config structure', async () => {
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify({ invalid: 'config' }));

      await expect(manager.load()).rejects.toThrow(ClaudeSwitchError);
    });
  });

  describe('save', () => {
    it('should create directory and save config', async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      await manager.save(validConfig);

      expect(fs.mkdir).toHaveBeenCalledWith(path.dirname(testConfigPath), { recursive: true });
      expect(fs.writeFile).toHaveBeenCalledWith(
        testConfigPath,
        JSON.stringify(validConfig, null, 2),
        'utf-8',
      );
    });

    it('should validate config before saving', async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      const invalidConfig = { version: '2.0' } as any;

      await expect(manager.save(invalidConfig)).rejects.toThrow();
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });

  describe('backup', () => {
    it('should create backup file', async () => {
      vi.mocked(fs.copyFile).mockResolvedValue(undefined);

      await manager.backup();

      expect(fs.copyFile).toHaveBeenCalledWith(
        testConfigPath,
        `${testConfigPath}.backup`,
      );
    });

    it('should handle backup failure gracefully', async () => {
      vi.mocked(fs.copyFile).mockRejectedValue(new Error('Permission denied'));

      // Should not throw, just warn
      await expect(manager.backup()).resolves.not.toThrow();
    });
  });

  describe('updateProvider', () => {
    it('should update current provider', async () => {
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(validConfig));
      vi.mocked(fs.copyFile).mockResolvedValue(undefined);
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      await manager.updateProvider('anthropic');

      expect(fs.writeFile).toHaveBeenCalled();
      const savedData = JSON.parse(vi.mocked(fs.writeFile).mock.calls[0][1] as string);
      expect(savedData.currentProvider).toBe('anthropic');
    });

    it('should create backup before updating', async () => {
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(validConfig));
      vi.mocked(fs.copyFile).mockResolvedValue(undefined);
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      await manager.updateProvider('z.ai');

      expect(fs.copyFile).toHaveBeenCalled();
    });

    it('should throw PROVIDER_NOT_FOUND for non-existent provider', async () => {
      const configWithOneProvider = {
        ...validConfig,
        providers: {
          'claude-pro-max': validConfig.providers['claude-pro-max'],
        },
      };
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(configWithOneProvider));

      await expect(manager.updateProvider('anthropic')).rejects.toThrow(ClaudeSwitchError);
      await expect(manager.updateProvider('anthropic')).rejects.toMatchObject({
        code: ErrorCode.PROVIDER_NOT_FOUND,
      });
    });
  });

  describe('sanitizePath', () => {
    it('should resolve absolute paths', () => {
      const result = ConfigManager.sanitizePath('/some/path/file.json');
      expect(result).toBe('/some/path/file.json');
    });

    it('should resolve relative paths to absolute', () => {
      const result = ConfigManager.sanitizePath('config.json');
      expect(result).toContain('config.json');
      expect(result.startsWith('/')).toBe(true); // Should be absolute
    });

    it('should handle paths with parent directory references', () => {
      // After path.resolve, '../' is resolved to actual path
      const result = ConfigManager.sanitizePath('../file.json');
      expect(result).toContain('file.json');
    });
  });

  describe('expandHome', () => {
    it('should expand ~ to home directory', () => {
      const result = ConfigManager.expandHome('~/test/path');
      expect(result).toBe(path.join(os.homedir(), 'test/path'));
    });

    it('should not modify paths without ~', () => {
      const result = ConfigManager.expandHome('/absolute/path');
      expect(result).toBe('/absolute/path');
    });

    it('should not expand ~ in the middle of path', () => {
      const result = ConfigManager.expandHome('/path/to/~/file');
      expect(result).toBe('/path/to/~/file');
    });
  });

  describe('getSettingsPath', () => {
    it('should return the Claude settings path', () => {
      const result = manager.getSettingsPath();
      expect(result).toBe(path.join(os.homedir(), '.claude', 'settings.json'));
    });
  });

  describe('writeClaudeSettings', () => {
    it('should create directory and write settings', async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readFile).mockRejectedValue(new Error('ENOENT'));
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      await manager.writeClaudeSettings({ API_KEY: 'test-key' });

      expect(fs.mkdir).toHaveBeenCalledWith(
        path.join(os.homedir(), '.claude'),
        { recursive: true },
      );
      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join(os.homedir(), '.claude', 'settings.json'),
        JSON.stringify({ env: { API_KEY: 'test-key' } }, null, 2),
        'utf-8',
      );
    });

    it('should merge with existing settings', async () => {
      const existingSettings = { env: { EXISTING: 'value' }, other: 'data' };
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(existingSettings));
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      await manager.writeClaudeSettings({ NEW_KEY: 'new-value' });

      const writtenData = JSON.parse(vi.mocked(fs.writeFile).mock.calls[0][1] as string);
      expect(writtenData.env).toEqual({
        EXISTING: 'value',
        NEW_KEY: 'new-value',
      });
      expect(writtenData.other).toBe('data');
    });

    it('should overwrite existing env values', async () => {
      const existingSettings = { env: { API_KEY: 'old-key' } };
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(existingSettings));
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      await manager.writeClaudeSettings({ API_KEY: 'new-key' });

      const writtenData = JSON.parse(vi.mocked(fs.writeFile).mock.calls[0][1] as string);
      expect(writtenData.env.API_KEY).toBe('new-key');
    });

    it('should handle invalid JSON in existing file', async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readFile).mockResolvedValue('{ invalid json');
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      await manager.writeClaudeSettings({ API_KEY: 'test-key' });

      const writtenData = JSON.parse(vi.mocked(fs.writeFile).mock.calls[0][1] as string);
      expect(writtenData.env).toEqual({ API_KEY: 'test-key' });
    });
  });
});
