import { useNavigate } from "react-router-dom";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { useActiveExercises } from "@/hooks/useSupabaseData";
import { motion } from "framer-motion";
import { ArrowLeft, Barbell, SpinnerGap } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

const Exercises = () => {
  const navigate = useNavigate();
  const { trimester } = usePregnancy();
  const { data: exercises = [], isLoading } = useActiveExercises();

  const recommended = exercises.filter(e => e.trimester.includes(trimester));
  const others = exercises.filter(e => !e.trimester.includes(trimester));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <SpinnerGap className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="px-6 pt-6 pb-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/painel")} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold font-display">Exercícios</h1>
      </div>

      <div className="px-6 space-y-6">
        <div className="bg-sage/50 rounded-2xl p-4 border border-sage">
          <p className="text-sm text-sage-foreground font-medium">
            🧘 Recomendados para o {trimester}° trimestre
          </p>
          <p className="text-xs text-muted-foreground mt-1">Consulte seu médico antes de iniciar qualquer exercício.</p>
        </div>

        {recommended.map((ex, i) => (
          <motion.div
            key={ex.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card rounded-2xl p-5 shadow-card border border-border"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl gradient-sage flex items-center justify-center">
                <Barbell className="w-5 h-5 text-foreground/70" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{ex.name}</p>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${ex.intensity === "Leve" ? "bg-sage text-sage-foreground" : "bg-warm-orange/20 text-warm-orange-foreground"}`}>
                  {ex.intensity}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{ex.description}</p>
            <div className="bg-muted/50 rounded-xl p-3 space-y-1">
              {ex.steps.map((step, si) => (
                <p key={si} className="text-xs text-foreground">
                  <span className="text-primary font-bold mr-1">{si + 1}.</span> {step}
                </p>
              ))}
            </div>
            {ex.contraindications !== "Nenhuma" && ex.contraindications !== "Nenhuma contraindicação. Seguro em todas as fases da gestação." && ex.contraindications !== "Nenhuma contraindicação. Pode ser feito em qualquer posição e a qualquer momento do dia, inclusive durante atividades cotidianas." && (
              <p className="text-xs text-warm-orange-foreground mt-2">⚠️ {ex.contraindications}</p>
            )}
          </motion.div>
        ))}

        {others.length > 0 && (
          <>
            <h2 className="text-sm font-semibold text-muted-foreground">Outros exercícios</h2>
            {others.map((ex) => (
              <div key={ex.id} className="bg-card rounded-2xl p-4 shadow-card border border-border opacity-60">
                <p className="font-semibold text-sm">{ex.name}</p>
                <p className="text-xs text-muted-foreground">{ex.description}</p>
                <p className="text-xs text-muted-foreground mt-1">Recomendado para: {ex.trimester.map(t => `${t}° tri`).join(", ")}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Exercises;
