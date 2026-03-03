import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Baby, CheckCircle, Crown, ArrowRight, ShieldCheck, Star,
  BookOpen, Heartbeat, Heart, Robot, Sparkle, ArrowLeft,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const essentialFeatures = [
  "Acesso completo semana 1 a 42",
  "Conteúdo de Saúde, Exercícios e Alimentação",
  "Desenvolvimento do bebê semana a semana",
  "Comparações de tamanho do bebê",
  "Diário de humor e sintomas",
  "Atualizações futuras incluídas",
  "Acesso por 12 meses",
];

const premiumFeatures = [
  "Tudo do plano Essencial",
  "Assistente de IA 24h",
  "Respostas personalizadas",
  "Uso ilimitado do chat IA",
  "Recursos premium futuros",
  "Suporte prioritário",
  "Acesso por 12 meses",
];

const faqs = [
  { q: "Preciso de assinatura?", a: "Não! É pagamento único com acesso por 12 meses completos." },
  { q: "Como funciona o acesso?", a: "Após o pagamento, você recebe um link no email para acessar imediatamente." },
  { q: "Posso fazer upgrade depois?", a: "Sim! Você pode migrar do Essencial para o Premium a qualquer momento." },
  { q: "O app substitui o médico?", a: "Não. O MamyBoo é informativo e complementar ao acompanhamento médico." },
];

const Plans = () => {
  const navigate = useNavigate();

  // TODO: Replace with actual Kiwify checkout URLs
  const essentialCheckoutUrl = "#";
  const premiumCheckoutUrl = "#";

  const handleSelectPlan = (url: string) => {
    if (url === "#") {
      // For now, navigate to login
      navigate("/login");
      return;
    }
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Baby className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-base text-foreground">MamyBoo</span>
          </div>
          <Button variant="ghost" size="sm" className="text-sm" onClick={() => navigate("/login")}>
            Já tenho conta
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-12 md:py-16 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground">
            Escolha o plano ideal para sua <span className="text-primary">jornada</span>
          </h1>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Pagamento único, sem assinaturas. Acesso completo por 12 meses.
          </p>
        </motion.div>
      </section>

      {/* Plans */}
      <section className="px-6 pb-16 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Essential */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl border border-border shadow-card p-6 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-peach flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-peach-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display">Essencial</h2>
                <p className="text-xs text-muted-foreground">Tudo para acompanhar sua gestação</p>
              </div>
            </div>
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold font-display text-foreground">R$ 47</span>
                <span className="text-sm text-muted-foreground">pagamento único</span>
              </div>
            </div>
            <ul className="space-y-3 flex-1 mb-6">
              {essentialFeatures.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{f}</span>
                </li>
              ))}
              <li className="flex items-start gap-2 text-sm opacity-40">
                <span className="w-4 h-4 flex-shrink-0 mt-0.5 text-center">✕</span>
                <span>Assistente de IA</span>
              </li>
            </ul>
            <Button
              onClick={() => handleSelectPlan(essentialCheckoutUrl)}
              variant="outline"
              className="w-full h-14 rounded-xl font-semibold text-base"
            >
              Quero começar
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>

          {/* Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl border-2 border-primary shadow-elevated p-6 flex flex-col relative"
          >
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground px-4 py-1 text-xs font-semibold border-0">
              ⭐ Mais escolhido
            </Badge>
            <div className="flex items-center gap-3 mb-4 mt-2">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
                <Crown className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display">Premium</h2>
                <p className="text-xs text-muted-foreground">A experiência completa</p>
              </div>
            </div>
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold font-display text-foreground">R$ 97</span>
                <span className="text-sm text-muted-foreground">pagamento único</span>
              </div>
              <p className="text-xs text-primary font-medium mt-1">Economize com IA ilimitada inclusa</p>
            </div>
            <ul className="space-y-3 flex-1 mb-6">
              {premiumFeatures.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" weight="fill" />
                  <span className="text-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleSelectPlan(premiumCheckoutUrl)}
              className="w-full h-14 rounded-xl gradient-primary text-primary-foreground font-semibold text-base shadow-soft"
            >
              Quero o Premium
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>

        {/* Security badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground"
        >
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>Pagamento 100% seguro via Kiwify</span>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold font-display text-center text-foreground mb-8">Perguntas frequentes</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl p-5 border border-border shadow-card"
              >
                <h3 className="font-semibold text-sm text-foreground">{faq.q}</h3>
                <p className="text-sm text-muted-foreground mt-1">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 px-6 text-center">
        <p className="text-xs text-muted-foreground/60">
          Este app não substitui acompanhamento médico profissional.
        </p>
      </section>
    </div>
  );
};

export default Plans;
