import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FileText, Users, Settings, BookOpen, AlertCircle,
  Activity, Heart, Bot, BarChart3, Plus, Edit, Trash2, Eye, ArrowLeft,
  TrendingUp, UserCheck, Calendar, Search, Save, X, Layers, Menu,
  Bell, CreditCard, Link2, Database, Monitor
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import cardJourney from "@/assets/card-journey.png";
import cardSymptoms from "@/assets/card-symptoms.png";
import cardExercises from "@/assets/card-exercises.png";
import cardHealth from "@/assets/card-health.png";
import cardDiary from "@/assets/card-diary.png";
import cardAssistant from "@/assets/card-assistant.png";

// Mock data
const mockStats = {
  totalUsers: 2847,
  activeUsers: 1623,
  newToday: 34,
  avgWeek: 18,
};

const initialWeekContents = Array.from({ length: 40 }, (_, i) => ({
  week: i + 1,
  status: i < 20 ? "published" : i < 30 ? "draft" : "empty" as string,
  lastUpdated: i < 20 ? "2026-02-28" : i < 30 ? "2026-02-15" : null,
  reviewed: i < 15,
  babyDevelopment: i < 20 ? `Conteúdo de desenvolvimento do bebê na semana ${i + 1}.` : "",
  motherChanges: i < 20 ? `Mudanças no corpo da mãe na semana ${i + 1}.` : "",
  tip: i < 20 ? `Dica prática para a semana ${i + 1}.` : "",
  symptoms: i < 20 ? `Sintomas comuns na semana ${i + 1}.` : "",
}));

const mockUsers = [
  { id: 1, name: "Camila Santos", email: "camila@email.com", week: 28, joined: "2026-01-15", active: true },
  { id: 2, name: "Juliana Martins", email: "juliana@email.com", week: 16, joined: "2026-02-01", active: true },
  { id: 3, name: "Ana Paula Reis", email: "ana@email.com", week: 34, joined: "2025-12-20", active: true },
  { id: 4, name: "Beatriz Lima", email: "beatriz@email.com", week: 12, joined: "2026-02-20", active: false },
  { id: 5, name: "Fernanda Costa", email: "fernanda@email.com", week: 22, joined: "2026-01-28", active: true },
];

const mockSymptoms = [
  { id: 1, name: "Náusea", trimester: [1], alertLevel: "low", description: "Enjoo matinal comum no primeiro trimestre." },
  { id: 2, name: "Dor lombar", trimester: [2, 3], alertLevel: "moderate", description: "Dor nas costas causada pelo peso extra." },
  { id: 3, name: "Inchaço", trimester: [3], alertLevel: "moderate", description: "Inchaço nos pés e tornozelos." },
  { id: 4, name: "Azia", trimester: [2, 3], alertLevel: "low", description: "Sensação de queimação no estômago." },
  { id: 5, name: "Cansaço", trimester: [1, 3], alertLevel: "low", description: "Fadiga excessiva comum na gestação." },
];

const mockExercises = [
  { id: 1, name: "Respiração Diafragmática", trimester: [1, 2, 3], intensity: "Leve", description: "Exercício de respiração para relaxamento." },
  { id: 2, name: "Caminhada Leve", trimester: [1, 2, 3], intensity: "Leve", description: "Caminhada em ritmo confortável." },
  { id: 3, name: "Agachamento com Apoio", trimester: [2, 3], intensity: "Moderado", description: "Fortalece pernas e prepara para o parto." },
  { id: 4, name: "Exercício de Kegel", trimester: [1, 2, 3], intensity: "Leve", description: "Fortalece o assoalho pélvico." },
  { id: 5, name: "Yoga Pré-natal", trimester: [1, 2, 3], intensity: "Leve", description: "Posturas suaves para flexibilidade." },
];

