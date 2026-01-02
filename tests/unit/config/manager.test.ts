/**
 * Tests for ConfigManager
 */

import test from 'ava';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { ConfigManager } from '../../../src/config/manager.js';
import { type Config } from '../../../src/config/schema.js';

// Test fixtures directory
const fixturesDir = path.join(process.cwd(), 'tests', 'fixtures');
const testConfigDir = path.join(fixturesDir, 'config-manager');

test.before(async () => {
  await fs.mkdir(testConfigDir, { recursive: true });
});

test.after.always(async () => {
  // Cleanup test files
  try {
    await fs.rm(testConfigDir, { recursive: true, force: true });
  } catch {
    // Ignore cleanup errors
  }
});

test('creates default configuration when file does not exist', async (t) => {
  const configPath = path.join(testConfigDir, 'new-config.json');
  const manager = new ConfigManager(configPath);

  const config = await manager.load();

  t.is(config.version, '1.0');
  t.is(config.currentProvider, 'claude-pro-max');
  t.truthy(config.providers['claude-pro-max']);
  t.truthy(config.providers['anthropic']);
  t.truthy(config.providers['z.ai']);
});

test('loads existing valid configuration', async (t) => {
  const configPath = path.join(testConfigDir, 'existing-config.json');
  const testConfig: Config = {
    version: '1.0',
    currentProvider: 'anthropic',
    providers: {
      'claude-pro-max': {
        type: 'subscription',
        description: 'Test description',
        settings: { env: { TEST: 'value' } },
      },
      'anthropic': {
        type: 'api',
        description: 'Test API',
        settings: { env: {} },
      },
      'z.ai': {
        type: 'api',
        description: 'Test GLM',
        settings: { env: {} },
      },
    },
  };

  await fs.writeFile(configPath, JSON.stringify(testConfig, null, 2));

  const manager = new ConfigManager(configPath);
  const config = await manager.load();

  t.is(config.currentProvider, 'anthropic');
  t.is(config.providers['claude-pro-max'].description, 'Test description');
});

test('saves configuration successfully', async (t) => {
  const configPath = path.join(testConfigDir, 'save-test.json');
  const manager = new ConfigManager(configPath);

  const config = await manager.load(); // Creates default
  config.currentProvider = 'z.ai';

  await manager.save(config);

  // Read back and verify
  const content = await fs.readFile(configPath, 'utf-8');
  const saved = JSON.parse(content);

  t.is(saved.currentProvider, 'z.ai');
});

test('updates provider successfully', async (t) => {
  const configPath = path.join(testConfigDir, 'update-provider.json');
  const manager = new ConfigManager(configPath);

  await manager.load(); // Creates default with claude-pro-max

  await manager.updateProvider('anthropic');

  const config = await manager.load();
  t.is(config.currentProvider, 'anthropic');
});

test('creates backup before updating', async (t) => {
  const configPath = path.join(testConfigDir, 'backup-test.json');
  const manager = new ConfigManager(configPath);

  await manager.load(); // Create initial config

  await manager.updateProvider('z.ai');

  // Check backup exists
  const backupPath = `${configPath}.backup`;
  await t.notThrowsAsync(fs.access(backupPath));
});

test('sanitizePath prevents path traversal', (t) => {
  const maliciousPath = '../../../etc/passwd';

  t.throws(
    () => ConfigManager.sanitizePath(maliciousPath),
    { message: /Path traversal detected/ },
  );
});

test('expandHome expands tilde correctly', (t) => {
  const homePath = '~/test/path';
  const expanded = ConfigManager.expandHome(homePath);

  t.is(expanded, path.join(os.homedir(), 'test/path'));
});

test('expandHome leaves absolute paths unchanged', (t) => {
  const absolutePath = '/absolute/path';
  const expanded = ConfigManager.expandHome(absolutePath);

  t.is(expanded, absolutePath);
});

test('throws error when updating to non-existent provider', async (t) => {
  const configPath = path.join(testConfigDir, 'error-test.json');
  const manager = new ConfigManager(configPath);

  await manager.load();

  await t.throwsAsync(
    async () => manager.updateProvider('invalid' as any),
    { message: /Provider 'invalid' not found/ },
  );
});
