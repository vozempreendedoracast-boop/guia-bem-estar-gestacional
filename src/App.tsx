import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PregnancyProvider } from "@/contexts/PregnancyContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
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
import NotFound from "./pages/NotFound";
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
              <Route path="/painel" element={<ProtectedRoute requirePlan><Dashboard /></ProtectedRoute>} />
              <Route path="/jornada" element={<ProtectedRoute requirePlan><Journey /></ProtectedRoute>} />
              <Route path="/jornada/:week" element={<ProtectedRoute requirePlan><WeekDetail /></ProtectedRoute>} />
              <Route path="/sintomas" element={<ProtectedRoute requirePlan><Symptoms /></ProtectedRoute>} />
              <Route path="/exercicios" element={<ProtectedRoute requirePlan><Exercises /></ProtectedRoute>} />
              <Route path="/saude" element={<ProtectedRoute requirePlan><Health /></ProtectedRoute>} />
              <Route path="/diario" element={<ProtectedRoute requirePlan><Diary /></ProtectedRoute>} />
              <Route path="/notificacoes" element={<ProtectedRoute requirePlan><Notifications /></ProtectedRoute>} />
              <Route path="/assistente" element={<ProtectedRoute requirePlan><Assistant /></ProtectedRoute>} />
              <Route path="/suporte" element={<ProtectedRoute><Support /></ProtectedRoute>} />
              <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/administracao" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PregnancyProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
