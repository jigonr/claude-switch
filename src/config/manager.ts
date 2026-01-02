/**
 * Configuration manager for claude-switch
 * Handles loading, saving, and validating configuration files
 */

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  ClaudeSwitchError,
  ErrorCode,
  SecurityError,
} from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { type Config, ConfigSchema, type ProviderName } from './schema.js';

export class ConfigManager {
  private configPath: string;

  constructor(configPath?: string) {
    this.configPath = configPath || this.getDefaultPath();
  }

  /**
   * Get default global config path
   */
  private getDefaultPath(): string {
    return path.join(os.homedir(), '.claude', 'switch-config.json');
  }

  /**
   * Load configuration from file
   */
  async load(): Promise<Config> {
    try {
      const content = await fs.readFile(this.configPath, 'utf-8');
      const data = JSON.parse(content);
      const config = ConfigSchema.parse(data);
      logger.debug(`Loaded config from ${this.configPath}`);
      return config;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        logger.warn('Config file not found, creating default');
        return this.createDefault();
      }
      throw new ClaudeSwitchError(
        `Failed to load configuration: ${(error as Error).message}`,
        ErrorCode.INVALID_CONFIG,
        error,
      );
    }
  }

  /**
   * Save configuration to file
   */
  async save(config: Config): Promise<void> {
    // Validate before save
    const validated = ConfigSchema.parse(config);

    // Create directory if it doesn't exist
    const dir = path.dirname(this.configPath);
    await fs.mkdir(dir, { recursive: true });

    // Write config
    await fs.writeFile(
      this.configPath,
      JSON.stringify(validated, null, 2),
      'utf-8',
    );

    logger.debug(`Config saved to ${this.configPath}`);
  }

  /**
   * Backup current configuration
   */
  async backup(): Promise<void> {
    const backupPath = `${this.configPath}.backup`;
    try {
      await fs.copyFile(this.configPath, backupPath);
      logger.debug(`Backup created at ${backupPath}`);
    } catch (error) {
      logger.warn(`Failed to create backup: ${(error as Error).message}`);
    }
  }

  /**
   * Update current provider
   */
  async updateProvider(providerName: ProviderName): Promise<void> {
    const config = await this.load();

    if (!config.providers[providerName]) {
      throw new ClaudeSwitchError(
        `Provider '${providerName}' not found in configuration`,
        ErrorCode.PROVIDER_NOT_FOUND,
      );
    }

    await this.backup();
    config.currentProvider = providerName;
    await this.save(config);

    logger.success(`Switched to provider: ${providerName}`);
  }

  /**
   * Create default configuration
   */
  private async createDefault(): Promise<Config> {
    const defaultConfig: Config = {
      version: '1.0',
      currentProvider: 'claude-pro-max',
      providers: {
        'claude-pro-max': {
          type: 'subscription',
          description: 'Claude Pro subscription (browser-based)',
          settings: {
            env: {
              API_TIMEOUT_MS: '3000000',
            },
          },
        },
        anthropic: {
          type: 'api',
          description: 'Anthropic official API',
          settings: {
            env: {
              ANTHROPIC_API_KEY_FILE: '~/.claude/credentials/anthropic.key',
              API_TIMEOUT_MS: '3000000',
            },
          },
        },
        'z.ai': {
          type: 'api',
          description: 'z.ai API (GLM models)',
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

    await this.save(defaultConfig);
    logger.info('Created default configuration');
    return defaultConfig;
  }

  /**
   * Validate file path for security (prevent path traversal)
   */
  static sanitizePath(input: string): string {
    const resolved = path.resolve(input);
    if (resolved.includes('..')) {
      throw new SecurityError('Path traversal detected');
    }
    return resolved;
  }

  /**
   * Expand home directory in path
   */
  static expandHome(filepath: string): string {
    if (filepath.startsWith('~/')) {
      return path.join(os.homedir(), filepath.slice(2));
    }
    return filepath;
  }
}
