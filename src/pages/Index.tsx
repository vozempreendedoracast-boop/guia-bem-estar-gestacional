import { useAuth } from "@/contexts/AuthContext";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Baby, Sparkle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, loading, isAdmin } = useAuth();
  const { isOnboarded } = usePregnancy();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user && isAdmin) {
      navigate("/administracao");
    } else if (user && isOnboarded) {
      navigate("/painel");
    } else if (user) {
      navigate("/cadastro");
    }
  }, [user, isOnboarded, isAdmin, navigate, loading]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm space-y-8"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="w-24 h-24 rounded-3xl gradient-hero mx-auto flex items-center justify-center shadow-elevated"
        >
          <Baby className="w-12 h-12 text-primary-foreground" />
        </motion.div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold font-display text-foreground">
            MamyBoo
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Sua companheira durante toda a jornada da gravidez. Informação certa, no momento certo. 💕
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 text-muted-foreground">
          <div className="flex flex-col items-center gap-1">
            <Heart className="w-5 h-5 text-primary" />
            <span className="text-xs">Acolhimento</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Sparkle className="w-5 h-5 text-primary" />
            <span className="text-xs">Personalizado</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Baby className="w-5 h-5 text-primary" />
            <span className="text-xs">Semana a semana</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => navigate("/planos")}
            className="w-full h-14 rounded-xl gradient-primary text-primary-foreground font-semibold text-base shadow-soft"
          >
            Começar agora
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/login")}
            className="w-full h-12 rounded-xl"
          >
            Já tenho conta
          </Button>
        </div>

        <p className="text-xs text-muted-foreground/50">
          Este app não substitui acompanhamento médico.
        </p>
      </motion.div>
    </div>
  );
};

export default Index;
