import { useAuth } from "@/contexts/AuthContext";

export function usePlan() {
  const { userProfile, loading } = useAuth();

  const plan = userProfile?.plan || "none";
  const planStatus = userProfile?.plan_status || "none";
  const isActive = planStatus === "active";
  const isPremium = isActive && plan === "premium";
  const isEssential = isActive && plan === "essential";
  const hasAccess = isActive && (plan === "essential" || plan === "premium");
  const hasAIAccess = isPremium;

  return {
    plan,
    planStatus,
    isActive,
    isPremium,
    isEssential,
    hasAccess,
    hasAIAccess,
    loading,
  };
}
