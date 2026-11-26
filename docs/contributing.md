# Contributing

## Development

```bash
git clone https://github.com/jigonr/claude-switch.git
cd claude-switch
bun install --frozen-lockfile
bun run dev
```

## Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Watch mode |
| `bun run build` | Build |
| `bun run test` | Run tests |
| `bun run format` | Format TypeScript, JavaScript, and project JSON |
| `bun run format:check` | Check formatting without rewriting files |
| `bun run typecheck` | Check production TypeScript, build/test configuration, and the JavaScript integration test |

Use current stable Bun for these developer checks; the published CLI still
targets Node.js 18 or newer. Optional Git hooks (`prek install`) run native Bun
checks on applicable staged paths. CI and the commands above check their full
scopes. Bun's formatter and type checker do not replace general lint rules or
enforce import ordering.

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
3. Run `bun run format:check && bun run typecheck && bun run build && bun run test:coverage`
4. Commit and create PR
