# Quick Start

## Check Current Provider

```bash
claude-switch
```

## Switch Provider

```bash
claude-switch anthropic      # Anthropic API
claude-switch claude-pro-max # Claude Pro subscription
claude-switch z.ai           # z.ai with GLM models
```

## List All Providers

```bash
claude-switch list
```

## Project Override

Create `.claude-switch.json` in your project:

```json
{"provider": "anthropic"}
```

The provider switches automatically when you enter that directory.
