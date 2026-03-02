import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Assistant = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="px-6 pt-6 pb-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold font-display">Assistente IA</h1>
      </div>

      <div className="px-6 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-20 h-20 rounded-2xl gradient-primary mx-auto flex items-center justify-center shadow-soft">
            <Bot className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold font-display">Em breve!</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Nossa assistente de IA está sendo preparada com muito carinho para te acompanhar durante toda a gestação.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground/60 justify-center">
            <Lock className="w-3 h-3" />
            <span>Funcionalidade em desenvolvimento</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Assistant;
