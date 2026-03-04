import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { EnvelopeSimple, ArrowRight, SpinnerGap, Lock, Eye, EyeSlash } from "@phosphor-icons/react";
import logoMamyboo from "@/assets/logo-mamyboo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AuthMode = "login" | "signup";

const Login = () => {
  const navigate = useNavigate();
  const { signInWithPassword, signUp, isAdmin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [recoveryCooldownUntil, setRecoveryCooldownUntil] = useState<number>(0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    let data: { user: any } = { user: null };

    setLoading(true);
    const result = await signInWithPassword(email.trim(), password.trim());
    const error = result.error;
    data = { user: result.user };
    setLoading(false);

    if (error) {
      toast.error("Email ou senha incorretos.");
      return;
    }

    // Small delay to let onAuthStateChange fire and fetch profile.
    // We check admin status after profile is loaded to redirect correctly.
    setTimeout(async () => {
      // Re-check admin from the RPC since isAdmin may not be updated yet
      const { data: adminCheck } = await supabase.rpc("has_role", { _user_id: data.user?.id ?? "", _role: "admin" });
      if (adminCheck) {
        navigate("/administracao", { replace: true });
      } else {
        navigate("/painel", { replace: true });
      }
    }, 300);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) return;

    if (password !== confirmPassword) {
      toast.error("As senhas não conferem.");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    const { error, user } = await signUp(email.trim(), password.trim());
    setLoading(false);

    if (error) {
      const msg = String(error.message || "").toLowerCase();
      if (msg.includes("already registered") || msg.includes("already been registered")) {
        toast.error("Este email já está cadastrado. Tente fazer login.");
      } else {
        toast.error("Erro ao criar conta. Tente novamente.");
      }
      return;
    }

    if (user?.identities?.length === 0) {
      // Email already exists but unconfirmed
      toast.error("Este email já está cadastrado. Verifique sua caixa de entrada.");
      return;
    }

    if (user) {
      toast.success("Conta criada com sucesso!");
      setTimeout(() => {
        navigate("/cadastro", { replace: true });
      }, 100);
    } else {
      toast.success("Conta criada! Verifique seu email para confirmar o acesso.");
      setMode("login");
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast.error("Digite seu email primeiro para recuperar a senha.");
      return;
    }

    const now = Date.now();
    if (now < recoveryCooldownUntil) {
      const remainingSeconds = Math.ceil((recoveryCooldownUntil - now) / 1000);
      toast.error(`Aguarde ${remainingSeconds}s para tentar novamente.`);
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: "https://mamyboo.vercel.app/reset-password",
    });
    setLoading(false);

    if (error) {
      const msg = String(error.message || "").toLowerCase();
      if (msg.includes("rate limit") || msg.includes("429") || msg.includes("over_email_send_rate_limit")) {
        setRecoveryCooldownUntil(Date.now() + 60_000);
        toast.error("Muitas tentativas. Aguarde 60 segundos e tente novamente.");
      } else {
        toast.error("Erro ao enviar email de recuperação.");
      }
      return;
    }

    toast.success("Email de recuperação enviado! Verifique sua caixa de entrada.");
    setRecoveryCooldownUntil(Date.now() + 60_000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm w-full space-y-8"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="w-24 h-24 mx-auto"
        >
          <img src={logoMamyboo} alt="MamyBoo" className="w-full h-full object-contain" />
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-display text-foreground">
            {mode === "signup" ? "Criar conta" : "Entrar no MamyBoo"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {mode === "signup"
              ? "Cadastre-se com email e senha para acessar o app."
              : "Entre com seu email e senha."}
          </p>
        </div>

        {mode === "signup" ? (
          <form onSubmit={handleSignUp} className="space-y-4">
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

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Crie uma senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="h-14 rounded-xl pl-10 pr-12 text-base border-2 border-muted focus:border-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeSlash className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirme a senha"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="h-14 rounded-xl pl-10 pr-12 text-base border-2 border-muted focus:border-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showConfirmPassword ? <EyeSlash className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading || !email.trim() || !password.trim() || !confirmPassword.trim()}
              className="w-full h-14 rounded-xl gradient-primary text-primary-foreground font-semibold text-base shadow-soft"
            >
              {loading ? <SpinnerGap className="w-5 h-5 animate-spin" /> : (
                <>Criar conta <ArrowRight className="w-5 h-5 ml-2" /></>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="text-sm text-muted-foreground"
              onClick={() => setMode("login")}
            >
              Já tenho conta
            </Button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
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

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="h-14 rounded-xl pl-10 pr-12 text-base border-2 border-muted focus:border-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeSlash className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className="w-full h-14 rounded-xl gradient-primary text-primary-foreground font-semibold text-base shadow-soft"
            >
              {loading ? <SpinnerGap className="w-5 h-5 animate-spin" /> : (
                <>Entrar <ArrowRight className="w-5 h-5 ml-2" /></>
              )}
            </Button>

            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="ghost"
                className="text-sm text-muted-foreground"
                onClick={handleForgotPassword}
                disabled={loading}
              >
                Esqueci minha senha
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="text-sm text-muted-foreground"
                onClick={() => setMode("signup")}
              >
                Criar conta com email e senha
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          <Button type="button" variant="ghost" className="text-sm text-muted-foreground" onClick={() => navigate("/planos")}>
            Ainda não tem conta? Veja os planos
          </Button>
          <Button type="button" variant="ghost" className="text-sm text-muted-foreground" onClick={() => navigate("/vendas")}>
            Conhecer o app
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
