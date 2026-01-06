# Troubleshooting

## Common Issues

### "Provider not found"

**Cause**: Invalid provider name specified.

**Solution**: Use one of the valid provider names:

- `claude-pro-max`
- `anthropic`
- `z.ai`

### "API key not configured"

**Cause**: Credential file missing for the selected provider.

**Solution**: Create the credential file with your API key:

```bash
# Create credentials directory
mkdir -p ~/.claude/credentials

# For Anthropic
echo "your-anthropic-key" > ~/.claude/credentials/anthropic.key
chmod 600 ~/.claude/credentials/anthropic.key

# For z.ai
echo "your-zai-key" > ~/.claude/credentials/zai.key
chmod 600 ~/.claude/credentials/zai.key
```

### "Permission denied"

**Cause**: Cannot write to configuration directory.

**Solution**: Ensure you have write permissions:

```bash
chmod 755 ~/.claude
chmod 755 ~/.claude/credentials
```

### Stale settings after switching

**Cause**: Previous provider's environment variables persisted.

**Solution**: This was fixed in v0.2.0. Provider switching now completely replaces env settings. If you're on an older version, update:

```bash
bun update -g @jigonr/claude-switch
```

### Changes not taking effect

**Cause**: Claude Code CLI may cache settings.

**Solution**: Restart Claude Code CLI after switching providers.

## Debug Mode

Enable debug output by setting the DEBUG environment variable:

```bash
DEBUG=1 claude-switch anthropic
```

Check configuration files directly:

```bash
# View switch configuration
cat ~/.claude/switch-config.json

# View Claude settings (written by claude-switch)
cat ~/.claude/settings.json
```

## Getting Help

- [GitHub Issues](https://github.com/jigonr/claude-switch/issues)
- [Documentation](https://jigonzalez.com/claude-switch/)
