import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  plan: "none" | "essential" | "premium";
  plan_status: "none" | "active" | "expired";
  account_status?: string;
  kiwify_order_id: string | null;
  purchased_at: string | null;
  expires_at: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error: Error | null; user: User | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null; user: User | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isAccountBlocked = useCallback((status?: string | null) => {
    const normalized = (status ?? "").toLowerCase().trim();
    return normalized !== "" && normalized !== "active";
  }, []);

  const isPlanInactive = useCallback((planStatus?: string | null) => {
    const normalized = (planStatus ?? "").toLowerCase().trim();
    return normalized === "none" || normalized === "inactive" || normalized === "inativo";
  }, []);

  const fetchProfile = useCallback(async (userId: string, email?: string) => {
    try {
      const [profileResult, adminResult] = await Promise.all([
        supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle(),
        supabase.rpc("has_role", { _user_id: userId, _role: "admin" }),
      ]);

      if (profileResult.error) {
        console.error("Erro ao buscar perfil:", profileResult.error);
      }
      if (adminResult.error) {
        console.error("Erro ao validar role admin:", adminResult.error);
      }

      let resolvedProfile = (profileResult.data as UserProfile) ?? null;

      // Self-heal: if authenticated user has no profile row, create it once via RPC
      if (!resolvedProfile && !profileResult.error) {
        const { data: ensured, error: ensureError } = await supabase.rpc("ensure_user_profile", {
          _email: email ?? "",
        });

        if (ensureError) {
          console.error("Erro ao garantir profile:", ensureError);
        } else {
          resolvedProfile = (ensured as UserProfile) ?? null;
        }
      }

      const isAdminUser = Boolean(adminResult.data);

      // Check if account/plan is blocked
      if (resolvedProfile && (isAccountBlocked(resolvedProfile.account_status) || (!isAdminUser && isPlanInactive(resolvedProfile.plan_status)))) {
        await supabase.auth.signOut();
        setUserProfile(null);
        setIsAdmin(false);
        setUser(null);
        setSession(null);
        return;
      }

      setUserProfile(resolvedProfile);
      setIsAdmin(isAdminUser);
    } catch (error) {
      console.error("Falha inesperada ao buscar dados:", error);
      setUserProfile(null);
      setIsAdmin(false);
    }
  }, [isAccountBlocked]);

  const clearState = useCallback(() => {
    setUser(null);
    setSession(null);
    setUserProfile(null);
    setIsAdmin(false);
  }, []);

  // Polling: check account_status every 30s
  useEffect(() => {
    if (!user) {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      return;
    }

    pollingRef.current = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("account_status, plan, plan_status, purchased_at, expires_at, kiwify_order_id, email, id, user_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) return;

        // If account/plan is blocked or profile deleted, force logout
        if (!data || isAccountBlocked((data as UserProfile).account_status) || (!isAdmin && isPlanInactive((data as UserProfile).plan_status))) {
          await supabase.auth.signOut();
          clearState();
          window.location.href = "/login";
          return;
        }

        // Update profile in real-time so plan_status changes reflect immediately
        setUserProfile(data as UserProfile);
      } catch {}
    }, 30000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [user, clearState]);

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          setTimeout(async () => {
            if (!mounted) return;
            await fetchProfile(currentSession.user.id, currentSession.user.email ?? "");
            if (mounted) setLoading(false);
          }, 0);
        } else {
          clearState();
          if (mounted) setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!mounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        fetchProfile(currentSession.user.id, currentSession.user.email ?? "").then(() => {
          if (mounted) setLoading(false);
        });
      } else {
        if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, clearState]);

  const signInWithPassword = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      return { error: error as Error | null, user: data.user ?? null };
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("account_status")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (profile && isAccountBlocked((profile as { account_status?: string }).account_status)) {
      await supabase.auth.signOut();
      return { error: new Error("ACCOUNT_INACTIVE"), user: null };
    }

    return { error: null, user: data.user };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/cadastro`,
      },
    });
    return { error: error as Error | null, user: data.user ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    clearState();
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id, user.email ?? "");
  };

  return (
    <AuthContext.Provider value={{ user, session, userProfile, loading, isAdmin, signInWithPassword, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
