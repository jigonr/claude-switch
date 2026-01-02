/**
 * Import configuration from bash script
 */

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { ConfigManager } from '../config/manager.js';
import { logger } from '../utils/logger.js';

interface GlmConfig {
  zai_api_key: string;
  model: string;
  model_haiku: string;
  _comment?: string;
}

/**
 * Import configuration from bash script (glm-config.json)
 */
export async function importFromBash(): Promise<void> {
  const glmConfigPath = path.join(os.homedir(), '.claude', 'glm-config.json');

  // Check if glm-config.json exists
  try {
    await fs.access(glmConfigPath);
  } catch {
    logger.warn('No bash script configuration found (glm-config.json)');
    logger.info('Creating default configuration instead');
    const manager = new ConfigManager();
    await manager.load(); // This will create default if doesn't exist
    return;
  }

  // Load GLM config
  const content = await fs.readFile(glmConfigPath, 'utf-8');
  const glmConfig: GlmConfig = JSON.parse(content);

  logger.info('Found bash script configuration');

  // Create credentials directory
  const credentialsDir = path.join(os.homedir(), '.claude', 'credentials');
  await fs.mkdir(credentialsDir, { recursive: true });

  // Write z.ai API key to separate file
  const zaiKeyPath = path.join(credentialsDir, 'zai.key');
  await fs.writeFile(zaiKeyPath, glmConfig.zai_api_key, { mode: 0o600 });

  logger.success(`Imported z.ai API key to ${zaiKeyPath}`);
  logger.warn('Make sure to add credentials/ to .gitignore');

  // Create default config with imported settings
  const manager = new ConfigManager();
  const config = await manager.load(); // Gets default or existing

  // Update z.ai provider with imported model settings
  const zaiProvider = config.providers['z.ai'];
  if (zaiProvider) {
    zaiProvider.settings.env.ANTHROPIC_DEFAULT_OPUS_MODEL = glmConfig.model;
    zaiProvider.settings.env.ANTHROPIC_DEFAULT_SONNET_MODEL = glmConfig.model;
    zaiProvider.settings.env.ANTHROPIC_DEFAULT_HAIKU_MODEL =
      glmConfig.model_haiku;
  }

  await manager.save(config);

  logger.success('Configuration imported successfully');
  logger.info('Run "claude-switch list" to see available providers');
}
