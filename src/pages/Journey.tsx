import { usePregnancy } from "@/contexts/PregnancyContext";
import { useWeekContents } from "@/hooks/useSupabaseData";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, CaretRight, SpinnerGap } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { getWeekEmoji } from "@/data/weeks";
import PageSEO from "@/components/PageSEO";

const Journey = () => {
  const { currentWeek } = usePregnancy();
  const navigate = useNavigate();
  const { data: weeks, isLoading } = useWeekContents();

  const trimesterLabels = ["1° Trimestre (1-13)", "2° Trimestre (14-27)", "3° Trimestre (28-40)"];

  const activeWeeks = (weeks || []).filter(w => w.active);

  const groupedWeeks = [
    activeWeeks.filter(w => w.week_number <= 13),
    activeWeeks.filter(w => w.week_number >= 14 && w.week_number <= 27),
    activeWeeks.filter(w => w.week_number >= 28),
  ];

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
        <h1 className="text-xl font-bold font-display">Minha Jornada</h1>
      </div>

      <div className="px-6 space-y-6">
        {groupedWeeks.map((group, gi) => (
          <div key={gi}>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">{trimesterLabels[gi]}</h2>
            <div className="space-y-2">
              {group.map((week, i) => {
                const isUnlocked = week.week_number <= currentWeek;
                const isCurrent = week.week_number === currentWeek || (currentWeek > week.week_number && (group[i + 1] ? currentWeek < group[i + 1].week_number : gi < 2 ? currentWeek < groupedWeeks[gi + 1]?.[0]?.week_number : true));

                return (
                  <motion.button
                    key={week.week_number}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => isUnlocked && navigate(`/jornada/${week.week_number}`)}
                    disabled={!isUnlocked}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                      isCurrent
                        ? "border-primary bg-primary/5 shadow-soft"
                        : isUnlocked
                        ? "border-border bg-card hover:shadow-card"
                        : "border-border/50 bg-muted/30 opacity-50"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                      {getWeekEmoji(week.week_number)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">
                        Semana {week.week_number}
                        {isCurrent && <span className="ml-2 text-xs font-normal text-primary">← Você está aqui</span>}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{week.baby_size_comparison} · {week.baby_size}</p>
                    </div>
                    {isUnlocked ? (
                      <CaretRight className="w-4 h-4 text-muted-foreground" />
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
