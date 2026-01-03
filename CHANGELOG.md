# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1](https://github.com/jigonr/claude-switch/compare/claude-switch-v0.1.0...claude-switch-v0.1.1) (2026-01-03)


### Features

* add comprehensive README, LICENSE, tests, and CI/CD ([112d4e4](https://github.com/jigonr/claude-switch/commit/112d4e4eb6ec75438e757570ca0f9204d898a817))
* configure publishing to GitHub Packages ([071633e](https://github.com/jigonr/claude-switch/commit/071633e0219ee0867b35785f52a7308b4ab864fe))
* implement claude-switch MVP ([ba7469c](https://github.com/jigonr/claude-switch/commit/ba7469c05fcf19e2465c3d384bef62cde73484df))
* initial project setup ([684bc61](https://github.com/jigonr/claude-switch/commit/684bc61952aed1fc83a4cc644a6e2295538ac6c0))


### Bug Fixes

* **ci:** remove invalid yaml document separator from release-please workflow ([3c6c732](https://github.com/jigonr/claude-switch/commit/3c6c73209f42b8105b35fbeff3a015f292cb0971))
* resolve TypeScript strict null check errors ([a64bdb8](https://github.com/jigonr/claude-switch/commit/a64bdb826994154eb705af7ed2f2ee00bbac1704))
* update package name to @jigonr/claude-switch ([bfa968f](https://github.com/jigonr/claude-switch/commit/bfa968f512d5a9c7322aecc583351a2aa4c943ed))

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
