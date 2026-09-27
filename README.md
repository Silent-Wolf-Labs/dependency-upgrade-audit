# Dependency Upgrade Audit

A Codex skill for researching and safely upgrading dependencies. It gathers
authoritative compatibility and security evidence before recommending the
smallest safe migration.

## What it covers

- Current resolved version, requested target, and the best suitable stable
  release
- Security advisories and their affected version ranges
- Repository-specific compatibility impact, including APIs, configuration, and
  lockfiles
- Focused verification and any remaining migration risk

The skill supports any package ecosystem. For npm projects, it includes a
repeatable snapshot helper that records manifest, lockfile, installed-package,
registry, and audit evidence.

## Codex / OpenAI

Install **Dependency Upgrade Audit** from the Silent Wolf Labs Codex
marketplace. The marketplace entry tracks this repository's `main` branch.

After installation, start a new Codex conversation and ask, for example:

```text
Assess upgrading lodash from the currently resolved version to 4.17.21.
```

The skill will assess the requested change before editing files. Ask Codex to
implement the migration when you are ready for repository changes.

## Claude

Install the Silent Wolf Labs Claude marketplace, then install the plugin:

```bash
claude plugin marketplace add Silent-Wolf-Labs/dependency-upgrade-audit
claude plugin install dependency-upgrade-audit@silent-wolf-labs
```

For local development, validate the repository and load the plugin for one
session:

```bash
claude plugin validate . --strict
claude --plugin-dir .
```

In that session, invoke `/dependency-upgrade-audit:dependency-upgrade-audit`
or ask Claude to assess a dependency upgrade. The skill assesses the requested
change before making repository edits.

## License

Licensed under the [Apache License 2.0](LICENSE).
