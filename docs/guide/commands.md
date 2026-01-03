# Commands

## Default Command

```bash
claude-switch [provider]
```

If no provider is specified, shows the current active provider.
If a provider is specified, switches to that provider.

### Arguments

| Argument | Description |
|----------|-------------|
| `provider` | Provider name: `claude-pro-max`, `anthropic`, or `z.ai` |

### Examples

```bash
# Show current provider
claude-switch

# Switch to anthropic
claude-switch anthropic
```

## list

List all available providers and their status.

```bash
claude-switch list
```

### Output

Shows each provider with:

- Name
- Type (subscription or API)
- Status (configured or not)

## status

Show detailed status information.

```bash
claude-switch status
```

### Output

- Current active provider
- Configuration file path
- Credentials file path
- API key status (masked)

## --version

Show the installed version.

```bash
claude-switch --version
```

## --help

Show help information.

```bash
claude-switch --help
```
