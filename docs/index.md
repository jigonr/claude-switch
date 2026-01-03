# claude-switch

**Simple API provider switcher for Claude Code CLI.**

[![CI](https://github.com/jigonr/claude-switch/workflows/CI/badge.svg)](https://github.com/jigonr/claude-switch/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **🔄 Simple Provider Switching** - Switch between 3 providers with one command
- **🔒 Security First** - Separate credential storage with proper permissions
- **📁 Project-Aware** - Auto-detects project-specific configs
- **⚡ Fast** - Built with Bun and TypeScript
- **🛡️ Type-Safe** - Zod schema validation for all configurations

## Supported Providers

| Provider | Type | Description |
|----------|------|-------------|
| `claude-pro-max` | Subscription | Claude Pro via browser authentication |
| `anthropic` | API | Official Anthropic API |
| `z.ai` | API | z.ai API with GLM models |

## Quick Start

```bash
# Install with Bun (recommended)
bun add -g @jigonr/claude-switch

# Install with npm
npm install -g @jigonr/claude-switch

# Show current provider
claude-switch

# Switch to a provider
claude-switch anthropic

# List all providers
claude-switch list
```

## Getting Started

1. [Installation](getting-started/installation.md)
2. [Quick Start](getting-started/quickstart.md)

## License

MIT License - see [LICENSE](https://github.com/jigonr/claude-switch/blob/main/LICENSE) for details.
