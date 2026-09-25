#!/usr/bin/env node
// Collect repeatable npm dependency evidence for this skill.

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const [projectArgument, packageName] = process.argv.slice(2);

if (!projectArgument || !packageName) {
  console.error('Usage: node scripts/npm-dependency-snapshot.mjs <project-directory> <package-name>');
  process.exit(2);
}

const projectDirectory = resolve(projectArgument);

function readJson(filename) {
  const path = `${projectDirectory}/${filename}`;
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8'));
}

function commandResult(arguments_) {
  const result = spawnSync('npm', ['--prefix', projectDirectory, ...arguments_], {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });
  const stdout = result.stdout.trim();
  let output = stdout;
  try {
    output = stdout ? JSON.parse(stdout) : null;
  } catch {
    // Keep non-JSON command output available to the agent.
  }
  return {
    command: `npm --prefix ${projectDirectory} ${arguments_.join(' ')}`,
    exitCode: result.status,
    output,
    stderr: result.stderr.trim() || null,
    error: result.error?.message ?? null,
  };
}

function directRelationships(manifest) {
  if (!manifest) return {};
  const result = {};
  for (const field of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
    if (manifest[field]?.[packageName]) result[field] = manifest[field][packageName];
  }
  return result;
}

function topLevelLockVersion(lockfile) {
  if (!lockfile) return null;
  return lockfile.packages?.[`node_modules/${packageName}`]?.version
    ?? lockfile.dependencies?.[packageName]?.version
    ?? null;
}

const manifest = readJson('package.json');
const lockfile = readJson('package-lock.json');

console.log(JSON.stringify({
  projectDirectory,
  packageName,
  manifest: manifest && {
    name: manifest.name ?? null,
    directRelationships: directRelationships(manifest),
  },
  lockfile: lockfile && {
    lockfileVersion: lockfile.lockfileVersion ?? null,
    topLevelResolvedVersion: topLevelLockVersion(lockfile),
  },
  npmLs: commandResult(['ls', packageName, '--all', '--json']),
  registry: commandResult(['view', packageName, 'version', '--json']),
  audit: commandResult(['audit', '--json']),
}, null, 2));
