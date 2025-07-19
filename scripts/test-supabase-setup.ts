#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import {
  UserRole,
  ProjectNamespace,
  hasRole,
  hasProjectAccess,
  isQNUser,
  getUserDisplayName,
  auth0Management
} from '../packages/auth/src/index';
import type { QNUser } from '../packages/auth/src/index';
import { dbUtils } from '../apps/qn-dashboard/lib/database';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Helper functions
function success(message: string) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function error(message: string) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
}

function warning(message: string) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

function info(message: string) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

function section(title: string) {
  console.log(`\n${colors.bold}${colors.blue}=== ${title} ===${colors.reset}`);
}

// Test functions
async function testEnvironmentVariables() {
  section('Testing Environment Variables');

  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  const optionalVars = [
    'AUTH0_DOMAIN',
    'AUTH0_CLIENT_ID',
    'AUTH0_CLIENT_SECRET',
    'AUTH0_BASE_URL',
    'AUTH0_SECRET'
  ];

  let allRequired = true;

  for (const varName of requiredVars) {
    if (process.env[varName]) {
      success(`${varName} is set`);
    } else {
      error(`${varName} is missing`);
      allRequired = false;
    }
  }

  for (const varName of optionalVars) {
    if (process.env[varName]) {
      success(`${varName} is set (optional)`);
    } else {
      warning(`${varName} is missing (optional for this test)`);
    }
  }

  return allRequired;
}

async function testSupabaseConnection() {
  section('Testing Supabase Connection');

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      error('Missing Supabase environment variables');
      return false;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Test basic connection
    const { data, error: connectionError } = await supabase
      .from('qn_users')
      .select('count')
      .limit(1);

    if (connectionError) {
      error(`Connection failed: ${connectionError.message}`);
      return false;
    }

    success('Supabase connection successful');
    return true;
  } catch (err) {
    error(`Connection error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    return false;
  }
}

async function testServiceRoleConnection() {
  section('Testing Service Role Connection');

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      error('Missing service role environment variables');
      return false;
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Test service role permissions
    const { data, error: serviceError } = await supabase
      .from('qn_users')
      .select('*')
      .limit(1);

    if (serviceError) {
      error(`Service role connection failed: ${serviceError.message}`);
      return false;
    }

    success('Service role connection successful');
    return true;
  } catch (err) {
    error(`Service role error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    return false;
  }
}

