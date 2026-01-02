/**
 * Project-specific config detection and inheritance
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { ProjectConfigSchema, ConfigSchema, type Config, type ProjectConfig } from './schema.js';
import { ConfigManager } from './manager.js';
import { logger } from '../utils/logger.js';

/**
 * Detect project-specific configuration file
 */
export async function detectConfig(): Promise<string | null> {
  const configFiles = [
    './.claude-switch.json',
    './.claude/config.json',
  ];

  for (const file of configFiles) {
    try {
      await fs.access(file);
      logger.info(`Using project config: ${file}`);
      return file;
    } catch {
      // File doesn't exist, continue
    }
  }

  return null;
}

/**
 * Load configuration with project override support
 */
export async function loadConfigWithOverride(
  configPath?: string,
): Promise<Config> {
  // Try to detect project config first
  const projectConfigPath = await detectConfig();

  if (projectConfigPath) {
    return loadProjectConfig(projectConfigPath);
  }

  // Fall back to global config
  const manager = new ConfigManager(configPath);
  return manager.load();
}

/**
 * Load and merge project configuration with global config
 */
async function loadProjectConfig(projectPath: string): Promise<Config> {
  // Load project config
  const content = await fs.readFile(projectPath, 'utf-8');
  const projectData = JSON.parse(content);
  const projectConfig: ProjectConfig = ProjectConfigSchema.parse(projectData);

  // Load base config (global)
  const baseConfigPath = projectConfig.inherits
    ? ConfigManager.expandHome(projectConfig.inherits)
    : path.join(os.homedir(), '.claude', 'switch-config.json');

  const manager = new ConfigManager(baseConfigPath);
  const baseConfig = await manager.load();

  // Override current provider from project config
  const mergedConfig: Config = {
    ...baseConfig,
    currentProvider: projectConfig.provider,
  };

  logger.debug(`Merged project config with global config`);
  return ConfigSchema.parse(mergedConfig);
}

/**
 * Check if current directory has a project config
 */
export async function hasProjectConfig(): Promise<boolean> {
  const configPath = await detectConfig();
  return configPath !== null;
}
