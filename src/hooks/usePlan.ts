import { useAuth } from "@/contexts/AuthContext";

export function usePlan() {
  const { userProfile, loading } = useAuth();

  const plan = userProfile?.plan || "none";
  const planStatus = userProfile?.plan_status || "none";
  const isActive = planStatus === "active";
  const isExpired = planStatus === "expired";
  const isInactive = planStatus === "none" || (!isActive && !isExpired);
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
