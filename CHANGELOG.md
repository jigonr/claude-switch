# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2025-01-02

### Added

- **Core Provider Switching**
  - Switch between Claude Pro, Anthropic API, and z.ai providers
  - Automatic settings.json generation for Claude Code CLI
  - Secure credential storage with proper file permissions (chmod 600)

- **Configuration Management**
  - Global configuration at `~/.claude/switch-config.json`
  - Project-specific configuration with `.claude-switch.json`
  - Configuration detection with project override support
  - Zod schema validation for all configurations

- **Commands**
  - `claude-switch` - Show current provider status
  - `claude-switch <provider>` - Switch to specified provider
  - `claude-switch list` - List all available providers
  - `claude-switch status` - Show detailed status
  - `claude-switch import-bash` - Import from legacy bash configuration

- **Testing Infrastructure**
  - Vitest test framework with 90%+ code coverage
  - Unit tests for all commands, config, and utilities
  - Codecov integration for coverage reporting
  - Pre-commit hooks for code quality

- **CI/CD**
  - GitHub Actions for linting, type checking, testing
  - Multi-platform testing (Ubuntu, macOS)
  - Multi-Node.js version testing (18, 20, 22)
  - Automated npm publishing on release

### Security

- API keys stored in separate credential files, not in config
- Credential files created with mode 0o600 (owner read/write only)
- API key redaction in logs to prevent accidental exposure
