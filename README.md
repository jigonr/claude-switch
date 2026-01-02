# claude-switch

> Simple API provider switcher for Claude Code CLI

A lightweight, secure CLI tool to seamlessly switch between different API providers for Claude Code: Claude Pro subscription, Anthropic API, and z.ai (GLM models).

[![CI](https://github.com/jigonr/claude-switch/workflows/CI/badge.svg)](https://github.com/jigonr/claude-switch/actions)
[![npm version](https://badge.fury.io/js/%40jigonr%2Fclaude-switch.svg)](https://www.npmjs.com/package/@jigonr/claude-switch)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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

```bash
# Using npm
npm install -g @jigonr/claude-switch

# Using bun
bun add -g @jigonr/claude-switch

# Using yarn
yarn global add @jigonr/claude-switch
```

## Quick Start

```bash
# Show current provider
claude-switch

# Switch to a provider
claude-switch claude-pro-max
claude-switch anthropic
claude-switch z.ai

# List all available providers
claude-switch list

# Show detailed status
claude-switch status

# Import from bash script configuration
claude-switch import-bash
```

## Usage

### Basic Commands

#### Switch Provider

```bash
# Switch to Claude Pro subscription
claude-switch claude-pro-max

# Switch to Anthropic API
claude-switch anthropic

# Switch to z.ai (GLM models)
claude-switch z.ai
```

#### List Providers

```bash
claude-switch list
```

Output:
```
Available Providers:

  ● claude-pro-max
    Claude Pro subscription (browser-based)
    Type: subscription

  ○ anthropic
    Anthropic official API
    Type: api

  ○ z.ai
    z.ai API (GLM models)
    Type: api

Current: claude-pro-max
```

#### Show Status

```bash
claude-switch status
```

Output:
```
Current Provider:

  claude-pro-max
  Claude Pro subscription (browser-based)
  Type: subscription
```

### Advanced Usage

#### Project-Specific Configuration

Create a `.claude-switch.json` file in your project root:

```json
{
  "provider": "z.ai",
  "inherits": "~/.claude/switch-config.json"
}
```

claude-switch will automatically detect and use this configuration when run from within the project directory.

#### Import from Bash Script

If you're migrating from the bash version of claude-switch:

```bash
claude-switch import-bash
```

This will:
- Import your `~/.claude/glm-config.json` settings
- Extract and securely store your z.ai API key
- Create the new configuration format
- Preserve your model preferences

## Configuration

### Global Configuration

Location: `~/.claude/switch-config.json`

```json
{
  "version": "1.0",
  "currentProvider": "claude-pro-max",
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
    },
    "z.ai": {
      "type": "api",
      "description": "z.ai API (GLM models)",
      "settings": {
        "env": {
          "ANTHROPIC_API_KEY_FILE": "~/.claude/credentials/zai.key",
          "API_TIMEOUT_MS": "3000000",
          "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-4.7",
          "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-4.7",
          "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.5-air"
        }
      }
    }
  }
}
```

### Credential Storage

API keys are stored separately from configuration:

```bash
~/.claude/credentials/
├── anthropic.key  (chmod 600)
└── zai.key        (chmod 600)
```

**Security Note**: Never commit credential files to version control!

## Security

### API Key Storage

❌ **BAD** - Don't store API keys in config files:
```json
{
  "provider": "anthropic",
  "apiKey": "sk-ant-..."  // NEVER DO THIS
}
```

✅ **GOOD** - Store keys in separate files:
```bash
# Create credentials directory
mkdir -p ~/.claude/credentials

# Store API key securely
echo "your-api-key-here" > ~/.claude/credentials/anthropic.key
chmod 600 ~/.claude/credentials/anthropic.key
```

### File Permissions

Ensure proper permissions on credential files:

```bash
chmod 600 ~/.claude/credentials/*.key
```

### Project Configurations

Never commit project-specific configs with sensitive data:

```bash
# Add to .gitignore
echo ".claude-switch.json" >> .gitignore
```

## Development

### Prerequisites

- Node.js ≥ 18.0.0
- Bun ≥ 1.0.0 (recommended) or npm

### Setup

```bash
# Clone the repository
git clone https://github.com/jigonr/claude-switch.git
cd claude-switch

# Install dependencies
bun install

# Build
bun run build

# Run tests
bun run test

# Lint
bun run lint

# Type check
bun run typecheck
```

### Project Structure

```
claude-switch/
├── src/
│   ├── commands/           # CLI commands
│   │   ├── switch.ts       # Provider switching logic
│   │   ├── list.ts         # List providers
│   │   └── import.ts       # Import from bash
│   ├── config/             # Configuration management
│   │   ├── schema.ts       # Zod schemas
│   │   ├── manager.ts      # Config I/O
│   │   └── detector.ts     # Project config detection
│   ├── providers/          # Provider type definitions
│   ├── utils/              # Utilities (logger, errors)
│   └── index.ts            # CLI entry point
├── tests/
│   ├── integration/        # Integration tests
│   └── unit/               # Unit tests
└── dist/                   # Built output
```

### Running Tests

```bash
# Run all tests
bun run test

# Run with coverage
bun run test:coverage

# Watch mode
bun run test:watch
```

## Troubleshooting

### Provider switch doesn't take effect

Make sure you're switching before launching Claude Code:

```bash
claude-switch anthropic
claude  # Now launches with Anthropic API
```

### API key not found

Verify your API key is stored correctly:

```bash
# Check file exists and has correct permissions
ls -la ~/.claude/credentials/

# Should show:
# -rw------- 1 user user ... anthropic.key
# -rw------- 1 user user ... zai.key
```

### Config validation errors

Reset to default configuration:

```bash
# Backup current config
mv ~/.claude/switch-config.json ~/.claude/switch-config.json.bak

# Let claude-switch create a new default
claude-switch list
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`bun run test`)
5. Run linter (`bun run lint:fix`)
6. Commit your changes (`git commit -m 'feat: add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License

MIT © [J.I. Gonzalez-Rojas](https://github.com/jigonr)

## Acknowledgments

- Built with [Bun](https://bun.sh/)
- CLI framework: [Commander.js](https://github.com/tj/commander.js)
- Validation: [Zod](https://github.com/colinhacks/zod)
- Linting: [Biome](https://biomejs.dev/)

## Roadmap

- [ ] Interactive TUI with Ink
- [ ] Shell completion (bash, zsh, fish)
- [ ] Validation command for credentials
- [ ] Doctor command for diagnostics
- [ ] Support for custom providers
- [ ] Configuration profiles management

## Related Projects

- [letta-switch](https://github.com/jigonr/letta-switch) - Comprehensive configuration manager for Letta CLI (agents + models + memory blocks)

---

**Made with ❤️ for the Claude Code community**
