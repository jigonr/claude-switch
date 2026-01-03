#!/usr/bin/env node

/**
 * claude-switch - Simple API provider switcher for Claude Code CLI
 * Entry point for the CLI
 */

import { createRequire } from 'node:module';
import chalk from 'chalk';
import { Command } from 'commander';
import { importFromBash } from './commands/import.js';
import { listProviders } from './commands/list.js';
import { getStatus, switchProvider } from './commands/switch.js';
import { ProviderNameSchema } from './config/schema.js';
import { ClaudeSwitchError } from './utils/errors.js';
import { logger } from './utils/logger.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json') as { version: string };

const program = new Command();

program
  .name('claude-switch')
  .description('Simple API provider switcher for Claude Code CLI')
  .version(version);

// Switch provider command (default action)
program
  .argument(
    '[provider]',
    'Provider to switch to (claude-pro-max, anthropic, z.ai)',
  )
  .option('--local', "Use project-specific config (don't update global)")
  .option('--json', 'Output in JSON format')
  .action(async (provider, options) => {
    try {
      if (!provider) {
        // No provider specified, show current status
        const status = await getStatus();
        if (options.json) {
          console.log(JSON.stringify(status, null, 2));
        } else {
          console.log(chalk.blue.bold('\nCurrent Provider:\n'));
          console.log(`  ${chalk.cyan(status.provider)}`);
          console.log(`  ${chalk.gray(status.description)}`);
          console.log(`  Type: ${chalk.yellow(status.type)}\n`);
        }
        return;
      }

      // Validate provider name
      const result = ProviderNameSchema.safeParse(provider);
      if (!result.success) {
        logger.error(`Invalid provider: ${provider}`);
        logger.info('Valid providers: claude-pro-max, anthropic, z.ai');
        process.exit(1);
      }

      await switchProvider(result.data, options);
    } catch (error) {
      if (error instanceof ClaudeSwitchError) {
        logger.error(error.message);
        if (error.details && process.env.DEBUG) {
          console.error(chalk.gray(JSON.stringify(error.details, null, 2)));
        }
      } else {
        logger.error((error as Error).message);
      }
      process.exit(1);
    }
  });

// List providers command
program
  .command('list')
  .alias('ls')
  .description('List all available providers')
  .option('--json', 'Output in JSON format')
  .action(async options => {
    try {
      await listProviders(options);
    } catch (error) {
      logger.error((error as Error).message);
      process.exit(1);
    }
  });

// Status command
program
  .command('status')
  .description('Show current provider status')
  .option('--json', 'Output in JSON format')
  .action(async options => {
    try {
      const status = await getStatus();
      if (options.json) {
        console.log(JSON.stringify(status, null, 2));
      } else {
        console.log(chalk.blue.bold('\nCurrent Provider:\n'));
        console.log(`  ${chalk.cyan(status.provider)}`);
        console.log(`  ${chalk.gray(status.description)}`);
        console.log(`  Type: ${chalk.yellow(status.type)}\n`);
      }
    } catch (error) {
      logger.error((error as Error).message);
      process.exit(1);
    }
  });

// Import from bash script
program
  .command('import-bash')
  .description('Import configuration from bash script (glm-config.json)')
  .action(async () => {
    try {
      await importFromBash();
    } catch (error) {
      logger.error((error as Error).message);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();
