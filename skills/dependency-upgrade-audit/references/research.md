# Research and reporting

## Gather Evidence

Research the upgrade before proposing edits. Prefer sources in this order:

1. Official migration guide.
2. Official release notes or changelog.
3. Official API documentation.
4. Project security advisories.
5. Package registry metadata.
6. OSV, GitHub Security Advisories, or NVD records.
7. Maintainer issues or discussions.
8. High-quality secondary sources.

Capture each source and the versions or version ranges to which its material
conclusion applies. Do not present unsourced model memory as fact. Report any
authoritative-source conflict and its effect on the recommendation.

## Assess Security and Compatibility

For installed and candidate versions, investigate applicable advisories and
whether the candidate fixes or introduces them. Check authoritative material for
security-sensitive changes involving authentication, authorization, TLS or
certificate validation, cryptography, parsing or deserialization, insecure API
deprecation, configuration defaults, and package provenance. Security evidence
does not justify unsupported claims that a package is malicious or compromised.

Identify breaking changes, deprecated or removed APIs, renamed symbols, changed
defaults, serialization changes, configuration-key changes, command-line or
environment-variable changes, and ecosystem compatibility requirements.
Distinguish changes that affect this repository from irrelevant changes.

## Inspect Repository Impact

Search only for evidence relevant to the dependency and identified changes:
imports, call sites, configuration, build configuration, tests, and integration
boundaries. Record affected files and the behavior each requires. Do not broaden
the task into unrelated cleanup or modernization.

## Recommend and Report

Before editing, state:

- dependency, ecosystem, current resolved version, requested target, latest
  suitable stable version, and recommended target;
- source-backed security findings and applicable version ranges;
- repository-relevant compatibility and configuration changes;
- affected files, required migration work, migration risk, and focused and
  broader verification;
- unavailable evidence, uncertainty, or blocking constraints.

Do not assume the requested or newest version is best. Prefer a newer patch
release when material security, regression, or compatibility fixes fit the
project constraints. Explain every difference between requested and recommended
targets.

In the final outcome, summarize selected and installed versions, sources and
their conclusions, security findings, repository impact, changes, verification
results, skipped checks, and residual risk.
