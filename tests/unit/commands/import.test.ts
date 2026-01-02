/**
 * Tests for import command
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

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

// Define mock config with vi.hoisted
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
        settings: {
          env: {
            ANTHROPIC_API_KEY: 'zai-key',
            ANTHROPIC_DEFAULT_OPUS_MODEL: 'glm-4.7',
            ANTHROPIC_DEFAULT_SONNET_MODEL: 'glm-4.7',
            ANTHROPIC_DEFAULT_HAIKU_MODEL: 'glm-4.5-air',
          },
        },
      },
    },
  },
}));

// Mock ConfigManager
vi.mock('../../../src/config/manager.js', () => ({
  ConfigManager: vi.fn().mockImplementation(() => ({
    load: vi.fn().mockResolvedValue(JSON.parse(JSON.stringify(mockConfig))),
    save: vi.fn().mockResolvedValue(undefined),
    updateProvider: vi.fn().mockResolvedValue(undefined),
  })),
}));

// Import after mocks
import { importFromBash } from '../../../src/commands/import.js';
import { logger } from '../../../src/utils/logger.js';

describe('Import Command', () => {
  const glmConfigPath = path.join(os.homedir(), '.claude', 'glm-config.json');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('importFromBash', () => {
    it('should warn and create default when no glm-config.json exists', async () => {
      vi.mocked(fs.access).mockRejectedValue(new Error('ENOENT'));

      await importFromBash();

      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('No bash script configuration found'),
      );
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('Creating default configuration'),
      );
    });

    it('should import configuration from glm-config.json', async () => {
      const glmConfig = {
        zai_api_key: 'sk-zai-test-key-12345',
        model: 'glm-4.7',
        model_haiku: 'glm-4.5-air',
      };

      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(glmConfig));
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      await importFromBash();

      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('Found bash script configuration'),
      );
      expect(logger.success).toHaveBeenCalledWith(
        expect.stringContaining('Imported z.ai API key'),
      );
    });

    it('should create credentials directory', async () => {
      const glmConfig = {
        zai_api_key: 'sk-zai-test-key-12345',
        model: 'glm-4.7',
        model_haiku: 'glm-4.5-air',
      };

      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(glmConfig));
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      await importFromBash();

      expect(fs.mkdir).toHaveBeenCalledWith(
        path.join(os.homedir(), '.claude', 'credentials'),
        { recursive: true },
      );
    });

    it('should write API key with secure permissions', async () => {
      const glmConfig = {
        zai_api_key: 'sk-zai-test-key-12345',
        model: 'glm-4.7',
        model_haiku: 'glm-4.5-air',
      };

      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(glmConfig));
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      await importFromBash();

      // Check that writeFile was called with secure mode (0o600)
      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join(os.homedir(), '.claude', 'credentials', 'zai.key'),
        'sk-zai-test-key-12345',
        { mode: 0o600 },
      );
    });

    it('should warn about .gitignore after import', async () => {
      const glmConfig = {
        zai_api_key: 'sk-zai-test-key-12345',
        model: 'glm-4.7',
        model_haiku: 'glm-4.5-air',
      };

      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(glmConfig));
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      await importFromBash();

      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('.gitignore'),
      );
    });

    it('should log success message with next steps', async () => {
      const glmConfig = {
        zai_api_key: 'sk-zai-test-key-12345',
        model: 'glm-4.7',
        model_haiku: 'glm-4.5-air',
      };

      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(glmConfig));
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      await importFromBash();

      expect(logger.success).toHaveBeenCalledWith(
        expect.stringContaining('Configuration imported successfully'),
      );
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('claude-switch list'),
      );
    });
  });
});
