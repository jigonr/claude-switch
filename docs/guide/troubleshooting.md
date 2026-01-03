# Troubleshooting

## Common Issues

### "Provider not found"

**Cause**: Invalid provider name specified.

**Solution**: Use one of the valid provider names:

- `claude-pro-max`
- `anthropic`
- `z.ai`

### "API key not configured"

**Cause**: Environment variable not set for the selected provider.

**Solution**: Set the appropriate environment variable:

```bash
# For Anthropic
export ANTHROPIC_API_KEY="your-key"

# For z.ai
export ZAI_API_KEY="your-key"
```

### "Permission denied"

**Cause**: Cannot write to configuration directory.

**Solution**: Ensure you have write permissions to `~/.config/claude-code/`:

```bash
chmod 755 ~/.config/claude-code
```

### Changes not taking effect

**Cause**: Claude Code CLI may cache settings.

**Solution**: Restart Claude Code CLI after switching providers.

## Debug Mode

For more detailed output, check the configuration files directly:

```bash
cat ~/.config/claude-code/settings.json
```

## Getting Help

- [GitHub Issues](https://github.com/jigonr/claude-switch/issues)
- [Documentation](https://jigonzalez.com/claude-switch/)
