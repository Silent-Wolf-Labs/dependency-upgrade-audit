FROM node:22-bookworm-slim AS base

WORKDIR /plugin

COPY . .

FROM base AS validate-claude

RUN npm install --global @anthropic-ai/claude-code@2.1.283 \
    && claude plugin validate .claude-plugin/plugin.json --strict --json \
    && claude plugin validate .claude-plugin/marketplace.json --strict --json

FROM base AS validate-codex

RUN node scripts/validate-codex-plugin.mjs .

FROM base AS package

ARG RELEASE_VERSION=dev

RUN apt-get update \
    && apt-get install --yes --no-install-recommends zip \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /release/claude /release/codex \
    && cp -a .claude-plugin skills README.md LICENSE /release/claude/ \
    && cp -a .codex-plugin skills README.md LICENSE /release/codex/ \
    && cd /release \
    && zip -rq dependency-upgrade-audit-claude-${RELEASE_VERSION}.zip claude \
    && zip -rq dependency-upgrade-audit-codex-${RELEASE_VERSION}.zip codex
