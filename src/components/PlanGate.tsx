import { useCategories } from "@/hooks/useSupabaseData";
import { usePlan } from "@/hooks/usePlan";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

const planHierarchy: Record<string, number> = { none: 0, essential: 1, premium: 2 };

interface PlanGateProps {
  children: React.ReactNode;
}

const PlanGate = ({ children }: PlanGateProps) => {
  const { plan } = usePlan();
  const { data: categories = [] } = useCategories();
  const location = useLocation();
  const toastShown = useRef(false);

  const category = categories.find(c => c.path === location.pathname);
  const requiredPlan = category?.required_plan || "none";
  const userLevel = planHierarchy[plan] ?? 0;
  const requiredLevel = planHierarchy[requiredPlan] ?? 0;
  const blocked = requiredLevel > userLevel;

  useEffect(() => {
    if (blocked && !toastShown.current) {
      toastShown.current = true;
      const planName = requiredPlan === "premium" ? "Premium" : "Essencial";
      toast(`Este recurso requer o plano ${planName} 🔒`);
    }
  }, [blocked, requiredPlan]);

  if (blocked) {
    return <Navigate to="/painel" replace />;
  }

  return <>{children}</>;
};

export default PlanGate;
