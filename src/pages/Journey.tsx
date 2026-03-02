import { usePregnancy } from "@/contexts/PregnancyContext";
import { weeksData } from "@/data/weeks";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Journey = () => {
  const { currentWeek } = usePregnancy();
  const navigate = useNavigate();

  const trimesterLabels = ["1° Trimestre (1-13)", "2° Trimestre (14-27)", "3° Trimestre (28-40)"];

  const groupedWeeks = [
    weeksData.filter(w => w.week <= 13),
    weeksData.filter(w => w.week >= 14 && w.week <= 27),
    weeksData.filter(w => w.week >= 28),
  ];

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="px-6 pt-6 pb-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/painel")} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold font-display">Minha Jornada</h1>
      </div>

      <div className="px-6 space-y-6">
        {groupedWeeks.map((group, gi) => (
          <div key={gi}>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">{trimesterLabels[gi]}</h2>
            <div className="space-y-2">
              {group.map((week, i) => {
                const isUnlocked = week.week <= currentWeek;
                const isCurrent = week.week === currentWeek || (currentWeek > week.week && (group[i + 1] ? currentWeek < group[i + 1].week : gi < 2 ? currentWeek < groupedWeeks[gi + 1]?.[0]?.week : true));

                return (
                  <motion.button
                    key={week.week}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => isUnlocked && navigate(`/jornada/${week.week}`)}
                    disabled={!isUnlocked}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                      isCurrent
                        ? "border-primary bg-primary/5 shadow-soft"
                        : isUnlocked
                        ? "border-border bg-card hover:shadow-card"
                        : "border-border/50 bg-muted/30 opacity-50"
                    }`}
                  >
                    <span className="text-2xl">{week.babySizeComparison.split(" ")[0]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">
                        Semana {week.week}
                        {isCurrent && <span className="ml-2 text-xs font-normal text-primary">← Você está aqui</span>}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{week.babySizeComparison.split(" ").slice(1).join(" ")} · {week.babySize}</p>
                    </div>
                    {isUnlocked ? (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground/50" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Journey;
