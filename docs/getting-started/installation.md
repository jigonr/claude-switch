# Installation

## Prerequisites

- **Bun** (recommended) or Node.js 18+
- **Claude Code CLI**: Must be installed and configured

## Install with Bun (Recommended)

First, configure npm to use GitHub Packages for the `@jigonr` scope:

```bash
# Add to your ~/.npmrc
echo "@jigonr:registry=https://npm.pkg.github.com" >> ~/.npmrc
```

Then install globally:

```bash
bun add -g @jigonr/claude-switch
```

## Alternative: Install with npm

```bash
npm install -g @jigonr/claude-switch
```

## Verify Installation

```bash
claude-switch --version
```

## Uninstall

```bash
# With Bun
bun remove -g @jigonr/claude-switch

# With npm
npm uninstall -g @jigonr/claude-switch
```
