# CLI Reference

## Synopsis

```bash
claude-switch [command] [options]
```

## Commands

### Default (switch/show)

```bash
claude-switch [provider]
```

| Argument | Required | Description |
|----------|----------|-------------|
| `provider` | No | Provider to switch to: `claude-pro-max`, `anthropic`, `z.ai` |

If no provider specified, shows current provider.

### list

```bash
claude-switch list
```

Lists all available providers with their configuration status.

### status

```bash
claude-switch status
```

Shows detailed configuration status including:

- Active provider
- Config file locations
- API key status (masked)

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

# Switch to Claude Pro subscription
claude-switch claude-pro-max

# Switch to z.ai
claude-switch z.ai

# List all providers
claude-switch list

# Show detailed status
claude-switch status
```
