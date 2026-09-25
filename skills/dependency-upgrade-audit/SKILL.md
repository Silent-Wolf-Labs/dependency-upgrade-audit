---
name: dependency-upgrade-audit
description: Research and safely upgrade a dependency in an existing repository using authoritative migration, compatibility, and security evidence. Use for dependency upgrade requests, dependency-related security advisories, or upgrade-safety assessments.
---

# Dependency Upgrade Audit Skill

Safely assess and, when authorized, upgrade one dependency. Base conclusions on
repository evidence and authoritative documentation. Limit work to the smallest
safe migration; do not make unrelated refactors.

## Start Here

Identify the package ecosystem; manifest and lockfile; the dependency's direct or
transitive relationship; its resolved version; the requested target or selection
criteria; and runtime, companion-package, and version-range constraints. Inspect
repository evidence before relying on declarations alone.

For npm projects, run the reusable snapshot helper before interpreting the
upgrade. Invoke it from this skill's directory, rather than the repository being
audited:

```bash
node /absolute/path/to/dependency-upgrade-audit/scripts/npm-dependency-snapshot.mjs <project-directory> <package-name>
```

It collects manifest and lockfile evidence, `npm ls`, the registry's current
version, and `npm audit` output in one JSON document. Treat its output as
evidence to interpret, not as a substitute for migration documentation or
repository inspection. If external requests cannot run, say so and report the
remaining risk.

## Route the Work

- For every assessment, read [research and reporting](references/research.md).
- When implementation is authorized, also read [implementation and verification](references/implementation.md).

If the dependency, target, or scope cannot be determined safely, explain what is
missing before changing files. For assessment or planning requests, stop after
the assessment. Make repository changes only when implementation is authorized.
