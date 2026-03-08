import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PregnancyProvider } from "@/contexts/PregnancyContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PlanGate from "@/components/PlanGate";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Journey from "./pages/Journey";
import WeekDetail from "./pages/WeekDetail";
import Symptoms from "./pages/Symptoms";
import Exercises from "./pages/Exercises";
import Health from "./pages/Health";
import Diary from "./pages/Diary";
import Notifications from "./pages/Notifications";
import Assistant from "./pages/Assistant";
import Sales from "./pages/Sales";
import Plans from "./pages/Plans";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import DynamicPage from "./pages/DynamicPage";
import ScrollToTop from "./components/ScrollToTop";
import PwaInstallPrompt from "./components/PwaInstallPrompt";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <PregnancyProvider>
            <ScrollToTop />
            <PwaInstallPrompt />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/vendas" element={<Sales />} />
              <Route path="/planos" element={<Plans />} /> {/* redirects to /vendas */}
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected routes */}
              <Route path="/cadastro" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              <Route path="/painel" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/jornada" element={<ProtectedRoute requirePlan><PlanGate><Journey /></PlanGate></ProtectedRoute>} />
              <Route path="/jornada/:week" element={<ProtectedRoute requirePlan><PlanGate><WeekDetail /></PlanGate></ProtectedRoute>} />
              <Route path="/sintomas" element={<ProtectedRoute requirePlan><PlanGate><Symptoms /></PlanGate></ProtectedRoute>} />
              <Route path="/exercicios" element={<ProtectedRoute requirePlan><PlanGate><Exercises /></PlanGate></ProtectedRoute>} />
              <Route path="/saude" element={<ProtectedRoute requirePlan><PlanGate><Health /></PlanGate></ProtectedRoute>} />
              <Route path="/diario" element={<ProtectedRoute requirePlan><PlanGate><Diary /></PlanGate></ProtectedRoute>} />
              <Route path="/notificacoes" element={<ProtectedRoute requirePlan><PlanGate><Notifications /></PlanGate></ProtectedRoute>} />
              <Route path="/assistente" element={<ProtectedRoute requirePlan><PlanGate><Assistant /></PlanGate></ProtectedRoute>} />
              <Route path="/suporte" element={<ProtectedRoute><Support /></ProtectedRoute>} />
              <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/administracao" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
              {/* Dynamic pages created by admin */}
              <Route path="*" element={<ProtectedRoute requirePlan><PlanGate><DynamicPage /></PlanGate></ProtectedRoute>} />
            </Routes>
          </PregnancyProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
