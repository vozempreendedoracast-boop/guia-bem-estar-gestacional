import { useAuth } from "@/contexts/AuthContext";

export function usePlan() {
  const { userProfile, loading } = useAuth();

  const plan = userProfile?.plan || "none";
  const planStatus = userProfile?.plan_status || "active";
  const isActive = planStatus === "active" || planStatus === "none";
  const isExpired = planStatus === "expired";
  const isInactive = false;
  const isPremium = isActive && plan === "premium";
  const isEssential = isActive && plan === "essential";
  const hasAccess = isActive && (plan === "essential" || plan === "premium");
  const hasAIAccess = isPremium;

  return {
    plan,
    planStatus,
    isActive,
    isExpired,
    isInactive,
    isPremium,
    isEssential,
    hasAccess,
    hasAIAccess,
    loading,
  };
}
