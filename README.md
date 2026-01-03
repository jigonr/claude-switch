# claude-switch

> Simple API provider switcher for Claude Code CLI

A lightweight, secure CLI tool to seamlessly switch between different API providers for Claude Code: Claude Pro subscription, Anthropic API, and z.ai (GLM models).

[![CI](https://github.com/jigonr/claude-switch/workflows/CI/badge.svg)](https://github.com/jigonr/claude-switch/actions)
[![codecov](https://codecov.io/gh/jigonr/claude-switch/branch/main/graph/badge.svg)](https://codecov.io/gh/jigonr/claude-switch)
[![GitHub Packages](https://img.shields.io/badge/npm-GitHub%20Packages-blue)](https://github.com/jigonr/claude-switch/packages)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Built for [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code)

📚 **[Documentation](https://jigonzalez.com/claude-switch/)**

## Features

- **🔄 Simple Provider Switching** - Switch between 3 providers with one command
- **🔒 Security First** - Separate credential storage with proper permissions
- **📁 Project-Aware** - Auto-detects project-specific configs
- **⚡ Fast** - Built with Bun and TypeScript for optimal performance
- **🛡️ Type-Safe** - Zod schema validation for all configurations
- **📦 Zero Config** - Works out of the box with sensible defaults

## Supported Providers

| Provider | Type | Description |
|----------|------|-------------|
| **claude-pro-max** | Subscription | Claude Pro via browser authentication |
| **anthropic** | API | Official Anthropic API |
| **z.ai** | API | z.ai API with GLM models |

## Installation

First, configure npm for GitHub Packages:

```bash
echo "@jigonr:registry=https://npm.pkg.github.com" >> ~/.npmrc
```

Then install with Bun (recommended):

```bash
bun add -g @jigonr/claude-switch
```

Or with npm:

```bash
npm install -g @jigonr/claude-switch
```

## Quick Start

```bash
# Show current provider
claude-switch

# Switch to a provider
claude-switch anthropic
claude-switch claude-pro-max
claude-switch z.ai

# List all available providers
claude-switch list

# Show detailed status
claude-switch status
```

## Documentation

For full documentation, visit **[jigonzalez.com/claude-switch](https://jigonzalez.com/claude-switch/)**.

- [Installation](https://jigonzalez.com/claude-switch/getting-started/installation/)
- [Quick Start](https://jigonzalez.com/claude-switch/getting-started/quickstart/)
- [Commands](https://jigonzalez.com/claude-switch/guide/commands/)
- [Providers](https://jigonzalez.com/claude-switch/guide/providers/)
- [Configuration](https://jigonzalez.com/claude-switch/guide/configuration/)

## Development

```bash
git clone https://github.com/jigonr/claude-switch.git
cd claude-switch
bun install
bun run dev
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

MIT © [J.I. Gonzalez-Rojas](https://github.com/jigonr)

## Related Projects

- [letta-switch](https://github.com/jigonr/letta-switch) - Configuration manager for Letta CLI
