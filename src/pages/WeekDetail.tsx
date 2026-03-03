import { useParams, useNavigate } from "react-router-dom";
import { useWeekContent } from "@/hooks/useSupabaseData";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { motion } from "framer-motion";
import { ArrowLeft, Baby, Heart, AlertTriangle, Lightbulb, Stethoscope, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWeekEmoji } from "@/data/weeks";

const WeekDetail = () => {
  const { week } = useParams();
  const navigate = useNavigate();
  const { currentWeek } = usePregnancy();
  const weekNum = parseInt(week || "1");
  const { data, isLoading } = useWeekContent(weekNum);

  if (weekNum > currentWeek) {
    navigate("/jornada");
    return null;
  }

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const sections = [
    { icon: Baby, title: "Desenvolvimento do bebê", content: data.baby_development, color: "bg-peach" },
    { icon: Heart, title: "Mudanças no seu corpo", content: data.mother_changes, color: "bg-lilac" },
    { icon: Stethoscope, title: "Sintomas comuns", content: data.common_symptoms.join(", "), color: "bg-sage" },
    { icon: Lightbulb, title: "Dica prática", content: data.tip, color: "bg-peach" },
  ];

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Hero */}
      <div className="gradient-hero text-primary-foreground px-6 pt-6 pb-10 rounded-b-[2rem]">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/jornada")} className="text-primary-foreground hover:bg-primary-foreground/10 rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold font-display">Semana {data.week_number}</h1>
        </div>
        <div className="text-center">
          <div className="w-28 h-28 rounded-2xl bg-primary-foreground/20 flex items-center justify-center text-6xl mx-auto mb-3 shadow-lg backdrop-blur-sm">
            {getWeekEmoji(data.week_number)}
          </div>
          <p className="text-lg font-semibold">{data.baby_size_comparison}</p>
          <p className="text-sm opacity-80 mt-1">Tamanho: ~{data.baby_size}</p>
        </div>
      </div>

      <div className="px-6 -mt-4 space-y-4">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl p-5 shadow-card border border-border"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl ${section.color} flex items-center justify-center`}>
                <section.icon className="w-5 h-5 text-foreground/70" />
              </div>
              <h2 className="font-semibold">{section.title}</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
          </motion.div>
        ))}

        {data.alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-warm-orange/20 rounded-2xl p-5 border border-warm-orange/30"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-warm-orange/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warm-orange-foreground" />
              </div>
              <h2 className="font-semibold">Alertas importantes</h2>
            </div>
            <ul className="space-y-1">
              {data.alerts.map((alert, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <span className="text-warm-orange mt-0.5">•</span>
                  {alert}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WeekDetail;
