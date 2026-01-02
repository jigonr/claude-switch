/**
 * List available providers command
 */

import chalk from 'chalk';
import { loadConfigWithOverride } from '../config/detector.js';
import type { ProviderName } from '../config/schema.js';

/**
 * List all available providers
 */
export async function listProviders(
  options: { json?: boolean } = {},
): Promise<void> {
  const config = await loadConfigWithOverride();

  if (options.json) {
    console.log(JSON.stringify(config.providers, null, 2));
    return;
  }

  console.log(chalk.blue.bold('\nAvailable Providers:\n'));

  const providerEntries = Object.entries(config.providers) as [
    ProviderName,
    (typeof config.providers)[ProviderName],
  ][];

  for (const [name, provider] of providerEntries) {
    const isCurrent = name === config.currentProvider;
    const marker = isCurrent ? chalk.green('●') : chalk.gray('○');
    const displayName = isCurrent ? chalk.cyan.bold(name) : chalk.white(name);

    console.log(`  ${marker} ${displayName}`);
    console.log(`    ${chalk.gray(provider.description)}`);
    console.log(`    Type: ${chalk.yellow(provider.type)}`);
    console.log();
  }

  console.log(chalk.yellow(`Current: ${config.currentProvider}\n`));
}
