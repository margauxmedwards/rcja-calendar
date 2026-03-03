#!/usr/bin/env node
/**
 * generate-state-pages.js
 * Generates docs/{STATE}/index.html for each configured state from the shared template.
 * This ensures all state pages stay in sync with the template.
 */

const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '../../docs/state-template.html');
const configPath = path.join(__dirname, '../../docs/config.json');
const docsDir = path.join(__dirname, '../../docs');

if (!fs.existsSync(templatePath)) {
  console.error('Template file not found:', templatePath);
  process.exit(1);
}

if (!fs.existsSync(configPath)) {
  console.error('Config file not found:', configPath);
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const stateCodes = Object.keys(config).filter(code => config[code].enabled);

for (const stateCode of stateCodes) {
  const stateDir = path.join(docsDir, stateCode);
  if (!fs.existsSync(stateDir)) {
    fs.mkdirSync(stateDir, { recursive: true });
    console.log(`Created directory: ${stateDir}`);
  }
  
  const outputPath = path.join(stateDir, 'index.html');
  fs.writeFileSync(outputPath, template);
  console.log(`✓ Generated ${stateCode}/index.html`);
}

console.log(`\nGenerated ${stateCodes.length} state pages from template.`);
