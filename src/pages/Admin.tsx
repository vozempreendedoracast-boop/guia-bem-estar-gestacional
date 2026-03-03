import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  SquaresFour, FileText, Users, Gear, BookOpen, WarningCircle,
  Heartbeat, Heart, Robot, ChartBar, Plus, PencilSimple, Trash, Eye, ArrowLeft,
  TrendUp, UserCheck, CalendarBlank, MagnifyingGlass, FloppyDisk, X, Stack, List,
  Bell, CreditCard, Link, Database, Monitor, SpinnerGap
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";

import cardJourney from "@/assets/card-journey.png";
import cardSymptoms from "@/assets/card-symptoms.png";
import cardExercises from "@/assets/card-exercises.png";
import cardHealth from "@/assets/card-health.png";
import cardDiary from "@/assets/card-diary.png";
import cardAssistant from "@/assets/card-assistant.png";

import {
  useCategories, useUpdateCategory, useCreateCategory, useDeleteCategory,
  useWeekContents, useUpdateWeekContent, useDeleteWeekContent,
  useSymptoms, useUpdateSymptom, useCreateSymptom, useDeleteSymptom,
  useExercises, useUpdateExercise, useCreateExercise, useDeleteExercise,
  useHealthTips, useUpdateHealthTip, useCreateHealthTip, useDeleteHealthTip,
  useWeeklyTips, useUpdateWeeklyTip, useCreateWeeklyTip, useDeleteWeeklyTip,
  type Category, type WeekContent, type SymptomRow, type ExerciseRow, type HealthTipRow, type WeeklyTipRow,
} from "@/hooks/useSupabaseData";
import { supabase } from "@/integrations/supabase/client";

const localImages: Record<string, string> = {
  journey: cardJourney, symptoms: cardSymptoms, exercises: cardExercises,
  health: cardHealth, diary: cardDiary, assistant: cardAssistant,
};

// Mock data (users/stats stay mock until auth is implemented)
const mockStats = {
  totalUsers: 2847, activeUsers: 1623, newToday: 34, avgWeek: 18,
};

const mockUsers = [
  { id: 1, name: "Camila Santos", email: "camila@email.com", week: 28, joined: "2026-01-15", active: true },
  { id: 2, name: "Juliana Martins", email: "juliana@email.com", week: 16, joined: "2026-02-01", active: true },
  { id: 3, name: "Ana Paula Reis", email: "ana@email.com", week: 34, joined: "2025-12-20", active: true },
  { id: 4, name: "Beatriz Lima", email: "beatriz@email.com", week: 12, joined: "2026-02-20", active: false },
  { id: 5, name: "Fernanda Costa", email: "fernanda@email.com", week: 22, joined: "2026-01-28", active: true },
];

interface SettingsState {
  appName: string;
  appDescription: string;
  pushEnabled: boolean;
  pushFrequency: string;
  planFreeEnabled: boolean;
  planPremiumPrice: string;
  analyticsEnabled: boolean;
  backupEnabled: boolean;
}

interface AISettingsState {
  id: string;
  provider: string;
  model: string;
  api_key_encrypted: string;
  system_prompt: string;
  temperature: number;
  max_tokens: number;
  enabled: boolean;
  base_url: string;
}

const sidebarItems = [
  { id: "overview", label: "Visão Geral", icon: SquaresFour },
  { id: "cards", label: "Cards", icon: Stack },
  { id: "content", label: "Conteúdos", icon: FileText },
  { id: "users", label: "Usuárias", icon: Users },
  { id: "settings", label: "Configurações", icon: Gear },
];

