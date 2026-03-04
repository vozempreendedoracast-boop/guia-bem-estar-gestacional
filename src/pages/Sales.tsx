import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Heart, BookOpen, Heartbeat, Robot, ShieldCheck, Star,
  CheckCircle, ArrowRight, Crown, Sparkle, BabyCarriage,
  Butterfly, FlowerLotus, StarFour,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import heroLanding from "@/assets/hero-landing.png";
import mamybooPink from "@/assets/mamyboo-pink.png";
import mamybooWhite from "@/assets/mamyboo-white.png";
import trustKiwify from "@/assets/trust-kiwify.png";
import trustSeguro from "@/assets/trust-seguro.webp";

const features = [
  { icon: BookOpen, title: "Jornada Semana a Semana", description: "Acompanhe as 40 semanas com conteúdo liberado automaticamente." },
  { icon: Heart, title: "Saúde Integral", description: "Alimentação, sono, emocional e preparação para o parto." },
  { icon: Heartbeat, title: "Exercícios por Trimestre", description: "Atividades seguras com instruções claras e detalhadas." },
  { icon: Robot, title: "Assistente IA 24h", description: "Tire dúvidas a qualquer momento com IA empática." },
  { icon: ShieldCheck, title: "Diário e Progresso", description: "Registre humor, sintomas e peso com gráficos fáceis." },
  { icon: Star, title: "Conteúdo Profissional", description: "Revisado por profissionais de saúde." },
];

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

