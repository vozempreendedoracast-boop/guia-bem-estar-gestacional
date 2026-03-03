import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Baby, EnvelopeSimple, ArrowRight, SpinnerGap, CheckCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { signInWithMagicLink } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const { error } = await signInWithMagicLink(email.trim());
    setLoading(false);
    if (error) {
      toast.error("Erro ao enviar link. Tente novamente.");
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm w-full space-y-8"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="w-20 h-20 rounded-3xl gradient-hero mx-auto flex items-center justify-center shadow-elevated"
        >
          <Baby className="w-10 h-10 text-primary-foreground" />
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-display text-foreground">
            {sent ? "Link enviado! ✨" : "Entrar no MamyBoo"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {sent
              ? `Enviamos um link mágico para ${email}. Verifique sua caixa de entrada e spam.`
              : "Digite seu email para receber um link de acesso seguro."}
          </p>
        </div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-accent-foreground" />
            </div>
            <Button variant="outline" className="rounded-xl" onClick={() => { setSent(false); setEmail(""); }}>
              Usar outro email
            </Button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <EnvelopeSimple className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-14 rounded-xl pl-10 text-base border-2 border-muted focus:border-primary"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full h-14 rounded-xl gradient-primary text-primary-foreground font-semibold text-base shadow-soft"
            >
              {loading ? <SpinnerGap className="w-5 h-5 animate-spin" /> : (
                <>
                  Enviar link de acesso
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>
        )}

        <div className="space-y-2">
          <Button variant="ghost" className="text-sm text-muted-foreground" onClick={() => navigate("/planos")}>
            Ainda não tem conta? Veja os planos
          </Button>
          <Button variant="ghost" className="text-sm text-muted-foreground" onClick={() => navigate("/vendas")}>
            Conhecer o app
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
