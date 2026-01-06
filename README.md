# claude-switch

Simple API provider switcher for Claude Code CLI.

[![CI](https://github.com/jigonr/claude-switch/workflows/CI/badge.svg)](https://github.com/jigonr/claude-switch/actions)
[![codecov](https://codecov.io/gh/jigonr/claude-switch/branch/main/graph/badge.svg)](https://codecov.io/gh/jigonr/claude-switch)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
bun add -g @jigonr/claude-switch
# or
npm install -g @jigonr/claude-switch
```

## Usage

```bash
claude-switch                # Show current provider
claude-switch <provider>     # Switch to provider
claude-switch list           # List all providers
```

### Providers

| Provider | Type | Description |
|----------|------|-------------|
| `claude-pro-max` | Subscription | Claude Pro via browser |
| `anthropic` | API | Anthropic API |
| `z.ai` | API | z.ai with GLM models |

### Options

| Option | Description |
|--------|-------------|
| `--local` | Don't update global config |
| `--json` | JSON output |

## Configuration

Files are stored in `~/.claude/`:

```
~/.claude/
├── switch-config.json    # Provider configuration
├── settings.json         # Claude Code settings (managed)
└── credentials/          # API keys (mode 0600)
    ├── anthropic.key
    └── zai.key
```

### Project Override

Create `.claude-switch.json` in your project:

```json
{"provider": "anthropic"}
```

## Documentation

- [Commands](https://jigonzalez.com/claude-switch/guide/commands/)
- [Configuration](https://jigonzalez.com/claude-switch/guide/configuration/)
- [Troubleshooting](https://jigonzalez.com/claude-switch/guide/troubleshooting/)

## License

MIT
