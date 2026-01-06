# Providers

## claude-pro-max

**Type:** Subscription

Uses Claude Pro via browser authentication. No setup required.

```bash
claude-switch claude-pro-max
```

## anthropic

**Type:** API

Uses the official Anthropic API.

### Setup

```bash
mkdir -p ~/.claude/credentials
echo "your-api-key" > ~/.claude/credentials/anthropic.key
chmod 600 ~/.claude/credentials/anthropic.key
```

Get your API key from [console.anthropic.com](https://console.anthropic.com).

## z.ai

**Type:** API

Uses z.ai API with GLM models.

### Setup

```bash
mkdir -p ~/.claude/credentials
echo "your-api-key" > ~/.claude/credentials/zai.key
chmod 600 ~/.claude/credentials/zai.key
```

### GLM Model Mapping

| Claude Model | GLM Model |
|--------------|-----------|
| Opus | glm-4.7 |
| Sonnet | glm-4.7 |
| Haiku | glm-4.5-air |

## Migration

If you have a legacy `~/.claude/glm-config.json`:

```bash
claude-switch import-bash
```
