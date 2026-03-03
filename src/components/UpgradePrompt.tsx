import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Crown, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface UpgradePromptProps {
  feature?: string;
  backPath?: string;
}

const UpgradePrompt = ({ feature = "este recurso", backPath = "/painel" }: UpgradePromptProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-6 pt-6 pb-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(backPath)} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm space-y-6"
        >
          <div className="w-20 h-20 rounded-2xl gradient-primary mx-auto flex items-center justify-center shadow-soft">
            <Crown className="w-10 h-10 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display">Recurso Premium 👑</h1>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              Para acessar {feature}, você precisa do <strong>Plano Premium</strong>.
            </p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border shadow-card text-left space-y-2">
            <p className="font-semibold text-sm">O que você ganha:</p>
            {["Assistente IA 24h", "Respostas personalizadas", "Uso ilimitado", "Recursos premium futuros"].map(b => (
              <div key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-primary">✓</span>
                {b}
              </div>
            ))}
          </div>
          <Button
            onClick={() => navigate("/planos")}
            className="w-full h-14 rounded-xl gradient-primary text-primary-foreground font-semibold text-base shadow-soft"
          >
            Ver planos
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default UpgradePrompt;
