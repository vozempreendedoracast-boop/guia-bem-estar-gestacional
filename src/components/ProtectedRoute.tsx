import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { SpinnerGap } from "@phosphor-icons/react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePlan?: boolean;
}

const ProtectedRoute = ({ children, requirePlan = false }: ProtectedRouteProps) => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <SpinnerGap className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has an active plan when required
  if (requirePlan && userProfile) {
    const hasActivePlan = userProfile.plan !== "none" && userProfile.plan_status === "active";
    if (!hasActivePlan) {
      return <Navigate to="/planos" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
