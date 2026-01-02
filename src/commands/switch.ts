/**
 * Provider switching command
 * Writes configuration to ~/.claude/settings.json
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { type Config, type ProviderName } from '../config/schema.js';
import { ConfigManager } from '../config/manager.js';
import { loadConfigWithOverride } from '../config/detector.js';
import { logger } from '../utils/logger.js';

/**
 * Switch to a specific provider
 */
export async function switchProvider(
  providerName: ProviderName,
  options: { local?: boolean } = {},
): Promise<void> {
  // Load configuration (with project override if exists)
  const config = await loadConfigWithOverride();

  // Validate provider exists
  const provider = config.providers[providerName];
  if (!provider) {
    throw new Error(`Provider '${providerName}' not found`);
  }

  // Write to Claude Code settings file
  const settingsPath = path.join(os.homedir(), '.claude', 'settings.json');
  await writeClaudeSettings(settingsPath, provider.settings.env);

  // Update current provider in global config (unless using project override)
  if (!options.local) {
    const manager = new ConfigManager();
    await manager.updateProvider(providerName);
  }

  logger.success(`Switched to ${providerName} (${provider.description})`);
  logger.info(`Settings written to ${settingsPath}`);
}

/**
 * Write environment settings to Claude Code settings.json
 */
async function writeClaudeSettings(
  settingsPath: string,
  env: Record<string, string>,
): Promise<void> {
  // Ensure directory exists
  const dir = path.dirname(settingsPath);
  await fs.mkdir(dir, { recursive: true });

  // Read existing settings or create new
  let settings: { env?: Record<string, string> } = {};
  try {
    const content = await fs.readFile(settingsPath, 'utf-8');
    settings = JSON.parse(content);
  } catch {
    // File doesn't exist or is invalid, start fresh
  }

  // Merge environment settings
  settings.env = {
    ...settings.env,
    ...env,
  };

  // Write settings
  await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');

  logger.debug(`Wrote settings to ${settingsPath}`);
}

/**
 * Get current provider status
 */
export async function getStatus(): Promise<{
  provider: ProviderName;
  description: string;
  type: string;
}> {
  const config = await loadConfigWithOverride();
  const currentProvider = config.currentProvider;
  const provider = config.providers[currentProvider];

  return {
    provider: currentProvider,
    description: provider?.description || 'Unknown',
    type: provider?.type || 'unknown',
  };
}