const mockTips = [
  { id: 1, week: 4, title: "Ácido fólico", content: "Inicie o uso de ácido fólico o quanto antes." },
  { id: 2, week: 8, title: "Primeira consulta", content: "Agende sua primeira consulta de pré-natal." },
  { id: 3, week: 12, title: "Ecografia", content: "Realize a ultrassonografia morfológica do primeiro trimestre." },
  { id: 4, week: 20, title: "Morfológica", content: "Hora da ultrassonografia morfológica do segundo trimestre." },
  { id: 5, week: 28, title: "Teste de glicose", content: "Realize o teste de tolerância à glicose." },
];

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  image: string;
  visible: boolean;
  order: number;
}

const initialCards: DashboardCard[] = [
  { id: "journey", title: "Minha Jornada", description: "Semana a semana", icon: "BookOpen", path: "/jornada", image: cardJourney, visible: true, order: 1 },
  { id: "symptoms", title: "Sintomas", description: "Guia completo", icon: "AlertCircle", path: "/sintomas", image: cardSymptoms, visible: true, order: 2 },
  { id: "exercises", title: "Exercícios", description: "Atividades por trimestre", icon: "Activity", path: "/exercicios", image: cardExercises, visible: true, order: 3 },
  { id: "health", title: "Saúde Integral", description: "Corpo e mente", icon: "Heart", path: "/saude", image: cardHealth, visible: true, order: 4 },
  { id: "diary", title: "Diário", description: "Registros e progresso", icon: "BarChart3", path: "/diario", image: cardDiary, visible: true, order: 5 },
  { id: "assistant", title: "Assistente IA", description: "Tire dúvidas", icon: "Bot", path: "/assistente", image: cardAssistant, visible: true, order: 6 },
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

const sidebarItems = [
  { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
  { id: "cards", label: "Cards", icon: Layers },
  { id: "content", label: "Conteúdos", icon: FileText },
  { id: "users", label: "Usuárias", icon: Users },
  { id: "settings", label: "Configurações", icon: Settings },
];

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cards state
  const [cards, setCards] = useState<DashboardCard[]>(initialCards);
  const [editingCard, setEditingCard] = useState<DashboardCard | null>(null);
  const [editCardOpen, setEditCardOpen] = useState(false);

  // Week content state
  const [weekContents, setWeekContents] = useState(initialWeekContents);
  const [editingWeek, setEditingWeek] = useState<typeof initialWeekContents[0] | null>(null);
  const [editWeekOpen, setEditWeekOpen] = useState(false);
  const [viewWeekOpen, setViewWeekOpen] = useState(false);
  const [viewingWeek, setViewingWeek] = useState<typeof initialWeekContents[0] | null>(null);

  // Symptom editing
  const [editingSymptom, setEditingSymptom] = useState<typeof mockSymptoms[0] | null>(null);
  const [editSymptomOpen, setEditSymptomOpen] = useState(false);

  // Exercise editing
  const [editingExercise, setEditingExercise] = useState<typeof mockExercises[0] | null>(null);
  const [editExerciseOpen, setEditExerciseOpen] = useState(false);

  // Tip editing
  const [editingTip, setEditingTip] = useState<typeof mockTips[0] | null>(null);
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

  const filteredUsers = mockUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Card handlers
  const handleEditCard = (card: DashboardCard) => {
    setEditingCard({ ...card });
    setEditCardOpen(true);
  };
  const handleSaveCard = () => {
    if (!editingCard) return;
    setCards(prev => prev.map(c => c.id === editingCard.id ? editingCard : c));
    setEditCardOpen(false);
    setEditingCard(null);
  };
  const handleToggleVisibility = (id: string) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, visible: !c.visible } : c));
  };

  // Week handlers
  const handleViewWeek = (w: typeof initialWeekContents[0]) => {
    setViewingWeek(w);
    setViewWeekOpen(true);
  };
  const handleEditWeek = (w: typeof initialWeekContents[0]) => {
    setEditingWeek({ ...w });
    setEditWeekOpen(true);
  };
  const handleSaveWeek = () => {
    if (!editingWeek) return;
    setWeekContents(prev => prev.map(w => w.week === editingWeek.week ? { ...editingWeek, status: editingWeek.babyDevelopment ? "draft" : "empty", lastUpdated: "2026-03-02" } : w));
    setEditWeekOpen(false);
    setEditingWeek(null);
  };
  const handleDeleteWeekContent = (weekNum: number) => {
    setWeekContents(prev => prev.map(w => w.week === weekNum ? { ...w, status: "empty", babyDevelopment: "", motherChanges: "", tip: "", symptoms: "", lastUpdated: null, reviewed: false } : w));
  };

  // Setting handlers
  const openSetting = (type: string) => {
    setEditSettingType(type);
    setEditSettingOpen(true);
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 mb-8 px-2">
        <LayoutDashboard className="w-6 h-6 text-primary" />
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
                  <Menu className="w-5 h-5" />
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
                { label: "Novas Hoje", value: `+${mockStats.newToday}`, icon: TrendingUp, color: "text-blue-600" },
                { label: "Semana Média", value: `${mockStats.avgWeek}ª`, icon: Calendar, color: "text-orange-600" },
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
              <h3 className="font-semibold text-foreground mb-4">Atividade Recente</h3>
              <div className="space-y-3">
                {[
                  { text: "Camila Santos registrou humor: 😊", time: "Há 5 min" },
                  { text: "Nova usuária: Beatriz Lima", time: "Há 2h" },
                  { text: "Conteúdo da Semana 21 atualizado", time: "Há 4h" },
                  { text: "Juliana Martins usou o assistente IA", time: "Há 6h" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <p className="text-sm text-foreground">{activity.text}</p>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-4">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== CARDS ===== */}
        {activeTab === "cards" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold font-display text-foreground">Cards do Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Gerencie os cards exibidos no dashboard das gestantes.</p>
            </div>

            <div className="grid gap-4">
              {cards.sort((a, b) => a.order - b.order).map(card => (
                <div key={card.id} className={`bg-card rounded-2xl border border-border shadow-card overflow-hidden transition-opacity ${!card.visible ? "opacity-50" : ""}`}>
                  <div className="flex flex-col sm:flex-row sm:items-stretch">
                    <div className="w-full sm:w-32 h-32 sm:h-28 flex-shrink-0 overflow-hidden">
                      <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
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
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleToggleVisibility(card.id)}>
                          <Eye className={`w-4 h-4 ${!card.visible ? "text-muted-foreground" : ""}`} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                <TabsTrigger value="tips" className="rounded-lg text-xs sm:text-sm">Dicas</TabsTrigger>
              </TabsList>

              {/* Weeks tab */}
              <TabsContent value="weeks" className="mt-4">
                <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                  {/* Desktop header */}
                  <div className="hidden sm:grid grid-cols-[60px_1fr_100px_80px_120px] gap-2 p-4 border-b border-border text-xs font-medium text-muted-foreground">
                    <span>Semana</span>
                    <span>Status</span>
                    <span>Atualizado</span>
                    <span>Revisado</span>
                    <span>Ações</span>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto">
                    {weekContents.map(w => (
                      <div key={w.week} className="p-4 border-b border-border last:border-0">
                        {/* Mobile layout */}
                        <div className="sm:hidden flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-sm text-foreground w-8">S{w.week}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              w.status === "published" ? "bg-green-100 text-green-700" :
                              w.status === "draft" ? "bg-yellow-100 text-yellow-700" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              {w.status === "published" ? "Publicado" : w.status === "draft" ? "Rascunho" : "Vazio"}
                            </span>
                            {w.reviewed && <span className="text-xs text-green-600">✓</span>}
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewWeek(w)}><Eye className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditWeek(w)}><Edit className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteWeekContent(w.week)}><Trash2 className="w-3.5 h-3.5" /></Button>
                          </div>
                        </div>
                        {/* Desktop layout */}
                        <div className="hidden sm:grid grid-cols-[60px_1fr_100px_80px_120px] gap-2 items-center">
                          <span className="font-semibold text-sm text-foreground">{w.week}</span>
                          <span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              w.status === "published" ? "bg-green-100 text-green-700" :
                              w.status === "draft" ? "bg-yellow-100 text-yellow-700" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              {w.status === "published" ? "Publicado" : w.status === "draft" ? "Rascunho" : "Vazio"}
                            </span>
                          </span>
                          <span className="text-xs text-muted-foreground">{w.lastUpdated || "—"}</span>
                          <span>{w.reviewed ? <span className="text-xs text-green-600">✓ Sim</span> : <span className="text-xs text-muted-foreground">Não</span>}</span>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewWeek(w)}><Eye className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditWeek(w)}><Edit className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteWeekContent(w.week)}><Trash2 className="w-3.5 h-3.5" /></Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Symptoms tab */}
              <TabsContent value="symptoms" className="mt-4">
                <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Sintomas cadastrados</span>
                    <Button size="sm" className="rounded-xl" onClick={() => { setEditingSymptom({ id: 0, name: "", trimester: [1], alertLevel: "low", description: "" }); setEditSymptomOpen(true); }}>
                      <Plus className="w-4 h-4 mr-1" /> Novo
                    </Button>
                  </div>
                  <div className="divide-y divide-border">
                    {mockSymptoms.map(s => (
                      <div key={s.id} className="p-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-foreground">{s.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{s.description}</p>
                          <div className="flex gap-1 mt-1">
                            {s.trimester.map(t => (
                              <span key={t} className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">{t}° tri</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingSymptom({ ...s }); setEditSymptomOpen(true); }}><Edit className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Exercises tab */}
              <TabsContent value="exercises" className="mt-4">
                <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Exercícios cadastrados</span>
                    <Button size="sm" className="rounded-xl" onClick={() => { setEditingExercise({ id: 0, name: "", trimester: [1], intensity: "Leve", description: "" }); setEditExerciseOpen(true); }}>
                      <Plus className="w-4 h-4 mr-1" /> Novo
                    </Button>
                  </div>
                  <div className="divide-y divide-border">
                    {mockExercises.map(ex => (
                      <div key={ex.id} className="p-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-foreground">{ex.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{ex.description}</p>
                          <div className="flex gap-1 mt-1">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${ex.intensity === "Leve" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{ex.intensity}</span>
                            {ex.trimester.map(t => (
                              <span key={t} className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">{t}° tri</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingExercise({ ...ex }); setEditExerciseOpen(true); }}><Edit className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Tips tab */}
              <TabsContent value="tips" className="mt-4">
                <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Dicas cadastradas</span>
                    <Button size="sm" className="rounded-xl" onClick={() => { setEditingTip({ id: 0, week: 1, title: "", content: "" }); setEditTipOpen(true); }}>
                      <Plus className="w-4 h-4 mr-1" /> Nova
                    </Button>
                  </div>
                  <div className="divide-y divide-border">
                    {mockTips.map(tip => (
                      <div key={tip.id} className="p-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-foreground">{tip.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{tip.content}</p>
                          <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground mt-1 inline-block">Semana {tip.week}</span>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingTip({ ...tip }); setEditTipOpen(true); }}><Edit className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome ou email..." className="pl-10 rounded-xl" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              {/* Desktop header */}
              <div className="hidden md:grid grid-cols-[1fr_1fr_80px_100px_60px] gap-2 p-4 border-b border-border text-xs font-medium text-muted-foreground">
                <span>Nome</span>
                <span>Email</span>
                <span>Semana</span>
                <span>Cadastro</span>
                <span>Status</span>
              </div>
              {filteredUsers.map(user => (
                <div key={user.id} className="p-4 border-b border-border last:border-0">
                  {/* Mobile */}
                  <div className="md:hidden flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">Semana {user.week}ª · {user.joined}</p>
                    </div>
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${user.active ? "bg-green-500" : "bg-muted-foreground/40"}`} />
                  </div>
                  {/* Desktop */}
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
                { type: "integrations", icon: Link2, title: "Integrações", description: `Analytics: ${settings.analyticsEnabled ? "Ativo" : "Inativo"}` },
                { type: "backup", icon: Database, title: "Backup e Exportação", description: settings.backupEnabled ? "Backup automático ativo" : "Backup desativado" },
              ].map(setting => (
                <div key={setting.type} className="bg-card rounded-2xl p-4 md:p-5 border border-border shadow-card flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <setting.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm text-foreground">{setting.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{setting.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl flex-shrink-0" onClick={() => openSetting(setting.type)}>
                    Configurar
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      {/* ===== DIALOGS ===== */}

      {/* Edit Card Dialog */}
      <Dialog open={editCardOpen} onOpenChange={setEditCardOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Card: {editingCard?.title}</DialogTitle>
            <DialogDescription>Altere as informações do card do dashboard.</DialogDescription>
          </DialogHeader>
          {editingCard && (
            <div className="space-y-4 mt-2">
              <div className="rounded-xl overflow-hidden border border-border">
                <img src={editingCard.image} alt={editingCard.title} className="w-full h-40 object-cover" />
              </div>
              <div>
                <Label className="text-sm font-medium">URL da Imagem</Label>
                <Input value={editingCard.image} onChange={e => setEditingCard({ ...editingCard, image: e.target.value })} placeholder="URL da imagem" className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label className="text-sm font-medium">Título</Label>
                <Input value={editingCard.title} onChange={e => setEditingCard({ ...editingCard, title: e.target.value })} className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label className="text-sm font-medium">Descrição</Label>
                <Textarea value={editingCard.description} onChange={e => setEditingCard({ ...editingCard, description: e.target.value })} className="mt-1 rounded-xl" rows={2} />
              </div>
              <div>
                <Label className="text-sm font-medium">Rota</Label>
                <Input value={editingCard.path} onChange={e => setEditingCard({ ...editingCard, path: e.target.value })} className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label className="text-sm font-medium">Ordem de exibição</Label>
                <Input type="number" value={editingCard.order} onChange={e => setEditingCard({ ...editingCard, order: parseInt(e.target.value) || 1 })} className="mt-1 rounded-xl" min={1} max={10} />
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 rounded-xl" onClick={handleSaveCard}><Save className="w-4 h-4 mr-2" /> Salvar</Button>
                <Button variant="outline" className="rounded-xl" onClick={() => setEditCardOpen(false)}><X className="w-4 h-4 mr-2" /> Cancelar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Week Dialog */}
      <Dialog open={viewWeekOpen} onOpenChange={setViewWeekOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Semana {viewingWeek?.week} — Visualização</DialogTitle>
            <DialogDescription>Conteúdo atualmente salvo para esta semana.</DialogDescription>
          </DialogHeader>
          {viewingWeek && (
            <div className="space-y-4 mt-2">
              {[
                { label: "Desenvolvimento do bebê", value: viewingWeek.babyDevelopment },
                { label: "Mudanças no corpo", value: viewingWeek.motherChanges },
                { label: "Sintomas comuns", value: viewingWeek.symptoms },
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
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Week Dialog */}
      <Dialog open={editWeekOpen} onOpenChange={setEditWeekOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Semana {editingWeek?.week}</DialogTitle>
            <DialogDescription>Edite o conteúdo exibido para esta semana.</DialogDescription>
          </DialogHeader>
          {editingWeek && (
            <div className="space-y-4 mt-2">
              <div>
                <Label className="text-sm font-medium">Desenvolvimento do bebê</Label>
                <Textarea value={editingWeek.babyDevelopment} onChange={e => setEditingWeek({ ...editingWeek, babyDevelopment: e.target.value })} className="mt-1 rounded-xl" rows={3} />
              </div>
              <div>
                <Label className="text-sm font-medium">Mudanças no corpo da mãe</Label>
                <Textarea value={editingWeek.motherChanges} onChange={e => setEditingWeek({ ...editingWeek, motherChanges: e.target.value })} className="mt-1 rounded-xl" rows={3} />
              </div>
              <div>
                <Label className="text-sm font-medium">Sintomas comuns</Label>
                <Textarea value={editingWeek.symptoms} onChange={e => setEditingWeek({ ...editingWeek, symptoms: e.target.value })} className="mt-1 rounded-xl" rows={2} />
              </div>
              <div>
                <Label className="text-sm font-medium">Dica prática</Label>
                <Textarea value={editingWeek.tip} onChange={e => setEditingWeek({ ...editingWeek, tip: e.target.value })} className="mt-1 rounded-xl" rows={2} />
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={editingWeek.reviewed} onCheckedChange={v => setEditingWeek({ ...editingWeek, reviewed: v })} />
                <Label className="text-sm">Marcado como revisado</Label>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 rounded-xl" onClick={handleSaveWeek}><Save className="w-4 h-4 mr-2" /> Salvar</Button>
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
            <DialogTitle>{editingSymptom?.id === 0 ? "Novo Sintoma" : `Editar: ${editingSymptom?.name}`}</DialogTitle>
            <DialogDescription>Preencha as informações do sintoma.</DialogDescription>
          </DialogHeader>
          {editingSymptom && (
            <div className="space-y-4 mt-2">
              <div>
                <Label className="text-sm font-medium">Nome</Label>
                <Input value={editingSymptom.name} onChange={e => setEditingSymptom({ ...editingSymptom, name: e.target.value })} className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label className="text-sm font-medium">Descrição</Label>
                <Textarea value={editingSymptom.description} onChange={e => setEditingSymptom({ ...editingSymptom, description: e.target.value })} className="mt-1 rounded-xl" rows={3} />
              </div>
              <div>
                <Label className="text-sm font-medium">Nível de alerta</Label>
                <select
                  value={editingSymptom.alertLevel}
                  onChange={e => setEditingSymptom({ ...editingSymptom, alertLevel: e.target.value })}
                  className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
                >
                  <option value="low">Baixo</option>
                  <option value="moderate">Moderado</option>
                  <option value="high">Alto</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 rounded-xl" onClick={() => setEditSymptomOpen(false)}><Save className="w-4 h-4 mr-2" /> Salvar</Button>
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
            <DialogTitle>{editingExercise?.id === 0 ? "Novo Exercício" : `Editar: ${editingExercise?.name}`}</DialogTitle>
            <DialogDescription>Preencha as informações do exercício.</DialogDescription>
          </DialogHeader>
          {editingExercise && (
            <div className="space-y-4 mt-2">
              <div>
                <Label className="text-sm font-medium">Nome</Label>
                <Input value={editingExercise.name} onChange={e => setEditingExercise({ ...editingExercise, name: e.target.value })} className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label className="text-sm font-medium">Descrição</Label>
                <Textarea value={editingExercise.description} onChange={e => setEditingExercise({ ...editingExercise, description: e.target.value })} className="mt-1 rounded-xl" rows={3} />
              </div>
              <div>
                <Label className="text-sm font-medium">Intensidade</Label>
                <select
                  value={editingExercise.intensity}
                  onChange={e => setEditingExercise({ ...editingExercise, intensity: e.target.value })}
                  className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
                >
                  <option value="Leve">Leve</option>
                  <option value="Moderado">Moderado</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 rounded-xl" onClick={() => setEditExerciseOpen(false)}><Save className="w-4 h-4 mr-2" /> Salvar</Button>
                <Button variant="outline" className="rounded-xl" onClick={() => setEditExerciseOpen(false)}><X className="w-4 h-4 mr-2" /> Cancelar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Tip Dialog */}
      <Dialog open={editTipOpen} onOpenChange={setEditTipOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTip?.id === 0 ? "Nova Dica" : `Editar: ${editingTip?.title}`}</DialogTitle>
            <DialogDescription>Preencha as informações da dica.</DialogDescription>
          </DialogHeader>
          {editingTip && (
            <div className="space-y-4 mt-2">
              <div>
                <Label className="text-sm font-medium">Título</Label>
                <Input value={editingTip.title} onChange={e => setEditingTip({ ...editingTip, title: e.target.value })} className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label className="text-sm font-medium">Semana</Label>
                <Input type="number" value={editingTip.week} onChange={e => setEditingTip({ ...editingTip, week: parseInt(e.target.value) || 1 })} className="mt-1 rounded-xl" min={1} max={40} />
              </div>
              <div>
                <Label className="text-sm font-medium">Conteúdo</Label>
                <Textarea value={editingTip.content} onChange={e => setEditingTip({ ...editingTip, content: e.target.value })} className="mt-1 rounded-xl" rows={4} />
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 rounded-xl" onClick={() => setEditTipOpen(false)}><Save className="w-4 h-4 mr-2" /> Salvar</Button>
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
              {editSettingType === "integrations" && "Integrações"}
              {editSettingType === "backup" && "Backup e Exportação"}
            </DialogTitle>
            <DialogDescription>Gerencie esta configuração.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {editSettingType === "app" && (
              <>
                <div>
                  <Label className="text-sm font-medium">Nome do app</Label>
                  <Input value={settings.appName} onChange={e => setSettings({ ...settings, appName: e.target.value })} className="mt-1 rounded-xl" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Descrição</Label>
                  <Textarea value={settings.appDescription} onChange={e => setSettings({ ...settings, appDescription: e.target.value })} className="mt-1 rounded-xl" rows={3} />
                </div>
              </>
            )}
            {editSettingType === "plans" && (
              <>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Plano gratuito ativo</Label>
                  <Switch checked={settings.planFreeEnabled} onCheckedChange={v => setSettings({ ...settings, planFreeEnabled: v })} />
                </div>
                <div>
                  <Label className="text-sm font-medium">Preço do Premium (R$/mês)</Label>
                  <Input value={settings.planPremiumPrice} onChange={e => setSettings({ ...settings, planPremiumPrice: e.target.value })} className="mt-1 rounded-xl" />
                </div>
              </>
            )}
            {editSettingType === "push" && (
              <>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Notificações ativas</Label>
                  <Switch checked={settings.pushEnabled} onCheckedChange={v => setSettings({ ...settings, pushEnabled: v })} />
                </div>
                <div>
                  <Label className="text-sm font-medium">Frequência</Label>
                  <select
                    value={settings.pushFrequency}
                    onChange={e => setSettings({ ...settings, pushFrequency: e.target.value })}
                    className="mt-1 w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
                  >
                    <option value="diária">Diária</option>
                    <option value="semanal">Semanal</option>
                    <option value="quinzenal">Quinzenal</option>
                  </select>
                </div>
              </>
            )}
            {editSettingType === "integrations" && (
              <>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Google Analytics</Label>
                  <Switch checked={settings.analyticsEnabled} onCheckedChange={v => setSettings({ ...settings, analyticsEnabled: v })} />
                </div>
                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground">Integrações com pagamento e email serão configuradas após conectar o backend.</p>
                </div>
              </>
            )}
            {editSettingType === "backup" && (
              <>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Backup automático</Label>
                  <Switch checked={settings.backupEnabled} onCheckedChange={v => setSettings({ ...settings, backupEnabled: v })} />
                </div>
                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground">Exportação de dados estará disponível após conectar o backend.</p>
                </div>
              </>
            )}
            <div className="flex gap-2 pt-2">
              <Button className="flex-1 rounded-xl" onClick={() => setEditSettingOpen(false)}><Save className="w-4 h-4 mr-2" /> Salvar</Button>
              <Button variant="outline" className="rounded-xl" onClick={() => setEditSettingOpen(false)}><X className="w-4 h-4 mr-2" /> Cancelar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
