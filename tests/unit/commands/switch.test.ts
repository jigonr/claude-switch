/**
 * Tests for switch command
 */

import test from 'ava';
import fs from 'node:fs/promises';
import path from 'node:path';
import { switchProvider, getStatus } from '../../../src/commands/switch.js';
import { ConfigManager } from '../../../src/config/manager.js';

const fixturesDir = path.join(process.cwd(), 'tests', 'fixtures');
const testSwitchDir = path.join(fixturesDir, 'switch-command');

test.before(async () => {
  await fs.mkdir(testSwitchDir, { recursive: true });
});

test.after.always(async () => {
  try {
    await fs.rm(testSwitchDir, { recursive: true, force: true });
  } catch {
    // Ignore
  }
});

test('getStatus returns current provider info', async (t) => {
  const status = await getStatus();

  t.truthy(status.provider);
  t.truthy(status.description);
  t.truthy(status.type);
  t.true(['subscription', 'api'].includes(status.type));
});

test('switchProvider throws error for invalid provider', async (t) => {
  await t.throwsAsync(
    async () => switchProvider('invalid' as any),
    { message: /not found/ },
  );
});
