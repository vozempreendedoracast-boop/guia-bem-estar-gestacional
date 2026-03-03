import { useNavigate } from "react-router-dom";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { motion } from "framer-motion";
import { ArrowLeft, Smiley, TrendUp, CalendarBlank } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const moodEmojis = ["😢", "😟", "😐", "🙂", "😊"];
const moodLabels = ["Muito triste", "Preocupada", "Neutra", "Bem", "Ótima"];

const Diary = () => {
  const navigate = useNavigate();
  const { moods, addMood } = usePregnancy();

  const sortedMoods = [...moods].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const avgMood = moods.length > 0
    ? (moods.reduce((sum, m) => sum + m.mood, 0) / moods.length).toFixed(1)
    : "—";

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="px-6 pt-6 pb-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/painel")} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold font-display">Diário</h1>
      </div>

      <div className="px-6 space-y-6">
        {/* Quick mood */}
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Smiley className="w-5 h-5 text-primary" /> Registrar humor agora
          </h2>
          <div className="flex justify-around">
            {moodEmojis.map((emoji, i) => (
              <button key={i} onClick={() => addMood(i + 1)} className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
                <span className="text-3xl">{emoji}</span>
                <span className="text-[10px] text-muted-foreground">{moodLabels[i]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-2xl p-4 shadow-card border border-border text-center">
            <TrendUp className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{avgMood}</p>
            <p className="text-xs text-muted-foreground">Humor médio</p>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-card border border-border text-center">
            <CalendarBlank className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{moods.length}</p>
            <p className="text-xs text-muted-foreground">Registros</p>
          </div>
        </div>

        {/* History */}
        <div>
          <h2 className="font-semibold text-sm text-muted-foreground mb-3">Histórico</h2>
          {sortedMoods.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Smiley className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhum registro ainda</p>
              <p className="text-xs">Registre seu humor acima!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedMoods.slice(0, 20).map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border"
                >
                  <span className="text-2xl">{moodEmojis[entry.mood - 1]}</span>
                  <div>
                    <p className="text-sm font-medium">{moodLabels[entry.mood - 1]}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(entry.date), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Diary;
