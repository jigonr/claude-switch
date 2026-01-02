/**
 * Provider types and interfaces for claude-switch
 */

export type ProviderType = 'subscription' | 'api';
export type ProviderName = 'claude-pro-max' | 'anthropic' | 'z.ai';

/**
 * Provider configuration interface
 */
export interface Provider {
  type: ProviderType;
  description: string;
  settings: {
    env: Record<string, string>;
  };
}

/**
 * Main configuration structure
 */
export interface Config {
  version: '1.0';
  currentProvider: ProviderName;
  providers: Record<ProviderName, Provider>;
}

/**
 * Project-specific configuration (inherits from global)
 */
export interface ProjectConfig {
  provider: ProviderName;
  inherits?: string;
}
