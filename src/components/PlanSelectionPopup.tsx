import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, BookOpen, Check, X as XIcon, Star } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useActivePlans } from "@/hooks/useSupabaseData";

interface PlanSelectionPopupProps {
  open: boolean;
  onClose?: () => void;
  filterPlan?: string;
}

const PlanSelectionPopup = ({ open, onClose, filterPlan }: PlanSelectionPopupProps) => {
  const { data: allPlans = [] } = useActivePlans();
  const plans = filterPlan ? allPlans.filter(p => p.slug === filterPlan) : allPlans;

  const iconMap: Record<string, React.ElementType> = { BookOpen, Crown, Star };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-card rounded-3xl border border-border shadow-xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {onClose && (
              <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground">
                <XIcon className="w-4 h-4" />
              </button>
            )}

            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-3 shadow-soft">
                <Crown className="w-7 h-7 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-bold font-display">
                {filterPlan === "premium" ? "Upgrade para o Premium 👑" : "Escolha seu plano"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {filterPlan === "premium"
                  ? "Desbloqueie todos os recursos exclusivos do plano Premium!"
                  : "Desbloqueie todos os recursos do MamyBoo para acompanhar sua gestação! 💕"}
              </p>
            </div>

            <div className="space-y-3">
              {plans.length > 0 ? plans.map(plan => {
                const Icon = iconMap[plan.icon] || BookOpen;
                return (
                  <a
                    key={plan.id}
                    href={plan.checkout_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block rounded-2xl border-2 p-4 transition-all hover:shadow-lg ${
                      plan.highlighted
                        ? "border-primary bg-primary/5 shadow-soft"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${plan.highlighted ? "gradient-primary" : "bg-muted"}`}>
                          <Icon className={`w-5 h-5 ${plan.highlighted ? "text-primary-foreground" : "text-foreground"}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-foreground">{plan.name}</p>
                            {plan.badge && (
                              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{plan.badge}</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{plan.description}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-foreground">{plan.price}</p>
                        <p className="text-[10px] text-muted-foreground">{plan.price_label}</p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-1">
                      {plan.features.slice(0, 4).map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" weight="bold" />
                          {f}
                        </div>
                      ))}
                    </div>
                    <Button className={`w-full mt-3 rounded-xl ${plan.highlighted ? "gradient-primary text-primary-foreground" : ""}`} variant={plan.highlighted ? "default" : "outline"}>
                      {plan.button_text}
                    </Button>
                  </a>
                );
              }) : (
                <>
                  {/* Fallback static plans */}
                  <a href="/vendas" className="block rounded-2xl border-2 border-border p-4 hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><BookOpen className="w-5 h-5" /></div>
                      <div>
                        <p className="font-bold">Essencial</p>
                        <p className="text-xs text-muted-foreground">Acesso ao conteúdo completo</p>
                      </div>
                    </div>
                    <Button className="w-full mt-3 rounded-xl" variant="outline">Escolher Essencial</Button>
                  </a>
                  <a href="/vendas" className="block rounded-2xl border-2 border-primary bg-primary/5 p-4 shadow-soft">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center"><Crown className="w-5 h-5 text-primary-foreground" /></div>
                      <div>
                        <p className="font-bold">Premium</p>
                        <p className="text-xs text-muted-foreground">Tudo + Assistente IA</p>
                      </div>
                    </div>
                    <Button className="w-full mt-3 rounded-xl gradient-primary text-primary-foreground">Escolher Premium</Button>
                  </a>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlanSelectionPopup;
