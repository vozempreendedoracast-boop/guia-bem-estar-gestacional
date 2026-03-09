import { useNavigate } from "react-router-dom";
import { useActiveHealthTips } from "@/hooks/useSupabaseData";
import { motion } from "framer-motion";
import { ArrowLeft, AppleLogo, Moon, Brain, Heart, Baby, SpinnerGap, Sparkle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import PageSEO from "@/components/PageSEO";

const iconMap: Record<string, React.ElementType> = {
  AppleLogo, Moon, Brain, Heart, Baby, Sparkle,
};

const gradientCycle = ["gradient-peach", "gradient-lilac", "gradient-sage"];

const Health = () => {
  const navigate = useNavigate();
  const { data: healthTips = [], isLoading } = useActiveHealthTips();

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
        <h1 className="text-xl font-bold font-display">Saúde Integral</h1>
      </div>

      <div className="px-6 space-y-5">
        {healthTips.map((cat, i) => {
          const IconComp = iconMap[cat.icon] || Heart;
          const imageUrl = (cat as any).image_url;
          const description = (cat as any).description;

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-2xl shadow-card border border-border overflow-hidden"
            >
              {/* Image */}
              {imageUrl && (
                <div className="w-full h-40 md:h-52 overflow-hidden">
                  <img src={imageUrl} alt={cat.section_title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="p-5">
                {/* Title with icon */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-xl ${gradientCycle[i % 3]} flex items-center justify-center`}>
                    <IconComp className="w-5 h-5 text-foreground/70" />
                  </div>
                  <h2 className="font-bold font-display text-lg">{cat.section_title}</h2>
                </div>

                {/* Description about importance */}
                {description && (
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>
                )}

                {/* Tips list */}
                <div className="space-y-2">
                  {cat.tips.map((tip, ti) => (
                    <div key={ti} className="flex items-start gap-2">
                      <span className="text-primary text-xs mt-1">●</span>
                      <p className="text-sm text-muted-foreground">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Health;
