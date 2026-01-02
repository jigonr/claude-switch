/**
 * Tests for project config detection
 */

import test from 'ava';
import fs from 'node:fs/promises';
import path from 'node:path';
import { detectConfig, hasProjectConfig, loadConfigWithOverride } from '../../../src/config/detector.js';
import type { ProjectConfig } from '../../../src/config/schema.js';

const fixturesDir = path.join(process.cwd(), 'tests', 'fixtures');
const testProjectDir = path.join(fixturesDir, 'project-config');

test.before(async () => {
  await fs.mkdir(testProjectDir, { recursive: true });
});

test.after.always(async () => {
  try {
    await fs.rm(testProjectDir, { recursive: true, force: true });
  } catch {
    // Ignore cleanup errors
  }
});

test.serial('detectConfig returns null when no project config exists', async (t) => {
  // Change to test directory
  const originalCwd = process.cwd();
  process.chdir(testProjectDir);

  const result = await detectConfig();
  t.is(result, null);

  process.chdir(originalCwd);
});

test.serial('detectConfig finds .claude-switch.json', async (t) => {
  const originalCwd = process.cwd();
  process.chdir(testProjectDir);

  const projectConfig: ProjectConfig = {
    provider: 'anthropic',
  };

  await fs.writeFile(
    './.claude-switch.json',
    JSON.stringify(projectConfig, null, 2),
  );

  const result = await detectConfig();
  t.is(result, './.claude-switch.json');

  // Cleanup
  await fs.unlink('./.claude-switch.json');
  process.chdir(originalCwd);
});

test.serial('hasProjectConfig returns false when no config', async (t) => {
  const originalCwd = process.cwd();
  process.chdir(testProjectDir);

  const result = await hasProjectConfig();
  t.false(result);

  process.chdir(originalCwd);
});

test.serial('hasProjectConfig returns true when config exists', async (t) => {
  const originalCwd = process.cwd();
  process.chdir(testProjectDir);

  const projectConfig: ProjectConfig = {
    provider: 'z.ai',
  };

  await fs.writeFile(
    './.claude-switch.json',
    JSON.stringify(projectConfig, null, 2),
  );

  const result = await hasProjectConfig();
  t.true(result);

  // Cleanup
  await fs.unlink('./.claude-switch.json');
  process.chdir(originalCwd);
});

test('loadConfigWithOverride loads global config when no project config', async (t) => {
  const config = await loadConfigWithOverride();

  // Should have default values
  t.is(config.version, '1.0');
  t.truthy(config.providers);
});
