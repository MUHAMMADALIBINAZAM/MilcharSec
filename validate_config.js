const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'data', 'project.json');

console.log('--- STARTING PLATFORM MASTER CONFIGURATION VALIDATION ---');

try {
  // 1. Syntactic Validity Check
  console.log('1. Checking Syntactic Validity...');
  const fileContent = fs.readFileSync(configPath, 'utf8');
  const projectConfig = JSON.parse(fileContent);
  console.log('   [SUCCESS] JSON is syntactically valid and was parsed successfully.\n');

  // 2. Modules Count Check (Exactly 8 modules)
  console.log('2. Checking Modules Count...');
  const modules = projectConfig.modules;
  if (!Array.isArray(modules)) {
    throw new Error('Config missing "modules" array');
  }
  console.log(`   Found ${modules.length} modules.`);
  if (modules.length === 8) {
    console.log('   [SUCCESS] Exactly 8 modules exist.\n');
  } else {
    throw new Error(`Expected exactly 8 modules, but found ${modules.length}.`);
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

  // 4. Tools Count Check (Exactly 4 core tools)
  console.log('4. Checking Core Tools Count...');
  const tools = projectConfig.tools;
  if (!Array.isArray(tools)) {
    throw new Error('Config missing "tools" array');
  }
  console.log(`   Found ${tools.length} core tools.`);
  if (tools.length === 4) {
    console.log('   [SUCCESS] Exactly 4 core tools exist.\n');
  } else {
    throw new Error(`Expected exactly 4 core tools, but found ${tools.length}.`);
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

  console.log('--- ALL PLATFORM CONFIGURATION CHECKS PASSED SUCCESSFULLY! ---');
  process.exit(0);
} catch (error) {
  console.error('   [FAILURE] Validation check failed:');
  console.error(`   ${error.message}\n`);
  process.exit(1);
}
