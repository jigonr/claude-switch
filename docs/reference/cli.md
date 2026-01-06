# CLI Reference

## Synopsis

```bash
claude-switch [command] [options]
```

## Commands

### Default (switch/show)

```bash
claude-switch [provider] [options]
```

| Argument | Required | Description |
|----------|----------|-------------|
| `provider` | No | Provider to switch to: `claude-pro-max`, `anthropic`, `z.ai` |

| Option | Description |
|--------|-------------|
| `--local` | Use project config only (don't update global) |
| `--json` | Output in JSON format |

If no provider specified, shows current provider.

### list

```bash
claude-switch list [--json]
```

Lists all available providers. Alias: `ls`

### status

```bash
claude-switch status [--json]
```

Shows current provider status.

### import-bash

```bash
claude-switch import-bash
```

Imports configuration from legacy `~/.claude/glm-config.json`.

## Global Options

| Option | Description |
|--------|-------------|
| `--version`, `-v` | Show version number |
| `--help`, `-h` | Show help |

## Exit Codes

| Code | Description |
|------|-------------|
| 0 | Success |
| 1 | Error (invalid provider, missing config, etc.) |

## Examples

```bash
# Show current provider
claude-switch

# Switch to Anthropic API
claude-switch anthropic

# Switch locally (project only)
claude-switch anthropic --local

# List all providers
claude-switch list

# Get JSON output for scripts
claude-switch --json
claude-switch list --json

# Import from legacy config
claude-switch import-bash
```

## Configuration Files

| File | Path |
|------|------|
| Global config | `~/.claude/switch-config.json` |
| Claude settings | `~/.claude/settings.json` |
| Credentials | `~/.claude/credentials/*.key` |
| Project config | `.claude-switch.json` or `.claude/config.json` |
