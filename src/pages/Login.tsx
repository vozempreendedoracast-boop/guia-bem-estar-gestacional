import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Baby, EnvelopeSimple, ArrowRight, SpinnerGap, Lock, Eye, EyeSlash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AuthMode = "login" | "signup";

const parseAuthErrorMessage = (error: unknown, fallback: string) => {
  const message = String((error as { message?: string } | null)?.message ?? "").toLowerCase();

  if (
    message.includes("over_email_send_rate_limit") ||
    message.includes("rate limit") ||
    message.includes("429")
  ) {
    return "Muitas tentativas de envio. Aguarde 60 segundos e tente novamente.";
  }

  return fallback;
};

const Login = () => {
  const navigate = useNavigate();
  const { signInWithPassword, signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [recoveryCooldownUntil, setRecoveryCooldownUntil] = useState<number>(0);

  const getPostLoginRoute = async (userId: string) => {
    const { data: adminData, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });

    if (error) {
      console.error("Erro ao validar role admin:", error);
      return "/painel";
    }

    return adminData ? "/administracao" : "/painel";
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    const { error, user } = await signInWithPassword(email.trim(), password.trim());

    if (error || !user) {
      setLoading(false);
      toast.error("Email ou senha incorretos.");
      return;
    }

    const redirectPath = await getPostLoginRoute(user.id);
    setLoading(false);
    navigate(redirectPath, { replace: true });
  };

  const handleSignUpWithPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) return;
    if (password !== confirmPassword) {
      toast.error("As senhas não conferem.");
      return;
    }

    setLoading(true);
    const { error, user } = await signUp(email.trim(), password.trim());

    if (error) {
      setLoading(false);
      toast.error("Erro ao criar conta. Tente novamente.");
      return;
    }

    if (user) {
      const redirectPath = await getPostLoginRoute(user.id);
      setLoading(false);
      navigate(redirectPath, { replace: true });
      return;
    }

    setLoading(false);
    toast.success("Conta criada! Verifique seu email para confirmar o acesso.");
    setMode("login");
  };

  const handleForgotPassword = async () => {
    const now = Date.now();

    if (!email.trim()) {
      toast.error("Digite seu email primeiro para recuperar a senha.");
      return;
    }

    if (now < recoveryCooldownUntil) {
      const remainingSeconds = Math.ceil((recoveryCooldownUntil - now) / 1000);
      toast.error(`Aguarde ${remainingSeconds}s para tentar enviar novamente.`);
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);

    if (error) {
      const message = parseAuthErrorMessage(error, "Erro ao enviar email de recuperação.");
      if (message.includes("Aguarde 60 segundos")) {
        setRecoveryCooldownUntil(Date.now() + 60_000);
      }
      toast.error(message);
      return;
    }

    toast.success("Email de recuperação enviado! Verifique sua caixa de entrada.");
    setRecoveryCooldownUntil(Date.now() + 60_000);
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
            {mode === "signup" ? "Criar conta" : "Entrar no MamyBoo"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {mode === "signup"
              ? "Cadastre-se com email e senha para acessar o app."
              : "Entre com seu email e senha."}
          </p>
        </div>

        {mode === "signup" ? (
          <form onSubmit={handleSignUpWithPassword} className="space-y-4">
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
          <form onSubmit={handlePasswordLogin} className="space-y-4">
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
