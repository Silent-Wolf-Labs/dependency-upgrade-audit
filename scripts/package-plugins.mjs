#!/usr/bin/env node
// Build the self-contained Claude and Codex plugin release directories.

import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const [outputArgument = 'release'] = process.argv.slice(2);
const repositoryRoot = resolve(import.meta.dirname, '..');
const outputDirectory = resolve(repositoryRoot, outputArgument);

const packages = {
  claude: ['.claude-plugin', 'skills', 'README.md', 'LICENSE'],
  codex: ['.codex-plugin', 'skills', 'scripts', 'README.md', 'LICENSE'],
};

rmSync(outputDirectory, { recursive: true, force: true });

for (const [packageName, entries] of Object.entries(packages)) {
  const packageDirectory = resolve(outputDirectory, packageName);
  mkdirSync(packageDirectory, { recursive: true });

  for (const entry of entries) {
    const source = resolve(repositoryRoot, entry);
    if (!existsSync(source)) throw new Error(`Cannot package missing entry: ${entry}`);
    cpSync(source, resolve(packageDirectory, entry), { recursive: true });
  }
}

console.log(`Plugin packages staged in ${outputDirectory}`);
