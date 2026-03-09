import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveSymptoms, type SymptomRow } from "@/hooks/useSupabaseData";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { motion } from "framer-motion";
import { ArrowLeft, MagnifyingGlass, WarningCircle, Warning, Info, SpinnerGap } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageSEO from "@/components/PageSEO";

const alertConfig = {
  low: { icon: Info, color: "bg-sage", textColor: "text-sage-foreground", label: "Baixo" },
  moderate: { icon: WarningCircle, color: "bg-warm-orange/20", textColor: "text-warm-orange-foreground", label: "Moderado" },
  high: { icon: Warning, color: "bg-destructive/10", textColor: "text-destructive", label: "Alto" },
};

const Symptoms = () => {
  const navigate = useNavigate();
  const { trimester } = usePregnancy();
  const { data: symptoms = [], isLoading } = useActiveSymptoms();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SymptomRow | null>(null);

  const filtered = symptoms.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  const relevant = filtered.filter(s => s.trimester.includes(trimester));
  const other = filtered.filter(s => !s.trimester.includes(trimester));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <SpinnerGap className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <PageSEO
        title="Sintomas da Gravidez por Trimestre"
        description="Conheça os sintomas mais comuns da gravidez em cada trimestre, saiba quando procurar o médico e o que fazer para aliviar o desconforto."
        keywords="sintomas da gravidez, enjoo na gravidez, dor nas costas gestação, sintomas por trimestre, quando ir ao médico grávida"
        path="/sintomas"
      />
      <div className="px-6 pt-6 pb-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/painel")} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold font-display">Sintomas</h1>
      </div>

      <div className="px-6 space-y-4">
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar sintoma..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 h-12 rounded-xl" />
        </div>

        {!selected ? (
          <>
            {relevant.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground mb-2">Comuns no {trimester}° trimestre</h2>
                <div className="space-y-2">
                  {relevant.map((s, i) => {
                    const cfg = alertConfig[s.alert_level as keyof typeof alertConfig] || alertConfig.low;
                    return (
                      <motion.button key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} onClick={() => setSelected(s)}
                        className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border shadow-card text-left hover:shadow-elevated transition-shadow">
                        <div className={`w-10 h-10 rounded-xl ${cfg.color} flex items-center justify-center flex-shrink-0`}>
                          <cfg.icon className={`w-5 h-5 ${cfg.textColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{s.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{s.description}</p>
                        </div>
                        <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${cfg.color} ${cfg.textColor}`}>{cfg.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}
            {other.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground mb-2">Outros sintomas</h2>
                <div className="space-y-2">
                  {other.map((s, i) => {
                    const cfg = alertConfig[s.alert_level as keyof typeof alertConfig] || alertConfig.low;
                    return (
                      <motion.button key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} onClick={() => setSelected(s)}
                        className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border shadow-card text-left">
                        <div className={`w-10 h-10 rounded-xl ${cfg.color} flex items-center justify-center flex-shrink-0`}>
                          <cfg.icon className={`w-5 h-5 ${cfg.textColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{s.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{s.description}</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <Button variant="ghost" size="sm" onClick={() => setSelected(null)} className="rounded-xl">
              ← Voltar à lista
            </Button>
            <div className="bg-card rounded-2xl p-5 shadow-card border border-border space-y-4">
              <h2 className="text-lg font-bold font-display">{selected.name}</h2>
              <p className="text-sm text-muted-foreground">{selected.description}</p>

              {[
                { label: "Quando é comum", value: selected.when_common },
                { label: "O que fazer", value: selected.what_to_do },
                { label: "⚠️ Quando procurar médico", value: selected.when_see_doctor },
              ].map(item => (
                <div key={item.label} className="bg-muted/50 rounded-xl p-4">
                  <p className="font-semibold text-sm mb-1">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-center text-muted-foreground/60">
              Este aplicativo não substitui acompanhamento médico profissional.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Symptoms;