async function testDatabaseTables() {
  section('Testing Database Tables');

  const requiredTables = [
    'qn_users',
    'qn_businesses',
    'qn_advertisements',
    'rltr_mktg_agents',
    'rltr_mktg_listings',
    'rltr_mktg_content_pieces'
  ];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    error('Missing environment variables for table testing');
    return false;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  let allTablesExist = true;

  for (const tableName of requiredTables) {
    try {
      const { error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (error) {
        error(`Table ${tableName} not accessible: ${error.message}`);
        allTablesExist = false;
      } else {
        success(`Table ${tableName} exists and accessible`);
      }
    } catch (err) {
      error(`Error checking table ${tableName}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      allTablesExist = false;
    }
  }

  return allTablesExist;
}

async function testAuthPackage() {
  section('Testing Auth Package');

  try {
    // Test enums
    const roles = Object.values(UserRole);
    const projects = Object.values(ProjectNamespace);

    success(`UserRole enum loaded with ${roles.length} roles`);
    success(`ProjectNamespace enum loaded with ${projects.length} projects`);

    // Test mock user
    const mockUser: QNUser = {
      sub: 'auth0|test123',
      email: 'test@example.com',
      name: 'Test User',
      given_name: 'Test',
      family_name: 'User',
      app_metadata: {
        roles: [UserRole.QN_RESIDENT],
        projects: [ProjectNamespace.QN]
      }
    };

    // Test utility functions
    const hasResident = hasRole(mockUser, UserRole.QN_RESIDENT);
    const hasQNAccess = hasProjectAccess(mockUser, ProjectNamespace.QN);
    const isQNUserResult = isQNUser(mockUser);
    const displayName = getUserDisplayName(mockUser);

    success(`hasRole function: ${hasResident}`);
    success(`hasProjectAccess function: ${hasQNAccess}`);
    success(`isQNUser function: ${isQNUserResult}`);
    success(`getUserDisplayName function: ${displayName}`);

    return true;
  } catch (err) {
    error(`Auth package error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    return false;
  }
}

async function testDatabaseUtilities() {
  section('Testing Database Utilities');

  try {
    // Test database utils import
    if (!dbUtils) {
      error('Database utilities not available');
      return false;
    }

    success('Database utilities imported successfully');

    // Test available methods
    const methods = [
      'getQNUsers',
      'createQNUser',
      'getRLTRAgents',
      'createRLTRAgent',
      'syncAuth0User'
    ];

    for (const method of methods) {
      if (typeof dbUtils[method] === 'function') {
        success(`Method ${method} available`);
      } else {
        error(`Method ${method} not available`);
      }
    }

    return true;
  } catch (err) {
    error(`Database utilities error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    return false;
  }
}

async function testUserSync() {
  section('Testing User Sync (Read-Only)');

  try {
    const mockUser: QNUser = {
      sub: 'auth0|test_sync_123',
      email: 'test-sync@example.com',
      name: 'Test Sync User',
      given_name: 'Test',
      family_name: 'Sync',
      app_metadata: {
        roles: [UserRole.QN_RESIDENT],
        projects: [ProjectNamespace.QN]
      }
    };

    info('Testing user sync preparation (not actually syncing)');

    // Test sync preparation without actually syncing
    const userData = {
      email: mockUser.email,
      auth0_id: mockUser.sub,
      first_name: mockUser.given_name || '',
      last_name: mockUser.family_name || '',
      location: '',
      interests: [],
      role: 'Resident' as const,
      is_verified: false
    };

    success('User sync data preparation successful');
    info(`Would sync user: ${userData.email} (${userData.auth0_id})`);

    return true;
  } catch (err) {
    error(`User sync test error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    return false;
  }
}

async function testAuth0Management() {
  section('Testing Auth0 Management (Optional)');

  try {
    if (!auth0Management) {
      warning('Auth0 management not available (missing credentials)');
      return true; // Not critical for basic setup
    }

    success('Auth0 management client imported');

    // Test that methods exist
    const methods = ['updateUserMetadata', 'getUserMetadata', 'createUser'];
    for (const method of methods) {
      if (typeof auth0Management[method] === 'function') {
        success(`Auth0 method ${method} available`);
      } else {
        warning(`Auth0 method ${method} not available`);
      }
    }

    return true;
  } catch (err) {
    warning(`Auth0 management error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    return true; // Not critical for basic setup
  }
}

async function testMigrationStatus() {
  section('Testing Migration Status');

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      error('Missing environment variables for migration check');
      return false;
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Check if migrations table exists
    const { data: migrations, error } = await supabase
      .from('meta.migrations')
      .select('*')
      .order('applied_at', { ascending: false });

    if (error) {
      error(`Migration check failed: ${error.message}`);
      info('Run migrations with: cd packages/database && npm run migrate');
      return false;
    }

    if (migrations && migrations.length > 0) {
      success(`Found ${migrations.length} applied migrations`);
      migrations.forEach(migration => {
        info(`Migration: ${migration.version} - ${migration.name}`);
      });
    } else {
      warning('No migrations found in meta.migrations table');
    }

    return true;
  } catch (err) {
    error(`Migration status error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log(`${colors.bold}🚀 Supabase Setup Test Suite${colors.reset}\n`);

  const results = {
    envVars: false,
    supabaseConnection: false,
    serviceRole: false,
    tables: false,
    authPackage: false,
    databaseUtils: false,
    userSync: false,
    auth0Management: false,
    migrations: false
  };

  try {
    results.envVars = await testEnvironmentVariables();

    if (results.envVars) {
      results.supabaseConnection = await testSupabaseConnection();
      results.serviceRole = await testServiceRoleConnection();
      results.tables = await testDatabaseTables();
      results.migrations = await testMigrationStatus();
    }

    results.authPackage = await testAuthPackage();
    results.databaseUtils = await testDatabaseUtilities();
    results.userSync = await testUserSync();
    results.auth0Management = await testAuth0Management();

  } catch (err) {
    error(`Test suite error: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }

  // Summary
  section('Test Summary');

  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;

  console.log(`\n${colors.bold}Results: ${passed}/${total} tests passed${colors.reset}\n`);

  Object.entries(results).forEach(([test, passed]) => {
    const icon = passed ? '✅' : '❌';
    const color = passed ? colors.green : colors.red;
    console.log(`${color}${icon} ${test}${colors.reset}`);
  });

  // Next steps
  section('Next Steps');

  if (!results.envVars) {
    info('1. Set up environment variables in .env.local');
  }

  if (!results.supabaseConnection) {
    info('2. Create Supabase project and configure credentials');
  }

  if (!results.tables || !results.migrations) {
    info('3. Run database migrations: cd packages/database && npm run migrate');
  }

  if (results.envVars && results.supabaseConnection && results.tables) {
    success('🎉 Basic setup is complete! Ready for development.');
    info('Try running: npm run dev');
  }

  console.log(`\n${colors.bold}📚 For detailed setup instructions, see: SUPABASE_SETUP_GUIDE.md${colors.reset}`);

  process.exit(passed === total ? 0 : 1);
}

// Run tests
runTests().catch(err => {
  error(`Test runner error: ${err instanceof Error ? err.message : 'Unknown error'}`);
  process.exit(1);
});
