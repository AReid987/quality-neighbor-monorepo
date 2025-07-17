import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { config } from "dotenv";

// Load environment variables
config({ path: join(__dirname, "../../../../apps/qn-dashboard/.env.local") });
config({ path: join(__dirname, "../../../.env.local") });

interface Migration {
  version: string;
  name: string;
  filename: string;
  content: string;
}

class MigrationRunner {
  private supabase: any;
  private migrationsPath: string;

  constructor() {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error(
        "Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
      );
    }

    this.supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    this.migrationsPath = join(__dirname, "../migrations");
  }

  private async ensureMetaSchema() {
    console.log("🔍 Ensuring meta schema exists...");

    const { error } = await this.supabase
      .rpc("exec_sql", {
        sql: "CREATE SCHEMA IF NOT EXISTS meta;",
      })
      .catch(async () => {
        // If exec_sql doesn't exist, create schema directly
        return { error: null };
      });

    if (error) {
      console.error("❌ Error creating meta schema:", error);
      throw error;
    }
  }

  private async ensureMigrationsTable() {
    console.log("🔍 Ensuring migrations table exists...");

    // Try to query the migrations table first to see if it exists
    const { error: queryError } = await this.supabase
      .from("meta.migrations")
      .select("version")
      .limit(1);

    if (queryError && queryError.code === "PGRST116") {
      // Table doesn't exist, we need to create it manually
      console.log(
        "📝 Migrations table does not exist. Please create it manually in Supabase SQL editor.",
      );
      console.log("📝 Run this SQL in your Supabase SQL editor:");
      console.log(`
CREATE SCHEMA IF NOT EXISTS meta;

CREATE TABLE IF NOT EXISTS meta.migrations (
  version text PRIMARY KEY,
  name text,
  applied_at timestamp with time zone DEFAULT now() NOT NULL
);
      `);
      throw new Error(
        "Migrations table does not exist. Please create it manually using the SQL above.",
      );
    }

    if (queryError && queryError.code !== "PGRST116") {
      console.error("❌ Error checking migrations table:", queryError);
      throw queryError;
    }
  }

  private async getAppliedMigrations(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from("meta.migrations")
      .select("version")
      .order("version");

    if (error) {
      if (error.code === "PGRST116") {
        // Table doesn't exist, return empty array
        return [];
      }
      console.error("❌ Error fetching applied migrations:", error);
      throw error;
    }

    return data?.map((row: any) => row.version) || [];
  }

  private loadMigrations(): Migration[] {
    console.log("📂 Loading migration files...");

    try {
      const files = readdirSync(this.migrationsPath)
        .filter((file) => file.endsWith(".sql"))
        .sort();

      const migrations: Migration[] = files.map((filename) => {
        const content = readFileSync(
          join(this.migrationsPath, filename),
          "utf8",
        );
        const match = filename.match(/^(\d+)-(.+)\.sql$/);

        if (!match) {
          throw new Error(`Invalid migration filename: ${filename}`);
        }

        const [, version, name] = match;

        return {
          version,
          name,
          filename,
          content,
        };
      });

      console.log(`📦 Found ${migrations.length} migration files`);
      return migrations;
    } catch (error) {
      console.error("❌ Error loading migrations:", error);
      throw error;
    }
  }

  private async executeMigration(migration: Migration) {
    console.log(
      `🚀 Executing migration: ${migration.version} - ${migration.name}`,
    );
    console.log(
      `📝 Please execute this migration manually in your Supabase SQL editor:`,
    );
    console.log("=".repeat(80));
    console.log(migration.content);
    console.log("=".repeat(80));

    try {
      // Since we can't execute arbitrary SQL through the client,
      // we'll just record the migration as applied
      // The user needs to run the SQL manually

      const readline = require("readline");
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const answer = await new Promise<string>((resolve) => {
        rl.question(
          "Have you executed this migration in Supabase SQL editor? (y/n): ",
          resolve,
        );
      });

      rl.close();

      if (answer.toLowerCase() !== "y" && answer.toLowerCase() !== "yes") {
        throw new Error(
          "Migration not executed. Please run the SQL in Supabase SQL editor and try again.",
        );
      }

      // Record the migration as applied
      const { error: insertError } = await this.supabase
        .from("meta.migrations")
        .insert({
          version: migration.version,
          name: migration.name,
        });

      if (insertError) {
        console.error(
          `❌ Error recording migration ${migration.version}:`,
          insertError,
        );
        throw insertError;
      }

      console.log(`✅ Migration ${migration.version} recorded successfully`);
    } catch (error) {
      console.error(
        `❌ Failed to execute migration ${migration.version}:`,
        error,
      );
      throw error;
    }
  }

  async runMigrations() {
    try {
      console.log("🚀 Starting database migration...");
      console.log("📍 Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

      // Ensure meta schema and migrations table exist
      await this.ensureMetaSchema();
      await this.ensureMigrationsTable();

      // Load all migrations
      const migrations = this.loadMigrations();

      // Get applied migrations
      const appliedMigrations = await this.getAppliedMigrations();
      console.log(`📊 Found ${appliedMigrations.length} applied migrations`);

      // Filter out already applied migrations
      const pendingMigrations = migrations.filter(
        (migration) => !appliedMigrations.includes(migration.version),
      );

      if (pendingMigrations.length === 0) {
        console.log("✅ No pending migrations to run");
        return;
      }

      console.log(`📝 Found ${pendingMigrations.length} pending migrations`);

      // Execute pending migrations
      for (const migration of pendingMigrations) {
        await this.executeMigration(migration);
      }

      console.log("🎉 All migrations completed successfully!");
    } catch (error) {
      console.error("💥 Migration failed:", error);
      process.exit(1);
    }
  }

  async rollback(version?: string) {
    console.log("⚠️  Rollback functionality not implemented yet");
    console.log("Please manually revert database changes if needed");
  }

  async status() {
    try {
      console.log("📊 Migration Status Report");
      console.log("========================");

      const migrations = this.loadMigrations();
      const appliedMigrations = await this.getAppliedMigrations();

      console.log(`Total migrations: ${migrations.length}`);
      console.log(`Applied migrations: ${appliedMigrations.length}`);
      console.log(
        `Pending migrations: ${migrations.length - appliedMigrations.length}`,
      );
      console.log("");

      console.log("Migration Details:");
      console.log("------------------");

      for (const migration of migrations) {
        const isApplied = appliedMigrations.includes(migration.version);
        const status = isApplied ? "✅ Applied" : "⏳ Pending";
        console.log(`${status} | ${migration.version} - ${migration.name}`);
      }
    } catch (error) {
      console.error("❌ Error checking migration status:", error);
      process.exit(1);
    }
  }
}

// CLI handling
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "run";

  const runner = new MigrationRunner();

  switch (command) {
    case "run":
      await runner.runMigrations();
      break;
    case "status":
      await runner.status();
      break;
    case "rollback":
      await runner.rollback(args[1]);
      break;
    default:
      console.log("Usage: tsx run.ts [run|status|rollback]");
      console.log("  run     - Run pending migrations (default)");
      console.log("  status  - Show migration status");
      console.log(
        "  rollback - Rollback to specific version (not implemented)",
      );
      process.exit(1);
  }
}

// Execute if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error("💥 Migration runner failed:", error);
    process.exit(1);
  });
}

export { MigrationRunner };
