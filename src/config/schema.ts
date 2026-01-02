/**
 * Zod schemas for configuration validation
 */

import { z } from 'zod';

/**
 * Provider name enum schema
 */
export const ProviderNameSchema = z.enum([
  'claude-pro-max',
  'anthropic',
  'z.ai',
]);

/**
 * Provider type schema
 */
export const ProviderTypeSchema = z.enum(['subscription', 'api']);

/**
 * Provider configuration schema
 */
export const ProviderSchema = z.object({
  type: ProviderTypeSchema,
  description: z.string(),
  settings: z.object({
    env: z.record(z.string()),
  }),
});

/**
 * Main configuration schema
 */
export const ConfigSchema = z.object({
  version: z.literal('1.0'),
  currentProvider: ProviderNameSchema,
  providers: z.record(ProviderNameSchema, ProviderSchema),
});

/**
 * Project-specific configuration schema
 */
export const ProjectConfigSchema = z.object({
  provider: ProviderNameSchema,
  inherits: z.string().optional(),
});

/**
 * Export inferred types
 */
export type ProviderName = z.infer<typeof ProviderNameSchema>;
export type ProviderType = z.infer<typeof ProviderTypeSchema>;
export type Provider = z.infer<typeof ProviderSchema>;
export type Config = z.infer<typeof ConfigSchema>;
export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;
