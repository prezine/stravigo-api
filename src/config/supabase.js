const { createClient } = require("@supabase/supabase-js");

class SupabaseConfig {
  constructor() {
    // Log environment variables (for debugging, remove in production)
    console.log("🔧 Initializing Supabase config...");
    console.log("🔧 SUPABASE_URL exists:", !!process.env.SUPABASE_URL);
    console.log(
      "🔧 SUPABASE_SERVICE_ROLE_KEY exists:",
      !!process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    console.log(
      "🔧 SUPABASE_ANON_KEY exists:",
      !!process.env.SUPABASE_ANON_KEY
    );

    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    this.supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    // Check for required environment variables
    const missingVars = [];
    if (!this.supabaseUrl) missingVars.push("SUPABASE_URL");
    if (!this.supabaseServiceKey) missingVars.push("SUPABASE_SERVICE_ROLE_KEY");
    if (!this.supabaseAnonKey) missingVars.push("SUPABASE_ANON_KEY");

    if (missingVars.length > 0) {
      console.error(
        "❌ Missing Supabase environment variables:",
        missingVars.join(", ")
      );
      console.error("❌ Please check your .env file");
      throw new Error(
        `Missing environment variables: ${missingVars.join(", ")}`
      );
    }

    try {
      // Service role client - bypasses RLS (for INSERT/UPDATE/DELETE)
      this.serviceClient = createClient(
        this.supabaseUrl,
        this.supabaseServiceKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
          },
          db: {
            schema: "public",
          },
        }
      );
      console.log("✅ Service role client initialized");

      // Anon client - respects RLS (for SELECT)
      this.anonClient = createClient(this.supabaseUrl, this.supabaseAnonKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
        db: {
          schema: "public",
        },
      });
      console.log("✅ Anon client initialized");
    } catch (error) {
      console.error("❌ Failed to create Supabase clients:", error.message);
      throw error;
    }
  }

  // Get service client for write operations (bypasses RLS)
  getServiceClient() {
    if (!this.serviceClient) {
      throw new Error("Service client not initialized");
    }
    return this.serviceClient;
  }

  // Get anon client for read operations (respects RLS)
  getAnonClient() {
    if (!this.anonClient) {
      throw new Error("Anon client not initialized");
    }
    return this.anonClient;
  }

  // For backward compatibility
  get supabase() {
    return this.getServiceClient();
  }

  // Test connection
  async testConnection() {
    try {
      console.log("🔌 Testing Supabase connection...");

      // Test with anon client first
      const { data, error } = await this.anonClient
        .from("pages")
        .select("count")
        .limit(1);

      if (error) {
        console.error("❌ Supabase connection test failed:", error.message);
        console.error("❌ Error details:", error);
        return false;
      }

      console.log("✅ Supabase connection successful");
      console.log("📊 Connection test response:", data);

      // Also test service client
      try {
        const serviceTest = await this.serviceClient
          .from("pages")
          .select("count")
          .limit(1);
        console.log("✅ Service role client test successful");
      } catch (serviceError) {
        console.warn(
          "⚠️ Service role client test failed (may be expected):",
          serviceError.message
        );
      }

      return true;
    } catch (error) {
      console.error("❌ Supabase connection error:", error.message);
      console.error("❌ Stack trace:", error.stack);
      return false;
    }
  }
}

// Create and export singleton instance
const supabaseConfig = new SupabaseConfig();

module.exports = {
  getServiceClient: () => supabaseConfig.getServiceClient(),
  getAnonClient: () => supabaseConfig.getAnonClient(),
  testConnection: () => supabaseConfig.testConnection(),

  // For backward compatibility
  supabase: supabaseConfig.serviceClient,
  anonClient: supabaseConfig.anonClient,
};
