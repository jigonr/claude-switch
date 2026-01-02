/**
 * Tests for list command
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock console.log
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

// Mock chalk to return plain text for easier testing
vi.mock('chalk', () => ({
  default: {
    blue: { bold: (s: string) => s },
    green: (s: string) => s,
    gray: (s: string) => s,
    white: (s: string) => s,
    yellow: (s: string) => s,
    cyan: { bold: (s: string) => s },
  },
}));

// Define mock config with vi.hoisted
const { mockConfig } = vi.hoisted(() => ({
  mockConfig: {
    version: '1.0',
    currentProvider: 'claude-pro-max',
    providers: {
      'claude-pro-max': {
        type: 'subscription',
        description: 'Claude Pro subscription',
        settings: { env: { API_TIMEOUT_MS: '3000000' } },
      },
      'anthropic': {
        type: 'api',
        description: 'Anthropic API',
        settings: { env: { ANTHROPIC_API_KEY: 'test-key' } },
      },
      'z.ai': {
        type: 'api',
        description: 'z.ai API',
        settings: { env: { ANTHROPIC_API_KEY: 'zai-key' } },
      },
    },
  },
}));

// Mock the detector module
vi.mock('../../../src/config/detector.js', () => ({
  loadConfigWithOverride: vi.fn().mockResolvedValue({
    version: '1.0',
    currentProvider: 'claude-pro-max',
    providers: {
      'claude-pro-max': {
        type: 'subscription',
        description: 'Claude Pro subscription',
        settings: { env: { API_TIMEOUT_MS: '3000000' } },
      },
      'anthropic': {
        type: 'api',
        description: 'Anthropic API',
        settings: { env: { ANTHROPIC_API_KEY: 'test-key' } },
      },
      'z.ai': {
        type: 'api',
        description: 'z.ai API',
        settings: { env: { ANTHROPIC_API_KEY: 'zai-key' } },
      },
    },
  }),
}));

// Import after mocks
import { listProviders } from '../../../src/commands/list.js';

describe('List Command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listProviders', () => {
    it('should list all providers', async () => {
      await listProviders();

      // Check that console.log was called multiple times
      expect(consoleSpy).toHaveBeenCalled();

      // Get all logged content
      const allCalls = consoleSpy.mock.calls.map(call => call[0]).join('\n');

      // Verify provider names are logged
      expect(allCalls).toContain('claude-pro-max');
      expect(allCalls).toContain('anthropic');
      expect(allCalls).toContain('z.ai');
    });

    it('should show provider types', async () => {
      await listProviders();

      const allCalls = consoleSpy.mock.calls.map(call => call[0]).join('\n');

      expect(allCalls).toContain('subscription');
      expect(allCalls).toContain('api');
    });

    it('should show provider descriptions', async () => {
      await listProviders();

      const allCalls = consoleSpy.mock.calls.map(call => call[0]).join('\n');

      expect(allCalls).toContain('Claude Pro subscription');
      expect(allCalls).toContain('Anthropic API');
      expect(allCalls).toContain('z.ai API');
    });

    it('should show current provider', async () => {
      await listProviders();

      const allCalls = consoleSpy.mock.calls.map(call => call[0]).join('\n');

      expect(allCalls).toContain('Current: claude-pro-max');
    });

    it('should output JSON when json option is true', async () => {
      await listProviders({ json: true });

      // Find the JSON output call
      const jsonCall = consoleSpy.mock.calls.find(call => {
        try {
          JSON.parse(call[0]);
          return true;
        } catch {
          return false;
        }
      });

      expect(jsonCall).toBeDefined();

      const output = JSON.parse(jsonCall![0]);
      expect(output).toHaveProperty('claude-pro-max');
      expect(output).toHaveProperty('anthropic');
      expect(output).toHaveProperty('z.ai');
    });

    it('should include provider settings in JSON output', async () => {
      await listProviders({ json: true });

      const jsonCall = consoleSpy.mock.calls.find(call => {
        try {
          JSON.parse(call[0]);
          return true;
        } catch {
          return false;
        }
      });

      const output = JSON.parse(jsonCall![0]);
      expect(output['claude-pro-max'].type).toBe('subscription');
      expect(output['anthropic'].type).toBe('api');
    });
  });
});
