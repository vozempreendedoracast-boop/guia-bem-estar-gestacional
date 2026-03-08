import { usePregnancy } from "@/contexts/PregnancyContext";
import { useAuth } from "@/contexts/AuthContext";
import { usePlan } from "@/hooks/usePlan";
import { useUnreadSupport } from "@/hooks/useUnreadSupport";
import { usePlans } from "@/hooks/useSupabaseData";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarBlank, Heart, Briefcase, Stethoscope, User, EnvelopeSimple, Phone, ChatCircleDots, Crown, Lock, Check, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import mamybooWhite from "@/assets/mamyboo-white.png";
import mamybooPink from "@/assets/mamyboo-pink.png";


const Profile = () => {
  const { profile, setProfile, currentWeek, trimester, progressPercent } = usePregnancy();
  const { user, userProfile } = useAuth();
  const { plan, planStatus, isPremium, isEssential, hasAccess } = usePlan();
  const { unreadCount: unreadSupportCount } = useUnreadSupport();
  const { data: plansData = [] } = usePlans();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: profile?.name || "",
    phone: localStorage.getItem("pregnancy_phone") || "",
    doctorName: localStorage.getItem("pregnancy_doctor_name") || "",
    doctorPhone: localStorage.getItem("pregnancy_doctor_phone") || "",
  });

  const handleSave = () => {
    if (profile) {
      setProfile({ ...profile, name: form.name });
    }
    localStorage.setItem("pregnancy_phone", form.phone);
    localStorage.setItem("pregnancy_doctor_name", form.doctorName);
    localStorage.setItem("pregnancy_doctor_phone", form.doctorPhone);
    setEditing(false);
    toast.success("Perfil atualizado!");
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 gap-4">
        <img src={mamybooPink} alt="MamyBoo" className="w-16 h-16 object-contain" />
        <p className="text-muted-foreground text-center">Você ainda não completou o cadastro.</p>
        <Button onClick={() => navigate("/cadastro")} className="rounded-xl">Completar cadastro</Button>
      </div>
    );
  }

  const dueDate = new Date(profile.dueDate);
  const userEmail = user?.email || localStorage.getItem("pregnancy_email") || "";

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="px-6 pt-6 pb-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/painel")} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold font-display">Meu Perfil</h1>
      </div>

      <div className="px-6 space-y-6">
        {/* Avatar & name */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-soft p-3">
            <img src={mamybooWhite} alt="MamyBoo" className="w-12 h-12 object-contain" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold font-display">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">Semana {currentWeek} · {trimester}° Trimestre</p>
          </div>
        </motion.div>

        {/* Progress */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-4 border border-border shadow-card">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Progresso da gestação</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full gradient-primary" initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1 }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">{40 - currentWeek} semanas restantes</p>
        </motion.div>

        {/* Info cards */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-5 border border-border shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Informações Pessoais</h3>
            <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={() => setEditing(!editing)}>
              {editing ? "Cancelar" : "Editar"}
            </Button>
          </div>

          <div className="space-y-3">
            {/* Name */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-peach flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-peach-foreground" />
              </div>
              {editing ? (
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Nome</Label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="rounded-xl h-9 text-sm" />
                </div>
              ) : (
                <div><p className="text-xs text-muted-foreground">Nome</p><p className="text-sm font-medium">{profile.name}</p></div>
              )}
            </div>

            {/* Email - read only */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-lilac flex items-center justify-center flex-shrink-0">
                <EnvelopeSimple className="w-4 h-4 text-lilac-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{userEmail || "Não informado"}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sage flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-sage-foreground" />
              </div>
              {editing ? (
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Telefone</Label>
                  <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="rounded-xl h-9 text-sm" placeholder="(11) 99999-9999" />
                </div>
              ) : (
                <div><p className="text-xs text-muted-foreground">Telefone</p><p className="text-sm font-medium">{form.phone || "Não informado"}</p></div>
              )}
            </div>

            {/* Doctor Name */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-peach flex items-center justify-center flex-shrink-0">
                <Stethoscope className="w-4 h-4 text-peach-foreground" />
              </div>
              {editing ? (
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Nome do(a) Médico(a)</Label>
                  <Input value={form.doctorName} onChange={e => setForm({ ...form, doctorName: e.target.value })} className="rounded-xl h-9 text-sm" placeholder="Dr(a). Nome" />
                </div>
              ) : (
                <div><p className="text-xs text-muted-foreground">Médico(a)</p><p className="text-sm font-medium">{form.doctorName || "Não informado"}</p></div>
              )}
            </div>

            {/* Doctor Phone */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-lilac flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-lilac-foreground" />
              </div>
              {editing ? (
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Telefone do(a) Médico(a)</Label>
                  <Input value={form.doctorPhone} onChange={e => setForm({ ...form, doctorPhone: e.target.value })} className="rounded-xl h-9 text-sm" placeholder="(11) 99999-9999" />
                </div>
              ) : (
                <div><p className="text-xs text-muted-foreground">Tel. Médico(a)</p><p className="text-sm font-medium">{form.doctorPhone || "Não informado"}</p></div>
              )}
            </div>
          </div>

          {editing && (
            <Button className="w-full rounded-xl" onClick={handleSave}>Salvar alterações</Button>
          )}
        </motion.div>

        {/* Plan info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card rounded-2xl p-5 border border-border shadow-card space-y-3">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Meu Plano</h3>
          </div>
          {(() => {
            // Find matching plan from DB
            const currentPlanSlug = plan; // "none" | "essential" | "premium"
            const dbPlan = plansData.find(p => p.slug === currentPlanSlug && p.active);

            return (
              <div className={`rounded-xl p-4 ${hasAccess ? "bg-primary/5 border border-primary/20" : "bg-muted"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {hasAccess ? <Crown className="w-5 h-5 text-primary" /> : <Lock className="w-5 h-5 text-muted-foreground" />}
                    <span className="font-bold text-sm">
                      {dbPlan ? dbPlan.name : isPremium ? "Premium" : isEssential ? "Essencial" : "Sem plano"}
                    </span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    planStatus === "active" ? "bg-primary/10 text-primary" :
                    planStatus === "expired" ? "bg-destructive/10 text-destructive" :
                    "bg-muted-foreground/10 text-muted-foreground"
                  }`}>
                    {planStatus === "active" || planStatus === "none" ? "Ativo" : planStatus === "expired" ? "Expirado" : "Inativo"}
                  </span>
                </div>

                <div className="mt-3 text-xs text-muted-foreground space-y-1.5">
                  {hasAccess && dbPlan ? (
                    <>
                      {dbPlan.features.map((feat, i) => (
                        <p key={i} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          {feat}
                        </p>
                      ))}
                      {dbPlan.excluded_features.map((feat, i) => (
                        <p key={`ex-${i}`} className="flex items-center gap-1.5 opacity-50">
                          <X className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          {feat}
                        </p>
                      ))}
                      {userProfile?.purchased_at && (
                        <p className="pt-1">📅 Início: {new Date(userProfile.purchased_at).toLocaleDateString("pt-BR")}</p>
                      )}
                      {userProfile?.expires_at && (
                        <p>📅 Válido até: {new Date(userProfile.expires_at).toLocaleDateString("pt-BR")}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <p>Você tem acesso à tela inicial do app.</p>
                      <p>Escolha um plano para desbloquear todas as ferramentas.</p>
                    </>
                  )}
                </div>
              </div>
            );
          })()}
        </motion.div>

        {/* Pregnancy info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-2xl p-5 border border-border shadow-card space-y-3">
          <h3 className="font-semibold text-sm">Dados da Gestação</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: CalendarBlank, label: "Data prevista", value: dueDate.toLocaleDateString("pt-BR"), bg: "bg-peach", color: "text-peach-foreground" },
              { icon: User, label: "Idade", value: `${profile.age} anos`, bg: "bg-lilac", color: "text-lilac-foreground" },
              { icon: Heart, label: "Primeira gestação", value: profile.firstPregnancy ? "Sim" : "Não", bg: "bg-sage", color: "text-sage-foreground" },
              { icon: Briefcase, label: "Trabalhando", value: profile.working ? "Sim" : "Não", bg: "bg-peach", color: "text-peach-foreground" },
              { icon: Stethoscope, label: "Acompanhamento", value: profile.hasMedicalCare ? "Sim" : "Não", bg: "bg-lilac", color: "text-lilac-foreground" },
              { icon: Heart, label: "Foco", value: profile.focus === "physical" ? "Físico" : profile.focus === "emotional" ? "Emocional" : "Ambos", bg: "bg-sage", color: "text-sage-foreground" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                  <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  <p className="text-xs font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Support FAB */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => navigate("/suporte")}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-elevated flex items-center justify-center hover:scale-105 transition-transform z-50"
        aria-label="Suporte"
      >
        <ChatCircleDots className="w-6 h-6" />
        {unreadSupportCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-destructive text-destructive-foreground rounded-full text-[10px] font-bold flex items-center justify-center px-1 border-2 border-background shadow-sm animate-pulse">
            {unreadSupportCount > 9 ? "9+" : unreadSupportCount}
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default Profile;
