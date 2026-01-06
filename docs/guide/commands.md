# Commands

## claude-switch [provider]

Switch to a provider or show current status.

```bash
claude-switch [provider] [options]
```

### Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `provider` | No | Provider to switch to: `claude-pro-max`, `anthropic`, `z.ai` |

If no provider is specified, shows the current active provider.

### Options

| Option | Description |
|--------|-------------|
| `--local` | Use project-specific config only (don't update global) |
| `--json` | Output in JSON format |

### Examples

```bash
# Show current provider
claude-switch

# Switch to Anthropic API
claude-switch anthropic

# Switch locally without updating global config
claude-switch anthropic --local

# Get status as JSON (for scripts)
claude-switch --json
```

## claude-switch list

List all available providers.

```bash
claude-switch list [options]
```

Aliases: `ls`

### Options

| Option | Description |
|--------|-------------|
| `--json` | Output in JSON format |

### Output

Shows each provider with:

- Visual indicator for current provider (green bullet)
- Provider name
- Description
- Type (subscription or api)

### Examples

```bash
# List all providers
claude-switch list

# List as JSON
claude-switch list --json
```

## claude-switch status

Show current provider status (same as running `claude-switch` with no arguments).

```bash
claude-switch status [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--json` | Output in JSON format |

## claude-switch import-bash

Import configuration from legacy bash script.

```bash
claude-switch import-bash
```

This command migrates from the legacy `glm-config.json` format:

1. Reads `~/.claude/glm-config.json` if it exists
2. Extracts z.ai API key and model configuration
3. Creates `~/.claude/credentials/zai.key` with secure permissions
4. Updates the z.ai provider configuration

Use this if you're migrating from an older bash-based setup.

## Global Options

| Option | Description |
|--------|-------------|
| `--version`, `-v` | Show version number |
| `--help`, `-h` | Show help information |

## Exit Codes

| Code | Description |
|------|-------------|
| 0 | Success |
| 1 | Error (invalid provider, missing config, etc.) |
