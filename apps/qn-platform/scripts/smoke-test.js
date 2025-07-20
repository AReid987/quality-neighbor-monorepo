#!/usr/bin/env node

/**
 * Smoke Test for QN Platform
 * Basic validation that the application is running and accessible
 */

const https = require('https');
const http = require('http');

const PREVIEW_URL = process.env.PREVIEW_URL || 'http://localhost:3000';
const TIMEOUT = 30000; // 30 seconds

async function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, { timeout: TIMEOUT }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function runSmokeTests() {
  console.log('🧪 Running QN Platform Smoke Tests...');
  console.log(`📍 Target URL: ${PREVIEW_URL}`);

  const tests = [
    {
      name: 'Homepage loads',
      url: PREVIEW_URL,
      expectedStatus: 200,
      expectedContent: 'Quality Neighbor'
    },
    {
      name: 'Dashboard route exists',
      url: `${PREVIEW_URL}/dashboard`,
      expectedStatus: 200,
      expectedContent: 'dashboard'
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`\n🔍 Testing: ${test.name}`);
      const response = await makeRequest(test.url);

      // Check status code
      if (response.statusCode !== test.expectedStatus) {
        throw new Error(`Expected status ${test.expectedStatus}, got ${response.statusCode}`);
      }

      // Check content if specified
      if (test.expectedContent && !response.body.toLowerCase().includes(test.expectedContent.toLowerCase())) {
        throw new Error(`Expected content "${test.expectedContent}" not found`);
      }

      console.log(`✅ PASS: ${test.name}`);
      passed++;

    } catch (error) {
      console.log(`❌ FAIL: ${test.name} - ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Smoke Test Results:`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n🚨 Smoke tests failed!');
    process.exit(1);
  } else {
    console.log('\n🎉 All smoke tests passed!');
    process.exit(0);
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

// Run tests
runSmokeTests().catch((error) => {
  console.error('❌ Smoke test execution failed:', error);
  process.exit(1);
});