/**
 * Application constants
 *
 * All magic numbers and hardcoded values are centralized here.
 * This follows the DRY principle and makes configuration changes easier.
 */

// =============================================================================
// Configuration Paths
// =============================================================================

/** Claude configuration directory name (relative to home) */
export const CLAUDE_DIR_NAME = '.claude';

/** Switch configuration file name */
export const CONFIG_FILE_NAME = 'switch-config.json';

/** Claude settings file name (written by Claude Code) */
export const SETTINGS_FILE_NAME = 'settings.json';

/** Credentials directory name */
export const CREDENTIALS_DIR_NAME = 'credentials';

/** Legacy GLM config file name (for import) */
export const LEGACY_GLM_CONFIG_FILE = 'glm-config.json';

/** Project-specific config file names to detect */
export const PROJECT_CONFIG_FILES: readonly string[] = [
  '.claude-switch.json',
  '.claude/config.json',
];

// =============================================================================
// Configuration
// =============================================================================

/** Current configuration schema version */
export const CONFIG_VERSION = '1.0' as const;

// =============================================================================
// Provider Names
// =============================================================================

/** Available provider identifiers */
export const PROVIDER_NAMES = ['claude-pro-max', 'anthropic', 'z.ai'] as const;
export type ProviderName = (typeof PROVIDER_NAMES)[number];

/** Provider types */
export const PROVIDER_TYPES = ['subscription', 'api'] as const;
export type ProviderType = (typeof PROVIDER_TYPES)[number];

// =============================================================================
// API Configuration
// =============================================================================

/** API timeout in milliseconds (50 minutes - for long-running operations) */
export const API_TIMEOUT_MS = 3_000_000;

// =============================================================================
// Default Model Names
// =============================================================================

/** Default models for z.ai provider */
export const ZAI_DEFAULT_MODELS = {
  opus: 'glm-4.7',
  sonnet: 'glm-4.7',
  haiku: 'glm-4.5-air',
} as const;

/** Default models for Anthropic API provider */
export const ANTHROPIC_DEFAULT_MODELS = {
  opus: 'claude-3-opus-20240229',
  sonnet: 'claude-3-5-sonnet-20241022',
  haiku: 'claude-3-5-haiku-20241022',
} as const;

// =============================================================================
// Security
// =============================================================================

/**
 * Minimum expected length for API keys
 * Used in regex pattern for redaction
 */
export const API_KEY_MIN_LENGTH = 40;

/**
 * Regex pattern for redacting API keys in logs
 * Matches sk-* format with at least API_KEY_MIN_LENGTH characters
 */
export const API_KEY_REDACTION_PATTERN = /sk-[a-zA-Z0-9-_]{40,}/g;

/** Replacement text for redacted API keys */
export const API_KEY_REDACTED_TEXT = 'sk-***REDACTED***';

// =============================================================================
// File Permissions
// =============================================================================

/** File permission mode for sensitive files (owner read/write only) */
export const SECURE_FILE_MODE = 0o600;

/** Directory permission mode */
export const DIRECTORY_MODE = 0o755;

// =============================================================================
// Environment Variables
// =============================================================================

/** Environment variable names for Claude settings */
export const ENV_VARS = {
  /** API key for Anthropic */
  ANTHROPIC_API_KEY: 'ANTHROPIC_API_KEY',
  /** Base URL override */
  ANTHROPIC_BASE_URL: 'ANTHROPIC_BASE_URL',
  /** API timeout */
  API_TIMEOUT_MS: 'API_TIMEOUT_MS',
  /** Default Opus model */
  ANTHROPIC_DEFAULT_OPUS_MODEL: 'ANTHROPIC_DEFAULT_OPUS_MODEL',
  /** Default Sonnet model */
  ANTHROPIC_DEFAULT_SONNET_MODEL: 'ANTHROPIC_DEFAULT_SONNET_MODEL',
  /** Default Haiku model */
  ANTHROPIC_DEFAULT_HAIKU_MODEL: 'ANTHROPIC_DEFAULT_HAIKU_MODEL',
} as const;
