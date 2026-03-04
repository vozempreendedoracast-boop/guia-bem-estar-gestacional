import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  SquaresFour, FileText, Users, Gear, BookOpen, WarningCircle,
  Heartbeat, Heart, Robot, ChartBar, Plus, PencilSimple, Trash, Eye, ArrowLeft,
  TrendUp, UserCheck, MagnifyingGlass, FloppyDisk, X, Stack, List,
  Bell, CreditCard, Link, Database, Monitor, SpinnerGap, Lock, Crown,
  ShieldCheck, Calendar, CaretRight, Password, UserCircle, Export
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
import { Badge } from "@/components/ui/badge";

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

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  plan: "none" | "essential" | "premium";
  plan_status: "none" | "active" | "expired";
  kiwify_order_id: string | null;
  purchased_at: string | null;
  expires_at: string | null;
  created_at: string;
}

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  newToday: number;
  essentialCount: number;
  premiumCount: number;
}

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

const ADMIN_BASE_URL = "https://hmtrjnosuwtmulerhgnr.supabase.co";

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

  // User management
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, activeUsers: 0, newToday: 0, essentialCount: 0, premiumCount: 0 });
  const [usersLoading, setUsersLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<Partial<UserProfile> | null>(null);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [newUserOpen, setNewUserOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({ email: "", plan: "none" as string, plan_status: "none" as string });
  const [userActionLoading, setUserActionLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const [usersRes, statsRes] = await Promise.all([
        fetch(`${ADMIN_BASE_URL}/functions/v1/admin-users?action=list`, {
          headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
        }),
        fetch(`${ADMIN_BASE_URL}/functions/v1/admin-users?action=stats`, {
          headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
        }),
      ]);
      if (usersRes.ok) setUsers(await usersRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (e) {
      console.error("Failed to fetch users:", e);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreateUser = async () => {
    setUserActionLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      const res = await fetch(`${ADMIN_BASE_URL}/functions/v1/admin-users?action=create`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
        body: JSON.stringify(newUserData),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      toast.success("Usuária criada com sucesso!");
      setNewUserOpen(false);
      setNewUserData({ email: "", plan: "none", plan_status: "none" });
      fetchUsers();
    } catch (e: any) { toast.error(e.message || "Erro ao criar usuária"); }
    finally { setUserActionLoading(false); }
  };

  const handleUpdateUser = async () => {
    if (!editingUser?.id) return;
    setUserActionLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      const res = await fetch(`${ADMIN_BASE_URL}/functions/v1/admin-users?action=update`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingUser.id, plan: editingUser.plan, plan_status: editingUser.plan_status }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      toast.success("Plano atualizado!");
      setEditUserOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (e: any) { toast.error(e.message || "Erro ao atualizar"); }
    finally { setUserActionLoading(false); }
  };

  const handleSetPassword = async () => {
    if (!editingUser?.user_id || !newPassword.trim()) return;
    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setPasswordLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      const res = await fetch(`${ADMIN_BASE_URL}/functions/v1/admin-users?action=set-password`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: editingUser.user_id, password: newPassword }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      toast.success("Senha alterada com sucesso!");
      setNewPassword("");
    } catch (e: any) { toast.error(e.message || "Erro ao alterar senha"); }
    finally { setPasswordLoading(false); }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta usuária? Esta ação é irreversível.")) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      const res = await fetch(`${ADMIN_BASE_URL}/functions/v1/admin-users?action=delete`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      toast.success("Usuária excluída!");
      fetchUsers();
    } catch (e: any) { toast.error(e.message || "Erro ao excluir"); }
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // Card handlers
  const handleEditCard = (card: Category) => { setEditingCard({ ...card }); setEditCardOpen(true); };
  const handleSaveCard = async () => {
    if (!editingCard) return;
    try { await updateCategory.mutateAsync(editingCard); toast.success("Card atualizado!"); setEditCardOpen(false); setEditingCard(null); }
    catch { toast.error("Erro ao salvar card"); }
  };
  const handleToggleVisibility = async (card: Category) => {
    try { await updateCategory.mutateAsync({ id: card.id, visible: !card.visible }); toast.success(card.visible ? "Card ocultado" : "Card visível"); }
    catch { toast.error("Erro ao alterar visibilidade"); }
  };
  const handleCreateCard = async () => {
    try { await createCategory.mutateAsync(newCard); toast.success("Card criado!"); setNewCardOpen(false); setNewCard({ title: "", slug: "", description: "", icon: "BookOpen", path: "/", visible: true, display_order: categories.length }); }
    catch { toast.error("Erro ao criar card"); }
  };
  const handleDeleteCard = async (card: Category) => {
    try { await deleteCategory.mutateAsync(card.id); toast.success("Card excluído!"); }
    catch { toast.error("Erro ao excluir card"); }
  };

  // Week handlers
  const handleSaveWeek = async () => {
    if (!editingWeek) return;
    try {
      await updateWeek.mutateAsync({
        id: editingWeek.id, baby_development: editingWeek.baby_development, mother_changes: editingWeek.mother_changes,
        common_symptoms: editingWeek.common_symptoms, tip: editingWeek.tip, reviewed: editingWeek.reviewed,
        status: editingWeek.status === "published" ? "published" : (editingWeek.baby_development ? "draft" : "empty"),
        active: editingWeek.active, category_id: editingWeek.category_id,
      });
      toast.success("Semana atualizada!"); setEditWeekOpen(false); setEditingWeek(null);
    } catch { toast.error("Erro ao salvar semana"); }
  };
  const handleDeleteWeekContent = async (week: WeekContent) => {
    try { await deleteWeekContent.mutateAsync(week.id); toast.success("Conteúdo limpo!"); }
    catch { toast.error("Erro ao limpar conteúdo"); }
  };

  // Symptom handlers
  const handleSaveSymptom = async () => {
    if (!editingSymptom) return;
    try {
      const payload = { name: editingSymptom.name, description: editingSymptom.description, alert_level: editingSymptom.alert_level, category_id: editingSymptom.category_id, trimester: editingSymptom.trimester || [1], when_common: editingSymptom.when_common, when_see_doctor: editingSymptom.when_see_doctor, what_to_do: editingSymptom.what_to_do };
      if (editingSymptom.id) { await updateSymptom.mutateAsync({ id: editingSymptom.id, ...payload, active: editingSymptom.active }); }
      else { await createSymptom.mutateAsync({ ...payload, name: payload.name || "" }); }
      toast.success("Sintoma salvo!"); setEditSymptomOpen(false); setEditingSymptom(null);
    } catch { toast.error("Erro ao salvar sintoma"); }
  };

  // Exercise handlers
  const handleSaveExercise = async () => {
    if (!editingExercise) return;
    try {
      const stepsArr = ((editingExercise as any).stepsText || "").split("\n").filter((s: string) => s.trim());
      const payload = { name: editingExercise.name, description: editingExercise.description, intensity: editingExercise.intensity, category_id: editingExercise.category_id, trimester: editingExercise.trimester || [1], contraindications: editingExercise.contraindications, steps: stepsArr };
      if (editingExercise.id) { await updateExercise.mutateAsync({ id: editingExercise.id, ...payload, active: editingExercise.active }); }
      else { await createExercise.mutateAsync({ ...payload, name: payload.name || "" }); }
      toast.success("Exercício salvo!"); setEditExerciseOpen(false); setEditingExercise(null);
    } catch { toast.error("Erro ao salvar exercício"); }
  };

  // Health Tip handlers
  const handleSaveHealthTip = async () => {
    if (!editingHealthTip) return;
    const tips = (editingHealthTip.tipsText || "").split("\n").filter(t => t.trim());
    try {
      if (editingHealthTip.id) { await updateHealthTip.mutateAsync({ id: editingHealthTip.id, section_title: editingHealthTip.section_title, icon: editingHealthTip.icon, tips, active: editingHealthTip.active, category_id: editingHealthTip.category_id }); }
      else { await createHealthTip.mutateAsync({ section_title: editingHealthTip.section_title || "", icon: editingHealthTip.icon || "Heart", tips, category_id: editingHealthTip.category_id }); }
      toast.success("Dica de saúde salva!"); setEditHealthTipOpen(false); setEditingHealthTip(null);
    } catch { toast.error("Erro ao salvar dica de saúde"); }
  };

  // Tip handlers
  const handleSaveTip = async () => {
    if (!editingTip) return;
    try {
      if (editingTip.id) { await updateTip.mutateAsync({ id: editingTip.id, title: editingTip.title, content: editingTip.content, week_number: editingTip.week_number, active: editingTip.active, category_id: editingTip.category_id }); }
      else { await createTip.mutateAsync({ title: editingTip.title || "", content: editingTip.content, week_number: editingTip.week_number || 1, category_id: editingTip.category_id }); }
      toast.success("Dica salva!"); setEditTipOpen(false); setEditingTip(null);
    } catch { toast.error("Erro ao salvar dica"); }
  };

  const openSetting = (type: string) => { setEditSettingType(type); setEditSettingOpen(true); };

  /* ─────────── Helpers ─────────── */
  const planBadge = (plan: string) => {
    if (plan === "premium") return <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-sm"><Crown className="w-3 h-3 mr-1" /> Premium</Badge>;
    if (plan === "essential") return <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-0">Essencial</Badge>;
    return <Badge variant="outline" className="text-muted-foreground border-muted">Sem plano</Badge>;
  };

  const statusBadge = (status: string) => {
    if (status === "active") return <Badge className="bg-emerald-100 text-emerald-700 border-0"><ShieldCheck className="w-3 h-3 mr-1" /> Ativo</Badge>;
    if (status === "expired") return <Badge className="bg-red-100 text-red-700 border-0">Expirado</Badge>;
    return <Badge variant="outline" className="text-muted-foreground border-muted">Inativo</Badge>;
  };

  const StatCard = ({ icon: Icon, label, value, trend, color }: { icon: any; label: string; value: string; trend?: string; color: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-card rounded-2xl p-5 border border-border shadow-card group hover:shadow-elevated transition-shadow duration-300"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 ${color}`} />
      <div className="relative z-10">
        <div className={`w-10 h-10 rounded-xl ${color} bg-opacity-10 flex items-center justify-center mb-3`}>
          <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} weight="duotone" />
        </div>
        <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        {trend && <p className="text-[10px] text-emerald-600 font-medium mt-1">{trend}</p>}
      </div>
    </motion.div>
  );

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-3 mb-8 px-3">
        <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center shadow-sm">
          <ShieldCheck className="w-5 h-5 text-primary-foreground" weight="bold" />
        </div>
        <div>
          <span className="font-display font-bold text-base text-foreground block leading-tight">MamyBoo</span>
          <span className="text-[10px] text-muted-foreground">Painel Admin</span>
        </div>
      </div>
      <nav className="space-y-0.5">
        {sidebarItems.map(item => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
              activeTab === item.id
                ? "bg-primary text-primary-foreground font-medium shadow-soft"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="w-[18px] h-[18px]" weight={activeTab === item.id ? "fill" : "regular"} />
            {item.label}
            {activeTab === item.id && <CaretRight className="w-3.5 h-3.5 ml-auto" />}
          </button>
        ))}
      </nav>
      <div className="mt-auto pt-6">
        <div className="bg-muted/50 rounded-xl p-3 mb-3">
          <p className="text-[10px] font-semibold text-foreground mb-1">💡 Dica rápida</p>
          <p className="text-[10px] text-muted-foreground leading-relaxed">Use a aba de Conteúdos para gerenciar todas as informações do app.</p>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={() => navigate("/painel")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao app
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="w-[260px] bg-card/80 backdrop-blur-sm border-r border-border min-h-screen p-4 hidden md:flex flex-col sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                  <List className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[260px] p-4 flex flex-col">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <div>
              <span className="font-display font-bold text-foreground text-sm">Admin</span>
              <span className="text-[10px] text-muted-foreground ml-2">{sidebarItems.find(s => s.id === activeTab)?.label}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" onClick={() => navigate("/painel")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 mt-16 md:mt-0 overflow-auto min-h-screen">
        <AnimatePresence mode="wait">
          {/* ===== OVERVIEW ===== */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6 max-w-5xl">
              <div>
                <h1 className="text-2xl font-bold font-display text-foreground">Visão Geral</h1>
                <p className="text-sm text-muted-foreground mt-1">Acompanhe o crescimento do MamyBoo em tempo real.</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard icon={Users} label="Total de Usuárias" value={stats.totalUsers.toLocaleString()} color="bg-primary" />
                <StatCard icon={UserCheck} label="Planos Ativos" value={stats.activeUsers.toLocaleString()} trend={stats.activeUsers > 0 ? `${Math.round((stats.activeUsers / Math.max(stats.totalUsers, 1)) * 100)}% do total` : undefined} color="bg-emerald-500" />
                <StatCard icon={TrendUp} label="Novas Hoje" value={`+${stats.newToday}`} color="bg-blue-500" />
                <StatCard icon={Crown} label="Premium" value={stats.premiumCount.toString()} color="bg-amber-500" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-5 border border-border shadow-card">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <ChartBar className="w-4 h-4 text-primary" weight="duotone" />
                    Distribuição de Planos
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: "Premium", count: stats.premiumCount, color: "bg-gradient-to-r from-amber-400 to-orange-500", pct: Math.round((stats.premiumCount / Math.max(stats.totalUsers, 1)) * 100) },
                      { label: "Essencial", count: stats.essentialCount, color: "bg-gradient-to-r from-blue-400 to-blue-500", pct: Math.round((stats.essentialCount / Math.max(stats.totalUsers, 1)) * 100) },
                      { label: "Sem plano", count: stats.totalUsers - stats.premiumCount - stats.essentialCount, color: "bg-muted", pct: Math.round(((stats.totalUsers - stats.premiumCount - stats.essentialCount) / Math.max(stats.totalUsers, 1)) * 100) },
                    ].map(bar => (
                      <div key={bar.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-foreground font-medium">{bar.label}</span>
                          <span className="text-muted-foreground">{bar.count} ({bar.pct}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${bar.pct}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className={`h-full rounded-full ${bar.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-5 border border-border shadow-card">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" weight="duotone" />
                    Resumo de Conteúdo
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Semanas", value: weekContents.length, sub: `${weekContents.filter(w => w.status === 'published').length} publicadas`, icon: Calendar },
                      { label: "Sintomas", value: symptomsData.length, sub: `${symptomsData.filter(s => s.active).length} ativos`, icon: WarningCircle },
                      { label: "Exercícios", value: exercisesData.length, sub: `${exercisesData.filter(e => e.active).length} ativos`, icon: Heartbeat },
                      { label: "Dicas", value: tipsData.length + healthTipsData.length, sub: `${tipsData.filter(t => t.active).length + healthTipsData.filter(h => h.active).length} ativas`, icon: Heart },
                    ].map(item => (
                      <div key={item.label} className="bg-muted/40 rounded-xl p-3 text-center hover:bg-muted/70 transition-colors">
                        <item.icon className="w-4 h-4 text-primary mx-auto mb-1.5" weight="duotone" />
                        <p className="text-lg font-bold text-foreground">{item.value}</p>
                        <p className="text-[10px] text-muted-foreground">{item.label}</p>
                        <p className="text-[9px] text-muted-foreground">{item.sub}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ===== CARDS ===== */}
          {activeTab === "cards" && (
            <motion.div key="cards" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold font-display text-foreground">Cards do Dashboard</h1>
                  <p className="text-sm text-muted-foreground mt-1">Gerencie os cards exibidos no painel.</p>
                </div>
                <Button className="rounded-xl gradient-primary text-primary-foreground shadow-soft" onClick={() => { setNewCard({ title: "", slug: "", description: "", icon: "BookOpen", path: "/", visible: true, display_order: categories.length }); setNewCardOpen(true); }}>
                  <Plus className="w-4 h-4 mr-1" /> Novo
                </Button>
              </div>

              {loadingCategories ? (
                <div className="flex justify-center py-12"><SpinnerGap className="w-6 h-6 animate-spin text-primary" /></div>
              ) : (
                <div className="grid gap-3">
                  {categories.sort((a, b) => a.display_order - b.display_order).map((card, i) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`bg-card rounded-2xl border border-border shadow-card overflow-hidden transition-all hover:shadow-elevated group ${!card.visible ? "opacity-50" : ""}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-stretch">
                        <div className="w-full sm:w-28 h-28 sm:h-auto flex-shrink-0 overflow-hidden">
                          <img src={localImages[card.slug] || cardJourney} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 p-4 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-foreground">{card.title}</h3>
                            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{card.description}</p>
                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                              <Badge variant="outline" className="text-[10px] font-normal">{card.path}</Badge>
                              {card.visible
                                ? <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">Visível</Badge>
                                : <Badge className="bg-red-100 text-red-700 border-0 text-[10px]">Oculto</Badge>}
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 flex-shrink-0">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => handleEditCard(card)}>
                              <PencilSimple className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => handleToggleVisibility(card)}>
                              <Eye className={`w-4 h-4 ${!card.visible ? "text-muted-foreground" : ""}`} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:text-destructive" onClick={() => handleDeleteCard(card)}>
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ===== CONTENT ===== */}
          {activeTab === "content" && (
            <motion.div key="content" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6 max-w-5xl">
              <div>
                <h1 className="text-2xl font-bold font-display text-foreground">Conteúdos</h1>
                <p className="text-sm text-muted-foreground mt-1">Gerencie todo o conteúdo educacional do app.</p>
              </div>

              <Tabs defaultValue="weeks">
                <TabsList className="rounded-xl bg-muted/50 p-1 w-full sm:w-auto overflow-x-auto">
                  <TabsTrigger value="weeks" className="rounded-lg text-xs sm:text-sm data-[state=active]:shadow-sm">Semanas</TabsTrigger>
                  <TabsTrigger value="symptoms" className="rounded-lg text-xs sm:text-sm data-[state=active]:shadow-sm">Sintomas</TabsTrigger>
                  <TabsTrigger value="exercises" className="rounded-lg text-xs sm:text-sm data-[state=active]:shadow-sm">Exercícios</TabsTrigger>
                  <TabsTrigger value="health" className="rounded-lg text-xs sm:text-sm data-[state=active]:shadow-sm">Saúde</TabsTrigger>
                  <TabsTrigger value="tips" className="rounded-lg text-xs sm:text-sm data-[state=active]:shadow-sm">Dicas</TabsTrigger>
                </TabsList>

                {/* Weeks tab */}
                <TabsContent value="weeks" className="mt-4">
                  <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                    <div className="hidden sm:grid grid-cols-[60px_1fr_100px_80px_80px_120px] gap-2 p-4 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      <span>Semana</span><span>Status</span><span>Atualizado</span><span>Revisado</span><span>Ativo</span><span>Ações</span>
                    </div>
                    {loadingWeeks ? (
                      <div className="flex justify-center py-8"><SpinnerGap className="w-5 h-5 animate-spin text-primary" /></div>
                    ) : (
                      <div className="max-h-[60vh] overflow-y-auto">
                        {weekContents.map(w => (
                          <div key={w.id} className="p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                            <div className="sm:hidden flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-sm text-foreground w-8">S{w.week_number}</span>
                                <Badge className={w.status === "published" ? "bg-emerald-100 text-emerald-700 border-0" : w.status === "draft" ? "bg-amber-100 text-amber-700 border-0" : "bg-muted text-muted-foreground border-0"}>
                                  {w.status === "published" ? "Publicado" : w.status === "draft" ? "Rascunho" : "Vazio"}
                                </Badge>
                                {w.reviewed && <span className="text-xs text-emerald-600">✓</span>}
                                {!w.active && <span className="text-xs text-red-500">Inativo</span>}
                              </div>
                              <div className="flex gap-0.5">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setViewingWeek(w); setViewWeekOpen(true); }}><Eye className="w-3.5 h-3.5" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingWeek({ ...w }); setEditWeekOpen(true); }}><PencilSimple className="w-3.5 h-3.5" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteWeekContent(w)}><Trash className="w-3.5 h-3.5" /></Button>
                              </div>
                            </div>
                            <div className="hidden sm:grid grid-cols-[60px_1fr_100px_80px_80px_120px] gap-2 items-center">
                              <span className="font-bold text-sm text-foreground">{w.week_number}</span>
                              <Badge className={w.status === "published" ? "bg-emerald-100 text-emerald-700 border-0 w-fit" : w.status === "draft" ? "bg-amber-100 text-amber-700 border-0 w-fit" : "bg-muted text-muted-foreground border-0 w-fit"}>
                                {w.status === "published" ? "Publicado" : w.status === "draft" ? "Rascunho" : "Vazio"}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{w.updated_at ? new Date(w.updated_at).toLocaleDateString("pt-BR") : "—"}</span>
                              <span>{w.reviewed ? <span className="text-xs text-emerald-600 font-medium">✓ Sim</span> : <span className="text-xs text-muted-foreground">Não</span>}</span>
                              <span>{w.active ? <span className="text-xs text-emerald-600">Sim</span> : <span className="text-xs text-red-500">Não</span>}</span>
                              <div className="flex gap-0.5">
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => { setViewingWeek(w); setViewWeekOpen(true); }}><Eye className="w-3.5 h-3.5" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => { setEditingWeek({ ...w }); setEditWeekOpen(true); }}><PencilSimple className="w-3.5 h-3.5" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive" onClick={() => handleDeleteWeekContent(w)}><Trash className="w-3.5 h-3.5" /></Button>
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
                      <span className="text-sm font-medium text-foreground">Sintomas ({symptomsData.length})</span>
                      <Button size="sm" className="rounded-xl gradient-primary text-primary-foreground" onClick={() => { setEditingSymptom({ name: "", description: "", alert_level: "low", trimester: [1], active: true, category_id: null }); setEditSymptomOpen(true); }}>
                        <Plus className="w-4 h-4 mr-1" /> Novo
                      </Button>
                    </div>
                    {loadingSymptoms ? <div className="flex justify-center py-8"><SpinnerGap className="w-5 h-5 animate-spin text-primary" /></div> : (
                      <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
                        {symptomsData.map(s => (
                          <div key={s.id} className={`p-4 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors ${!s.active ? "opacity-50" : ""}`}>
                            <div className="min-w-0">
                              <p className="font-medium text-sm text-foreground">{s.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{s.description}</p>
                              <div className="flex gap-1 mt-1.5">
                                <Badge className={s.alert_level === "high" ? "bg-red-100 text-red-700 border-0 text-[10px]" : s.alert_level === "medium" ? "bg-amber-100 text-amber-700 border-0 text-[10px]" : "bg-emerald-100 text-emerald-700 border-0 text-[10px]"}>
                                  {s.alert_level === "high" ? "Alto" : s.alert_level === "medium" ? "Médio" : "Baixo"}
                                </Badge>
                                <Badge variant="outline" className="text-[10px]">T{(s.trimester || []).join(",")}</Badge>
                              </div>
                            </div>
                            <div className="flex gap-0.5 flex-shrink-0">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => { setEditingSymptom({ ...s }); setEditSymptomOpen(true); }}><PencilSimple className="w-3.5 h-3.5" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive" onClick={() => { deleteSymptomMut.mutate(s.id); toast.success("Sintoma excluído"); }}><Trash className="w-3.5 h-3.5" /></Button>
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
                      <span className="text-sm font-medium text-foreground">Exercícios ({exercisesData.length})</span>
                      <Button size="sm" className="rounded-xl gradient-primary text-primary-foreground" onClick={() => { setEditingExercise({ name: "", description: "", intensity: "Leve", trimester: [1], steps: [], stepsText: "", contraindications: "", active: true, category_id: null }); setEditExerciseOpen(true); }}>
                        <Plus className="w-4 h-4 mr-1" /> Novo
                      </Button>
                    </div>
                    {loadingExercises ? <div className="flex justify-center py-8"><SpinnerGap className="w-5 h-5 animate-spin text-primary" /></div> : (
                      <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
                        {exercisesData.map(ex => (
                          <div key={ex.id} className={`p-4 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors ${!ex.active ? "opacity-50" : ""}`}>
                            <div className="min-w-0">
                              <p className="font-medium text-sm text-foreground">{ex.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{ex.description}</p>
                              <div className="flex gap-1 mt-1.5">
                                <Badge variant="secondary" className="text-[10px]">{ex.intensity}</Badge>
                                <Badge variant="outline" className="text-[10px]">T{(ex.trimester || []).join(",")}</Badge>
                              </div>
                            </div>
                            <div className="flex gap-0.5 flex-shrink-0">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => { setEditingExercise({ ...ex, stepsText: (ex.steps || []).join("\n") }); setEditExerciseOpen(true); }}><PencilSimple className="w-3.5 h-3.5" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive" onClick={() => { deleteExerciseMut.mutate(ex.id); toast.success("Exercício excluído"); }}><Trash className="w-3.5 h-3.5" /></Button>
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
                      <span className="text-sm font-medium text-foreground">Saúde ({healthTipsData.length})</span>
                      <Button size="sm" className="rounded-xl gradient-primary text-primary-foreground" onClick={() => { setEditingHealthTip({ section_title: "", icon: "Heart", tips: [], tipsText: "", active: true, category_id: null }); setEditHealthTipOpen(true); }}>
                        <Plus className="w-4 h-4 mr-1" /> Nova Seção
                      </Button>
                    </div>
                    {loadingHealthTips ? <div className="flex justify-center py-8"><SpinnerGap className="w-5 h-5 animate-spin text-primary" /></div> : (
                      <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
                        {healthTipsData.map(ht => (
                          <div key={ht.id} className={`p-4 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors ${!ht.active ? "opacity-50" : ""}`}>
                            <div className="min-w-0">
                              <p className="font-medium text-sm text-foreground">{ht.section_title}</p>
                              <p className="text-xs text-muted-foreground">{ht.tips.length} dica(s)</p>
                            </div>
                            <div className="flex gap-0.5 flex-shrink-0">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => { setEditingHealthTip({ ...ht, tipsText: ht.tips.join("\n") }); setEditHealthTipOpen(true); }}><PencilSimple className="w-3.5 h-3.5" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive" onClick={() => { deleteHealthTipMut.mutate(ht.id); toast.success("Seção excluída"); }}><Trash className="w-3.5 h-3.5" /></Button>
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
                      <span className="text-sm font-medium text-foreground">Dicas ({tipsData.length})</span>
                      <Button size="sm" className="rounded-xl gradient-primary text-primary-foreground" onClick={() => { setEditingTip({ title: "", content: "", week_number: 1, active: true, category_id: null }); setEditTipOpen(true); }}>
                        <Plus className="w-4 h-4 mr-1" /> Nova
                      </Button>
                    </div>
                    {loadingTips ? <div className="flex justify-center py-8"><SpinnerGap className="w-5 h-5 animate-spin text-primary" /></div> : (
                      <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
                        {tipsData.map(tip => (
                          <div key={tip.id} className={`p-4 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors ${!tip.active ? "opacity-50" : ""}`}>
                            <div className="min-w-0">
                              <p className="font-medium text-sm text-foreground">{tip.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{tip.content}</p>
                              <Badge variant="outline" className="text-[10px] mt-1">Semana {tip.week_number}</Badge>
                            </div>
                            <div className="flex gap-0.5 flex-shrink-0">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => { setEditingTip({ ...tip }); setEditTipOpen(true); }}><PencilSimple className="w-3.5 h-3.5" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive" onClick={() => { deleteTipMut.mutate(tip.id); toast.success("Dica excluída"); }}><Trash className="w-3.5 h-3.5" /></Button>
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
            <motion.div key="users" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold font-display text-foreground">Usuárias</h1>
                  <p className="text-sm text-muted-foreground mt-1">{users.length} cadastrada{users.length !== 1 ? "s" : ""} · {users.filter(u => u.plan_status === "active").length} ativa{users.filter(u => u.plan_status === "active").length !== 1 ? "s" : ""}</p>
                </div>
                <Button className="rounded-xl gradient-primary text-primary-foreground shadow-soft" onClick={() => { setNewUserData({ email: "", plan: "none", plan_status: "none" }); setNewUserOpen(true); }}>
                  <Plus className="w-4 h-4 mr-1" /> Nova Usuária
                </Button>
              </div>

              <div className="relative">
                <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar por email..." className="pl-10 rounded-xl h-11 bg-card border-border" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>

              <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                {usersLoading ? (
                  <div className="flex justify-center py-12"><SpinnerGap className="w-6 h-6 animate-spin text-primary" /></div>
                ) : filteredUsers.length === 0 ? (
                  <div className="p-12 text-center">
                    <Users className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">Nenhuma usuária encontrada.</p>
                  </div>
                ) : (
                  <div className="max-h-[65vh] overflow-y-auto">
                    {filteredUsers.map((user, i) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className="p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors group"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                              <UserCircle className="w-5 h-5 text-primary" weight="duotone" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-sm text-foreground truncate">{user.email}</p>
                              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                {planBadge(user.plan)}
                                {statusBadge(user.plan_status)}
                                <span className="text-[10px] text-muted-foreground hidden sm:inline">
                                  · {new Date(user.created_at).toLocaleDateString("pt-BR")}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-0.5 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => { setEditingUser({ ...user }); setNewPassword(""); setEditUserOpen(true); }}>
                              <PencilSimple className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:text-destructive" onClick={() => handleDeleteUser(user.user_id)}>
                              <Trash className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ===== SETTINGS ===== */}
          {activeTab === "settings" && (
            <motion.div key="settings" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6 max-w-3xl">
              <div>
                <h1 className="text-2xl font-bold font-display text-foreground">Configurações</h1>
                <p className="text-sm text-muted-foreground mt-1">Ajuste o funcionamento do app.</p>
              </div>
              <div className="space-y-3">
                {[
                  { type: "app", icon: Monitor, title: "Informações do App", description: `Nome: ${settings.appName}`, color: "text-blue-500" },
                  { type: "plans", icon: CreditCard, title: "Planos e Assinaturas", description: `Premium: R$ ${settings.planPremiumPrice}/mês`, color: "text-amber-500" },
                  { type: "push", icon: Bell, title: "Notificações Push", description: settings.pushEnabled ? `Ativadas · ${settings.pushFrequency}` : "Desativadas", color: "text-emerald-500" },
                  { type: "integrations", icon: Robot, title: "Integrações e IA", description: aiSettings.enabled ? `IA: ${aiSettings.model}` : "IA desativada", color: "text-purple-500" },
                  { type: "backup", icon: Database, title: "Backup e Exportação", description: settings.backupEnabled ? "Backup automático" : "Manual", color: "text-slate-500" },
                ].map((s, i) => (
                  <motion.div
                    key={s.type}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card rounded-2xl border border-border shadow-card p-5 hover:shadow-elevated transition-shadow cursor-pointer group"
                    onClick={() => openSetting(s.type)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <s.icon className={`w-5 h-5 ${s.color}`} weight="duotone" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{s.title}</p>
                          <p className="text-xs text-muted-foreground">{s.description}</p>
                        </div>
                      </div>
                      <CaretRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
              <div><Label className="text-sm font-medium">Ícone</Label><Input value={editingCard.icon} onChange={e => setEditingCard({ ...editingCard, icon: e.target.value })} className="mt-1 rounded-xl" /></div>
              <div><Label className="text-sm font-medium">Rota</Label><Input value={editingCard.path} onChange={e => setEditingCard({ ...editingCard, path: e.target.value })} className="mt-1 rounded-xl" /></div>
              <div><Label className="text-sm font-medium">URL da imagem</Label><Input value={editingCard.image_url} onChange={e => setEditingCard({ ...editingCard, image_url: e.target.value })} className="mt-1 rounded-xl" /></div>
              <div><Label className="text-sm font-medium">Ordem</Label><Input type="number" value={editingCard.display_order} onChange={e => setEditingCard({ ...editingCard, display_order: parseInt(e.target.value) || 0 })} className="mt-1 rounded-xl" /></div>
              <div className="flex items-center gap-3"><Switch checked={editingCard.visible} onCheckedChange={v => setEditingCard({ ...editingCard, visible: v })} /><Label className="text-sm">Visível</Label></div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 rounded-xl" onClick={handleSaveCard} disabled={updateCategory.isPending}>{updateCategory.isPending ? <SpinnerGap className="w-4 h-4 mr-2 animate-spin" /> : <FloppyDisk className="w-4 h-4 mr-2" />} Salvar</Button>
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
            <div><Label className="text-sm font-medium">Slug</Label><Input value={newCard.slug} onChange={e => setNewCard({ ...newCard, slug: e.target.value })} className="mt-1 rounded-xl" placeholder="Ex: nutricao" /></div>
            <div><Label className="text-sm font-medium">Descrição</Label><Textarea value={newCard.description} onChange={e => setNewCard({ ...newCard, description: e.target.value })} className="mt-1 rounded-xl" rows={2} /></div>
            <div><Label className="text-sm font-medium">Ícone</Label><Input value={newCard.icon} onChange={e => setNewCard({ ...newCard, icon: e.target.value })} className="mt-1 rounded-xl" placeholder="BookOpen" /></div>
            <div><Label className="text-sm font-medium">Rota</Label><Input value={newCard.path} onChange={e => setNewCard({ ...newCard, path: e.target.value })} className="mt-1 rounded-xl" placeholder="/nutricao" /></div>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1 rounded-xl" onClick={handleCreateCard} disabled={createCategory.isPending || !newCard.title || !newCard.slug}>{createCategory.isPending ? <SpinnerGap className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />} Criar</Button>
              <Button variant="outline" className="rounded-xl" onClick={() => setNewCardOpen(false)}><X className="w-4 h-4 mr-2" /> Cancelar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Week Dialog */}
      <Dialog open={viewWeekOpen} onOpenChange={setViewWeekOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Semana {viewingWeek?.week_number}</DialogTitle>
            <DialogDescription>Visualização do conteúdo da semana.</DialogDescription>
          </DialogHeader>
          {viewingWeek && (
            <div className="space-y-4 mt-2 text-sm">
              <div><p className="font-semibold text-foreground mb-1">Desenvolvimento do bebê</p><p className="text-muted-foreground whitespace-pre-wrap">{viewingWeek.baby_development || "—"}</p></div>
              <div><p className="font-semibold text-foreground mb-1">Mudanças na mãe</p><p className="text-muted-foreground whitespace-pre-wrap">{viewingWeek.mother_changes || "—"}</p></div>
              <div><p className="font-semibold text-foreground mb-1">Sintomas comuns</p><p className="text-muted-foreground">{(viewingWeek.common_symptoms || []).join(", ") || "—"}</p></div>
              <div><p className="font-semibold text-foreground mb-1">Dica</p><p className="text-muted-foreground">{viewingWeek.tip || "—"}</p></div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Week Dialog */}
      <Dialog open={editWeekOpen} onOpenChange={setEditWeekOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Semana {editingWeek?.week_number}</DialogTitle>
            <DialogDescription>Atualize o conteúdo desta semana.</DialogDescription>
          </DialogHeader>
          {editingWeek && (
            <div className="space-y-4 mt-2">
              <CategorySelect value={editingWeek.category_id} onChange={v => setEditingWeek({ ...editingWeek, category_id: v })} categories={categories} />
              <div><Label className="text-sm font-medium">Desenvolvimento do bebê</Label><Textarea value={editingWeek.baby_development} onChange={e => setEditingWeek({ ...editingWeek, baby_development: e.target.value })} className="mt-1 rounded-xl" rows={4} /></div>
              <div><Label className="text-sm font-medium">Mudanças na mãe</Label><Textarea value={editingWeek.mother_changes} onChange={e => setEditingWeek({ ...editingWeek, mother_changes: e.target.value })} className="mt-1 rounded-xl" rows={4} /></div>
              <div><Label className="text-sm font-medium">Sintomas comuns (separados por vírgula)</Label><Input value={(editingWeek.common_symptoms || []).join(", ")} onChange={e => setEditingWeek({ ...editingWeek, common_symptoms: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} className="mt-1 rounded-xl" /></div>
              <div><Label className="text-sm font-medium">Dica</Label><Textarea value={editingWeek.tip} onChange={e => setEditingWeek({ ...editingWeek, tip: e.target.value })} className="mt-1 rounded-xl" rows={2} /></div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2"><Switch checked={editingWeek.reviewed} onCheckedChange={v => setEditingWeek({ ...editingWeek, reviewed: v })} /><Label className="text-sm">Revisado</Label></div>
                <div className="flex items-center gap-2"><Switch checked={editingWeek.active} onCheckedChange={v => setEditingWeek({ ...editingWeek, active: v })} /><Label className="text-sm">Ativo</Label></div>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <select value={editingWeek.status} onChange={e => setEditingWeek({ ...editingWeek, status: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm">
                  <option value="empty">Vazio</option><option value="draft">Rascunho</option><option value="published">Publicado</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 rounded-xl" onClick={handleSaveWeek}><FloppyDisk className="w-4 h-4 mr-2" /> Salvar</Button>
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
              <div><Label className="text-sm font-medium">Nome</Label><Input value={editingSymptom.name || ""} onChange={e => setEditingSymptom({ ...editingSymptom, name: e.target.value })} className="mt-1 rounded-xl" /></div>
              <div><Label className="text-sm font-medium">Descrição</Label><Textarea value={editingSymptom.description || ""} onChange={e => setEditingSymptom({ ...editingSymptom, description: e.target.value })} className="mt-1 rounded-xl" rows={3} /></div>
              <div><Label className="text-sm font-medium">Nível de alerta</Label>
                <select value={editingSymptom.alert_level || "low"} onChange={e => setEditingSymptom({ ...editingSymptom, alert_level: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm">
                  <option value="low">Baixo</option><option value="medium">Médio</option><option value="high">Alto</option>
                </select>
              </div>
              <div><Label className="text-sm font-medium">Trimestres</Label>
                <div className="flex gap-3 mt-1">
                  {[1, 2, 3].map(t => (
                    <label key={t} className="flex items-center gap-1.5 text-sm">
                      <input type="checkbox" checked={(editingSymptom.trimester || []).includes(t)} onChange={e => { const current = editingSymptom.trimester || []; setEditingSymptom({ ...editingSymptom, trimester: e.target.checked ? [...current, t] : current.filter(x => x !== t) }); }} className="rounded" />
                      {t}º
                    </label>
                  ))}
                </div>
              </div>
              <div><Label className="text-sm font-medium">Quando é comum</Label><Textarea value={editingSymptom.when_common || ""} onChange={e => setEditingSymptom({ ...editingSymptom, when_common: e.target.value })} className="mt-1 rounded-xl" rows={2} /></div>
              <div><Label className="text-sm font-medium">Quando procurar médico</Label><Textarea value={editingSymptom.when_see_doctor || ""} onChange={e => setEditingSymptom({ ...editingSymptom, when_see_doctor: e.target.value })} className="mt-1 rounded-xl" rows={2} /></div>
              <div><Label className="text-sm font-medium">O que fazer</Label><Textarea value={editingSymptom.what_to_do || ""} onChange={e => setEditingSymptom({ ...editingSymptom, what_to_do: e.target.value })} className="mt-1 rounded-xl" rows={2} /></div>
              {editingSymptom.id && (
                <div className="flex items-center gap-3"><Switch checked={editingSymptom.active ?? true} onCheckedChange={v => setEditingSymptom({ ...editingSymptom, active: v })} /><Label className="text-sm">Ativo</Label></div>
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
              <div><Label className="text-sm font-medium">Nome</Label><Input value={editingExercise.name || ""} onChange={e => setEditingExercise({ ...editingExercise, name: e.target.value })} className="mt-1 rounded-xl" /></div>
              <div><Label className="text-sm font-medium">Descrição</Label><Textarea value={editingExercise.description || ""} onChange={e => setEditingExercise({ ...editingExercise, description: e.target.value })} className="mt-1 rounded-xl" rows={3} /></div>
              <div><Label className="text-sm font-medium">Intensidade</Label>
                <select value={editingExercise.intensity || "Leve"} onChange={e => setEditingExercise({ ...editingExercise, intensity: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm">
                  <option value="Leve">Leve</option><option value="Moderado">Moderado</option>
                </select>
              </div>
              <div><Label className="text-sm font-medium">Trimestres</Label>
                <div className="flex gap-3 mt-1">
                  {[1, 2, 3].map(t => (
                    <label key={t} className="flex items-center gap-1.5 text-sm">
                      <input type="checkbox" checked={(editingExercise.trimester || []).includes(t)} onChange={e => { const current = editingExercise.trimester || []; setEditingExercise({ ...editingExercise, trimester: e.target.checked ? [...current, t] : current.filter(x => x !== t) }); }} className="rounded" />
                      {t}º
                    </label>
                  ))}
                </div>
              </div>
              <div><Label className="text-sm font-medium">Passos (um por linha)</Label><Textarea value={(editingExercise as any).stepsText || ""} onChange={e => setEditingExercise({ ...editingExercise, stepsText: e.target.value } as any)} className="mt-1 rounded-xl" rows={5} placeholder="Cada linha será um passo" /></div>
              <div><Label className="text-sm font-medium">Contraindicações</Label><Textarea value={editingExercise.contraindications || ""} onChange={e => setEditingExercise({ ...editingExercise, contraindications: e.target.value })} className="mt-1 rounded-xl" rows={2} /></div>
              {editingExercise.id && (
                <div className="flex items-center gap-3"><Switch checked={editingExercise.active ?? true} onCheckedChange={v => setEditingExercise({ ...editingExercise, active: v })} /><Label className="text-sm">Ativo</Label></div>
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
            <DialogDescription>Preencha as informações da seção.</DialogDescription>
          </DialogHeader>
          {editingHealthTip && (
            <div className="space-y-4 mt-2">
              <CategorySelect value={editingHealthTip.category_id || null} onChange={v => setEditingHealthTip({ ...editingHealthTip, category_id: v })} categories={categories} />
              <div><Label className="text-sm font-medium">Título da seção</Label><Input value={editingHealthTip.section_title || ""} onChange={e => setEditingHealthTip({ ...editingHealthTip, section_title: e.target.value })} className="mt-1 rounded-xl" /></div>
              <div><Label className="text-sm font-medium">Ícone</Label>
                <select value={editingHealthTip.icon || "Heart"} onChange={e => setEditingHealthTip({ ...editingHealthTip, icon: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm">
                  <option value="Apple">Nutrição</option><option value="Moon">Sono</option><option value="Brain">Emocional</option><option value="Heart">Coração</option><option value="Baby">Bebê</option><option value="Sparkles">Brilho</option>
                </select>
              </div>
              <div><Label className="text-sm font-medium">Dicas (uma por linha)</Label><Textarea value={editingHealthTip.tipsText || ""} onChange={e => setEditingHealthTip({ ...editingHealthTip, tipsText: e.target.value })} className="mt-1 rounded-xl" rows={6} /></div>
              {editingHealthTip.id && (
                <div className="flex items-center gap-3"><Switch checked={editingHealthTip.active ?? true} onCheckedChange={v => setEditingHealthTip({ ...editingHealthTip, active: v })} /><Label className="text-sm">Ativo</Label></div>
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
              <div><Label className="text-sm font-medium">Título</Label><Input value={editingTip.title || ""} onChange={e => setEditingTip({ ...editingTip, title: e.target.value })} className="mt-1 rounded-xl" /></div>
              <div><Label className="text-sm font-medium">Semana</Label><Input type="number" value={editingTip.week_number || 1} onChange={e => setEditingTip({ ...editingTip, week_number: parseInt(e.target.value) || 1 })} className="mt-1 rounded-xl" min={1} max={40} /></div>
              <div><Label className="text-sm font-medium">Conteúdo</Label><Textarea value={editingTip.content || ""} onChange={e => setEditingTip({ ...editingTip, content: e.target.value })} className="mt-1 rounded-xl" rows={4} /></div>
              {editingTip.id && (
                <div className="flex items-center gap-3"><Switch checked={editingTip.active ?? true} onCheckedChange={v => setEditingTip({ ...editingTip, active: v })} /><Label className="text-sm">Ativa</Label></div>
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
                <div className="flex items-center justify-between"><Label className="text-sm font-medium">Plano gratuito</Label><Switch checked={settings.planFreeEnabled} onCheckedChange={v => setSettings({ ...settings, planFreeEnabled: v })} /></div>
                <div><Label className="text-sm font-medium">Preço Premium (R$/mês)</Label><Input value={settings.planPremiumPrice} onChange={e => setSettings({ ...settings, planPremiumPrice: e.target.value })} className="mt-1 rounded-xl" /></div>
              </>
            )}
            {editSettingType === "push" && (
              <>
                <div className="flex items-center justify-between"><Label className="text-sm font-medium">Notificações ativas</Label><Switch checked={settings.pushEnabled} onCheckedChange={v => setSettings({ ...settings, pushEnabled: v })} /></div>
                <div><Label className="text-sm font-medium">Frequência</Label>
                  <select value={settings.pushFrequency} onChange={e => setSettings({ ...settings, pushFrequency: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm">
                    <option value="diária">Diária</option><option value="semanal">Semanal</option><option value="quinzenal">Quinzenal</option>
                  </select>
                </div>
              </>
            )}
            {editSettingType === "integrations" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between"><Label className="text-sm font-medium">Assistente IA</Label><Switch checked={aiSettings.enabled} onCheckedChange={v => setAiSettings({ ...aiSettings, enabled: v })} /></div>
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-foreground mb-0.5">💡 Como funciona?</p>
                  <p className="text-[10px] text-muted-foreground">A IA usa <strong>OpenRouter</strong> como provedor principal. Se falhar, o <strong>Lovable IA</strong> entra como fallback.</p>
                </div>
                <div><Label className="text-sm font-medium">API Key (OpenRouter)</Label><Input type="password" value={aiSettings.api_key_encrypted} onChange={e => setAiSettings({ ...aiSettings, api_key_encrypted: e.target.value })} className="mt-1 rounded-xl" placeholder="Cole sua chave" /></div>
                <div><Label className="text-sm font-medium">Modelo</Label>
                  <select value={aiSettings.model} onChange={e => setAiSettings({ ...aiSettings, model: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm">
                    <option value="google/gemini-2.5-flash-lite">Gemini 2.5 Flash Lite</option>
                    <option value="google/gemini-2.5-flash">Gemini 2.5 Flash</option>
                    <option value="google/gemini-2.5-pro">Gemini 2.5 Pro</option>
                    <option value="google/gemini-3-flash-preview">Gemini 3 Flash Preview</option>
                    <option value="meta-llama/llama-4-scout">Llama 4 Scout</option>
                    <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                  </select>
                </div>
                <div><Label className="text-sm font-medium">Instruções do sistema</Label><Textarea value={aiSettings.system_prompt} onChange={e => setAiSettings({ ...aiSettings, system_prompt: e.target.value })} className="mt-1 rounded-xl" rows={4} /></div>
                <div><Label className="text-sm font-medium">Temperatura ({aiSettings.temperature})</Label><input type="range" min="0" max="1" step="0.1" value={aiSettings.temperature} onChange={e => setAiSettings({ ...aiSettings, temperature: parseFloat(e.target.value) })} className="mt-1 w-full" /></div>
                <div><Label className="text-sm font-medium">Máx. tokens</Label><Input type="number" value={aiSettings.max_tokens} onChange={e => setAiSettings({ ...aiSettings, max_tokens: parseInt(e.target.value) || 1024 })} className="mt-1 rounded-xl" /></div>
              </div>
            )}
            {editSettingType === "backup" && (
              <>
                <div className="flex items-center justify-between"><Label className="text-sm font-medium">Backup automático</Label><Switch checked={settings.backupEnabled} onCheckedChange={v => setSettings({ ...settings, backupEnabled: v })} /></div>
                <div className="bg-muted/50 rounded-xl p-3"><p className="text-[10px] text-muted-foreground">Os dados já estão sendo salvos no Supabase.</p></div>
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

      {/* Edit User Dialog - REDESIGNED with password */}
      <Dialog open={editUserOpen} onOpenChange={setEditUserOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-primary" weight="duotone" />
              Editar Usuária
            </DialogTitle>
            <DialogDescription>Gerencie plano, status e credenciais.</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-5 mt-2">
              {/* User info header */}
              <div className="bg-muted/40 rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                  <UserCircle className="w-6 h-6 text-primary" weight="duotone" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{editingUser.email}</p>
                  <p className="text-[10px] text-muted-foreground">
                    Cadastro: {editingUser.created_at ? new Date(editingUser.created_at).toLocaleDateString("pt-BR") : "—"}
                  </p>
                </div>
              </div>

              {/* Plan & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-medium">Plano</Label>
                  <select
                    value={editingUser.plan || "none"}
                    onChange={e => setEditingUser({ ...editingUser, plan: e.target.value as any })}
                    className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
                  >
                    <option value="none">Sem plano</option>
                    <option value="essential">Essencial</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <select
                    value={editingUser.plan_status || "none"}
                    onChange={e => setEditingUser({ ...editingUser, plan_status: e.target.value as any })}
                    className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
                  >
                    <option value="none">Inativo</option>
                    <option value="active">Ativo</option>
                    <option value="expired">Expirado</option>
                  </select>
                </div>
              </div>

              {/* Metadata */}
              {(editingUser.purchased_at || editingUser.expires_at || editingUser.kiwify_order_id) && (
                <div className="bg-muted/30 rounded-xl p-3 space-y-1">
                  {editingUser.purchased_at && <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> Compra: {new Date(editingUser.purchased_at).toLocaleDateString("pt-BR")}</p>}
                  {editingUser.expires_at && <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> Expira: {new Date(editingUser.expires_at).toLocaleDateString("pt-BR")}</p>}
                  {editingUser.kiwify_order_id && <p className="text-[10px] text-muted-foreground">Kiwify: {editingUser.kiwify_order_id}</p>}
                </div>
              )}

              <Button className="w-full rounded-xl" onClick={handleUpdateUser} disabled={userActionLoading}>
                {userActionLoading ? <SpinnerGap className="w-4 h-4 mr-2 animate-spin" /> : <FloppyDisk className="w-4 h-4 mr-2" />} Salvar Alterações
              </Button>

              {/* Password section */}
              <div className="border-t border-border pt-4">
                <Label className="text-sm font-medium flex items-center gap-1.5 mb-2">
                  <Password className="w-4 h-4 text-primary" weight="duotone" />
                  Alterar Senha
                </Label>
                <p className="text-[10px] text-muted-foreground mb-2">Defina uma nova senha para esta usuária. Mínimo 6 caracteres.</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Nova senha..."
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="rounded-xl pl-9 h-10"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-xl h-10 px-4"
                    onClick={handleSetPassword}
                    disabled={passwordLoading || !newPassword.trim() || newPassword.length < 6}
                  >
                    {passwordLoading ? <SpinnerGap className="w-4 h-4 animate-spin" /> : "Definir"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New User Dialog */}
      <Dialog open={newUserOpen} onOpenChange={setNewUserOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Nova Usuária
            </DialogTitle>
            <DialogDescription>Crie uma conta manualmente com o plano desejado.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div><Label className="text-sm font-medium">Email</Label><Input value={newUserData.email} onChange={e => setNewUserData({ ...newUserData, email: e.target.value })} className="mt-1 rounded-xl" placeholder="email@exemplo.com" /></div>
            <div><Label className="text-sm font-medium">Plano</Label>
              <select
                value={newUserData.plan}
                onChange={e => setNewUserData({ ...newUserData, plan: e.target.value, plan_status: e.target.value !== "none" ? "active" : "none" })}
                className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
              >
                <option value="none">Sem plano</option>
                <option value="essential">Essencial (R$ 47)</option>
                <option value="premium">Premium (R$ 97)</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1 rounded-xl gradient-primary text-primary-foreground" onClick={handleCreateUser} disabled={userActionLoading || !newUserData.email}>
                {userActionLoading ? <SpinnerGap className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />} Criar Usuária
              </Button>
              <Button variant="outline" className="rounded-xl" onClick={() => setNewUserOpen(false)}><X className="w-4 h-4 mr-2" /> Cancelar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
