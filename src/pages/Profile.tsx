import { usePregnancy } from "@/contexts/PregnancyContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Baby, CalendarBlank, Heart, Briefcase, Stethoscope, User, EnvelopeSimple, Phone } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const Profile = () => {
  const { profile, setProfile, currentWeek, trimester, progressPercent } = usePregnancy();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: profile?.name || "",
    email: user?.email || localStorage.getItem("pregnancy_email") || "",
    phone: localStorage.getItem("pregnancy_phone") || "",
  });

  const handleSave = () => {
    if (profile) {
      setProfile({ ...profile, name: form.name });
    }
    localStorage.setItem("pregnancy_email", form.email);
    localStorage.setItem("pregnancy_phone", form.phone);
    setEditing(false);
    toast.success("Perfil atualizado!");
  };

  if (!profile) return null;

  const dueDate = new Date(profile.dueDate);

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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-soft">
            <Baby className="w-10 h-10 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold font-display">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">Semana {currentWeek} · {trimester}° Trimestre</p>
          </div>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-4 border border-border shadow-card"
        >
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Progresso da gestação</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full gradient-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {40 - currentWeek} semanas restantes
          </p>
        </motion.div>

        {/* Info cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-5 border border-border shadow-card space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Informações Pessoais</h3>
            <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={() => setEditing(!editing)}>
              {editing ? "Cancelar" : "Editar"}
            </Button>
          </div>

          <div className="space-y-3">
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
                <div>
                  <p className="text-xs text-muted-foreground">Nome</p>
                  <p className="text-sm font-medium">{profile.name}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-lilac flex items-center justify-center flex-shrink-0">
                <EnvelopeSimple className="w-4 h-4 text-lilac-foreground" />
              </div>
              {editing ? (
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="rounded-xl h-9 text-sm" placeholder="seu@email.com" />
                </div>
              ) : (
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{form.email || "Não informado"}</p>
                </div>
              )}
            </div>

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
                <div>
                  <p className="text-xs text-muted-foreground">Telefone</p>
                  <p className="text-sm font-medium">{form.phone || "Não informado"}</p>
                </div>
              )}
            </div>
          </div>

          {editing && (
            <Button className="w-full rounded-xl" onClick={handleSave}>Salvar alterações</Button>
          )}
        </motion.div>

        {/* Pregnancy info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-5 border border-border shadow-card space-y-3"
        >
          <h3 className="font-semibold text-sm">Dados da Gestação</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: CalendarBlank, label: "Data prevista", value: dueDate.toLocaleDateString("pt-BR"), bg: "bg-peach", color: "text-peach-foreground" },
              { icon: Baby, label: "Idade", value: `${profile.age} anos`, bg: "bg-lilac", color: "text-lilac-foreground" },
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
    </div>
  );
};

export default Profile;
