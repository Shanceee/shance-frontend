#!/usr/bin/env node

/**
 * Simple verification script to check if the project creation fix is correct
 */

import { readFileSync } from 'fs';
import { join } from 'path';

console.log('🔍 Verifying project creation fix...\n');

let hasErrors = false;

// Test 1: Check that uploadPhoto is removed from api.ts
console.log('Test 1: Checking api.ts...');
const apiContent = readFileSync(
  join(process.cwd(), 'src/modules/projects/api.ts'),
  'utf-8'
);

if (apiContent.includes('uploadPhoto')) {
  console.log('❌ FAIL: uploadPhoto method still exists in api.ts');
  hasErrors = true;
} else {
  console.log('✅ PASS: uploadPhoto method removed from api.ts');
}

if (apiContent.includes('projects/${projectId}/photo/')) {
  console.log('❌ FAIL: Non-existent /photo/ endpoint still referenced');
  hasErrors = true;
} else {
  console.log('✅ PASS: No reference to /photo/ endpoint');
}

if (!apiContent.includes('uploadImage')) {
  console.log('❌ FAIL: uploadImage method is missing');
  hasErrors = true;
} else {
  console.log('✅ PASS: uploadImage method exists');
}

console.log();

// Test 2: Check that hooks.ts uses uploadImage correctly
console.log('Test 2: Checking hooks.ts...');
const hooksContent = readFileSync(
  join(process.cwd(), 'src/modules/projects/hooks.ts'),
  'utf-8'
);

if (hooksContent.includes('useUploadProjectPhoto')) {
  console.log('❌ FAIL: useUploadProjectPhoto hook still exists');
  hasErrors = true;
} else {
  console.log('✅ PASS: useUploadProjectPhoto hook removed');
}

if (hooksContent.includes("formData.append('photo',")) {
  console.log("❌ FAIL: Still using 'photo' as field name");
  hasErrors = true;
} else {
  console.log("✅ PASS: Not using 'photo' as field name");
}

if (!hooksContent.includes("formData.append('image',")) {
  console.log("❌ FAIL: Not using 'image' as field name");
  hasErrors = true;
} else {
  console.log("✅ PASS: Using 'image' as field name");
}

if (!hooksContent.includes('useUploadProjectImage')) {
  console.log('❌ FAIL: useUploadProjectImage is not used');
  hasErrors = true;
} else {
  console.log('✅ PASS: Using useUploadProjectImage hook');
}

if (!hooksContent.includes('projectsApi.uploadImage')) {
  console.log('❌ FAIL: Not using projectsApi.uploadImage');
  hasErrors = true;
} else {
  console.log('✅ PASS: Using projectsApi.uploadImage');
}

console.log();

// Test 3: Check that index.ts doesn't export removed hook
console.log('Test 3: Checking index.ts...');
const indexContent = readFileSync(
  join(process.cwd(), 'src/modules/projects/index.ts'),
  'utf-8'
);

if (indexContent.includes('useUploadProjectPhoto')) {
  console.log('❌ FAIL: useUploadProjectPhoto still exported from index.ts');
  hasErrors = true;
} else {
  console.log('✅ PASS: useUploadProjectPhoto not exported');
}

if (!indexContent.includes('useUploadProjectImage')) {
  console.log('❌ FAIL: useUploadProjectImage not exported');
  hasErrors = true;
} else {
  console.log('✅ PASS: useUploadProjectImage exported');
}

if (!indexContent.includes('useCreateProjectWithImage')) {
  console.log('❌ FAIL: useCreateProjectWithImage not exported');
  hasErrors = true;
} else {
  console.log('✅ PASS: useCreateProjectWithImage exported');
}

console.log();
console.log('='.repeat(50));

if (hasErrors) {
  console.log('❌ VERIFICATION FAILED');
  console.log('Some checks did not pass. Please review the changes.');
  process.exit(1);
} else {
  console.log('✅ VERIFICATION PASSED');
  console.log('All checks passed successfully!');
  console.log();
  console.log('Next steps:');
  console.log('1. Start dev server: npm run dev');
  console.log('2. Navigate to: http://localhost:3000/projects/create');
  console.log('3. Test project creation with and without images');
  process.exit(0);
}
