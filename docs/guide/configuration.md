# Configuration

## File Locations

claude-switch manages the following files:

| File | Path | Purpose |
|------|------|---------|
| Global config | `~/.claude/switch-config.json` | Provider definitions and current selection |
| Claude settings | `~/.claude/settings.json` | Environment variables for Claude Code |
| Credentials | `~/.claude/credentials/` | API key files (mode 0600) |

## Global Configuration

The main configuration file (`~/.claude/switch-config.json`) stores:

- Available providers and their settings
- Currently active provider
- Environment variables for each provider

Example structure:

```json
{
  "version": "1.0",
  "currentProvider": "anthropic",
  "providers": {
    "claude-pro-max": {
      "type": "subscription",
      "description": "Claude Pro subscription (browser-based)",
      "settings": {
        "env": {
          "API_TIMEOUT_MS": "3000000"
        }
      }
    },
    "anthropic": {
      "type": "api",
      "description": "Anthropic official API",
      "settings": {
        "env": {
          "ANTHROPIC_API_KEY_FILE": "~/.claude/credentials/anthropic.key",
          "API_TIMEOUT_MS": "3000000"
        }
      }
    }
  }
}
```

## Project-Specific Configuration

Override the global provider for a specific project by creating `.claude-switch.json` in the project root:

```json
{
  "provider": "anthropic"
}
```

Alternatively, use `.claude/config.json` in your project directory.

When you run `claude-switch` in a directory with a project config, it automatically uses that provider without modifying the global configuration.

## Credentials

API keys are stored in separate files under `~/.claude/credentials/`:

- `anthropic.key` - Anthropic API key
- `zai.key` - z.ai API key

These files have restricted permissions (mode 0600 - owner read/write only).

## Security

- API keys are stored in separate credential files, not in config
- Credential files are created with mode 0600 (owner read/write only)
- API keys are redacted in all log output
- Path traversal attacks are prevented in all file operations
