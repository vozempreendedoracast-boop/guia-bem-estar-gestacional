import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify the caller is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify user with anon client
    const anonClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller }, error: authError } = await anonClient.auth.getUser();
    if (authError || !caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Service role client for admin operations
    const admin = createClient(supabaseUrl, serviceRoleKey);

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // LIST all user profiles
    if (req.method === "GET" && action === "list") {
      const { data, error } = await admin
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // STATS
    if (req.method === "GET" && action === "stats") {
      const { count: totalUsers } = await admin
        .from("user_profiles")
        .select("*", { count: "exact", head: true });

      const { count: activeUsers } = await admin
        .from("user_profiles")
        .select("*", { count: "exact", head: true })
        .eq("plan_status", "active");

      const today = new Date().toISOString().split("T")[0];
      const { count: newToday } = await admin
        .from("user_profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today);

      const { data: planCounts } = await admin
        .from("user_profiles")
        .select("plan");

      const essentialCount = (planCounts || []).filter(p => p.plan === "essential").length;
      const premiumCount = (planCounts || []).filter(p => p.plan === "premium").length;

      return new Response(JSON.stringify({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        newToday: newToday || 0,
        essentialCount,
        premiumCount,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST") {
      const body = await req.json();

      // CREATE user
      if (action === "create") {
        const { email, plan, plan_status } = body;
        if (!email) {
          return new Response(JSON.stringify({ error: "Email é obrigatório" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Use inviteUserByEmail to create user AND send invitation email
        const redirectUrl = url.origin.replace("functions/v1/admin-users", "");
        const siteUrl = body.redirectTo || "https://mamyboo.lovable.app/cadastro";
        const { data: newUser, error: createError } = await admin.auth.admin.inviteUserByEmail(email, {
          redirectTo: siteUrl,
        });
        if (createError) throw createError;

        // Update profile with plan info
        if (newUser.user) {
          // Small delay to ensure the trigger has created the profile
          await new Promise(r => setTimeout(r, 500));

          const { error: updateError } = await admin
            .from("user_profiles")
            .update({
              plan: plan || "none",
              plan_status: plan_status || "none",
              purchased_at: (plan_status === "active") ? new Date().toISOString() : null,
              expires_at: (plan_status === "active")
                ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
                : null,
            })
            .eq("user_id", newUser.user.id);
          if (updateError) throw updateError;
        }

        return new Response(JSON.stringify({ success: true, user_id: newUser.user?.id }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // UPDATE user profile
      if (action === "update") {
        const { id, plan, plan_status, email } = body;
        if (!id) {
          return new Response(JSON.stringify({ error: "ID é obrigatório" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const updates: Record<string, unknown> = {};
        if (plan !== undefined) updates.plan = plan;
        if (plan_status !== undefined) updates.plan_status = plan_status;
        if (email !== undefined) updates.email = email;

        // If activating, set dates
        if (plan_status === "active" && plan !== "none") {
          updates.purchased_at = new Date().toISOString();
          updates.expires_at = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
        }
        if (plan_status === "expired" || plan === "none") {
          updates.plan_status = plan_status || "expired";
        }

        const { error } = await admin
          .from("user_profiles")
          .update(updates)
          .eq("id", id);
        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // DELETE user
      if (action === "delete") {
        const { user_id } = body;
        if (!user_id) {
          return new Response(JSON.stringify({ error: "user_id é obrigatório" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Delete auth user (cascade will remove profile)
        const { error } = await admin.auth.admin.deleteUser(user_id);
        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Admin users error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
