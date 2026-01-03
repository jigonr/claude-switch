# Providers

claude-switch supports three API providers for Claude Code CLI.

## claude-pro-max

**Type**: Subscription

Uses your Claude Pro subscription via browser authentication.

### Setup

No additional setup required. Claude Code CLI handles authentication through your browser.

### When to Use

- You have an active Claude Pro subscription
- You want to use your subscription quota
- You don't need API-level control

## anthropic

**Type**: API

Uses the official Anthropic API directly.

### Setup

1. Get your API key from [console.anthropic.com](https://console.anthropic.com)
2. Set the environment variable:

```bash
export ANTHROPIC_API_KEY="your-api-key"
```

Or add to your shell config (~/.zshrc or ~/.bashrc).

### When to Use

- You need API-level control
- You want to track usage separately
- You're building integrations

## z.ai

**Type**: API

Uses z.ai API with GLM models (OpenAI-compatible).

### Setup

1. Get your API key from z.ai
2. Set the environment variable:

```bash
export ZAI_API_KEY="your-api-key"
```

### Configuration

z.ai uses the OpenAI-compatible API format:

- Base URL: `https://api.z.ai/api/paas/v4`
- Model: GLM models

### When to Use

- You want to use GLM models
- Alternative to Anthropic API
- Different pricing structure
