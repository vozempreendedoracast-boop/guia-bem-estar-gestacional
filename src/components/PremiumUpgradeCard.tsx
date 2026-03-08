import { motion } from "framer-motion";
import { Crown, ArrowRight } from "@phosphor-icons/react";
import { usePlan } from "@/hooks/usePlan";
import { usePlans } from "@/hooks/useSupabaseData";

const PremiumUpgradeCard = () => {
  const { isEssential } = usePlan();
  const { data: plansData = [] } = usePlans();

  if (!isEssential) return null;

  const premiumPlan = plansData.find(p => p.slug === "premium" && p.active);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.75 }}
      className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl p-5 border border-primary/20 shadow-card"
    >
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-soft">
          <Crown className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-foreground">Upgrade para o Premium 👑</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Desbloqueie o <strong>Assistente de IA 24h</strong> e tenha respostas personalizadas para toda a sua gestação.
          </p>
          {premiumPlan && (
            <div className="mt-3 space-y-1.5">
              {premiumPlan.features.slice(0, 3).map((feat, i) => (
                <p key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="text-primary">✓</span> {feat}
                </p>
              ))}
            </div>
          )}
          <a
            href={premiumPlan?.checkout_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            {premiumPlan?.price ? `Assinar por ${premiumPlan.price}` : "Ver plano Premium"}
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumUpgradeCard;
