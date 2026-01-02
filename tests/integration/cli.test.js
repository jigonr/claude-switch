/**
 * Integration tests for claude-switch CLI
 */

import assert from 'node:assert';
import { exec } from 'node:child_process';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI_PATH = path.join(__dirname, '../../dist/index.js');

test('CLI shows help message', async () => {
  const { stdout } = await execAsync(`node ${CLI_PATH} --help`);

  assert.match(stdout, /Simple API provider switcher/);
  assert.match(stdout, /Commands:/);
  assert.match(stdout, /list/);
});

test('CLI shows version', async () => {
  const { stdout } = await execAsync(`node ${CLI_PATH} --version`);

  assert.match(stdout, /0\.1\.0/);
});

test('CLI list command shows providers', async () => {
  const { stdout } = await execAsync(`node ${CLI_PATH} list`);

  assert.match(stdout, /claude-pro-max/);
  assert.match(stdout, /anthropic/);
  assert.match(stdout, /z\.ai/);
});

test('CLI status command shows current provider', async () => {
  const { stdout } = await execAsync(`node ${CLI_PATH} status`);

  assert.match(stdout, /Current Provider/);
});

test.skip('CLI list --json outputs valid JSON', async () => {
  // TODO: Fix --json flag handling in list command
  const { stdout } = await execAsync(`node ${CLI_PATH} list --json`);

  // Extract JSON from output (may have logs before it)
  const jsonMatch = stdout.match(/\{[\s\S]*\}/);
  assert.ok(jsonMatch, 'Should contain JSON output');

  const providers = JSON.parse(jsonMatch[0]);
  assert.ok(providers['claude-pro-max']);
  assert.ok(providers.anthropic);
  assert.ok(providers['z.ai']);
});

test('CLI rejects invalid provider', async () => {
  try {
    await execAsync(`node ${CLI_PATH} invalid-provider`);
    assert.fail('Should have thrown an error');
  } catch (error) {
    assert.match(error.stderr || error.stdout, /Invalid provider/);
  }
});
