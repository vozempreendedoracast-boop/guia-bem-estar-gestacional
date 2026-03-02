import { useNavigate } from "react-router-dom";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { motion } from "framer-motion";
import { ArrowLeft, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Exercise {
  name: string;
  description: string;
  steps: string[];
  intensity: "Leve" | "Moderado";
  contraindications: string;
  trimester: number[];
}

const exercises: Exercise[] = [
  { name: "Respiração Diafragmática", description: "Exercício de respiração profunda para relaxamento e oxigenação.", steps: ["Deite-se confortavelmente", "Coloque uma mão no peito e outra na barriga", "Inspire pelo nariz, expandindo a barriga", "Expire pela boca lentamente", "Repita 10 vezes"], intensity: "Leve", contraindications: "Nenhuma", trimester: [1, 2, 3] },
  { name: "Caminhada Leve", description: "Caminhada em ritmo confortável para manter a circulação.", steps: ["Use calçado confortável", "Caminhe em terreno plano", "Mantenha ritmo conversacional", "15-30 minutos", "Hidrate-se bem"], intensity: "Leve", contraindications: "Restrição médica de atividade física", trimester: [1, 2, 3] },
  { name: "Alongamento para Lombar", description: "Alivia dores nas costas causadas pelo peso extra.", steps: ["Fique de quatro apoios", "Arqueie as costas para cima (gato)", "Depois deixe a barriga pender (vaca)", "Alterne lentamente", "Repita 10 vezes"], intensity: "Leve", contraindications: "Dor aguda na lombar", trimester: [2, 3] },
  { name: "Agachamento com Apoio", description: "Fortalece pernas e prepara para o parto.", steps: ["Apoie as costas na parede", "Pés afastados na largura dos quadris", "Desça lentamente até 90°", "Segure 5 segundos", "Suba devagar. Repita 8x"], intensity: "Moderado", contraindications: "Problemas nos joelhos, restrição médica", trimester: [2, 3] },
  { name: "Exercício de Kegel", description: "Fortalece o assoalho pélvico para o parto e recuperação.", steps: ["Sente-se ou deite confortavelmente", "Contraia os músculos como se fosse segurar urina", "Segure por 5 segundos", "Relaxe por 5 segundos", "Repita 10-15 vezes, 3x ao dia"], intensity: "Leve", contraindications: "Nenhuma", trimester: [1, 2, 3] },
  { name: "Yoga Pré-natal", description: "Posturas suaves que melhoram flexibilidade e relaxamento.", steps: ["Postura da criança modificada", "Guerreiro II suave", "Borboleta sentada", "Mantenha cada postura 30s", "Foque na respiração"], intensity: "Leve", contraindications: "Evite posturas invertidas e deitada de barriga para cima após 20 semanas", trimester: [1, 2, 3] },
];

const Exercises = () => {
  const navigate = useNavigate();
  const { trimester } = usePregnancy();

  const recommended = exercises.filter(e => e.trimester.includes(trimester));
  const others = exercises.filter(e => !e.trimester.includes(trimester));

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="px-6 pt-6 pb-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="rounded-xl">
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
            key={ex.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card rounded-2xl p-5 shadow-card border border-border"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl gradient-sage flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-foreground/70" />
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
            {ex.contraindications !== "Nenhuma" && (
              <p className="text-xs text-warm-orange-foreground mt-2">⚠️ {ex.contraindications}</p>
            )}
          </motion.div>
        ))}

        {others.length > 0 && (
          <>
            <h2 className="text-sm font-semibold text-muted-foreground">Outros exercícios</h2>
            {others.map((ex, i) => (
              <div key={ex.name} className="bg-card rounded-2xl p-4 shadow-card border border-border opacity-60">
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
