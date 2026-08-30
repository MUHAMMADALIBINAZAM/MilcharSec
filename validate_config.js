const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'data', 'project.json');
const toolHubPath = path.join(__dirname, 'src', 'tools', 'tool-hub.js');

const EXPECTED_MODULES = 10;
const EXPECTED_TOOLS = 8;

console.log('--- STARTING PLATFORM MASTER CONFIGURATION VALIDATION ---');

try {
  // 1. Syntactic Validity Check
  console.log('1. Checking Syntactic Validity...');
  const fileContent = fs.readFileSync(configPath, 'utf8');
  const projectConfig = JSON.parse(fileContent);
  console.log('   [SUCCESS] JSON is syntactically valid and was parsed successfully.\n');

  // 2. Modules Count Check
  console.log('2. Checking Modules Count...');
  const modules = projectConfig.modules;
  if (!Array.isArray(modules)) {
    throw new Error('Config missing "modules" array');
  }
  console.log(`   Found ${modules.length} modules.`);
  if (modules.length === EXPECTED_MODULES) {
    console.log(`   [SUCCESS] Exactly ${EXPECTED_MODULES} modules exist.\n`);
  } else {
    throw new Error(`Expected exactly ${EXPECTED_MODULES} modules, but found ${modules.length}.`);
  }

  // 3. Module IDs Uniqueness Check
  console.log('3. Checking Module IDs Uniqueness...');
  const moduleIds = modules.map(m => m.id);
  const uniqueModuleIds = new Set(moduleIds);
  console.log(`   Module IDs found: ${moduleIds.join(', ')}`);
  if (uniqueModuleIds.size === moduleIds.length) {
    console.log(`   [SUCCESS] All ${moduleIds.length} module IDs are unique.\n`);
  } else {
    const duplicates = moduleIds.filter((item, index) => moduleIds.indexOf(item) !== index);
    throw new Error(`Duplicate module IDs found: ${duplicates.join(', ')}`);
  }

  // 4. Tools Count Check
  console.log('4. Checking Core Tools Count...');
  const tools = projectConfig.tools;
  if (!Array.isArray(tools)) {
    throw new Error('Config missing "tools" array');
  }
  console.log(`   Found ${tools.length} core tools.`);
  if (tools.length === EXPECTED_TOOLS) {
    console.log(`   [SUCCESS] Exactly ${EXPECTED_TOOLS} core tools exist.\n`);
  } else {
    throw new Error(`Expected exactly ${EXPECTED_TOOLS} core tools, but found ${tools.length}.`);
  }

  // 5. Tool IDs Uniqueness Check
  console.log('5. Checking Tool IDs Uniqueness...');
  const toolIds = tools.map(t => t.id);
  const uniqueToolIds = new Set(toolIds);
  console.log(`   Tool IDs found: ${toolIds.join(', ')}`);
  if (uniqueToolIds.size === toolIds.length) {
    console.log(`   [SUCCESS] All ${toolIds.length} tool IDs are unique.\n`);
  } else {
    const duplicates = toolIds.filter((item, index) => toolIds.indexOf(item) !== index);
    throw new Error(`Duplicate tool IDs found: ${duplicates.join(', ')}`);
  }

  // 6. Tool Registry Sync Check (project.json vs src/tools/tool-hub.js)
  console.log('6. Checking Tool Registry Sync (catalog vs runtime registry)...');
  const toolHubSource = fs.readFileSync(toolHubPath, 'utf8');
  const registryMatches = [...toolHubSource.matchAll(/'(tool-\d+)':\s*\{\s*name:\s*'([^']+)'/g)];
  const registry = new Map(registryMatches.map(m => [m[1], m[2]]));

  if (registry.size !== EXPECTED_TOOLS) {
    throw new Error(`Runtime registry in src/tools/tool-hub.js declares ${registry.size} tools; expected ${EXPECTED_TOOLS}.`);
  }

  const catalogIds = new Set(toolIds);
  const registryOnlyIds = [...registry.keys()].filter(id => !catalogIds.has(id));
  const catalogOnlyIds = toolIds.filter(id => !registry.has(id));

  if (registryOnlyIds.length > 0) {
    throw new Error(`Tools in the runtime registry but missing from data/project.json: ${registryOnlyIds.join(', ')}`);
  }
  if (catalogOnlyIds.length > 0) {
    throw new Error(`Tools declared in data/project.json but absent from the runtime registry in src/tools/tool-hub.js: ${catalogOnlyIds.join(', ')}`);
  }

  for (const [id, registryName] of registry) {
    const catalogTool = tools.find(t => t.id === id);
    if (catalogTool.name !== registryName) {
      throw new Error(`Tool name mismatch for ${id}: data/project.json says "${catalogTool.name}" but the runtime registry says "${registryName}".`);
    }
  }
  console.log('   [SUCCESS] Catalog and runtime registry declare the same 8 tools with matching IDs and names.\n');

  // 7. Tool related_modules Reference Check
  console.log('7. Checking Tool related_modules References...');
  const moduleSet = new Set(moduleIds);
  const badReferences = [];
  for (const tool of tools) {
    for (const ref of tool.related_modules || []) {
      if (!moduleSet.has(ref)) badReferences.push(`${tool.id} -> ${ref}`);
    }
  }
  if (badReferences.length === 0) {
    console.log('   [SUCCESS] All tool related_modules references point to existing modules.\n');
  } else {
    throw new Error(`Tool related_modules reference unknown modules: ${badReferences.join(', ')}`);
  }

  console.log('--- ALL PLATFORM CONFIGURATION CHECKS PASSED SUCCESSFULLY! ---');
  process.exit(0);
} catch (error) {
  console.error('   [FAILURE] Validation check failed:');
  console.error(`   ${error.message}\n`);
  process.exit(1);
}
