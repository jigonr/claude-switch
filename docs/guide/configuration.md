# Configuration

## Configuration Files

claude-switch uses two configuration files:

### Main Config

Location: `~/.config/claude-code/settings.json`

This is the Claude Code CLI configuration file that claude-switch modifies.

### Credentials

Location: `~/.config/claude-code/.credentials`

Stores API credentials securely with restricted permissions (600).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | API key for Anthropic provider |
| `ZAI_API_KEY` | API key for z.ai provider |

## Project-Specific Config

Create a `.claude-switch.json` in your project root to override global settings:

```json
{
  "provider": "anthropic"
}
```

This automatically switches to the specified provider when working in that directory.

## Security

- API keys are stored with 600 permissions
- Keys are never logged or displayed in full
- Credentials file is separate from config
