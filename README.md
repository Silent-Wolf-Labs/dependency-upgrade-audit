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

## Install

Install **Dependency Upgrade Audit** from the Silent Wolf Labs Codex
marketplace. The marketplace entry tracks this repository's `main` branch.

After installation, start a new Codex conversation and ask, for example:

```text
Assess upgrading lodash from the currently resolved version to 4.17.21.
```

The skill will assess the requested change before editing files. Ask Codex to
implement the migration when you are ready for repository changes.

## License

Licensed under the [Apache License 2.0](LICENSE).
