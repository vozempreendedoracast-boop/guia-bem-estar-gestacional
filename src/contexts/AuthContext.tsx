import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  plan: "none" | "essential" | "premium";
  plan_status: "none" | "active" | "expired";
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

      setUserProfile(resolvedProfile);
      setIsAdmin(Boolean(adminResult.data));
    } catch (error) {
      console.error("Falha inesperada ao buscar dados:", error);
      setUserProfile(null);
      setIsAdmin(false);
    }
  }, []);

  const clearState = useCallback(() => {
    setUser(null);
    setSession(null);
    setUserProfile(null);
    setIsAdmin(false);
  }, []);

  useEffect(() => {
    let mounted = true;

    // 1. Set up auth listener FIRST (Supabase best practice)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          // Use setTimeout to avoid potential deadlocks with Supabase auth
          setTimeout(async () => {
            if (!mounted) return;
            await fetchProfile(currentSession.user.id, currentSession.user.email ?? "");
            if (mounted) setLoading(false);
          }, 0);
        } else {
          clearState();
          // Keep session/user as null (already set above)
          if (mounted) setLoading(false);
        }
      }
    );

    // 2. Then get initial session
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
    return { error: error as Error | null, user: data.user ?? null };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://mamyboo.vercel.app/cadastro",
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