/* Floating decorative blobs */
const FloatingBlob = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none opacity-30 blur-3xl ${className}`}
    animate={{ y: [0, -20, 0], x: [0, 10, 0], scale: [1, 1.05, 1] }}
    transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

const FloatingSparkle = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.div
    className={`absolute pointer-events-none ${className}`}
    animate={{ y: [0, -12, 0], rotate: [0, 15, -15, 0], opacity: [0.4, 0.8, 0.4] }}
    transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
  >
    <Sparkle className="w-5 h-5 text-primary/40" weight="fill" />
  </motion.div>
);

/* Cute floating elements */
const cuteElements = [
  { Icon: Heart, className: "top-[15%] left-[3%]", delay: 0, size: "w-32 h-32", color: "text-primary/20" },
  { Icon: Heart, className: "top-[35%] right-[4%]", delay: 1.5, size: "w-24 h-24", color: "text-primary/15" },
  { Icon: Butterfly, className: "top-[50%] left-[5%]", delay: 2, size: "w-36 h-36", color: "text-lilac-foreground/15" },
  { Icon: FlowerLotus, className: "top-[25%] right-[6%]", delay: 3, size: "w-32 h-32", color: "text-primary/15" },
  { Icon: StarFour, className: "top-[65%] left-[4%]", delay: 0.5, size: "w-28 h-28", color: "text-primary/20" },
  { Icon: Heart, className: "top-[75%] right-[3%]", delay: 2.5, size: "w-28 h-28", color: "text-primary/15" },
  { Icon: BabyCarriage, className: "top-[45%] right-[5%]", delay: 4, size: "w-32 h-32", color: "text-primary/12" },
  { Icon: Butterfly, className: "top-[85%] left-[6%]", delay: 1, size: "w-28 h-28", color: "text-lilac-foreground/12" },
  { Icon: FlowerLotus, className: "top-[55%] left-[2%]", delay: 3.5, size: "w-24 h-24", color: "text-primary/18" },
  { Icon: Heart, className: "top-[10%] right-[8%]", delay: 4.5, size: "w-24 h-24", color: "text-primary/20" },
  { Icon: StarFour, className: "top-[90%] right-[6%]", delay: 2, size: "w-24 h-24", color: "text-primary/15" },
  { Icon: Butterfly, className: "top-[70%] left-[7%]", delay: 5, size: "w-28 h-28", color: "text-primary/12" },
];

const FloatingCuteElement = ({ Icon, className, delay, size, color }: typeof cuteElements[0]) => (
  <motion.div
    className={`absolute pointer-events-none z-0 hidden md:block ${className}`}
    animate={{
      y: [0, -18, 0],
      x: [0, 8, -4, 0],
      rotate: [0, 10, -8, 0],
      opacity: [0.3, 0.7, 0.3],
    }}
    transition={{ duration: 7 + delay, repeat: Infinity, delay, ease: "easeInOut" }}
  >
    <Icon className={`${size} ${color}`} weight="fill" />
  </motion.div>
);

const Sales = () => {
  const navigate = useNavigate();

  const essentialCheckoutUrl = "#";
  const premiumCheckoutUrl = "#";

  const handleSelectPlan = (url: string) => {
    if (url === "#") {
      navigate("/login");
      return;
    }
    window.open(url, "_blank");
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Cute floating background elements */}
      {cuteElements.map((el, i) => (
        <FloatingCuteElement key={i} {...el} />
      ))}

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={mamybooPink} alt="MamyBoo" className="w-8 h-8 object-contain" />
            <span className="font-display font-bold text-base sm:text-lg text-foreground">MamyBoo</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => scrollToSection("features")}>Recursos</Button>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => scrollToSection("plans")}>Planos</Button>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => navigate("/login")}>Entrar</Button>
            <Button size="sm" className="rounded-xl text-xs sm:text-sm" onClick={() => scrollToSection("plans")}>
              Ver planos
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative">
        <FloatingBlob className="w-72 h-72 bg-primary/20 -top-20 -left-20" delay={0} />
        <FloatingBlob className="w-56 h-56 bg-secondary -top-10 right-10" delay={2} />
        <FloatingSparkle className="top-24 left-[15%]" delay={0.5} />
        <FloatingSparkle className="top-40 right-[20%]" delay={1.5} />
        <FloatingSparkle className="bottom-12 left-[60%]" delay={3} />

        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center md:text-left"
          >
            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">
              ✨ A partir de R$ 47 · Pagamento único
            </span>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground leading-tight">
              Sua companheira durante toda a
              <span className="text-primary"> gestação</span>
            </h1>
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed max-w-lg">
              Informação personalizada, apoio emocional e acompanhamento semana a semana. Tudo que você precisa em um único app.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button size="lg" className="rounded-xl text-base h-14 px-8" onClick={() => scrollToSection("plans")}>
                Ver planos e preços
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl text-base h-14 px-8" onClick={() => scrollToSection("features")}>
                Conhecer recursos
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 max-w-md"
          >
            <img src={heroLanding} alt="Gestante feliz com borboletas" className="w-full rounded-3xl shadow-elevated" />
          </motion.div>
        </div>
      </section>

      {/* Benefits strip */}
      <section className="gradient-peach py-10 relative z-10">
        <FloatingSparkle className="top-4 right-[10%]" delay={1} />
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Informação certa na hora certa",
              "Reduz ansiedade e insegurança",
              "Organiza toda a sua jornada",
              "Apoio emocional contínuo",
              "A partir de R$ 47 (pagamento único)",
              "Funciona no celular e offline",
            ].map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" weight="fill" />
                <span className="text-sm text-foreground font-medium">{b}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 relative z-10">
        <FloatingBlob className="w-64 h-64 bg-lilac/40 -bottom-20 -right-20" delay={1} />
        <FloatingSparkle className="top-10 left-[8%]" delay={2} />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold font-display text-foreground"
            >
              Tudo que você precisa 💜
            </motion.h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Desenvolvido com carinho para acompanhar cada momento da sua gestação.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-elevated transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — carousel */}
      <section id="testimonials" className="py-16 gradient-lilac relative z-10">
        <FloatingSparkle className="top-6 left-[25%]" delay={0} />
        <FloatingSparkle className="bottom-10 right-[15%]" delay={2.5} />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold font-display text-foreground"
            >
              O que dizem as mamães 🥰
            </motion.h2>
          </div>
          <TestimonialsCarousel />
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="py-16 relative z-10">
        <FloatingBlob className="w-80 h-80 bg-peach/30 -top-20 -left-32" delay={0.5} />
        <FloatingBlob className="w-60 h-60 bg-sage/30 bottom-0 right-0" delay={3} />
        <FloatingSparkle className="top-20 right-[12%]" delay={1} />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold font-display text-foreground"
            >
              Escolha seu plano ✨
            </motion.h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Pagamento único, sem assinaturas. Acesso completo por 12 meses.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Essential */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl border border-border shadow-card p-6 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-peach flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-peach-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display">Essencial</h3>
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
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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
                  <h3 className="text-xl font-bold font-display">Premium</h3>
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

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col items-center gap-6"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Pagamento 100% seguro via Kiwify</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <img src={trustKiwify} alt="Formas de pagamento Kiwify - Compra 100% segura" className="h-14 object-contain" />
              <img src={trustSeguro} alt="Site seguro - SSL - Satisfação garantida" className="h-16 object-contain" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="gradient-sage py-16 relative z-10">
        <FloatingSparkle className="top-8 right-[20%]" delay={0.5} />
        <FloatingSparkle className="bottom-6 left-[10%]" delay={2} />

        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold font-display text-center text-foreground mb-8"
          >
            Perguntas frequentes 🤔
          </motion.h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card/90 backdrop-blur-sm rounded-2xl p-5 border border-border shadow-card"
              >
                <h3 className="font-semibold text-sm text-foreground">{faq.q}</h3>
                <p className="text-sm text-muted-foreground mt-1">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="gradient-hero py-16 relative z-10">
        <FloatingSparkle className="top-4 left-[30%]" delay={1} />
        <FloatingSparkle className="bottom-4 right-[25%]" delay={3} />

        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <img src={mamybooWhite} alt="MamyBoo" className="w-16 h-16 object-contain mx-auto mb-4" />
          <h2 className="text-3xl font-bold font-display text-primary-foreground">Pronta para começar?</h2>
          <p className="text-primary-foreground/80 mt-3 max-w-md mx-auto">
            Escolha seu plano e comece a acompanhar sua gestação com carinho e segurança.
          </p>
          <Button
            size="lg"
            className="mt-8 rounded-xl text-base h-14 px-10 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            onClick={() => scrollToSection("plans")}
          >
            Escolher meu plano
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-xs text-primary-foreground/50 mt-4">
            Este app não substitui acompanhamento médico profissional.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-background relative z-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={mamybooPink} alt="MamyBoo" className="w-7 h-7 object-contain" />
            <span className="font-display font-semibold text-foreground">MamyBoo</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 MamyBoo. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Sales;
