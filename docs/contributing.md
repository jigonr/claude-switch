# Contributing

## Development

```bash
git clone https://github.com/jigonr/claude-switch.git
cd claude-switch
bun install
bun run dev
```

## Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Watch mode |
| `bun run build` | Build |
| `bun run test` | Run tests |
| `bun run lint` | Lint |
| `bun run typecheck` | Type check |

## Commits

Use [Conventional Commits](https://conventionalcommits.org):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `test:` Tests
- `refactor:` Refactoring
- `chore:` Maintenance

## Pull Requests

1. Fork and create feature branch
2. Make changes
3. Run `bun run lint && bun run test`
4. Commit and create PR
