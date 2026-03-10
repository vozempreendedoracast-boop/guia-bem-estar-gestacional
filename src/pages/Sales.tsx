import PageSEO from "@/components/PageSEO";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Heart, BookOpen, Heartbeat, Robot, ShieldCheck, Star,
  CheckCircle, ArrowRight, Crown, Sparkle, BabyCarriage,
  Butterfly, FlowerLotus, StarFour, Notebook,
  Stethoscope, Seal, Baby, Calendar, FirstAid, Brain,
  Lock, Fire, X as XMark,
} from "@phosphor-icons/react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import { useActivePlans } from "@/hooks/useSupabaseData";
import heroLanding from "@/assets/hero-landing.png";
import mamybooPink from "@/assets/mamyboo-pink.png";
import mamybooWhite from "@/assets/mamyboo-white.png";
import trustKiwify from "@/assets/trust-kiwify.png";
import trustSeguro from "@/assets/trust-seguro.webp";

const features = [
  { icon: BookOpen, title: "Jornada Semana a Semana", description: "Acompanhe todas as semanas da gestação com conteúdos liberados automaticamente explicando o desenvolvimento do seu bebê e as mudanças no seu corpo." },
  { icon: Heart, title: "Saúde Integral", description: "Orientações sobre alimentação, sono, saúde emocional e preparação para o parto." },
  { icon: Heartbeat, title: "Exercícios por Trimestre", description: "Exercícios seguros para cada fase da gestação, ajudando a aliviar desconfortos e preparar o corpo para o parto." },
  { icon: Robot, title: "Assistente IA 24h", description: "Tire dúvidas sempre que precisar com uma assistente treinada para responder perguntas comuns da gestação." },
  { icon: Notebook, title: "Diário e Progresso", description: "Registre humor, sintomas e peso e acompanhe sua evolução com gráficos simples." },
  { icon: ShieldCheck, title: "Conteúdo Revisado", description: "Informações desenvolvidas com base em recomendações de profissionais de saúde e literatura médica." },
];

const iconMap: Record<string, any> = { BookOpen, Crown, Star, Heart, Sparkle };

