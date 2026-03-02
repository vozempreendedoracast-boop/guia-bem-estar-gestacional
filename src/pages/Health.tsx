import { useNavigate } from "react-router-dom";
import { useActiveHealthTips } from "@/hooks/useSupabaseData";
import { motion } from "framer-motion";
import { ArrowLeft, Apple, Moon, Brain, Heart, Baby, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ElementType> = {
  Apple, Moon, Brain, Heart, Baby, Sparkles,
};

const gradientCycle = ["gradient-peach", "gradient-lilac", "gradient-sage"];

const Health = () => {
  const navigate = useNavigate();
  const { data: healthTips = [], isLoading } = useActiveHealthTips();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="px-6 pt-6 pb-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/painel")} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold font-display">Saúde Integral</h1>
      </div>

      <div className="px-6 space-y-4">
        {healthTips.map((cat, i) => {
          const IconComp = iconMap[cat.icon] || Heart;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-2xl p-5 shadow-card border border-border"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-11 h-11 rounded-xl ${gradientCycle[i % 3]} flex items-center justify-center`}>
                  <IconComp className="w-5 h-5 text-foreground/70" />
                </div>
                <h2 className="font-bold font-display">{cat.section_title}</h2>
              </div>
              <div className="space-y-2">
                {cat.tips.map((tip, ti) => (
                  <div key={ti} className="flex items-start gap-2">
                    <span className="text-primary text-xs mt-1">●</span>
                    <p className="text-sm text-muted-foreground">{tip}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Health;
