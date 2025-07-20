#!/usr/bin/env node

/**
 * Health Check for QN Platform
 * Comprehensive validation for production deployments
 */

const https = require('https');
const http = require('http');

const PROD_URL = process.env.PROD_URL || 'https://qualityneighbor.com';
const TIMEOUT = 30000; // 30 seconds

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, { timeout: TIMEOUT, ...options }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          responseTime: Date.now() - startTime
        });
      });
    });

    const startTime = Date.now();
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function runHealthChecks() {
  console.log('🏥 Running QN Platform Health Checks...');
  console.log(`📍 Target URL: ${PROD_URL}`);

  const checks = [
    {
      name: 'Homepage availability',
      url: PROD_URL,
      expectedStatus: 200,
      expectedContent: 'Quality Neighbor',
      maxResponseTime: 3000
    },
    {
      name: 'Dashboard route',
      url: `${PROD_URL}/dashboard`,
      expectedStatus: 200,
      maxResponseTime: 3000
    },
    {
      name: 'API health endpoint',
      url: `${PROD_URL}/api/health`,
      expectedStatus: 200,
      optional: true
    },
    {
      name: 'Security headers',
      url: PROD_URL,
      expectedStatus: 200,
      checkHeaders: true
    }
  ];

  let passed = 0;
  let failed = 0;
  let warnings = 0;

  for (const check of checks) {
    try {
      console.log(`\n🔍 Checking: ${check.name}`);
      const response = await makeRequest(check.url);

      // Check status code
      if (response.statusCode !== check.expectedStatus) {
        throw new Error(`Expected status ${check.expectedStatus}, got ${response.statusCode}`);
      }

      // Check response time
      if (check.maxResponseTime && response.responseTime > check.maxResponseTime) {
        const message = `Response time ${response.responseTime}ms exceeds limit ${check.maxResponseTime}ms`;
        if (check.optional) {
          console.log(`⚠️  WARNING: ${check.name} - ${message}`);
          warnings++;
        } else {
          throw new Error(message);
        }
      }

      // Check content if specified
      if (check.expectedContent && !response.body.toLowerCase().includes(check.expectedContent.toLowerCase())) {
        throw new Error(`Expected content "${check.expectedContent}" not found`);
      }

      // Check security headers
      if (check.checkHeaders) {
        const securityHeaders = [
          'x-frame-options',
          'x-content-type-options',
          'x-xss-protection'
        ];

        for (const header of securityHeaders) {
          if (!response.headers[header]) {
            console.log(`⚠️  WARNING: Missing security header: ${header}`);
            warnings++;
          }
        }
      }

      console.log(`✅ PASS: ${check.name} (${response.responseTime}ms)`);
      passed++;

    } catch (error) {
      if (check.optional) {
        console.log(`⚠️  WARNING: ${check.name} - ${error.message}`);
        warnings++;
      } else {
        console.log(`❌ FAIL: ${check.name} - ${error.message}`);
        failed++;
      }
    }
  }

  console.log(`\n📊 Health Check Results:`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Warnings: ${warnings}`);

  if (failed > 0) {
    console.log('\n🚨 Health checks failed!');
    process.exit(1);
  } else if (warnings > 0) {
    console.log('\n⚠️  Health checks passed with warnings');
    process.exit(0);
  } else {
    console.log('\n🎉 All health checks passed!');
    process.exit(0);
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

// Run health checks
runHealthChecks().catch((error) => {
  console.error('❌ Health check execution failed:', error);
  process.exit(1);
});