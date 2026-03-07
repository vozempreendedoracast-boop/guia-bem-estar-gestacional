import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  SquaresFour, FileText, Users, Gear, BookOpen, WarningCircle,
  Heartbeat, Heart, Robot, ChartBar, Plus, PencilSimple, Trash, Eye, ArrowLeft,
  TrendUp, UserCheck, MagnifyingGlass, FloppyDisk, X, Stack, List,
  Bell, CreditCard, Link, Database, Monitor, SpinnerGap, Lock, Crown,
  ShieldCheck, Calendar, CaretRight, Password, UserCircle, Export,
  Megaphone, Image, DownloadSimple, Clipboard, Globe, ChatCircleDots
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
import WebhookAdmin from "@/components/WebhookAdmin";
import AdminSupportTab from "@/components/AdminSupportTab";
import AdminBioLinksTab from "@/components/AdminBioLinksTab";
import { useAppSettings } from "@/hooks/useAppSettings";

import {
  useCategories, useUpdateCategory, useCreateCategory, useDeleteCategory,
  useWeekContents, useUpdateWeekContent, useDeleteWeekContent,
  useSymptoms, useUpdateSymptom, useCreateSymptom, useDeleteSymptom,
  useExercises, useUpdateExercise, useCreateExercise, useDeleteExercise,
  useHealthTips, useUpdateHealthTip, useCreateHealthTip, useDeleteHealthTip,
  useWeeklyTips, useUpdateWeeklyTip, useCreateWeeklyTip, useDeleteWeeklyTip,
  usePlans, useUpdatePlan, useCreatePlan, useDeletePlan,
  usePromotions, useCreatePromotion, useUpdatePromotion, useDeletePromotion,
  type Category, type WeekContent, type SymptomRow, type ExerciseRow, type HealthTipRow, type WeeklyTipRow, type PlanRow, type PromotionRow,
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
  account_status?: string;
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
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
  canonicalUrl: string;
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
  { id: "promotions", label: "Promoções", icon: Megaphone },
  { id: "users", label: "Usuárias", icon: Users },
  { id: "support", label: "Suporte", icon: ChatCircleDots },
  { id: "webhooks", label: "Webhooks", icon: Link },
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
  const { getSetting, updateSetting: updateAppSetting } = useAppSettings();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("admin_active_tab") || "overview";
  });
  
  useEffect(() => {
    localStorage.setItem("admin_active_tab", activeTab);
  }, [activeTab]);
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
  const { data: plansData = [], isLoading: loadingPlans } = usePlans();
  const updatePlanMut = useUpdatePlan();
  const createPlanMut = useCreatePlan();
  const deletePlanMut = useDeletePlan();
  const { data: promotionsData = [], isLoading: loadingPromotions } = usePromotions();
  const createPromotionMut = useCreatePromotion();
  const updatePromotionMut = useUpdatePromotion();
  const deletePromotionMut = useDeletePromotion();
  // User management
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, activeUsers: 0, newToday: 0, essentialCount: 0, premiumCount: 0 });
  const [usersLoading, setUsersLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<Partial<UserProfile> | null>(null);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [newUserOpen, setNewUserOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({ email: "", plan: "none" as string, plan_status: "active" as string, password: "" });
  const [userActionLoading, setUserActionLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [viewProfileOpen, setViewProfileOpen] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<any>(null);
  const [viewProfileLoading, setViewProfileLoading] = useState(false);

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
      setNewUserData({ email: "", plan: "none", plan_status: "active", password: "" });
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

  const handleBanUser = async (userId: string, currentStatus: string) => {
    const isBanned = currentStatus === "banned";
    const action = isBanned ? "unban" : "ban";
    const label = isBanned ? "reativar" : "desativar";
    if (!confirm(`Tem certeza que deseja ${label} esta usuária?`)) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      const res = await fetch(`${ADMIN_BASE_URL}/functions/v1/admin-users?action=${action}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      toast.success(isBanned ? "Usuária reativada!" : "Usuária desativada!");
      fetchUsers();
    } catch (e: any) { toast.error(e.message || `Erro ao ${label}`); }
  };

  const handleViewProfile = async (userId: string) => {
    setViewProfileLoading(true);
    setViewProfileOpen(true);
    try {
      const { data, error } = await supabase
        .from("pregnancy_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      setViewingProfile(data);
    } catch { setViewingProfile(null); }
    finally { setViewProfileLoading(false); }
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

  // Plans state
  const [editingPlan, setEditingPlan] = useState<Partial<PlanRow> & { featuresText?: string; excludedText?: string } | null>(null);
  const [editPlanOpen, setEditPlanOpen] = useState(false);

  // Promotions state
  const [editingPromotion, setEditingPromotion] = useState<Partial<PromotionRow> | null>(null);
  const [editPromotionOpen, setEditPromotionOpen] = useState(false);

  // Settings state - load from localStorage
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem("admin_app_settings");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      appName: "MamyBoo",
      appDescription: "Sua companheira durante toda a jornada da gravidez.",
      pushEnabled: true,
      pushFrequency: "diária",
      planFreeEnabled: true,
      planPremiumPrice: "29,90",
      analyticsEnabled: true,
      backupEnabled: false,
      seoTitle: "MamyBoo - Acompanhamento de Gestação",
      seoDescription: "Acompanhe sua gestação semana a semana com informações personalizadas, dicas e suporte emocional.",
      ogImageUrl: "",
      canonicalUrl: "https://mamyboo.vercel.app",
    };
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
    try { await createCategory.mutateAsync({ ...newCard, image_url: (newCard as any).image_url || "" }); toast.success("Card criado!"); setNewCardOpen(false); setNewCard({ title: "", slug: "", description: "", icon: "BookOpen", path: "/", visible: true, display_order: categories.length }); }
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
      if (editingTip.id) { await updateTip.mutateAsync({ id: editingTip.id, title: editingTip.title, content: editingTip.content, week_number: editingTip.week_number, active: editingTip.active, category_id: editingTip.category_id, day_of_week: (editingTip as any).day_of_week || 1 } as any); }
      else { await createTip.mutateAsync({ title: editingTip.title || "", content: editingTip.content, week_number: editingTip.week_number || 1, category_id: editingTip.category_id, day_of_week: (editingTip as any).day_of_week || 1 } as any); }
      toast.success("Dica salva!"); setEditTipOpen(false); setEditingTip(null);
    } catch { toast.error("Erro ao salvar dica"); }
  };

  // Plan handlers
  const handleSavePlan = async () => {
    if (!editingPlan) return;
    try {
      const features = (editingPlan.featuresText || "").split("\n").filter(s => s.trim());
      const excluded = (editingPlan.excludedText || "").split("\n").filter(s => s.trim());
      const payload = {
        name: editingPlan.name || "",
        slug: editingPlan.slug || "",
        description: editingPlan.description || "",
        price: editingPlan.price || "",
        price_label: editingPlan.price_label || "pagamento único",
        badge: editingPlan.badge || "",
        icon: editingPlan.icon || "BookOpen",
        features,
        excluded_features: excluded,
        checkout_url: editingPlan.checkout_url || "#",
        button_text: editingPlan.button_text || "Quero começar",
        highlighted: editingPlan.highlighted ?? false,
        active: editingPlan.active ?? true,
        display_order: editingPlan.display_order ?? 0,
        highlight_text: editingPlan.highlight_text || "",
      };
      if (editingPlan.id) {
        await updatePlanMut.mutateAsync({ id: editingPlan.id, ...payload });
      } else {
        await createPlanMut.mutateAsync(payload);
      }
      toast.success("Plano salvo!"); setEditPlanOpen(false); setEditingPlan(null);
    } catch (e: any) { toast.error(e.message || "Erro ao salvar plano"); }
  };

  const openSetting = (type: string) => { setEditSettingType(type); setEditSettingOpen(true); };

  // Promotion handlers
  const handleSavePromotion = async () => {
    if (!editingPromotion) return;
    try {
      const payload = {
        title: editingPromotion.title || "",
        description: editingPromotion.description || "",
        image_url: editingPromotion.image_url || "",
        link_url: editingPromotion.link_url || "#",
        button_text: editingPromotion.button_text || "Ver oferta",
        active: editingPromotion.active ?? true,
        display_order: editingPromotion.display_order ?? 0,
        starts_at: editingPromotion.starts_at ? new Date(editingPromotion.starts_at).toISOString() : null,
        ends_at: editingPromotion.ends_at ? new Date(editingPromotion.ends_at).toISOString() : null,
      };
      if (editingPromotion.id) {
        await updatePromotionMut.mutateAsync({ id: editingPromotion.id, ...payload });
      } else {
        await createPromotionMut.mutateAsync(payload);
      }
      toast.success("Promoção salva!"); setEditPromotionOpen(false); setEditingPromotion(null);
    } catch (e: any) { toast.error(e.message || "Erro ao salvar promoção"); }
  };
  /* ─────────── Helpers ─────────── */
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return null;
    return categories.find(c => c.id === categoryId)?.title || null;
  };

  const CategoryBar = ({ categoryId }: { categoryId: string | null }) => {
    const name = getCategoryName(categoryId);
    if (!name) return null;
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-t-xl bg-primary/10 border-b border-primary/20 -mx-4 -mt-4 mb-3">
        <Globe className="w-3 h-3 text-primary" />
        <span className="text-[11px] font-semibold text-primary truncate">{name}</span>
      </div>
    );
  };

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
                          <img src={card.image_url?.trim() ? card.image_url : (localImages[card.slug] || cardJourney)} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                  <TabsTrigger value="biolinks" className="rounded-lg text-xs sm:text-sm data-[state=active]:shadow-sm">Bio Links</TabsTrigger>
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
                          <div key={s.id} className={`p-4 hover:bg-muted/30 transition-colors ${!s.active ? "opacity-50" : ""}`}>
                            <CategoryBar categoryId={s.category_id} />
                            <div className="flex items-center justify-between gap-3">
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
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive" disabled={deleteSymptomMut.isPending} onClick={async () => { try { await deleteSymptomMut.mutateAsync(s.id); toast.success("Sintoma excluído"); } catch (error: any) { console.error("Erro ao excluir sintoma:", error); toast.error(error?.message || "Erro ao excluir sintoma"); } }}><Trash className="w-3.5 h-3.5" /></Button>
                            </div>
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
                          <div key={ex.id} className={`p-4 hover:bg-muted/30 transition-colors ${!ex.active ? "opacity-50" : ""}`}>
                            <CategoryBar categoryId={ex.category_id} />
                            <div className="flex items-center justify-between gap-3">
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
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive" disabled={deleteExerciseMut.isPending} onClick={async () => { try { await deleteExerciseMut.mutateAsync(ex.id); toast.success("Exercício excluído"); } catch (error: any) { console.error("Erro ao excluir exercício:", error); toast.error(error?.message || "Erro ao excluir exercício"); } }}><Trash className="w-3.5 h-3.5" /></Button>
                            </div>
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
                          <div key={ht.id} className={`p-4 hover:bg-muted/30 transition-colors ${!ht.active ? "opacity-50" : ""}`}>
                            <CategoryBar categoryId={ht.category_id} />
                            <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-medium text-sm text-foreground">{ht.section_title}</p>
                              <p className="text-xs text-muted-foreground">{ht.tips.length} dica(s)</p>
                            </div>
                            <div className="flex gap-0.5 flex-shrink-0">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => { setEditingHealthTip({ ...ht, tipsText: ht.tips.join("\n") }); setEditHealthTipOpen(true); }}><PencilSimple className="w-3.5 h-3.5" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive" disabled={deleteHealthTipMut.isPending} onClick={async () => { try { await deleteHealthTipMut.mutateAsync(ht.id); toast.success("Seção excluída"); } catch (error: any) { console.error("Erro ao excluir seção de saúde:", error); toast.error(error?.message || "Erro ao excluir seção"); } }}><Trash className="w-3.5 h-3.5" /></Button>
                            </div>
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
                      <span className="text-sm font-medium text-foreground">Dicas Diárias ({tipsData.length})</span>
                      <Button size="sm" className="rounded-xl gradient-primary text-primary-foreground" onClick={() => { setEditingTip({ title: "", content: "", week_number: 1, active: true, category_id: null, day_of_week: 1 } as any); setEditTipOpen(true); }}>
                        <Plus className="w-4 h-4 mr-1" /> Nova
                      </Button>
                    </div>
                    {loadingTips ? <div className="flex justify-center py-8"><SpinnerGap className="w-5 h-5 animate-spin text-primary" /></div> : (
                      <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
                        {tipsData.map(tip => (
                          <div key={tip.id} className={`p-4 hover:bg-muted/30 transition-colors ${!tip.active ? "opacity-50" : ""}`}>
                            <CategoryBar categoryId={tip.category_id} />
                            <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-medium text-sm text-foreground">{tip.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{tip.content}</p>
                              <div className="flex gap-1 mt-1">
                                <Badge variant="outline" className="text-[10px]">Semana {tip.week_number}</Badge>
                                <Badge variant="outline" className="text-[10px]">Dia {(tip as any).day_of_week || 1}</Badge>
                              </div>
                            </div>
                            <div className="flex gap-0.5 flex-shrink-0">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => { setEditingTip({ ...tip }); setEditTipOpen(true); }}><PencilSimple className="w-3.5 h-3.5" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive" disabled={deleteTipMut.isPending} onClick={async () => { try { await deleteTipMut.mutateAsync(tip.id); toast.success("Dica excluída"); } catch (error: any) { console.error("Erro ao excluir dica:", error); toast.error(error?.message || "Erro ao excluir dica"); } }}><Trash className="w-3.5 h-3.5" /></Button>
                            </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
                {/* Bio Links tab */}
                <TabsContent value="biolinks" className="mt-4">
                  <AdminBioLinksTab />
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
                <Button className="rounded-xl gradient-primary text-primary-foreground shadow-soft" onClick={() => { setNewUserData({ email: "", plan: "none", plan_status: "active", password: "" }); setNewUserOpen(true); }}>
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
                                {user.account_status === "banned" && <Badge className="bg-red-100 text-red-700 border-0 text-[10px]">Desativada</Badge>}
                                <span className="text-[10px] text-muted-foreground hidden sm:inline">
                                  · {new Date(user.created_at).toLocaleDateString("pt-BR")}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-0.5 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" title="Ver perfil" onClick={() => handleViewProfile(user.user_id)}>
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => { setEditingUser({ ...user }); setNewPassword(""); setEditUserOpen(true); }}>
                              <PencilSimple className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 rounded-lg ${user.account_status === "banned" ? "text-emerald-600 hover:text-emerald-700" : "text-amber-600 hover:text-amber-700"}`}
                              title={user.account_status === "banned" ? "Reativar" : "Desativar"}
                              onClick={() => handleBanUser(user.user_id, user.account_status || "active")}
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
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

          {/* ===== PROMOTIONS ===== */}
          {activeTab === "promotions" && (
            <motion.div key="promotions" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold font-display text-foreground">Promoções</h1>
                  <p className="text-sm text-muted-foreground mt-1">Gerencie banners e ofertas exibidos no painel das usuárias.</p>
                </div>
                <Button className="rounded-xl gradient-primary text-primary-foreground shadow-soft" onClick={() => { setEditingPromotion({ title: "", description: "", image_url: "", link_url: "#", button_text: "Ver oferta", active: true, display_order: promotionsData.length }); setEditPromotionOpen(true); }}>
                  <Plus className="w-4 h-4 mr-1" /> Nova
                </Button>
              </div>

              {/* Carousel Settings */}
              <div className="bg-card rounded-2xl border border-border shadow-card p-4 space-y-4">
                <p className="text-sm font-semibold text-foreground">⚙️ Configurações do Carrossel</p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Auto-play</Label>
                    <Switch
                      checked={getSetting("promo_carousel_autoplay", "true") === "true"}
                      onCheckedChange={v => {
                        updateAppSetting.mutate({ key: "promo_carousel_autoplay", value: String(v) });
                        toast.success(v ? "Auto-play ativado" : "Auto-play desativado");
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Intervalo (segundos)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="number"
                        min={2}
                        max={30}
                        defaultValue={getSetting("promo_carousel_interval", "5")}
                        onBlur={e => {
                          const val = Math.max(2, Math.min(30, parseInt(e.target.value) || 5));
                          updateAppSetting.mutate({ key: "promo_carousel_interval", value: String(val) });
                          toast.success(`Intervalo atualizado para ${val}s`);
                        }}
                        className="rounded-xl w-24"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground">O carrossel de promoções no painel da usuária passará automaticamente conforme estas configurações.</p>
              </div>

              {loadingPromotions ? (
                <div className="flex justify-center py-12"><SpinnerGap className="w-6 h-6 animate-spin text-primary" /></div>
              ) : promotionsData.length === 0 ? (
                <div className="bg-card rounded-2xl border border-border shadow-card p-12 text-center">
                  <Megaphone className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" weight="duotone" />
                  <p className="text-muted-foreground text-sm">Nenhuma promoção cadastrada.</p>
                  <p className="text-xs text-muted-foreground mt-1">Crie promoções para exibir no carrossel do painel.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {promotionsData.sort((a, b) => a.display_order - b.display_order).map((promo, i) => (
                    <motion.div
                      key={promo.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`bg-card rounded-2xl border border-border shadow-card overflow-hidden transition-all hover:shadow-elevated group ${!promo.active ? "opacity-50" : ""}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-stretch">
                        {promo.image_url && (
                          <div className="w-full sm:w-32 h-24 sm:h-auto flex-shrink-0 overflow-hidden bg-muted">
                            <img src={promo.image_url} alt={promo.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 p-4 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-foreground">{promo.title || "Sem título"}</h3>
                            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{promo.description}</p>
                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                              <Badge variant="outline" className="text-[10px] font-normal">{promo.button_text}</Badge>
                              {promo.active
                                ? <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">Ativa</Badge>
                                : <Badge className="bg-red-100 text-red-700 border-0 text-[10px]">Inativa</Badge>}
                              {promo.ends_at && <Badge variant="outline" className="text-[10px]">Até {new Date(promo.ends_at).toLocaleDateString("pt-BR")}</Badge>}
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 flex-shrink-0">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => { setEditingPromotion({ ...promo }); setEditPromotionOpen(true); }}>
                              <PencilSimple className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:text-destructive" onClick={async () => {
                              if (!confirm(`Excluir promoção "${promo.title}"?`)) return;
                              try { await deletePromotionMut.mutateAsync(promo.id); toast.success("Promoção excluída!"); } catch { toast.error("Erro ao excluir"); }
                            }}>
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

          {/* ===== SUPPORT ===== */}
          {activeTab === "support" && <AdminSupportTab />}

          {/* ===== WEBHOOKS ===== */}
          {activeTab === "webhooks" && (
            <motion.div key="webhooks" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="max-w-5xl">
              <div className="mb-6">
                <h1 className="text-2xl font-bold font-display text-foreground">Webhooks Kiwify</h1>
                <p className="text-sm text-muted-foreground mt-1">Simule webhooks e monitore os eventos recebidos.</p>
              </div>
              <WebhookAdmin />
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
                  { type: "plans", icon: CreditCard, title: "Planos e Assinaturas", description: `${plansData.length} plano(s) cadastrado(s)`, color: "text-amber-500" },
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
              <div>
                <Label className="text-sm font-medium">Plano mínimo necessário</Label>
                <select
                  value={(editingCard as any).required_plan || "none"}
                  onChange={e => setEditingCard({ ...editingCard, required_plan: e.target.value } as any)}
                  className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
                >
                  <option value="none">Todos os planos</option>
                  <option value="essential">Essencial ou superior</option>
                  <option value="premium">Somente Premium</option>
                </select>
              </div>
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
            <div><Label className="text-sm font-medium">URL da imagem</Label><Input value={(newCard as any).image_url || ""} onChange={e => setNewCard({ ...newCard, image_url: e.target.value } as any)} className="mt-1 rounded-xl" placeholder="https://... (opcional)" /></div>
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
              <div><Label className="text-sm font-medium">URL da Imagem</Label><Input value={(editingHealthTip as any).image_url || ""} onChange={e => setEditingHealthTip({ ...editingHealthTip, image_url: e.target.value } as any)} className="mt-1 rounded-xl" placeholder="https://exemplo.com/imagem.jpg" /></div>
              {(editingHealthTip as any).image_url && (
                <div className="rounded-xl overflow-hidden border border-border">
                  <img src={(editingHealthTip as any).image_url} alt="Preview" className="w-full h-28 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}
              <div><Label className="text-sm font-medium">Descrição (importância do tema)</Label><Textarea value={(editingHealthTip as any).description || ""} onChange={e => setEditingHealthTip({ ...editingHealthTip, description: e.target.value } as any)} className="mt-1 rounded-xl" rows={3} placeholder="Explique a importância deste tema para a gestante..." /></div>
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
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-sm font-medium">Semana</Label><Input type="number" value={editingTip.week_number || 1} onChange={e => setEditingTip({ ...editingTip, week_number: parseInt(e.target.value) || 1 })} className="mt-1 rounded-xl" min={1} max={40} /></div>
                <div><Label className="text-sm font-medium">Dia da semana</Label><Input type="number" value={(editingTip as any).day_of_week || 1} onChange={e => setEditingTip({ ...editingTip, day_of_week: parseInt(e.target.value) || 1 } as any)} className="mt-1 rounded-xl" min={1} max={7} /></div>
              </div>
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

      {/* Edit Plan Dialog */}
      <Dialog open={editPlanOpen} onOpenChange={setEditPlanOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{!editingPlan?.id ? "Novo Plano" : `Editar: ${editingPlan?.name}`}</DialogTitle>
            <DialogDescription>Preencha as informações do plano.</DialogDescription>
          </DialogHeader>
          {editingPlan && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-sm font-medium">Nome</Label><Input value={editingPlan.name || ""} onChange={e => setEditingPlan({ ...editingPlan, name: e.target.value })} className="mt-1 rounded-xl" placeholder="Ex: Essencial" /></div>
                <div><Label className="text-sm font-medium">Slug</Label><Input value={editingPlan.slug || ""} onChange={e => setEditingPlan({ ...editingPlan, slug: e.target.value })} className="mt-1 rounded-xl" placeholder="Ex: essential" /></div>
              </div>
              <div><Label className="text-sm font-medium">Descrição</Label><Input value={editingPlan.description || ""} onChange={e => setEditingPlan({ ...editingPlan, description: e.target.value })} className="mt-1 rounded-xl" placeholder="Ex: Tudo para acompanhar sua gestação" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-sm font-medium">Preço</Label><Input value={editingPlan.price || ""} onChange={e => setEditingPlan({ ...editingPlan, price: e.target.value })} className="mt-1 rounded-xl" placeholder="R$ 47" /></div>
                <div><Label className="text-sm font-medium">Label do preço</Label><Input value={editingPlan.price_label || ""} onChange={e => setEditingPlan({ ...editingPlan, price_label: e.target.value })} className="mt-1 rounded-xl" placeholder="pagamento único" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-sm font-medium">Ícone</Label>
                  <select value={editingPlan.icon || "BookOpen"} onChange={e => setEditingPlan({ ...editingPlan, icon: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm">
                    <option value="BookOpen">BookOpen</option>
                    <option value="Crown">Crown</option>
                    <option value="Star">Star</option>
                    <option value="Heart">Heart</option>
                    <option value="Sparkle">Sparkle</option>
                  </select>
                </div>
                <div><Label className="text-sm font-medium">Ordem</Label><Input type="number" value={editingPlan.display_order ?? 0} onChange={e => setEditingPlan({ ...editingPlan, display_order: parseInt(e.target.value) || 0 })} className="mt-1 rounded-xl" /></div>
              </div>
              <div><Label className="text-sm font-medium">Badge (texto destaque)</Label><Input value={editingPlan.badge || ""} onChange={e => setEditingPlan({ ...editingPlan, badge: e.target.value })} className="mt-1 rounded-xl" placeholder="Ex: ⭐ Mais escolhido" /></div>
              <div><Label className="text-sm font-medium">Texto destaque abaixo do preço</Label><Input value={editingPlan.highlight_text || ""} onChange={e => setEditingPlan({ ...editingPlan, highlight_text: e.target.value })} className="mt-1 rounded-xl" placeholder="Ex: Economize com IA ilimitada inclusa" /></div>
              <div><Label className="text-sm font-medium">Recursos incluídos (um por linha)</Label><Textarea value={editingPlan.featuresText || ""} onChange={e => setEditingPlan({ ...editingPlan, featuresText: e.target.value })} className="mt-1 rounded-xl" rows={5} placeholder="Cada linha será um recurso" /></div>
              <div><Label className="text-sm font-medium">Recursos excluídos (um por linha)</Label><Textarea value={editingPlan.excludedText || ""} onChange={e => setEditingPlan({ ...editingPlan, excludedText: e.target.value })} className="mt-1 rounded-xl" rows={2} placeholder="Ex: Assistente de IA" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-sm font-medium">URL do checkout</Label><Input value={editingPlan.checkout_url || ""} onChange={e => setEditingPlan({ ...editingPlan, checkout_url: e.target.value })} className="mt-1 rounded-xl" placeholder="https://..." /></div>
                <div><Label className="text-sm font-medium">Texto do botão</Label><Input value={editingPlan.button_text || ""} onChange={e => setEditingPlan({ ...editingPlan, button_text: e.target.value })} className="mt-1 rounded-xl" placeholder="Quero começar" /></div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2"><Switch checked={editingPlan.highlighted ?? false} onCheckedChange={v => setEditingPlan({ ...editingPlan, highlighted: v })} /><Label className="text-sm">Destaque</Label></div>
                <div className="flex items-center gap-2"><Switch checked={editingPlan.active ?? true} onCheckedChange={v => setEditingPlan({ ...editingPlan, active: v })} /><Label className="text-sm">Ativo</Label></div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 rounded-xl" onClick={handleSavePlan} disabled={updatePlanMut.isPending || createPlanMut.isPending}>
                  {(updatePlanMut.isPending || createPlanMut.isPending) ? <SpinnerGap className="w-4 h-4 mr-2 animate-spin" /> : <FloppyDisk className="w-4 h-4 mr-2" />} Salvar
                </Button>
                <Button variant="outline" className="rounded-xl" onClick={() => setEditPlanOpen(false)}><X className="w-4 h-4 mr-2" /> Cancelar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Promotion Dialog */}
      <Dialog open={editPromotionOpen} onOpenChange={setEditPromotionOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{!editingPromotion?.id ? "Nova Promoção" : `Editar: ${editingPromotion?.title}`}</DialogTitle>
            <DialogDescription>Configure os detalhes da promoção/banner.</DialogDescription>
          </DialogHeader>
          {editingPromotion && (
            <div className="space-y-4 mt-2">
              <div><Label className="text-sm font-medium">Título</Label><Input value={editingPromotion.title || ""} onChange={e => setEditingPromotion({ ...editingPromotion, title: e.target.value })} className="mt-1 rounded-xl" placeholder="Ex: Oferta Especial" /></div>
              <div><Label className="text-sm font-medium">Descrição</Label><Textarea value={editingPromotion.description || ""} onChange={e => setEditingPromotion({ ...editingPromotion, description: e.target.value })} className="mt-1 rounded-xl" rows={2} placeholder="Texto da promoção" /></div>
              <div><Label className="text-sm font-medium">URL da imagem</Label><Input value={editingPromotion.image_url || ""} onChange={e => setEditingPromotion({ ...editingPromotion, image_url: e.target.value })} className="mt-1 rounded-xl" placeholder="https://..." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-sm font-medium">Link de destino</Label><Input value={editingPromotion.link_url || ""} onChange={e => setEditingPromotion({ ...editingPromotion, link_url: e.target.value })} className="mt-1 rounded-xl" placeholder="https://..." /></div>
                <div><Label className="text-sm font-medium">Texto do botão</Label><Input value={editingPromotion.button_text || ""} onChange={e => setEditingPromotion({ ...editingPromotion, button_text: e.target.value })} className="mt-1 rounded-xl" placeholder="Ver oferta" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-sm font-medium">Início (opcional)</Label><Input type="datetime-local" value={editingPromotion.starts_at ? (() => { const d = new Date(editingPromotion.starts_at!); const offset = d.getTimezoneOffset(); const local = new Date(d.getTime() - offset * 60000); return local.toISOString().slice(0, 16); })() : ""} onChange={e => setEditingPromotion({ ...editingPromotion, starts_at: e.target.value || null })} className="mt-1 rounded-xl" /></div>
                <div><Label className="text-sm font-medium">Fim (opcional)</Label><Input type="datetime-local" value={editingPromotion.ends_at ? (() => { const d = new Date(editingPromotion.ends_at!); const offset = d.getTimezoneOffset(); const local = new Date(d.getTime() - offset * 60000); return local.toISOString().slice(0, 16); })() : ""} onChange={e => setEditingPromotion({ ...editingPromotion, ends_at: e.target.value || null })} className="mt-1 rounded-xl" /></div>
              </div>
              <div><Label className="text-sm font-medium">Ordem</Label><Input type="number" value={editingPromotion.display_order ?? 0} onChange={e => setEditingPromotion({ ...editingPromotion, display_order: parseInt(e.target.value) || 0 })} className="mt-1 rounded-xl" /></div>
              <div className="flex items-center gap-3"><Switch checked={editingPromotion.active ?? true} onCheckedChange={v => setEditingPromotion({ ...editingPromotion, active: v })} /><Label className="text-sm">Ativa</Label></div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 rounded-xl" onClick={handleSavePromotion} disabled={createPromotionMut.isPending || updatePromotionMut.isPending}>
                  {(createPromotionMut.isPending || updatePromotionMut.isPending) ? <SpinnerGap className="w-4 h-4 mr-2 animate-spin" /> : <FloppyDisk className="w-4 h-4 mr-2" />} Salvar
                </Button>
                <Button variant="outline" className="rounded-xl" onClick={() => setEditPromotionOpen(false)}><X className="w-4 h-4 mr-2" /> Cancelar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
                
                <div className="border-t border-border pt-4 space-y-3">
                  <p className="text-xs font-semibold text-foreground flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> SEO e Metadados</p>
                  <div><Label className="text-sm font-medium">Título SEO (og:title)</Label><Input value={settings.seoTitle} onChange={e => setSettings({ ...settings, seoTitle: e.target.value })} className="mt-1 rounded-xl" placeholder="MamyBoo - Acompanhamento de Gestação" /><p className="text-[10px] text-muted-foreground mt-1">{(settings.seoTitle || "").length}/60 caracteres recomendados</p></div>
                  <div><Label className="text-sm font-medium">Descrição SEO (og:description)</Label><Textarea value={settings.seoDescription} onChange={e => setSettings({ ...settings, seoDescription: e.target.value })} className="mt-1 rounded-xl" rows={2} placeholder="Acompanhe sua gestação semana a semana..." /><p className="text-[10px] text-muted-foreground mt-1">{(settings.seoDescription || "").length}/160 caracteres recomendados</p></div>
                  <div><Label className="text-sm font-medium">Imagem destacada (og:image)</Label><Input value={settings.ogImageUrl} onChange={e => setSettings({ ...settings, ogImageUrl: e.target.value })} className="mt-1 rounded-xl" placeholder="https://..." /><p className="text-[10px] text-muted-foreground mt-1">Tamanho recomendado: 1200×630px. Usada por redes sociais e motores de busca.</p></div>
                  {settings.ogImageUrl && (
                    <div className="rounded-xl overflow-hidden border border-border">
                      <img src={settings.ogImageUrl} alt="OG Preview" className="w-full h-32 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  )}
                  <div><Label className="text-sm font-medium">URL canônica</Label><Input value={settings.canonicalUrl} onChange={e => setSettings({ ...settings, canonicalUrl: e.target.value })} className="mt-1 rounded-xl" placeholder="https://mamyboo.vercel.app" /></div>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <p className="text-xs font-semibold text-foreground">Informações técnicas</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted/40 rounded-xl p-3">
                      <p className="text-[10px] text-muted-foreground">Versão</p>
                      <p className="text-sm font-medium text-foreground">1.0.0</p>
                    </div>
                    <div className="bg-muted/40 rounded-xl p-3">
                      <p className="text-[10px] text-muted-foreground">Plataforma</p>
                      <p className="text-sm font-medium text-foreground">Web (PWA)</p>
                    </div>
                    <div className="bg-muted/40 rounded-xl p-3">
                      <p className="text-[10px] text-muted-foreground">Hospedagem</p>
                      <p className="text-sm font-medium text-foreground">Vercel</p>
                    </div>
                    <div className="bg-muted/40 rounded-xl p-3">
                      <p className="text-[10px] text-muted-foreground">Backend</p>
                      <p className="text-sm font-medium text-foreground">Supabase</p>
                    </div>
                  </div>
                  <div className="bg-muted/40 rounded-xl p-3">
                    <p className="text-[10px] text-muted-foreground">URL de produção</p>
                    <p className="text-sm font-medium text-foreground truncate">{settings.canonicalUrl || "https://mamyboo.vercel.app"}</p>
                  </div>
                  <div className="bg-muted/40 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-muted-foreground">Usuárias cadastradas</p>
                        <p className="text-sm font-medium text-foreground">{stats.totalUsers}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Planos ativos</p>
                        <p className="text-sm font-medium text-foreground">{stats.activeUsers}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Conteúdos</p>
                        <p className="text-sm font-medium text-foreground">{weekContents.length + symptomsData.length + exercisesData.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {editSettingType === "plans" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">Planos cadastrados</p>
                  <Button size="sm" className="rounded-xl" onClick={() => {
                    setEditingPlan({ name: "", slug: "", description: "", price: "", price_label: "pagamento único", badge: "", icon: "BookOpen", features: [], excluded_features: [], checkout_url: "#", button_text: "Quero começar", highlighted: false, active: true, display_order: plansData.length, highlight_text: "", featuresText: "", excludedText: "" });
                    setEditPlanOpen(true);
                    setEditSettingOpen(false);
                  }}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Novo plano
                  </Button>
                </div>
                {loadingPlans ? (
                  <div className="flex justify-center py-4"><SpinnerGap className="w-5 h-5 animate-spin text-muted-foreground" /></div>
                ) : plansData.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Nenhum plano cadastrado.</p>
                ) : (
                  plansData.map(plan => (
                    <div key={plan.id} className="bg-muted/40 rounded-xl p-3 flex items-center justify-between group">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm text-foreground">{plan.name}</p>
                          {plan.highlighted && <Badge className="text-[10px] bg-primary/10 text-primary border-0">Destaque</Badge>}
                          {!plan.active && <Badge variant="outline" className="text-[10px]">Inativo</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{plan.price} · {plan.features.length} recursos</p>
                      </div>
                      <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => {
                          setEditingPlan({ ...plan, featuresText: (plan.features || []).join("\n"), excludedText: (plan.excluded_features || []).join("\n") });
                          setEditPlanOpen(true);
                          setEditSettingOpen(false);
                        }}>
                          <PencilSimple className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:text-destructive" onClick={async () => {
                          if (!confirm(`Excluir plano "${plan.name}"?`)) return;
                          try { await deletePlanMut.mutateAsync(plan.id); toast.success("Plano excluído!"); } catch { toast.error("Erro ao excluir plano"); }
                        }}>
                          <Trash className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            {editSettingType === "push" && (
              <>
                <div className="flex items-center justify-between"><Label className="text-sm font-medium">Notificações ativas</Label><Switch checked={settings.pushEnabled} onCheckedChange={v => setSettings({ ...settings, pushEnabled: v })} /></div>
                <div><Label className="text-sm font-medium">Frequência</Label>
                  <select value={settings.pushFrequency} onChange={e => setSettings({ ...settings, pushFrequency: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm">
                    <option value="diária">Diária</option><option value="semanal">Semanal</option><option value="quinzenal">Quinzenal</option>
                  </select>
                </div>
                <div className="border-t border-border pt-4 space-y-3">
                  <p className="text-xs font-semibold text-foreground">Horários de envio</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label className="text-[11px]">Manhã</Label><Input type="time" defaultValue="08:00" className="mt-1 rounded-xl" /></div>
                    <div><Label className="text-[11px]">Noite</Label><Input type="time" defaultValue="20:00" className="mt-1 rounded-xl" /></div>
                  </div>
                </div>
                <div className="border-t border-border pt-4 space-y-3">
                  <p className="text-xs font-semibold text-foreground">Tipos de notificação</p>
                  <div className="space-y-2">
                    {[
                      { label: "Dica semanal", desc: "Envia dica ao início de cada semana" },
                      { label: "Lembrete de humor", desc: "Lembra de registrar como está se sentindo" },
                      { label: "Atualização do bebê", desc: "Informa desenvolvimento do bebê" },
                      { label: "Promoções", desc: "Ofertas e novidades do app" },
                    ].map((n) => (
                      <div key={n.label} className="flex items-center justify-between bg-muted/40 rounded-xl p-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">{n.label}</p>
                          <p className="text-[10px] text-muted-foreground">{n.desc}</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-[10px] text-muted-foreground">⚠️ Push notifications requerem configuração de Service Worker (PWA). As configurações acima serão aplicadas quando o recurso estiver habilitado.</p>
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
                <div className="bg-muted/50 rounded-xl p-3"><p className="text-[10px] text-muted-foreground">Os dados estão sendo persistidos no Supabase com backups diários automáticos.</p></div>
                <div className="border-t border-border pt-4 space-y-3">
                  <p className="text-xs font-semibold text-foreground">Exportar dados</p>
                  <p className="text-[10px] text-muted-foreground">Baixe os dados das tabelas em formato JSON.</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Usuárias", table: "user_profiles" },
                      { label: "Semanas", table: "week_contents" },
                      { label: "Sintomas", table: "symptoms" },
                      { label: "Exercícios", table: "exercises" },
                      { label: "Dicas de Saúde", table: "health_tips" },
                      { label: "Planos", table: "plans" },
                    ].map(item => (
                      <Button key={item.table} variant="outline" size="sm" className="rounded-xl text-xs justify-start" onClick={async () => {
                        try {
                          const { data, error } = await supabase.from(item.table as any).select("*");
                          if (error) throw error;
                          const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url; a.download = `${item.table}_${new Date().toISOString().slice(0, 10)}.json`; a.click();
                          URL.revokeObjectURL(url);
                          toast.success(`${item.label} exportado!`);
                        } catch { toast.error(`Erro ao exportar ${item.label}`); }
                      }}>
                        <DownloadSimple className="w-3.5 h-3.5 mr-1.5" /> {item.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}
            <div className="flex gap-2 pt-2">
              <Button className="flex-1 rounded-xl" onClick={() => {
                if (editSettingType === "integrations") {
                  handleSaveAiSettings();
                } else {
                  // Persist settings to localStorage
                  localStorage.setItem("admin_app_settings", JSON.stringify(settings));
                  // Update meta tags dynamically
                  if (settings.seoTitle) {
                    document.title = settings.seoTitle;
                    document.querySelector('meta[property="og:title"]')?.setAttribute("content", settings.seoTitle);
                    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", settings.seoTitle);
                  }
                  if (settings.seoDescription) {
                    document.querySelector('meta[name="description"]')?.setAttribute("content", settings.seoDescription);
                    document.querySelector('meta[property="og:description"]')?.setAttribute("content", settings.seoDescription);
                    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", settings.seoDescription);
                  }
                  if (settings.ogImageUrl) {
                    document.querySelector('meta[property="og:image"]')?.setAttribute("content", settings.ogImageUrl);
                    document.querySelector('meta[name="twitter:image"]')?.setAttribute("content", settings.ogImageUrl);
                  }
                  toast.success("Configurações salvas com sucesso!");
                  setEditSettingOpen(false);
                }
              }} disabled={aiLoading}>
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
            <div>
              <Label className="text-sm font-medium">Senha (opcional)</Label>
              <p className="text-[10px] text-muted-foreground mb-1">Se informada, a conta é criada com login imediato. Caso contrário, um convite será enviado por email.</p>
              <Input type="text" value={newUserData.password} onChange={e => setNewUserData({ ...newUserData, password: e.target.value })} className="mt-1 rounded-xl" placeholder="Mínimo 6 caracteres" />
            </div>
            <div><Label className="text-sm font-medium">Plano</Label>
              <select
                value={newUserData.plan}
                onChange={e => setNewUserData({ ...newUserData, plan: e.target.value, plan_status: "active" })}
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

      {/* View Profile Dialog */}
      <Dialog open={viewProfileOpen} onOpenChange={setViewProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-primary" weight="duotone" />
              Perfil da Gestante
            </DialogTitle>
            <DialogDescription>Informações do perfil de gestação.</DialogDescription>
          </DialogHeader>
          {viewProfileLoading ? (
            <div className="flex justify-center py-8"><SpinnerGap className="w-6 h-6 animate-spin text-primary" /></div>
          ) : !viewingProfile ? (
            <div className="text-center py-8 text-muted-foreground">
              <UserCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Esta usuária ainda não completou o cadastro.</p>
            </div>
          ) : (
            <div className="space-y-3 mt-2">
              <div className="bg-muted/40 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-foreground">{viewingProfile.name || "Sem nome"}</p>
                <p className="text-xs text-muted-foreground">{viewingProfile.age} anos</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Data prevista", value: viewingProfile.due_date ? new Date(viewingProfile.due_date).toLocaleDateString("pt-BR") : "—" },
                  { label: "Primeira gestação", value: viewingProfile.first_pregnancy ? "Sim" : "Não" },
                  { label: "Trabalhando", value: viewingProfile.working ? "Sim" : "Não" },
                  { label: "Acompanhamento médico", value: viewingProfile.has_medical_care ? "Sim" : "Não" },
                  { label: "Foco", value: viewingProfile.focus === "physical" ? "Físico" : viewingProfile.focus === "emotional" ? "Emocional" : "Ambos" },
                  { label: "Nível emocional", value: `${viewingProfile.emotional_level}/5` },
                ].map(item => (
                  <div key={item.label} className="bg-muted/30 rounded-lg p-2.5">
                    <p className="text-[10px] text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
              {viewingProfile.current_symptoms?.length > 0 && (
                <div className="bg-muted/30 rounded-lg p-2.5">
                  <p className="text-[10px] text-muted-foreground mb-1">Sintomas</p>
                  <div className="flex flex-wrap gap-1">
                    {viewingProfile.current_symptoms.map((s: string) => (
                      <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
