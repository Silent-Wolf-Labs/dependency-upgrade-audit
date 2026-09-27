#!/usr/bin/env node
// Validate the repository's Codex/OpenAI plugin package without installing it.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

const [pluginArgument = '.'] = process.argv.slice(2);
const pluginRoot = resolve(pluginArgument);
const errors = [];

function fail(message) {
  errors.push(message);
}

function readJson(path, label) {
  if (!existsSync(path)) {
    fail(`${label} is missing`);
    return null;
  }

  try {
    const value = JSON.parse(readFileSync(path, 'utf8'));
    if (value === null || Array.isArray(value) || typeof value !== 'object') {
      fail(`${label} must contain a JSON object`);
      return null;
    }
    return value;
  } catch (error) {
    fail(`${label} must be valid JSON (${error.message})`);
    return null;
  }
}

function requireString(object, key, label) {
  if (typeof object[key] !== 'string' || !object[key].trim()) {
    fail(`${label}.${key} must be a non-empty string`);
    return null;
  }
  return object[key];
}

function requireObject(object, key, label) {
  const value = object[key];
  if (value === null || Array.isArray(value) || typeof value !== 'object') {
    fail(`${label}.${key} must be an object`);
    return null;
  }
  return value;
}

function validateHttpsUrl(value, label) {
  if (value === undefined) return;
  if (typeof value !== 'string') {
    fail(`${label} must be a string`);
    return;
  }
  try {
    if (new URL(value).protocol !== 'https:') fail(`${label} must use HTTPS`);
  } catch {
    fail(`${label} must be a valid URL`);
  }
}

function insideRoot(path) {
  const pathFromRoot = relative(pluginRoot, path);
  return pathFromRoot && !pathFromRoot.startsWith('..') && !pathFromRoot.includes('/../');
}

function validateSkill(skillDirectory) {
  const skillPath = resolve(skillDirectory, 'SKILL.md');
  const label = relative(pluginRoot, skillPath);
  if (!existsSync(skillPath)) {
    fail(`${label} is missing`);
    return;
  }

  const content = readFileSync(skillPath, 'utf8');
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!frontmatter) {
    fail(`${label} must begin with YAML frontmatter`);
    return;
  }

  for (const key of ['name', 'description']) {
    if (!new RegExp(`^${key}:\\s*\\S`, 'm').test(frontmatter[1])) {
      fail(`${label} frontmatter must contain a non-empty ${key}`);
    }
  }
}

const manifestPath = resolve(pluginRoot, '.codex-plugin/plugin.json');
const manifest = readJson(manifestPath, '.codex-plugin/plugin.json');

if (manifest) {
  const allowedKeys = new Set([
    'id', 'name', 'version', 'description', 'skills', 'apps', 'mcpServers',
    'interface', 'author', 'homepage', 'repository', 'license', 'keywords',
  ]);
  for (const key of Object.keys(manifest)) {
    if (!allowedKeys.has(key)) fail(`plugin.json contains unsupported field ${key}`);
  }

  const name = requireString(manifest, 'name', 'plugin.json');
  if (name && !/^[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*$/.test(name)) {
    fail('plugin.json.name has an invalid Codex plugin identifier');
  }

  const version = requireString(manifest, 'version', 'plugin.json');
  if (version && !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(version)) {
    fail('plugin.json.version must be strict semver');
  }

  requireString(manifest, 'description', 'plugin.json');
  validateHttpsUrl(manifest.homepage, 'plugin.json.homepage');
  validateHttpsUrl(manifest.repository, 'plugin.json.repository');

  const author = requireObject(manifest, 'author', 'plugin.json');
  if (author) {
    requireString(author, 'name', 'plugin.json.author');
    validateHttpsUrl(author.url, 'plugin.json.author.url');
  }

  if (!Array.isArray(manifest.keywords) || !manifest.keywords.every((value) => typeof value === 'string' && value.trim())) {
    fail('plugin.json.keywords must be an array of non-empty strings');
  }

  const skillPath = requireString(manifest, 'skills', 'plugin.json');
  if (skillPath) {
    const skillsDirectory = resolve(pluginRoot, skillPath);
    if (!insideRoot(skillsDirectory) || !existsSync(skillsDirectory) || !statSync(skillsDirectory).isDirectory()) {
      fail('plugin.json.skills must resolve to a directory inside the plugin root');
    } else {
      for (const entry of readdirSync(skillsDirectory, { withFileTypes: true })) {
        if (entry.isDirectory()) validateSkill(resolve(skillsDirectory, entry.name));
      }
    }
  }

  const interfaceConfig = requireObject(manifest, 'interface', 'plugin.json');
  if (interfaceConfig) {
    for (const key of ['displayName', 'shortDescription', 'longDescription', 'developerName', 'category']) {
      requireString(interfaceConfig, key, 'plugin.json.interface');
    }
    if (!Array.isArray(interfaceConfig.capabilities) || !interfaceConfig.capabilities.every((value) => typeof value === 'string')) {
      fail('plugin.json.interface.capabilities must be an array of strings');
    }
    if (!Array.isArray(interfaceConfig.defaultPrompt) || !interfaceConfig.defaultPrompt.every((value) => typeof value === 'string' && value.trim())) {
      fail('plugin.json.interface.defaultPrompt must be an array of non-empty strings');
    }
  }
}

if (errors.length) {
  console.error('Codex plugin validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Codex plugin validation passed: ${pathToFileURL(pluginRoot)}`);
}