const faqs = [
  { q: "Preciso de assinatura?", a: "Não! É pagamento único com acesso por 12 meses completos." },
  { q: "Como funciona o acesso?", a: "Após o pagamento, você recebe um link no email para acessar imediatamente." },
  { q: "Posso fazer upgrade depois?", a: "Sim! Você pode migrar do Essencial para o Premium a qualquer momento." },
  { q: "O app substitui o médico?", a: "Não. O MamyBoo é informativo e complementar ao acompanhamento médico." },
  { q: "Tem garantia?", a: "Sim! Oferecemos garantia de 7 dias. Se não gostar, devolvemos seu dinheiro sem burocracia." },
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

const staggerChild = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const Sales = () => {
  const navigate = useNavigate();
  const { data: plans = [] } = useActivePlans();

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
      <PageSEO
        title="Planos e Preços — App de Gravidez"
        description="Conheça os planos do MamyBoo. Acompanhamento gestacional completo com diário, sintomas, exercícios, IA e muito mais a partir de R$ 47."
        keywords="app gravidez preço, plano acompanhamento gestacional, aplicativo para grávidas, MamyBoo planos"
        path="/vendas"
      />
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
            
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => navigate("/login")}>Entrar</Button>
            <Button size="sm" className="rounded-xl text-xs sm:text-sm" onClick={() => scrollToSection("plans")}>
              Ver planos
            </Button>
          </div>
        </div>
      </nav>

      {/* 01 — Hero */}
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
              ✨ A partir de R$ 47 · Pagamento único · Acesso por 12 meses
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-foreground leading-tight">
              Acompanhe sua gestação semana a semana com
              <span className="text-primary"> segurança e tranquilidade.</span>
            </h1>
            <p className="text-muted-foreground mt-4 text-base sm:text-lg leading-relaxed max-w-lg">
              Saiba exatamente o que acontece com seu bebê, cuide da sua saúde e tire dúvidas a qualquer momento — tudo em um único app.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button size="lg" className="rounded-xl text-base h-14 px-8" onClick={() => scrollToSection("plans")}>
                Começar meu acompanhamento
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl text-base h-14 px-8" onClick={() => scrollToSection("features")}>
                Ver Recursos
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 max-w-md"
          >
            <img src={heroLanding} alt="Gestante feliz acompanhando sua gestação" className="w-full rounded-3xl shadow-elevated" />
          </motion.div>
        </div>
      </section>

      {/* 02 — Valor percebido — Cards modernos */}
      <section className="gradient-peach py-16 relative z-10">
        <FloatingSparkle className="top-4 right-[10%]" delay={1} />
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
              Menos que uma consulta médica 💜
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Por menos que o valor de uma consulta, você tem acompanhamento durante toda a gestação.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: Calendar, number: "40", label: "Semanas de conteúdo", desc: "Acompanhamento completo do 1º ao último dia" },
              { icon: Baby, number: "24h", label: "Sempre disponível", desc: "Acesse informações a qualquer hora do dia" },
              { icon: Heart, number: "12", label: "Meses de acesso", desc: "Pagamento único sem renovação automática" },
            ].map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerChild}
                className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-card text-center group hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="w-7 h-7 text-primary" weight="duotone" />
                </div>
                <span className="text-3xl font-bold font-display text-primary">{item.number}</span>
                <h3 className="font-semibold text-foreground mt-1">{item.label}</h3>
                <p className="text-sm text-muted-foreground mt-2">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — Benefícios rápidos — Cards com ícones */}
      <section className="py-16 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
              Informação certa no momento certo ✨
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { icon: Baby, title: "Desenvolvimento do bebê", text: "Saiba o que está acontecendo com seu bebê em cada semana da gestação" },
              { icon: Heart, title: "Mudanças no seu corpo", text: "Entenda as mudanças do seu corpo e cuide melhor da sua saúde" },
              { icon: Brain, title: "Menos ansiedade", text: "Reduza a ansiedade com informações claras e confiáveis" },
              { icon: Robot, title: "Assistente 24 horas", text: "Tire dúvidas a qualquer momento com uma assistente inteligente" },
            ].map((b, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerChild}
                className="flex items-start gap-4 bg-card rounded-2xl p-5 border border-border shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <b.icon className="w-6 h-6 text-primary" weight="duotone" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{b.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{b.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — Features */}
      <section id="features" className="py-16 gradient-lilac relative z-10">
        <FloatingBlob className="w-64 h-64 bg-lilac/40 -bottom-20 -right-20" delay={1} />
        <FloatingSparkle className="top-10 left-[8%]" delay={2} />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl font-bold font-display text-foreground"
            >
              Tudo que você precisa durante sua gestação 💜
            </motion.h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Desenvolvido com carinho para acompanhar cada momento dessa jornada.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerChild}
                className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-elevated transition-all hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 — Jornada da gestante — Layout moderno com cards lado a lado */}
      <section className="py-16 relative z-10 overflow-hidden">
        <FloatingBlob className="w-48 h-48 bg-peach/40 -top-10 right-0" delay={2} />
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
              A gestação é um momento lindo… mas também cheio de dúvidas 🤔
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {/* Left: Grande card emocional */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="gradient-peach rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 opacity-10">
                <Heart className="w-32 h-32 text-primary" weight="fill" />
              </div>
              <h3 className="text-xl font-bold font-display text-foreground relative z-10">
                Muitas gestantes sentem insegurança durante a gravidez
              </h3>
              <p className="text-muted-foreground mt-3 leading-relaxed relative z-10">
                A busca por informações na internet pode gerar mais dúvidas do que respostas. 
                Cada semana traz novas mudanças e novas perguntas.
              </p>
              <p className="text-primary font-semibold mt-4 relative z-10">
                O MamyBoo foi criado para ajudar você a viver essa fase com mais tranquilidade. 💕
              </p>
            </motion.div>

            {/* Right: Mini cards empilhados */}
            <div className="space-y-4">
              {[
                { icon: FirstAid, text: "Dúvidas sobre sintomas e quando procurar o médico" },
                { icon: Baby, text: "Ansiedade sobre o desenvolvimento do bebê" },
                { icon: Heart, text: "Incerteza sobre alimentação e cuidados" },
                { icon: Brain, text: "Medo do parto e preocupações emocionais" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerChild}
                  className="flex items-center gap-4 bg-card rounded-2xl p-4 border border-border shadow-card hover:shadow-elevated transition-all hover:-translate-y-0.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" weight="duotone" />
                  </div>
                  <span className="text-foreground text-sm font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 06 — Testimonials */}
      <section id="testimonials" className="py-16 gradient-peach relative z-10">
        <FloatingSparkle className="top-6 left-[25%]" delay={0} />
        <FloatingSparkle className="bottom-10 right-[15%]" delay={2.5} />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl font-bold font-display text-foreground"
            >
              O que dizem as mamães 🥰
            </motion.h2>
          </div>
          <TestimonialsCarousel />
        </div>
      </section>

      {/* 07 — Diferencial + Autoridade — Grid moderno de cards */}
      <section className="py-16 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
              Por que confiar no MamyBoo? 💜
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Stethoscope,
                title: "Base Médica",
                desc: "Conteúdo desenvolvido com base em recomendações de profissionais de saúde e literatura médica.",
                gradient: "gradient-sage",
              },
              {
                icon: Seal,
                title: "Garantia de 7 dias",
                desc: "Teste o app com tranquilidade. Se não gostar, devolvemos seu dinheiro sem burocracia.",
                gradient: "gradient-lilac",
              },
              {
                icon: Lock,
                title: "Pagamento Seguro",
                desc: "Plataforma Kiwify com criptografia SSL. Seus dados estão sempre protegidos.",
                gradient: "gradient-peach",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerChild}
                className={`${card.gradient} rounded-3xl p-7 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <card.icon className="w-32 h-32 text-foreground" weight="fill" />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-card/60 backdrop-blur-sm flex items-center justify-center mb-5 shadow-card">
                  <card.icon className="w-7 h-7 text-primary" weight="duotone" />
                </div>
                <h3 className="font-bold text-lg font-display text-foreground">{card.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed relative z-10">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 08 — Garantia — Card premium */}
      <section className="py-14 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="gradient-lilac rounded-3xl p-8 sm:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 opacity-5">
              <Seal className="w-56 h-56 text-foreground" weight="fill" />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-card/60 backdrop-blur-sm flex items-center justify-center shadow-elevated flex-shrink-0">
                <Seal className="w-10 h-10 text-primary" weight="duotone" />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                  Experimente sem risco ✅
                </h2>
                <p className="text-muted-foreground mt-3 text-base leading-relaxed">
                  Você pode testar o app com tranquilidade. <strong className="text-foreground">Oferecemos garantia de 7 dias.</strong>
                </p>
                <p className="text-muted-foreground mt-2 text-base leading-relaxed">
                  Se dentro desse período você sentir que o app não é para você, basta solicitar o reembolso. Sem burocracia.
                </p>
                <Button 
                  className="mt-6 rounded-xl h-12 px-8"
                  onClick={() => scrollToSection("plans")}
                >
                  Ver planos <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Launch offer intro */}
      <section className="py-16 relative z-10">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Fire className="w-4 h-4" weight="fill" />
              Oferta de Lançamento
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
              O MamyBoo foi criado para acompanhar cada fase da gestação com informação confiável e apoio emocional. 💜
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto leading-relaxed">
              Para o lançamento do aplicativo, as <strong className="text-foreground">primeiras 100 gestantes</strong> terão acesso ao preço especial.
            </p>
          </motion.div>

          {/* Vacancy counter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 max-w-md mx-auto"
          >
            <div className="bg-card rounded-2xl border border-border shadow-card p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-foreground">Vagas de lançamento</span>
                <span className="text-sm font-bold text-primary">87 de 100</span>
              </div>
              <Progress value={87} className="h-3 bg-muted" />
              <p className="text-xs text-muted-foreground mt-3">
                🔥 Restam apenas <strong className="text-foreground">13 vagas</strong> com preço de lançamento.
              </p>
            </div>
          </motion.div>
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
              className="text-2xl sm:text-3xl font-bold font-display text-foreground"
            >
              Escolha seu plano ✨
            </motion.h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Pagamento único, sem assinaturas. Acesso completo por 12 meses.
            </p>
          </div>

          <div className={`grid gap-6 ${plans.length === 1 ? 'max-w-md mx-auto' : plans.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
            {plans.map((plan, i) => {
              const IconComp = iconMap[plan.icon] || BookOpen;
              const isPremium = plan.slug === "premium" || plan.highlighted;
              return (
                <motion.div
                  key={plan.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerChild}
                  className={`bg-card rounded-2xl p-6 flex flex-col relative ${
                    isPremium
                      ? "border-2 border-primary shadow-elevated ring-2 ring-primary/20 scale-[1.02]"
                      : "border border-border shadow-card opacity-90"
                  }`}
                >
                  {plan.badge && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground px-4 py-1 text-xs font-semibold border-0">
                      {plan.badge}
                    </Badge>
                  )}
                  <div className={`flex items-center gap-3 mb-4 ${plan.badge ? "mt-2" : ""}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isPremium
                        ? "gradient-primary shadow-soft"
                        : "bg-muted"
                    }`}>
                      <IconComp className={`w-6 h-6 ${isPremium ? "text-primary-foreground" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-display">{plan.name}</h3>
                      <p className="text-xs text-muted-foreground">{plan.description}</p>
                    </div>
                  </div>
                  <div className="mb-6">
                    {isPremium && (
                      <p className="text-sm text-muted-foreground mb-1">
                        <span className="line-through">R$ 297</span>
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">-67% OFF</span>
                      </p>
                    )}
                    {!isPremium && (
                      <p className="text-sm text-muted-foreground mb-1">
                        <span className="line-through">R$ 179</span>
                        <span className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">Lançamento</span>
                      </p>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold font-display text-foreground">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">{plan.price_label}</span>
                    </div>
                    {isPremium && (
                      <p className="text-xs text-primary font-medium mt-1">
                        Menos de R$ 8 por mês durante toda a gestação.
                      </p>
                    )}
                    {!isPremium && plan.highlight_text && (
                      <p className="text-xs text-muted-foreground font-medium mt-1">{plan.highlight_text}</p>
                    )}
                    {isPremium && (
                      <p className="text-[11px] text-muted-foreground mt-2">
                        Preço especial de lançamento para as primeiras gestantes.
                      </p>
                    )}
                    {!isPremium && (
                      <p className="text-[11px] text-muted-foreground mt-2">
                        Após o lançamento: R$ 179
                      </p>
                    )}
                  </div>
                  <ul className="space-y-3 flex-1 mb-6">
                    {(plan.features || []).map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isPremium ? "text-primary" : "text-muted-foreground"}`} weight={isPremium ? "fill" : "regular"} />
                        <span className="text-foreground">{f}</span>
                      </li>
                    ))}
                    {(plan.excluded_features || []).map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm opacity-40">
                        <XMark className="w-4 h-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
                        <span>{f}</span>
                      </li>
                    ))}
                    {!isPremium && (
                      <li className="flex items-start gap-2 text-sm opacity-40">
                        <XMark className="w-4 h-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
                        <span>Atualizações e recursos futuros</span>
                      </li>
                    )}
                  </ul>
                  <Button
                    onClick={() => handleSelectPlan(plan.checkout_url || "#")}
                    variant={isPremium ? "default" : "outline"}
                    className={`w-full h-14 rounded-xl font-semibold text-base ${
                      isPremium ? "gradient-primary text-primary-foreground shadow-soft" : ""
                    }`}
                  >
                    {isPremium ? "Quero Premium" : "Começar"}
                    {isPremium && <ArrowRight className="w-5 h-5 ml-2" />}
                  </Button>
                </motion.div>
              );
            })}
          </div>

          {/* Guarantee reminder */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-card border border-border rounded-2xl px-5 py-3 shadow-card">
              <Seal className="w-5 h-5 text-primary" weight="fill" />
              <span className="text-sm text-foreground font-medium">Teste por 7 dias. Se não gostar, devolvemos 100% do seu dinheiro.</span>
            </div>
          </motion.div>

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
          <div className="grid sm:grid-cols-2 gap-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerChild}
                className="bg-card/90 backdrop-blur-sm rounded-2xl p-5 border border-border shadow-card hover:shadow-elevated transition-all hover:-translate-y-0.5"
              >
                <h3 className="font-semibold text-sm text-foreground">{faq.q}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10 — Final CTA */}
      <section className="gradient-hero py-16 relative z-10">
        <FloatingSparkle className="top-4 left-[30%]" delay={1} />
        <FloatingSparkle className="bottom-4 right-[25%]" delay={3} />

        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <img src={mamybooWhite} alt="MamyBoo" className="w-16 h-16 object-contain mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-primary-foreground">
            Comece hoje a acompanhar sua gestação com mais tranquilidade
          </h2>
          <p className="text-primary-foreground/80 mt-3 max-w-md mx-auto text-base leading-relaxed">
            Tenha acesso a informações confiáveis, acompanhamento semana a semana e ferramentas para cuidar da sua saúde e do seu bebê.
          </p>
          <Button
            size="lg"
            className="mt-8 rounded-xl text-base h-14 px-10 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            onClick={() => scrollToSection("plans")}
          >
            Quero acompanhar minha gestação
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-xs text-primary-foreground/50 mt-4">
            Pagamento único • acesso por 12 meses • compra segura via Kiwify
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
