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
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/journey/:week" element={<WeekDetail />} />
            <Route path="/symptoms" element={<Symptoms />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/health" element={<Health />} />
            <Route path="/diary" element={<Diary />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PregnancyProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
