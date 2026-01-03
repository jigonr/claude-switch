# claude-switch

> Simple API provider switcher for Claude Code CLI

[![CI](https://github.com/jigonr/claude-switch/workflows/CI/badge.svg)](https://github.com/jigonr/claude-switch/actions)
[![codecov](https://codecov.io/gh/jigonr/claude-switch/branch/main/graph/badge.svg)](https://codecov.io/gh/jigonr/claude-switch)
[![Docs](https://img.shields.io/badge/docs-jigonzalez.com-blue)](https://jigonzalez.com/claude-switch/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **🔄 Simple Provider Switching** - Switch between 3 providers with one command
- **🔒 Security First** - Separate credential storage with proper permissions
- **📁 Project-Aware** - Auto-detects project-specific configs
- **⚡ Fast** - Built with Bun and TypeScript

## Installation

```bash
# Using Bun (recommended)
bun add -g @jigonr/claude-switch

# Using npm
npm install -g @jigonr/claude-switch
```

## Quick Start

```bash
claude-switch              # Show current provider
claude-switch anthropic    # Switch to Anthropic API
claude-switch list         # List all providers
claude-switch status       # Show detailed status
```

## Supported Providers

| Provider | Type | Description |
|----------|------|-------------|
| `claude-pro-max` | Subscription | Claude Pro via browser |
| `anthropic` | API | Anthropic API |
| `z.ai` | API | z.ai with GLM models |

## Development

```bash
git clone https://github.com/jigonr/claude-switch.git
cd claude-switch
bun install
bun run dev
```

## License

MIT © [J.I. Gonzalez-Rojas](https://github.com/jigonr)

## Related

- [letta-switch](https://github.com/jigonr/letta-switch) - Configuration manager for Letta CLI
