/**
 * Integration tests for claude-switch CLI
 *
 * These tests verify the CLI works correctly end-to-end.
 * They run against the built dist/index.js file.
 */

import assert from 'node:assert';
import { exec } from 'node:child_process';
import path from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI_PATH = path.join(__dirname, '../../dist/index.js');

describe('CLI Help and Version', () => {
  test('shows help message with usage information', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} --help`);

    assert.match(stdout, /Simple API provider switcher/);
    assert.match(stdout, /Commands:/);
    assert.match(stdout, /list/);
    assert.match(stdout, /status/);
  });

  test('shows version number', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} --version`);

    // Version should be semver format
    assert.match(stdout, /\d+\.\d+\.\d+/);
  });
});

describe('CLI List Command', () => {
  test('lists all three providers', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} list`);

    assert.match(stdout, /claude-pro-max/);
    assert.match(stdout, /anthropic/);
    assert.match(stdout, /z\.ai/);
  });

  test('shows provider types', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} list`);

    assert.match(stdout, /subscription/i);
    assert.match(stdout, /api/i);
  });

  test('list --json outputs valid JSON with all providers', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} list --json`);

    // Parse JSON (may have leading whitespace/logs)
    const jsonMatch = stdout.match(/\{[\s\S]*\}/);
    assert.ok(jsonMatch, 'Should contain JSON output');

    const data = JSON.parse(jsonMatch[0]);
    assert.ok(data['claude-pro-max'], 'Should have claude-pro-max provider');
    assert.ok(data.anthropic, 'Should have anthropic provider');
    assert.ok(data['z.ai'], 'Should have z.ai provider');
  });
});

describe('CLI Status Command', () => {
  test('shows current provider', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} status`);

    assert.match(stdout, /Current Provider/i);
  });

  test('status --json outputs valid JSON', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} status --json`);

    const jsonMatch = stdout.match(/\{[\s\S]*\}/);
    assert.ok(jsonMatch, 'Should contain JSON output');

    const data = JSON.parse(jsonMatch[0]);
    assert.ok(data.provider, 'Should have provider field');
    assert.ok(data.type, 'Should have type field');
  });
});

describe('CLI Default Command (no args)', () => {
  test('shows current provider when no args given', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH}`);

    assert.match(stdout, /Current Provider/i);
  });

  test('--json flag works without provider arg', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} --json`);

    const jsonMatch = stdout.match(/\{[\s\S]*\}/);
    assert.ok(jsonMatch, 'Should contain JSON output');

    const data = JSON.parse(jsonMatch[0]);
    assert.ok(data.provider, 'Should have provider field');
  });
});

describe('CLI Error Handling', () => {
  test('rejects invalid provider name', async () => {
    try {
      await execAsync(`node ${CLI_PATH} invalid-provider`);
      assert.fail('Should have thrown an error');
    } catch (error) {
      const output = error.stderr || error.stdout;
      assert.match(output, /Invalid provider|not found/i);
    }
  });

  test('suggests valid providers on invalid input', async () => {
    try {
      await execAsync(`node ${CLI_PATH} invalid-provider`);
      assert.fail('Should have thrown an error');
    } catch (error) {
      // Combine stdout and stderr to check for suggestions
      const output = (error.stdout || '') + (error.stderr || '');
      assert.match(output, /claude-pro-max|anthropic|z\.ai/);
    }
  });

  test('exits with code 1 on error', async () => {
    try {
      await execAsync(`node ${CLI_PATH} invalid-provider`);
      assert.fail('Should have thrown an error');
    } catch (error) {
      assert.strictEqual(error.code, 1);
    }
  });
});

describe('CLI Provider Switching', () => {
  // Note: These tests actually switch providers, which modifies ~/.claude/settings.json
  // In a real CI environment, you might want to mock the home directory

  test('can switch to claude-pro-max', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} claude-pro-max`);

    assert.match(stdout, /Switched to claude-pro-max/i);
  });

  test('can switch to anthropic', async () => {
    const { stdout } = await execAsync(`node ${CLI_PATH} anthropic`);

    assert.match(stdout, /Switched to anthropic/i);
  });

  test('switching updates status', async () => {
    // Switch to a specific provider
    await execAsync(`node ${CLI_PATH} claude-pro-max`);

    // Verify status reflects the change
    const { stdout } = await execAsync(`node ${CLI_PATH} status --json`);
    const jsonMatch = stdout.match(/\{[\s\S]*\}/);
    const data = JSON.parse(jsonMatch[0]);

    assert.strictEqual(data.provider, 'claude-pro-max');
  });
});
