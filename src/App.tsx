import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PregnancyProvider } from "@/contexts/PregnancyContext";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Journey from "./pages/Journey";
import WeekDetail from "./pages/WeekDetail";
import Symptoms from "./pages/Symptoms";
import Exercises from "./pages/Exercises";
import Health from "./pages/Health";
import Diary from "./pages/Diary";
import Assistant from "./pages/Assistant";
import Sales from "./pages/Sales";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PregnancyProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cadastro" element={<Onboarding />} />
            <Route path="/painel" element={<Dashboard />} />
            <Route path="/jornada" element={<Journey />} />
            <Route path="/jornada/:week" element={<WeekDetail />} />
            <Route path="/sintomas" element={<Symptoms />} />
            <Route path="/exercicios" element={<Exercises />} />
            <Route path="/saude" element={<Health />} />
            <Route path="/diario" element={<Diary />} />
            <Route path="/assistente" element={<Assistant />} />
            <Route path="/vendas" element={<Sales />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/administracao" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PregnancyProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