const CategorySelect = ({ value, onChange, categories }: { value: string | null; onChange: (v: string | null) => void; categories: Category[] }) => (
  <div>
    <Label className="text-sm font-medium">Card/Categoria vinculada</Label>
    <select
      value={value || ""}
      onChange={e => onChange(e.target.value || null)}
      className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
    >
      <option value="">— Nenhuma —</option>
      {categories.map(c => (
        <option key={c.id} value={c.id}>{c.title}</option>
      ))}
    </select>
  </div>
);

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Supabase data
  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  const updateCategory = useUpdateCategory();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const { data: weekContents = [], isLoading: loadingWeeks } = useWeekContents();
  const updateWeek = useUpdateWeekContent();
  const deleteWeekContent = useDeleteWeekContent();
  const { data: symptomsData = [], isLoading: loadingSymptoms } = useSymptoms();
  const updateSymptom = useUpdateSymptom();
  const createSymptom = useCreateSymptom();
  const deleteSymptomMut = useDeleteSymptom();
  const { data: exercisesData = [], isLoading: loadingExercises } = useExercises();
  const updateExercise = useUpdateExercise();
  const createExercise = useCreateExercise();
  const deleteExerciseMut = useDeleteExercise();
  const { data: healthTipsData = [], isLoading: loadingHealthTips } = useHealthTips();
  const updateHealthTip = useUpdateHealthTip();
  const createHealthTip = useCreateHealthTip();
  const deleteHealthTipMut = useDeleteHealthTip();
  const { data: tipsData = [], isLoading: loadingTips } = useWeeklyTips();
  const updateTip = useUpdateWeeklyTip();
  const createTip = useCreateWeeklyTip();
  const deleteTipMut = useDeleteWeeklyTip();

  // Editing states
  const [editingCard, setEditingCard] = useState<Category | null>(null);
  const [editCardOpen, setEditCardOpen] = useState(false);
  const [newCardOpen, setNewCardOpen] = useState(false);
  const [newCard, setNewCard] = useState({ title: "", slug: "", description: "", icon: "BookOpen", path: "/", visible: true, display_order: 0 });

  const [editingWeek, setEditingWeek] = useState<WeekContent | null>(null);
  const [editWeekOpen, setEditWeekOpen] = useState(false);
  const [viewWeekOpen, setViewWeekOpen] = useState(false);
  const [viewingWeek, setViewingWeek] = useState<WeekContent | null>(null);

  const [editingSymptom, setEditingSymptom] = useState<Partial<SymptomRow> | null>(null);
  const [editSymptomOpen, setEditSymptomOpen] = useState(false);

  const [editingExercise, setEditingExercise] = useState<Partial<ExerciseRow> & { stepsText?: string } | null>(null);
  const [editExerciseOpen, setEditExerciseOpen] = useState(false);

  const [editingHealthTip, setEditingHealthTip] = useState<Partial<HealthTipRow> & { tipsText?: string } | null>(null);
  const [editHealthTipOpen, setEditHealthTipOpen] = useState(false);

  const [editingTip, setEditingTip] = useState<Partial<WeeklyTipRow> | null>(null);
  const [editTipOpen, setEditTipOpen] = useState(false);

  // Settings state
  const [settings, setSettings] = useState<SettingsState>({
    appName: "Minha Gestação",
    appDescription: "Sua companheira durante toda a jornada da gravidez.",
    pushEnabled: true,
    pushFrequency: "diária",
    planFreeEnabled: true,
    planPremiumPrice: "29,90",
    analyticsEnabled: true,
    backupEnabled: false,
  });
  const [editSettingOpen, setEditSettingOpen] = useState(false);
  const [editSettingType, setEditSettingType] = useState("");

  // AI Settings
  const [aiSettings, setAiSettings] = useState<AISettingsState>({
    id: "", provider: "lovable", model: "google/gemini-3-flash-preview", api_key_encrypted: "",
    system_prompt: "Você é uma assistente carinhosa e acolhedora especializada em gestação.", 
    temperature: 0.7, max_tokens: 1024, enabled: false, base_url: "",
  });
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    supabase.from("ai_settings").select("*").limit(1).single().then(({ data }) => {
      if (data) setAiSettings(data as any);
    });
  }, []);

  const handleSaveAiSettings = async () => {
    setAiLoading(true);
    try {
      const { error } = await supabase.from("ai_settings").update({
        provider: aiSettings.provider,
        model: aiSettings.model,
        api_key_encrypted: aiSettings.api_key_encrypted,
        system_prompt: aiSettings.system_prompt,
        temperature: aiSettings.temperature,
        max_tokens: aiSettings.max_tokens,
        enabled: aiSettings.enabled,
        base_url: aiSettings.base_url,
      }).eq("id", aiSettings.id);
      if (error) throw error;
      toast.success("Configurações de IA salvas!");
      setEditSettingOpen(false);
    } catch { toast.error("Erro ao salvar configurações de IA"); }
    finally { setAiLoading(false); }
  };

  const filteredUsers = mockUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Card handlers
  const handleEditCard = (card: Category) => {
    setEditingCard({ ...card });
    setEditCardOpen(true);
  };
  const handleSaveCard = async () => {
    if (!editingCard) return;
    try {
      await updateCategory.mutateAsync(editingCard);
      toast.success("Card atualizado!");
      setEditCardOpen(false);
      setEditingCard(null);
    } catch { toast.error("Erro ao salvar card"); }
  };
  const handleToggleVisibility = async (card: Category) => {
    try {
      await updateCategory.mutateAsync({ id: card.id, visible: !card.visible });
      toast.success(card.visible ? "Card ocultado" : "Card visível");
    } catch { toast.error("Erro ao alterar visibilidade"); }
  };
  const handleCreateCard = async () => {
    try {
      await createCategory.mutateAsync(newCard);
      toast.success("Card criado!");
      setNewCardOpen(false);
      setNewCard({ title: "", slug: "", description: "", icon: "BookOpen", path: "/", visible: true, display_order: categories.length });
    } catch { toast.error("Erro ao criar card"); }
  };
  const handleDeleteCard = async (card: Category) => {
    try {
      await deleteCategory.mutateAsync(card.id);
      toast.success("Card excluído!");
    } catch { toast.error("Erro ao excluir card"); }
  };

  // Week handlers
  const handleSaveWeek = async () => {
    if (!editingWeek) return;
    try {
      await updateWeek.mutateAsync({
        id: editingWeek.id,
        baby_development: editingWeek.baby_development,
        mother_changes: editingWeek.mother_changes,
        common_symptoms: editingWeek.common_symptoms,
        tip: editingWeek.tip,
        reviewed: editingWeek.reviewed,
        status: editingWeek.status === "published" ? "published" : (editingWeek.baby_development ? "draft" : "empty"),
        active: editingWeek.active,
        category_id: editingWeek.category_id,
      });
      toast.success("Semana atualizada!");
      setEditWeekOpen(false);
      setEditingWeek(null);
    } catch { toast.error("Erro ao salvar semana"); }
  };
  const handleDeleteWeekContent = async (week: WeekContent) => {
    try {
      await deleteWeekContent.mutateAsync(week.id);
      toast.success("Conteúdo limpo!");
    } catch { toast.error("Erro ao limpar conteúdo"); }
  };

  // Symptom handlers
  const handleSaveSymptom = async () => {
    if (!editingSymptom) return;
    try {
      const payload = {
        name: editingSymptom.name,
        description: editingSymptom.description,
        alert_level: editingSymptom.alert_level,
        category_id: editingSymptom.category_id,
        trimester: editingSymptom.trimester || [1],
        when_common: editingSymptom.when_common,
        when_see_doctor: editingSymptom.when_see_doctor,
        what_to_do: editingSymptom.what_to_do,
      };
      if (editingSymptom.id) {
        await updateSymptom.mutateAsync({ id: editingSymptom.id, ...payload, active: editingSymptom.active });
      } else {
        await createSymptom.mutateAsync({ ...payload, name: payload.name || "" });
      }
      toast.success("Sintoma salvo!");
      setEditSymptomOpen(false);
      setEditingSymptom(null);
    } catch { toast.error("Erro ao salvar sintoma"); }
  };

  // Exercise handlers
  const handleSaveExercise = async () => {
    if (!editingExercise) return;
    try {
      const stepsArr = ((editingExercise as any).stepsText || "").split("\n").filter((s: string) => s.trim());
      const payload = {
        name: editingExercise.name,
        description: editingExercise.description,
        intensity: editingExercise.intensity,
        category_id: editingExercise.category_id,
        trimester: editingExercise.trimester || [1],
        contraindications: editingExercise.contraindications,
        steps: stepsArr,
      };
      if (editingExercise.id) {
        await updateExercise.mutateAsync({ id: editingExercise.id, ...payload, active: editingExercise.active });
      } else {
        await createExercise.mutateAsync({ ...payload, name: payload.name || "" });
      }
      toast.success("Exercício salvo!");
      setEditExerciseOpen(false);
      setEditingExercise(null);
    } catch { toast.error("Erro ao salvar exercício"); }
  };

  // Health Tip handlers
  const handleSaveHealthTip = async () => {
    if (!editingHealthTip) return;
    const tips = (editingHealthTip.tipsText || "").split("\n").filter(t => t.trim());
    try {
      if (editingHealthTip.id) {
        await updateHealthTip.mutateAsync({ id: editingHealthTip.id, section_title: editingHealthTip.section_title, icon: editingHealthTip.icon, tips, active: editingHealthTip.active, category_id: editingHealthTip.category_id });
      } else {
        await createHealthTip.mutateAsync({ section_title: editingHealthTip.section_title || "", icon: editingHealthTip.icon || "Heart", tips, category_id: editingHealthTip.category_id });
      }
      toast.success("Dica de saúde salva!");
      setEditHealthTipOpen(false);
      setEditingHealthTip(null);
    } catch { toast.error("Erro ao salvar dica de saúde"); }
  };

  // Tip handlers
  const handleSaveTip = async () => {
    if (!editingTip) return;
    try {
      if (editingTip.id) {
        await updateTip.mutateAsync({ id: editingTip.id, title: editingTip.title, content: editingTip.content, week_number: editingTip.week_number, active: editingTip.active, category_id: editingTip.category_id });
      } else {
        await createTip.mutateAsync({ title: editingTip.title || "", content: editingTip.content, week_number: editingTip.week_number || 1, category_id: editingTip.category_id });
      }
      toast.success("Dica salva!");
      setEditTipOpen(false);
      setEditingTip(null);
    } catch { toast.error("Erro ao salvar dica"); }
  };

  const openSetting = (type: string) => {
    setEditSettingType(type);
    setEditSettingOpen(true);
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 mb-8 px-2">
        <SquaresFour className="w-6 h-6 text-primary" />
        <span className="font-display font-bold text-lg text-foreground">Admin</span>
      </div>
      <nav className="space-y-1">
        {sidebarItems.map(item => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
              activeTab === item.id
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="mt-8">
        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={() => navigate("/painel")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao app
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-card border-r border-border min-h-screen p-4 hidden md:block">
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <List className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-4">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <span className="font-display font-bold text-foreground">Admin</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/painel")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-1 mt-2 overflow-x-auto pb-1 scrollbar-none">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                activeTab === item.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 mt-24 md:mt-0 overflow-auto">
        {/* ===== OVERVIEW ===== */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h1 className="text-2xl font-bold font-display text-foreground">Visão Geral</h1>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: "Total de Usuárias", value: mockStats.totalUsers.toLocaleString(), icon: Users, color: "text-primary" },
                { label: "Ativas Hoje", value: mockStats.activeUsers.toLocaleString(), icon: UserCheck, color: "text-green-600" },
                { label: "Novas Hoje", value: `+${mockStats.newToday}`, icon: TrendUp, color: "text-blue-600" },
                { label: "Semana Média", value: `${mockStats.avgWeek}ª`, icon: CalendarBlank, color: "text-orange-600" },
              ].map(stat => (
                <div key={stat.label} className="bg-card rounded-2xl p-4 md:p-5 border border-border shadow-card">
                  <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                  <p className="text-xl md:text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-card rounded-2xl p-5 border border-border shadow-card">
              <h3 className="font-semibold text-foreground mb-4">Distribuição por Trimestre</h3>
              <div className="flex items-end gap-3 h-40">
                {[
                  { label: "1°", value: 35, color: "bg-primary/60" },
                  { label: "2°", value: 45, color: "bg-primary/80" },
                  { label: "3°", value: 20, color: "bg-primary" },
                ].map(bar => (
                  <div key={bar.label} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${bar.value * 2.5}px` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={`w-full rounded-xl ${bar.color}`}
                    />
                    <span className="text-xs text-muted-foreground">{bar.label} Tri</span>
                    <span className="text-xs font-semibold text-foreground">{bar.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl p-5 border border-border shadow-card">
              <h3 className="font-semibold text-foreground mb-4">Resumo de Conteúdo</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { label: "Semanas", value: weekContents.length, sub: `${weekContents.filter(w => w.status === 'published').length} publicadas` },
                  { label: "Sintomas", value: symptomsData.length, sub: `${symptomsData.filter(s => s.active).length} ativos` },
                  { label: "Exercícios", value: exercisesData.length, sub: `${exercisesData.filter(e => e.active).length} ativos` },
                  { label: "Saúde", value: healthTipsData.length, sub: `${healthTipsData.filter(h => h.active).length} ativos` },
                  { label: "Dicas", value: tipsData.length, sub: `${tipsData.filter(t => t.active).length} ativas` },
                ].map(item => (
                  <div key={item.label} className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-foreground">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== CARDS ===== */}
        {activeTab === "cards" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold font-display text-foreground">Cards do Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">Gerencie os cards exibidos no dashboard das gestantes.</p>
              </div>
              <Button size="sm" className="rounded-xl" onClick={() => { setNewCard({ title: "", slug: "", description: "", icon: "BookOpen", path: "/", visible: true, display_order: categories.length }); setNewCardOpen(true); }}>
                <Plus className="w-4 h-4 mr-1" /> Novo Card
              </Button>
            </div>

            {loadingCategories ? (
              <div className="flex justify-center py-8"><SpinnerGap className="w-6 h-6 animate-spin text-primary" /></div>
            ) : (
              <div className="grid gap-4">
                {categories.sort((a, b) => a.display_order - b.display_order).map(card => (
                  <div key={card.id} className={`bg-card rounded-2xl border border-border shadow-card overflow-hidden transition-opacity ${!card.visible ? "opacity-50" : ""}`}>
                    <div className="flex flex-col sm:flex-row sm:items-stretch">
                      <div className="w-full sm:w-32 h-32 sm:h-28 flex-shrink-0 overflow-hidden">
                        <img src={localImages[card.slug] || cardJourney} alt={card.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 p-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground">{card.title}</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">{card.description}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">Rota: {card.path}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${card.visible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {card.visible ? "Visível" : "Oculto"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleEditCard(card)}>
                            <PencilSimple className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleToggleVisibility(card)}>
                            <Eye className={`w-4 h-4 ${!card.visible ? "text-muted-foreground" : ""}`} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive" onClick={() => handleDeleteCard(card)}>
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ===== CONTENT ===== */}
        {activeTab === "content" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold font-display text-foreground">Conteúdos</h1>
            </div>

            <Tabs defaultValue="weeks">
              <TabsList className="rounded-xl w-full sm:w-auto overflow-x-auto">
                <TabsTrigger value="weeks" className="rounded-lg text-xs sm:text-sm">Semanas</TabsTrigger>
                <TabsTrigger value="symptoms" className="rounded-lg text-xs sm:text-sm">Sintomas</TabsTrigger>
                <TabsTrigger value="exercises" className="rounded-lg text-xs sm:text-sm">Exercícios</TabsTrigger>
                <TabsTrigger value="health" className="rounded-lg text-xs sm:text-sm">Saúde</TabsTrigger>
                <TabsTrigger value="tips" className="rounded-lg text-xs sm:text-sm">Dicas</TabsTrigger>
              </TabsList>

              {/* Weeks tab */}
              <TabsContent value="weeks" className="mt-4">
                <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                  <div className="hidden sm:grid grid-cols-[60px_1fr_100px_80px_80px_120px] gap-2 p-4 border-b border-border text-xs font-medium text-muted-foreground">
                    <span>Semana</span><span>Status</span><span>Atualizado</span><span>Revisado</span><span>Ativo</span><span>Ações</span>
                  </div>
                  {loadingWeeks ? (
                    <div className="flex justify-center py-8"><SpinnerGap className="w-5 h-5 animate-spin text-primary" /></div>
                  ) : (
                    <div className="max-h-[60vh] overflow-y-auto">
                      {weekContents.map(w => (
                        <div key={w.id} className="p-4 border-b border-border last:border-0">
                          <div className="sm:hidden flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-sm text-foreground w-8">S{w.week_number}</span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                w.status === "published" ? "bg-green-100 text-green-700" :
                                w.status === "draft" ? "bg-yellow-100 text-yellow-700" :
                                "bg-muted text-muted-foreground"
                              }`}>
                                {w.status === "published" ? "Publicado" : w.status === "draft" ? "Rascunho" : "Vazio"}
                              </span>
                              {w.reviewed && <span className="text-xs text-green-600">✓</span>}
                              {!w.active && <span className="text-xs text-red-500">Inativo</span>}
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setViewingWeek(w); setViewWeekOpen(true); }}><Eye className="w-3.5 h-3.5" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingWeek({ ...w }); setEditWeekOpen(true); }}><PencilSimple className="w-3.5 h-3.5" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteWeekContent(w)}><Trash className="w-3.5 h-3.5" /></Button>
                            </div>
                          </div>
                          <div className="hidden sm:grid grid-cols-[60px_1fr_100px_80px_80px_120px] gap-2 items-center">
                            <span className="font-semibold text-sm text-foreground">{w.week_number}</span>
                            <span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                w.status === "published" ? "bg-green-100 text-green-700" :
                                w.status === "draft" ? "bg-yellow-100 text-yellow-700" :
                                "bg-muted text-muted-foreground"
                              }`}>
                                {w.status === "published" ? "Publicado" : w.status === "draft" ? "Rascunho" : "Vazio"}
                              </span>
                            </span>
                            <span className="text-xs text-muted-foreground">{w.updated_at ? new Date(w.updated_at).toLocaleDateString("pt-BR") : "—"}</span>
                            <span>{w.reviewed ? <span className="text-xs text-green-600">✓ Sim</span> : <span className="text-xs text-muted-foreground">Não</span>}</span>
                            <span>{w.active ? <span className="text-xs text-green-600">Sim</span> : <span className="text-xs text-red-500">Não</span>}</span>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setViewingWeek(w); setViewWeekOpen(true); }}><Eye className="w-3.5 h-3.5" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingWeek({ ...w }); setEditWeekOpen(true); }}><PencilSimple className="w-3.5 h-3.5" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteWeekContent(w)}><Trash className="w-3.5 h-3.5" /></Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Symptoms tab */}
              <TabsContent value="symptoms" className="mt-4">
                <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Sintomas cadastrados ({symptomsData.length})</span>
                    <Button size="sm" className="rounded-xl" onClick={() => { setEditingSymptom({ name: "", description: "", alert_level: "low", trimester: [1], active: true, category_id: null }); setEditSymptomOpen(true); }}>
                      <Plus className="w-4 h-4 mr-1" /> Novo
                    </Button>
                  </div>
                  {loadingSymptoms ? (
                    <div className="flex justify-center py-8"><SpinnerGap className="w-5 h-5 animate-spin text-primary" /></div>
                  ) : (
                    <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
                      {symptomsData.map(s => (
                        <div key={s.id} className={`p-4 flex items-center justify-between gap-3 ${!s.active ? "opacity-50" : ""}`}>
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-foreground">{s.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{s.description}</p>
                            <div className="flex gap-1 mt-1">
                              {s.trimester.map(t => (
                                <span key={t} className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">{t}° tri</span>
                              ))}
                              {!s.active && <span className="text-[10px] bg-red-100 px-1.5 py-0.5 rounded-full text-red-700">Inativo</span>}
                              {s.category_id && <span className="text-[10px] bg-primary/10 px-1.5 py-0.5 rounded-full text-primary">{categories.find(c => c.id === s.category_id)?.title || "Card"}</span>}
                            </div>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingSymptom({ ...s }); setEditSymptomOpen(true); }}><PencilSimple className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { deleteSymptomMut.mutate(s.id); toast.success("Sintoma excluído"); }}><Trash className="w-3.5 h-3.5" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Exercises tab */}
              <TabsContent value="exercises" className="mt-4">
                <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Exercícios cadastrados ({exercisesData.length})</span>
                    <Button size="sm" className="rounded-xl" onClick={() => { setEditingExercise({ name: "", description: "", intensity: "Leve", trimester: [1], active: true, category_id: null, contraindications: "", stepsText: "" }); setEditExerciseOpen(true); }}>
                      <Plus className="w-4 h-4 mr-1" /> Novo
                    </Button>
                  </div>
                  {loadingExercises ? (
                    <div className="flex justify-center py-8"><SpinnerGap className="w-5 h-5 animate-spin text-primary" /></div>
                  ) : (
                    <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
                      {exercisesData.map(ex => (
                        <div key={ex.id} className={`p-4 flex items-center justify-between gap-3 ${!ex.active ? "opacity-50" : ""}`}>
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-foreground">{ex.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{ex.description}</p>
                            <div className="flex gap-1 mt-1">
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${ex.intensity === "Leve" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{ex.intensity}</span>
                              {ex.trimester.map(t => (
                                <span key={t} className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">{t}° tri</span>
                              ))}
                              {!ex.active && <span className="text-[10px] bg-red-100 px-1.5 py-0.5 rounded-full text-red-700">Inativo</span>}
                              {ex.category_id && <span className="text-[10px] bg-primary/10 px-1.5 py-0.5 rounded-full text-primary">{categories.find(c => c.id === ex.category_id)?.title || "Card"}</span>}
                            </div>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingExercise({ ...ex, stepsText: (ex.steps || []).join("\n") }); setEditExerciseOpen(true); }}><PencilSimple className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { deleteExerciseMut.mutate(ex.id); toast.success("Exercício excluído"); }}><Trash className="w-3.5 h-3.5" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Health Tips tab */}
              <TabsContent value="health" className="mt-4">
                <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Saúde Integral ({healthTipsData.length})</span>
                    <Button size="sm" className="rounded-xl" onClick={() => { setEditingHealthTip({ section_title: "", icon: "Heart", tips: [], tipsText: "", active: true, category_id: null }); setEditHealthTipOpen(true); }}>
                      <Plus className="w-4 h-4 mr-1" /> Nova Seção
                    </Button>
                  </div>
                  {loadingHealthTips ? (
                    <div className="flex justify-center py-8"><SpinnerGap className="w-5 h-5 animate-spin text-primary" /></div>
                  ) : (
                    <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
                      {healthTipsData.map(ht => (
                        <div key={ht.id} className={`p-4 flex items-center justify-between gap-3 ${!ht.active ? "opacity-50" : ""}`}>
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-foreground">{ht.section_title}</p>
                            <p className="text-xs text-muted-foreground truncate">{ht.tips.length} dica(s)</p>
                            <div className="flex gap-1 mt-1">
                              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">Ícone: {ht.icon}</span>
                              {!ht.active && <span className="text-[10px] bg-red-100 px-1.5 py-0.5 rounded-full text-red-700">Inativo</span>}
                              {ht.category_id && <span className="text-[10px] bg-primary/10 px-1.5 py-0.5 rounded-full text-primary">{categories.find(c => c.id === ht.category_id)?.title || "Card"}</span>}
                            </div>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingHealthTip({ ...ht, tipsText: ht.tips.join("\n") }); setEditHealthTipOpen(true); }}><PencilSimple className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { deleteHealthTipMut.mutate(ht.id); toast.success("Seção excluída"); }}><Trash className="w-3.5 h-3.5" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Tips tab */}
              <TabsContent value="tips" className="mt-4">
                <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Dicas cadastradas ({tipsData.length})</span>
                    <Button size="sm" className="rounded-xl" onClick={() => { setEditingTip({ title: "", content: "", week_number: 1, active: true, category_id: null }); setEditTipOpen(true); }}>
                      <Plus className="w-4 h-4 mr-1" /> Nova
                    </Button>
                  </div>
                  {loadingTips ? (
                    <div className="flex justify-center py-8"><SpinnerGap className="w-5 h-5 animate-spin text-primary" /></div>
                  ) : (
                    <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
                      {tipsData.map(tip => (
                        <div key={tip.id} className={`p-4 flex items-center justify-between gap-3 ${!tip.active ? "opacity-50" : ""}`}>
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-foreground">{tip.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{tip.content}</p>
                            <div className="flex gap-1 mt-1">
                              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">Semana {tip.week_number}</span>
                              {!tip.active && <span className="text-[10px] bg-red-100 px-1.5 py-0.5 rounded-full text-red-700">Inativa</span>}
                              {tip.category_id && <span className="text-[10px] bg-primary/10 px-1.5 py-0.5 rounded-full text-primary">{categories.find(c => c.id === tip.category_id)?.title || "Card"}</span>}
                            </div>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingTip({ ...tip }); setEditTipOpen(true); }}><PencilSimple className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { deleteTipMut.mutate(tip.id); toast.success("Dica excluída"); }}><Trash className="w-3.5 h-3.5" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}

        {/* ===== USERS ===== */}
        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h1 className="text-2xl font-bold font-display text-foreground">Usuárias</h1>
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome ou email..." className="pl-10 rounded-xl" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              <div className="hidden md:grid grid-cols-[1fr_1fr_80px_100px_60px] gap-2 p-4 border-b border-border text-xs font-medium text-muted-foreground">
                <span>Nome</span><span>Email</span><span>Semana</span><span>Cadastro</span><span>Status</span>
              </div>
              {filteredUsers.map(user => (
                <div key={user.id} className="p-4 border-b border-border last:border-0">
                  <div className="md:hidden flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">Semana {user.week}ª · {user.joined}</p>
                    </div>
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${user.active ? "bg-green-500" : "bg-muted-foreground/40"}`} />
                  </div>
                  <div className="hidden md:grid grid-cols-[1fr_1fr_80px_100px_60px] gap-2 items-center">
                    <span className="font-medium text-sm text-foreground">{user.name}</span>
                    <span className="text-sm text-muted-foreground truncate">{user.email}</span>
                    <span className="text-sm text-foreground">{user.week}ª</span>
                    <span className="text-xs text-muted-foreground">{user.joined}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${user.active ? "bg-green-500" : "bg-muted-foreground/40"}`} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ===== SETTINGS ===== */}
        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h1 className="text-2xl font-bold font-display text-foreground">Configurações</h1>
            <div className="space-y-4">
              {[
                { type: "app", icon: Monitor, title: "Informações do App", description: `Nome: ${settings.appName}` },
                { type: "plans", icon: CreditCard, title: "Planos e Assinaturas", description: `Premium: R$ ${settings.planPremiumPrice}/mês` },
                { type: "push", icon: Bell, title: "Notificações Push", description: settings.pushEnabled ? `Ativadas · ${settings.pushFrequency}` : "Desativadas" },
                { type: "integrations", icon: Link, title: "Integrações e IA", description: aiSettings.enabled ? `IA: ${aiSettings.provider}/${aiSettings.model}` : "IA desativada" },
                { type: "backup", icon: Database, title: "Backup e Exportação", description: settings.backupEnabled ? "Backup automático ativado" : "Manual" },
              ].map(s => (
                <div key={s.type} className="bg-card rounded-2xl border border-border shadow-card p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                        <s.icon className="w-5 h-5 text-foreground/70" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">{s.title}</p>
                        <p className="text-xs text-muted-foreground">{s.description}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl" onClick={() => openSetting(s.type)}>
                      <PencilSimple className="w-3.5 h-3.5 mr-1" /> Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      {/* ===== DIALOGS ===== */}

      {/* Edit Card Dialog */}
      <Dialog open={editCardOpen} onOpenChange={setEditCardOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Card: {editingCard?.title}</DialogTitle>
            <DialogDescription>Modifique as informações do card.</DialogDescription>
          </DialogHeader>
          {editingCard && (
            <div className="space-y-4 mt-2">
              <div><Label className="text-sm font-medium">Título</Label><Input value={editingCard.title} onChange={e => setEditingCard({ ...editingCard, title: e.target.value })} className="mt-1 rounded-xl" /></div>
              <div><Label className="text-sm font-medium">Slug</Label><Input value={editingCard.slug} onChange={e => setEditingCard({ ...editingCard, slug: e.target.value })} className="mt-1 rounded-xl" /></div>
              <div><Label className="text-sm font-medium">Descrição</Label><Textarea value={editingCard.description} onChange={e => setEditingCard({ ...editingCard, description: e.target.value })} className="mt-1 rounded-xl" rows={2} /></div>
              <div><Label className="text-sm font-medium">Ícone (componente)</Label><Input value={editingCard.icon} onChange={e => setEditingCard({ ...editingCard, icon: e.target.value })} className="mt-1 rounded-xl" /></div>
              <div><Label className="text-sm font-medium">Rota (path)</Label><Input value={editingCard.path} onChange={e => setEditingCard({ ...editingCard, path: e.target.value })} className="mt-1 rounded-xl" /></div>
              <div><Label className="text-sm font-medium">URL da imagem</Label><Input value={editingCard.image_url} onChange={e => setEditingCard({ ...editingCard, image_url: e.target.value })} className="mt-1 rounded-xl" /></div>
              <div><Label className="text-sm font-medium">Ordem de exibição</Label><Input type="number" value={editingCard.display_order} onChange={e => setEditingCard({ ...editingCard, display_order: parseInt(e.target.value) || 0 })} className="mt-1 rounded-xl" /></div>
              <div className="flex items-center gap-3">
                <Switch checked={editingCard.visible} onCheckedChange={v => setEditingCard({ ...editingCard, visible: v })} />
                <Label className="text-sm">Visível no dashboard</Label>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 rounded-xl" onClick={handleSaveCard} disabled={updateCategory.isPending}>
                  {updateCategory.isPending ? <SpinnerGap className="w-4 h-4 mr-2 animate-spin" /> : <FloppyDisk className="w-4 h-4 mr-2" />} Salvar
                </Button>
                <Button variant="outline" className="rounded-xl" onClick={() => setEditCardOpen(false)}><X className="w-4 h-4 mr-2" /> Cancelar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Card Dialog */}
      <Dialog open={newCardOpen} onOpenChange={setNewCardOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Card</DialogTitle>
            <DialogDescription>Crie um novo card para o dashboard.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div><Label className="text-sm font-medium">Título</Label><Input value={newCard.title} onChange={e => setNewCard({ ...newCard, title: e.target.value })} className="mt-1 rounded-xl" placeholder="Ex: Nutrição" /></div>
            <div><Label className="text-sm font-medium">Slug (identificador único)</Label><Input value={newCard.slug} onChange={e => setNewCard({ ...newCard, slug: e.target.value })} className="mt-1 rounded-xl" placeholder="Ex: nutricao" /></div>
            <div><Label className="text-sm font-medium">Descrição</Label><Textarea value={newCard.description} onChange={e => setNewCard({ ...newCard, description: e.target.value })} className="mt-1 rounded-xl" rows={2} /></div>
            <div><Label className="text-sm font-medium">Ícone</Label><Input value={newCard.icon} onChange={e => setNewCard({ ...newCard, icon: e.target.value })} className="mt-1 rounded-xl" placeholder="BookOpen" /></div>
            <div><Label className="text-sm font-medium">Rota</Label><Input value={newCard.path} onChange={e => setNewCard({ ...newCard, path: e.target.value })} className="mt-1 rounded-xl" placeholder="/nutricao" /></div>
            <div><Label className="text-sm font-medium">Ordem</Label><Input type="number" value={newCard.display_order} onChange={e => setNewCard({ ...newCard, display_order: parseInt(e.target.value) || 0 })} className="mt-1 rounded-xl" /></div>
            <div className="flex items-center gap-3">
              <Switch checked={newCard.visible} onCheckedChange={v => setNewCard({ ...newCard, visible: v })} />
              <Label className="text-sm">Visível no dashboard</Label>
            </div>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1 rounded-xl" onClick={handleCreateCard} disabled={createCategory.isPending}>
                {createCategory.isPending ? <SpinnerGap className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />} Criar Card
              </Button>
              <Button variant="outline" className="rounded-xl" onClick={() => setNewCardOpen(false)}><X className="w-4 h-4 mr-2" /> Cancelar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Week Dialog */}
      <Dialog open={viewWeekOpen} onOpenChange={setViewWeekOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Semana {viewingWeek?.week_number} — Visualização</DialogTitle>
            <DialogDescription>Conteúdo atualmente salvo para esta semana.</DialogDescription>
          </DialogHeader>
          {viewingWeek && (
            <div className="space-y-4 mt-2">
              {[
                { label: "Desenvolvimento do bebê", value: viewingWeek.baby_development },
                { label: "Mudanças no corpo", value: viewingWeek.mother_changes },
                { label: "Sintomas comuns", value: viewingWeek.common_symptoms.join(", ") },
                { label: "Dica prática", value: viewingWeek.tip },
              ].map(item => (
                <div key={item.label} className="bg-muted/50 rounded-xl p-4">
                  <p className="font-semibold text-sm mb-1">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.value || "— Sem conteúdo —"}</p>
                </div>
              ))}
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>Status: {viewingWeek.status === "published" ? "Publicado" : viewingWeek.status === "draft" ? "Rascunho" : "Vazio"}</span>
                <span>·</span>
                <span>Revisado: {viewingWeek.reviewed ? "Sim" : "Não"}</span>
                <span>·</span>
                <span>Ativo: {viewingWeek.active ? "Sim" : "Não"}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Week Dialog */}
      <Dialog open={editWeekOpen} onOpenChange={setEditWeekOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Semana {editingWeek?.week_number}</DialogTitle>
            <DialogDescription>Edite o conteúdo exibido para esta semana.</DialogDescription>
          </DialogHeader>
          {editingWeek && (
            <div className="space-y-4 mt-2">
              <CategorySelect value={editingWeek.category_id} onChange={v => setEditingWeek({ ...editingWeek, category_id: v })} categories={categories} />
              <div>
                <Label className="text-sm font-medium">Desenvolvimento do bebê</Label>
                <Textarea value={editingWeek.baby_development} onChange={e => setEditingWeek({ ...editingWeek, baby_development: e.target.value })} className="mt-1 rounded-xl" rows={3} />
              </div>
              <div>
                <Label className="text-sm font-medium">Mudanças no corpo da mãe</Label>
                <Textarea value={editingWeek.mother_changes} onChange={e => setEditingWeek({ ...editingWeek, mother_changes: e.target.value })} className="mt-1 rounded-xl" rows={3} />
              </div>
              <div>
                <Label className="text-sm font-medium">Dica prática</Label>
                <Textarea value={editingWeek.tip} onChange={e => setEditingWeek({ ...editingWeek, tip: e.target.value })} className="mt-1 rounded-xl" rows={2} />
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={editingWeek.reviewed} onCheckedChange={v => setEditingWeek({ ...editingWeek, reviewed: v })} />
                <Label className="text-sm">Revisado</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={editingWeek.active} onCheckedChange={v => setEditingWeek({ ...editingWeek, active: v })} />
                <Label className="text-sm">Ativo</Label>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 rounded-xl" onClick={handleSaveWeek} disabled={updateWeek.isPending}>
                  {updateWeek.isPending ? <SpinnerGap className="w-4 h-4 mr-2 animate-spin" /> : <FloppyDisk className="w-4 h-4 mr-2" />} Salvar
                </Button>
                <Button variant="outline" className="rounded-xl" onClick={() => setEditWeekOpen(false)}><X className="w-4 h-4 mr-2" /> Cancelar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Symptom Dialog */}
      <Dialog open={editSymptomOpen} onOpenChange={setEditSymptomOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{!editingSymptom?.id ? "Novo Sintoma" : `Editar: ${editingSymptom?.name}`}</DialogTitle>
            <DialogDescription>Preencha as informações do sintoma.</DialogDescription>
          </DialogHeader>
          {editingSymptom && (
            <div className="space-y-4 mt-2">
              <CategorySelect value={editingSymptom.category_id || null} onChange={v => setEditingSymptom({ ...editingSymptom, category_id: v })} categories={categories} />
              <div>
                <Label className="text-sm font-medium">Nome</Label>
                <Input value={editingSymptom.name || ""} onChange={e => setEditingSymptom({ ...editingSymptom, name: e.target.value })} className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label className="text-sm font-medium">Descrição</Label>
                <Textarea value={editingSymptom.description || ""} onChange={e => setEditingSymptom({ ...editingSymptom, description: e.target.value })} className="mt-1 rounded-xl" rows={3} />
              </div>
              <div>
                <Label className="text-sm font-medium">Nível de alerta</Label>
                <select value={editingSymptom.alert_level || "low"} onChange={e => setEditingSymptom({ ...editingSymptom, alert_level: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm">
                  <option value="low">Baixo</option>
                  <option value="moderate">Moderado</option>
                  <option value="high">Alto</option>
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium">Trimestres</Label>
                <div className="flex gap-3 mt-1">
                  {[1, 2, 3].map(t => (
                    <label key={t} className="flex items-center gap-1.5 text-sm">
                      <input type="checkbox" checked={(editingSymptom.trimester || []).includes(t)} onChange={e => {
                        const current = editingSymptom.trimester || [];
                        setEditingSymptom({ ...editingSymptom, trimester: e.target.checked ? [...current, t] : current.filter(x => x !== t) });
                      }} className="rounded" />
                      {t}º
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Quando é comum</Label>
                <Textarea value={editingSymptom.when_common || ""} onChange={e => setEditingSymptom({ ...editingSymptom, when_common: e.target.value })} className="mt-1 rounded-xl" rows={2} />
              </div>
              <div>
                <Label className="text-sm font-medium">O que fazer</Label>
                <Textarea value={editingSymptom.what_to_do || ""} onChange={e => setEditingSymptom({ ...editingSymptom, what_to_do: e.target.value })} className="mt-1 rounded-xl" rows={2} />
              </div>
              <div>
                <Label className="text-sm font-medium">Quando procurar médico</Label>
                <Textarea value={editingSymptom.when_see_doctor || ""} onChange={e => setEditingSymptom({ ...editingSymptom, when_see_doctor: e.target.value })} className="mt-1 rounded-xl" rows={2} />
              </div>
              {editingSymptom.id && (
                <div className="flex items-center gap-3">
                  <Switch checked={editingSymptom.active ?? true} onCheckedChange={v => setEditingSymptom({ ...editingSymptom, active: v })} />
                  <Label className="text-sm">Ativo</Label>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 rounded-xl" onClick={handleSaveSymptom}><FloppyDisk className="w-4 h-4 mr-2" /> Salvar</Button>
                <Button variant="outline" className="rounded-xl" onClick={() => setEditSymptomOpen(false)}><X className="w-4 h-4 mr-2" /> Cancelar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Exercise Dialog */}
      <Dialog open={editExerciseOpen} onOpenChange={setEditExerciseOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{!editingExercise?.id ? "Novo Exercício" : `Editar: ${editingExercise?.name}`}</DialogTitle>
            <DialogDescription>Preencha as informações do exercício.</DialogDescription>
          </DialogHeader>
          {editingExercise && (
            <div className="space-y-4 mt-2">
              <CategorySelect value={editingExercise.category_id || null} onChange={v => setEditingExercise({ ...editingExercise, category_id: v })} categories={categories} />
              <div>
                <Label className="text-sm font-medium">Nome</Label>
                <Input value={editingExercise.name || ""} onChange={e => setEditingExercise({ ...editingExercise, name: e.target.value })} className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label className="text-sm font-medium">Descrição</Label>
                <Textarea value={editingExercise.description || ""} onChange={e => setEditingExercise({ ...editingExercise, description: e.target.value })} className="mt-1 rounded-xl" rows={3} />
              </div>
              <div>
                <Label className="text-sm font-medium">Intensidade</Label>
                <select value={editingExercise.intensity || "Leve"} onChange={e => setEditingExercise({ ...editingExercise, intensity: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm">
                  <option value="Leve">Leve</option>
                  <option value="Moderado">Moderado</option>
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium">Trimestres</Label>
                <div className="flex gap-3 mt-1">
                  {[1, 2, 3].map(t => (
                    <label key={t} className="flex items-center gap-1.5 text-sm">
                      <input type="checkbox" checked={(editingExercise.trimester || []).includes(t)} onChange={e => {
                        const current = editingExercise.trimester || [];
                        setEditingExercise({ ...editingExercise, trimester: e.target.checked ? [...current, t] : current.filter(x => x !== t) });
                      }} className="rounded" />
                      {t}º
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Passos (um por linha)</Label>
                <Textarea value={(editingExercise as any).stepsText || ""} onChange={e => setEditingExercise({ ...editingExercise, stepsText: e.target.value } as any)} className="mt-1 rounded-xl" rows={5} placeholder="Cada linha será um passo" />
              </div>
              <div>
                <Label className="text-sm font-medium">Contraindicações</Label>
                <Textarea value={editingExercise.contraindications || ""} onChange={e => setEditingExercise({ ...editingExercise, contraindications: e.target.value })} className="mt-1 rounded-xl" rows={2} />
              </div>
              {editingExercise.id && (
                <div className="flex items-center gap-3">
                  <Switch checked={editingExercise.active ?? true} onCheckedChange={v => setEditingExercise({ ...editingExercise, active: v })} />
                  <Label className="text-sm">Ativo</Label>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 rounded-xl" onClick={handleSaveExercise}><FloppyDisk className="w-4 h-4 mr-2" /> Salvar</Button>
                <Button variant="outline" className="rounded-xl" onClick={() => setEditExerciseOpen(false)}><X className="w-4 h-4 mr-2" /> Cancelar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Health Tip Dialog */}
      <Dialog open={editHealthTipOpen} onOpenChange={setEditHealthTipOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{!editingHealthTip?.id ? "Nova Seção de Saúde" : `Editar: ${editingHealthTip?.section_title}`}</DialogTitle>
            <DialogDescription>Preencha as informações da seção de saúde integral.</DialogDescription>
          </DialogHeader>
          {editingHealthTip && (
            <div className="space-y-4 mt-2">
              <CategorySelect value={editingHealthTip.category_id || null} onChange={v => setEditingHealthTip({ ...editingHealthTip, category_id: v })} categories={categories} />
              <div>
                <Label className="text-sm font-medium">Título da seção</Label>
                <Input value={editingHealthTip.section_title || ""} onChange={e => setEditingHealthTip({ ...editingHealthTip, section_title: e.target.value })} className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label className="text-sm font-medium">Ícone</Label>
                <select value={editingHealthTip.icon || "Heart"} onChange={e => setEditingHealthTip({ ...editingHealthTip, icon: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm">
                  <option value="Apple">Apple (Nutrição)</option>
                  <option value="Moon">Moon (Sono)</option>
                  <option value="Brain">Brain (Emocional)</option>
                  <option value="Heart">Heart (Coração)</option>
                  <option value="Baby">Baby (Bebê)</option>
                  <option value="Sparkles">Sparkles (Brilho)</option>
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium">Dicas (uma por linha)</Label>
                <Textarea value={editingHealthTip.tipsText || ""} onChange={e => setEditingHealthTip({ ...editingHealthTip, tipsText: e.target.value })} className="mt-1 rounded-xl" rows={6} placeholder="Cada linha será uma dica separada" />
              </div>
              {editingHealthTip.id && (
                <div className="flex items-center gap-3">
                  <Switch checked={editingHealthTip.active ?? true} onCheckedChange={v => setEditingHealthTip({ ...editingHealthTip, active: v })} />
                  <Label className="text-sm">Ativo</Label>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 rounded-xl" onClick={handleSaveHealthTip}><FloppyDisk className="w-4 h-4 mr-2" /> Salvar</Button>
                <Button variant="outline" className="rounded-xl" onClick={() => setEditHealthTipOpen(false)}><X className="w-4 h-4 mr-2" /> Cancelar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Tip Dialog */}
      <Dialog open={editTipOpen} onOpenChange={setEditTipOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{!editingTip?.id ? "Nova Dica" : `Editar: ${editingTip?.title}`}</DialogTitle>
            <DialogDescription>Preencha as informações da dica.</DialogDescription>
          </DialogHeader>
          {editingTip && (
            <div className="space-y-4 mt-2">
              <CategorySelect value={editingTip.category_id || null} onChange={v => setEditingTip({ ...editingTip, category_id: v })} categories={categories} />
              <div>
                <Label className="text-sm font-medium">Título</Label>
                <Input value={editingTip.title || ""} onChange={e => setEditingTip({ ...editingTip, title: e.target.value })} className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label className="text-sm font-medium">Semana</Label>
                <Input type="number" value={editingTip.week_number || 1} onChange={e => setEditingTip({ ...editingTip, week_number: parseInt(e.target.value) || 1 })} className="mt-1 rounded-xl" min={1} max={40} />
              </div>
              <div>
                <Label className="text-sm font-medium">Conteúdo</Label>
                <Textarea value={editingTip.content || ""} onChange={e => setEditingTip({ ...editingTip, content: e.target.value })} className="mt-1 rounded-xl" rows={4} />
              </div>
              {editingTip.id && (
                <div className="flex items-center gap-3">
                  <Switch checked={editingTip.active ?? true} onCheckedChange={v => setEditingTip({ ...editingTip, active: v })} />
                  <Label className="text-sm">Ativa</Label>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 rounded-xl" onClick={handleSaveTip}><FloppyDisk className="w-4 h-4 mr-2" /> Salvar</Button>
                <Button variant="outline" className="rounded-xl" onClick={() => setEditTipOpen(false)}><X className="w-4 h-4 mr-2" /> Cancelar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={editSettingOpen} onOpenChange={setEditSettingOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editSettingType === "app" && "Informações do App"}
              {editSettingType === "plans" && "Planos e Assinaturas"}
              {editSettingType === "push" && "Notificações Push"}
              {editSettingType === "integrations" && "Integrações e Assistente IA"}
              {editSettingType === "backup" && "Backup e Exportação"}
            </DialogTitle>
            <DialogDescription>Gerencie esta configuração.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {editSettingType === "app" && (
              <>
                <div><Label className="text-sm font-medium">Nome do app</Label><Input value={settings.appName} onChange={e => setSettings({ ...settings, appName: e.target.value })} className="mt-1 rounded-xl" /></div>
                <div><Label className="text-sm font-medium">Descrição</Label><Textarea value={settings.appDescription} onChange={e => setSettings({ ...settings, appDescription: e.target.value })} className="mt-1 rounded-xl" rows={3} /></div>
              </>
            )}
            {editSettingType === "plans" && (
              <>
                <div className="flex items-center justify-between"><Label className="text-sm font-medium">Plano gratuito ativo</Label><Switch checked={settings.planFreeEnabled} onCheckedChange={v => setSettings({ ...settings, planFreeEnabled: v })} /></div>
                <div><Label className="text-sm font-medium">Preço do Premium (R$/mês)</Label><Input value={settings.planPremiumPrice} onChange={e => setSettings({ ...settings, planPremiumPrice: e.target.value })} className="mt-1 rounded-xl" /></div>
              </>
            )}
            {editSettingType === "push" && (
              <>
                <div className="flex items-center justify-between"><Label className="text-sm font-medium">Notificações ativas</Label><Switch checked={settings.pushEnabled} onCheckedChange={v => setSettings({ ...settings, pushEnabled: v })} /></div>
                <div><Label className="text-sm font-medium">Frequência</Label><select value={settings.pushFrequency} onChange={e => setSettings({ ...settings, pushFrequency: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"><option value="diária">Diária</option><option value="semanal">Semanal</option><option value="quinzenal">Quinzenal</option></select></div>
              </>
            )}
            {editSettingType === "integrations" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Assistente IA ativada</Label>
                  <Switch checked={aiSettings.enabled} onCheckedChange={v => setAiSettings({ ...aiSettings, enabled: v })} />
                </div>

                <div className="bg-muted/50 rounded-xl p-4 space-y-1">
                  <p className="text-xs font-semibold text-foreground">💡 Como funciona?</p>
                  <p className="text-xs text-muted-foreground">
                    A IA usa <strong>OpenRouter</strong> como provedor principal. Se falhar (créditos esgotados, erro etc.), 
                    o <strong>Lovable IA</strong> entra automaticamente como fallback.
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">API Key (OpenRouter)</Label>
                  <Input type="password" value={aiSettings.api_key_encrypted} onChange={e => setAiSettings({ ...aiSettings, api_key_encrypted: e.target.value })} className="mt-1 rounded-xl" placeholder="Cole sua chave OpenRouter aqui" />
                  <p className="text-[10px] text-muted-foreground mt-1">Obtenha em: openrouter.ai/keys</p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Modelo (OpenRouter)</Label>
                  <select value={aiSettings.model} onChange={e => setAiSettings({ ...aiSettings, model: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm">
                    <option value="google/gemini-2.5-flash-lite">Gemini 2.5 Flash Lite (mais barato)</option>
                    <option value="google/gemini-2.5-flash">Gemini 2.5 Flash (equilibrado)</option>
                    <option value="google/gemini-2.5-pro">Gemini 2.5 Pro (mais inteligente)</option>
                    <option value="google/gemini-3-flash-preview">Gemini 3 Flash Preview</option>
                    <option value="meta-llama/llama-4-scout">Llama 4 Scout</option>
                    <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                  </select>
                  <p className="text-[10px] text-muted-foreground mt-1">O modelo do fallback (Lovable IA) é selecionado automaticamente.</p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Instruções do sistema (personalidade da IA)</Label>
                  <Textarea value={aiSettings.system_prompt} onChange={e => setAiSettings({ ...aiSettings, system_prompt: e.target.value })} className="mt-1 rounded-xl" rows={5} placeholder="Ex: Você é uma assistente carinhosa especializada em gestação..." />
                </div>
                <div>
                  <Label className="text-sm font-medium">Temperatura ({aiSettings.temperature}) — mais baixo = mais preciso, mais alto = mais criativo</Label>
                  <input type="range" min="0" max="1" step="0.1" value={aiSettings.temperature} onChange={e => setAiSettings({ ...aiSettings, temperature: parseFloat(e.target.value) })} className="mt-1 w-full" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Máximo de tokens (tamanho da resposta)</Label>
                  <Input type="number" value={aiSettings.max_tokens} onChange={e => setAiSettings({ ...aiSettings, max_tokens: parseInt(e.target.value) || 1024 })} className="mt-1 rounded-xl" />
                </div>
              </div>
            )}
            {editSettingType === "backup" && (
              <>
                <div className="flex items-center justify-between"><Label className="text-sm font-medium">Backup automático</Label><Switch checked={settings.backupEnabled} onCheckedChange={v => setSettings({ ...settings, backupEnabled: v })} /></div>
                <div className="bg-muted/50 rounded-xl p-4"><p className="text-xs text-muted-foreground">Os dados já estão sendo salvos no Supabase. Exportação avançada virá em breve.</p></div>
              </>
            )}
            <div className="flex gap-2 pt-2">
              <Button className="flex-1 rounded-xl" onClick={() => editSettingType === "integrations" ? handleSaveAiSettings() : setEditSettingOpen(false)} disabled={aiLoading}>
                {aiLoading ? <SpinnerGap className="w-4 h-4 mr-2 animate-spin" /> : <FloppyDisk className="w-4 h-4 mr-2" />} Salvar
              </Button>
              <Button variant="outline" className="rounded-xl" onClick={() => setEditSettingOpen(false)}><X className="w-4 h-4 mr-2" /> Cancelar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;