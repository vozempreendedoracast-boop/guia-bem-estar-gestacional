import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { SpinnerGap } from "@phosphor-icons/react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePlan?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requirePlan = false, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, userProfile, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <SpinnerGap className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  // Not authenticated → login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin route but not admin → dashboard
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/painel" replace />;
  }

  // Requires plan but no active plan (or missing profile) → plans page
  // Admins bypass plan requirement
  if (requirePlan && !isAdmin) {
    const hasActivePlan = userProfile?.plan !== "none" && userProfile?.plan_status === "active";
    if (!hasActivePlan) {
      return <Navigate to="/planos" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
