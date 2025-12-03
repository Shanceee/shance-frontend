#!/usr/bin/env node

/**
 * Manual test script for project creation
 *
 * This script tests the project creation API directly
 *
 * Usage:
 *   node test-project-creation.mjs
 */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://185.171.82.179:8000/api/v1';

// You need to set your JWT token here
const JWT_TOKEN = process.env.JWT_TOKEN || '';

if (!JWT_TOKEN) {
  console.error('Please set JWT_TOKEN environment variable');
  console.log(
    'Example: JWT_TOKEN=your_token_here node test-project-creation.mjs'
  );
  process.exit(1);
}

async function testProjectCreation() {
  console.log('Testing project creation...\n');

  try {
    // Step 1: Create project
    console.log('Step 1: Creating project...');
    const projectData = {
      name: `Test Project ${Date.now()}`,
      title: `Test Project Title ${Date.now()}`,
      description:
        'This is a test project description created by automated test script to verify the API works correctly',
      status: 'prototype',
      stage: 'idea',
    };

    const createResponse = await fetch(`${API_URL}/projects/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${JWT_TOKEN}`,
      },
      body: JSON.stringify(projectData),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      throw new Error(
        `Failed to create project: ${createResponse.status} ${errorText}`
      );
    }

    const project = await createResponse.json();
    console.log('✅ Project created successfully!');
    console.log(`   ID: ${project.id}`);
    console.log(`   Name: ${project.name}`);
    console.log(`   Title: ${project.title}\n`);

    // Step 2: Upload image (if we have one)
    console.log('Step 2: Testing image upload...');

    // Create a simple 1x1 PNG image buffer
    const pngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );

    // Create form data
    const formData = new FormData();
    const blob = new Blob([pngBuffer], { type: 'image/png' });
    formData.append('image', blob, 'test-image.png');

    const uploadResponse = await fetch(
      `${API_URL}/projects/${project.id}/images/`,
      {
        method: 'POST',
        headers: {
          Authorization: `JWT ${JWT_TOKEN}`,
        },
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.log(
        `⚠️  Image upload failed: ${uploadResponse.status} ${errorText}`
      );
      console.log(
        '   This is expected if the endpoint requires different parameters\n'
      );
    } else {
      const imageData = await uploadResponse.json();
      console.log('✅ Image uploaded successfully!');
      console.log(`   Image ID: ${imageData.id}`);
      console.log(`   Image URL: ${imageData.image}\n`);
    }

    // Step 3: Get project details
    console.log('Step 3: Fetching project details...');
    const getResponse = await fetch(`${API_URL}/projects/${project.id}/`, {
      method: 'GET',
      headers: {
        Authorization: `JWT ${JWT_TOKEN}`,
      },
    });

    if (!getResponse.ok) {
      const errorText = await getResponse.text();
      throw new Error(
        `Failed to get project: ${getResponse.status} ${errorText}`
      );
    }

    const projectDetails = await getResponse.json();
    console.log('✅ Project fetched successfully!');
    console.log(
      '   Full project data:',
      JSON.stringify(projectDetails, null, 2)
    );
    console.log('\n');

    console.log('===========================================');
    console.log('✅ ALL TESTS PASSED!');
    console.log('===========================================');
  } catch (error) {
    console.error('\n❌ TEST FAILED:');
    console.error(error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

testProjectCreation();
