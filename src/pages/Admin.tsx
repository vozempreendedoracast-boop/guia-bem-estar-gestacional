import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FileText, Users, Settings, BookOpen, AlertCircle,
  Activity, Heart, Bot, BarChart3, Plus, Edit, Trash2, Eye, ArrowLeft,
  TrendingUp, UserCheck, Calendar, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const mockStats = {
  totalUsers: 2847,
  activeUsers: 1623,
  newToday: 34,
  avgWeek: 18,
};

const mockWeekContents = Array.from({ length: 40 }, (_, i) => ({
  week: i + 1,
  status: i < 20 ? "published" : i < 30 ? "draft" : "empty",
  lastUpdated: i < 20 ? "2026-02-28" : i < 30 ? "2026-02-15" : null,
  reviewed: i < 15,
}));

const mockUsers = [
  { id: 1, name: "Camila Santos", email: "camila@email.com", week: 28, joined: "2026-01-15", active: true },
  { id: 2, name: "Juliana Martins", email: "juliana@email.com", week: 16, joined: "2026-02-01", active: true },
  { id: 3, name: "Ana Paula Reis", email: "ana@email.com", week: 34, joined: "2025-12-20", active: true },
  { id: 4, name: "Beatriz Lima", email: "beatriz@email.com", week: 12, joined: "2026-02-20", active: false },
  { id: 5, name: "Fernanda Costa", email: "fernanda@email.com", week: 22, joined: "2026-01-28", active: true },
];

const sidebarItems = [
  { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
  { id: "content", label: "Conteúdos", icon: FileText },
  { id: "users", label: "Usuárias", icon: Users },
  { id: "settings", label: "Configurações", icon: Settings },
];

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = mockUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border min-h-screen p-4 hidden md:block">
        <div className="flex items-center gap-2 mb-8 px-2">
          <LayoutDashboard className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-lg text-foreground">Admin</span>
        </div>
        <nav className="space-y-1">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
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
        <div className="mt-auto pt-8">
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao app
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-foreground">Admin</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-1 mt-2 overflow-x-auto pb-1">
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
      <main className="flex-1 p-6 md:p-8 mt-24 md:mt-0 overflow-auto">
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h1 className="text-2xl font-bold font-display text-foreground">Visão Geral</h1>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total de Usuárias", value: mockStats.totalUsers.toLocaleString(), icon: Users, color: "text-primary" },
                { label: "Ativas Hoje", value: mockStats.activeUsers.toLocaleString(), icon: UserCheck, color: "text-green-500" },
                { label: "Novas Hoje", value: `+${mockStats.newToday}`, icon: TrendingUp, color: "text-blue-500" },
                { label: "Semana Média", value: `${mockStats.avgWeek}ª`, icon: Calendar, color: "text-orange-500" },
              ].map(stat => (
                <div key={stat.label} className="bg-card rounded-2xl p-5 border border-border shadow-card">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Distribution chart mock */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
              <h3 className="font-semibold text-foreground mb-4">Distribuição por Trimestre</h3>
              <div className="flex items-end gap-2 h-40">
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

            {/* Recent activity */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
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

        {activeTab === "content" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold font-display text-foreground">Conteúdos</h1>
              <Button size="sm" className="rounded-xl">
                <Plus className="w-4 h-4 mr-1" /> Novo conteúdo
              </Button>
            </div>

            <Tabs defaultValue="weeks">
              <TabsList className="rounded-xl">
                <TabsTrigger value="weeks" className="rounded-lg">Semanas</TabsTrigger>
                <TabsTrigger value="symptoms" className="rounded-lg">Sintomas</TabsTrigger>
                <TabsTrigger value="exercises" className="rounded-lg">Exercícios</TabsTrigger>
                <TabsTrigger value="tips" className="rounded-lg">Dicas</TabsTrigger>
              </TabsList>

              <TabsContent value="weeks" className="mt-4">
                <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                  <div className="grid grid-cols-[60px_1fr_100px_100px_120px] gap-2 p-4 border-b border-border text-xs font-medium text-muted-foreground">
                    <span>Semana</span>
                    <span>Status</span>
                    <span>Atualizado</span>
                    <span>Revisado</span>
                    <span>Ações</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {mockWeekContents.map(w => (
                      <div key={w.week} className="grid grid-cols-[60px_1fr_100px_100px_120px] gap-2 p-4 border-b border-border last:border-0 items-center">
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
                        <span>
                          {w.reviewed ? (
                            <span className="text-xs text-green-600">✓ Sim</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">Não</span>
                          )}
                        </span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="symptoms" className="mt-4">
                <div className="bg-card rounded-2xl p-8 border border-border shadow-card text-center">
                  <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Gestão de sintomas será habilitada com o backend.</p>
                  <Button variant="outline" size="sm" className="mt-4 rounded-xl">Em breve</Button>
                </div>
              </TabsContent>

              <TabsContent value="exercises" className="mt-4">
                <div className="bg-card rounded-2xl p-8 border border-border shadow-card text-center">
                  <Activity className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Gestão de exercícios será habilitada com o backend.</p>
                  <Button variant="outline" size="sm" className="mt-4 rounded-xl">Em breve</Button>
                </div>
              </TabsContent>

              <TabsContent value="tips" className="mt-4">
                <div className="bg-card rounded-2xl p-8 border border-border shadow-card text-center">
                  <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Gestão de dicas será habilitada com o backend.</p>
                  <Button variant="outline" size="sm" className="mt-4 rounded-xl">Em breve</Button>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}

        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h1 className="text-2xl font-bold font-display text-foreground">Usuárias</h1>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                className="pl-10 rounded-xl"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              <div className="grid grid-cols-[1fr_1fr_80px_100px_60px] gap-2 p-4 border-b border-border text-xs font-medium text-muted-foreground">
                <span>Nome</span>
                <span>Email</span>
                <span>Semana</span>
                <span>Cadastro</span>
                <span>Status</span>
              </div>
              {filteredUsers.map(user => (
                <div key={user.id} className="grid grid-cols-[1fr_1fr_80px_100px_60px] gap-2 p-4 border-b border-border last:border-0 items-center">
                  <span className="font-medium text-sm text-foreground">{user.name}</span>
                  <span className="text-sm text-muted-foreground truncate">{user.email}</span>
                  <span className="text-sm text-foreground">{user.week}ª</span>
                  <span className="text-xs text-muted-foreground">{user.joined}</span>
                  <span className={`w-2 h-2 rounded-full ${user.active ? "bg-green-500" : "bg-muted-foreground/40"}`} />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h1 className="text-2xl font-bold font-display text-foreground">Configurações</h1>

            <div className="space-y-4">
              {[
                { title: "Informações do App", description: "Nome, logo, descrição e metadados do aplicativo." },
                { title: "Planos e Assinaturas", description: "Configurar planos gratuito e premium, preços e períodos." },
                { title: "Notificações Push", description: "Configurar notificações automáticas para as gestantes." },
                { title: "Integrações", description: "Conectar com serviços externos (pagamento, email, analytics)." },
                { title: "Backup & Exportação", description: "Exportar dados e configurar backups automáticos." },
              ].map(setting => (
                <div key={setting.title} className="bg-card rounded-2xl p-5 border border-border shadow-card flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{setting.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{setting.description}</p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl flex-shrink-0">
                    Configurar
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Admin;
