/**
 * Provider switching command
 * Writes configuration to ~/.claude/settings.json
 */

import { loadConfigWithOverride } from '../config/detector.js';
import { ConfigManager } from '../config/manager.js';
import type { ProviderName } from '../config/schema.js';
import { logger } from '../utils/logger.js';

/**
 * Switch to a specific provider
 */
export async function switchProvider(
  providerName: ProviderName,
  options: { local?: boolean } = {},
): Promise<void> {
  const manager = new ConfigManager();

  // Load configuration (with project override if exists)
  const config = await loadConfigWithOverride();

  // Validate provider exists
  const provider = config.providers[providerName];
  if (!provider) {
    throw new Error(`Provider '${providerName}' not found`);
  }

  // Write to Claude Code settings file
  await manager.writeClaudeSettings(provider.settings.env);

  // Update current provider in global config (unless using project override)
  if (!options.local) {
    await manager.updateProvider(providerName);
  }

  logger.success(`Switched to ${providerName} (${provider.description})`);
  logger.info(`Settings written to ${manager.getSettingsPath()}`);
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
