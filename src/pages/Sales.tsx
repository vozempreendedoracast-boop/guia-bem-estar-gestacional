import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Baby, Heart, BookOpen, Heartbeat, Robot, ShieldCheck, Star, CheckCircle, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import heroLanding from "@/assets/hero-landing.png";

const features = [
  { icon: BookOpen, title: "Jornada Semana a Semana", description: "Acompanhe as 40 semanas de gestação com conteúdo liberado automaticamente conforme sua idade gestacional." },
  { icon: Heart, title: "Saúde Integral", description: "Alimentação, sono, saúde emocional e preparação para o parto reunidos em um só lugar." },
  { icon: Heartbeat, title: "Exercícios Personalizados", description: "Atividades seguras organizadas por trimestre, com instruções claras e detalhadas." },
  { icon: Robot, title: "Assistente IA 24h", description: "Tire suas dúvidas a qualquer momento com nossa inteligência artificial empática e acolhedora." },
  { icon: ShieldCheck, title: "Diário e Progresso", description: "Registre humor, sintomas e peso. Acompanhe sua evolução com gráficos fáceis de entender." },
  { icon: Star, title: "Conteúdo Profissional", description: "Todo o conteúdo é revisado por profissionais de saúde para garantir sua segurança." },
];

const benefits = [
  "Informação certa na hora certa",
  "Reduz ansiedade e insegurança",
  "Organiza toda a sua jornada",
  "Apoio emocional contínuo",
  "A partir de R$ 47 (pagamento único)",
  "Funciona no celular e offline",
];

const testimonials = [
  { name: "Camila S.", week: "Semana 28", text: "Me sinto acompanhada todos os dias. As dicas são certeiras e o diário me ajuda muito!" },
  { name: "Juliana M.", week: "Semana 16", text: "A assistente IA me tranquilizou em vários momentos de dúvida. Recomendo muito!" },
  { name: "Ana Paula R.", week: "Semana 34", text: "Os exercícios por trimestre são perfeitos. Me sinto mais preparada para o parto." },
];

const Sales = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Baby className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-base sm:text-lg text-foreground">MamyBoo</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => scrollToSection("features")}>Recursos</Button>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => scrollToSection("testimonials")}>Depoimentos</Button>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => navigate("/login")}>Entrar</Button>
            <Button size="sm" className="rounded-xl text-xs sm:text-sm" onClick={() => navigate("/planos")}>
              Ver planos
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
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
              <Button size="lg" className="rounded-xl text-base h-14 px-8" onClick={() => navigate("/planos")}>
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
      <section className="bg-primary/5 py-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground">{b}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display text-foreground">Tudo que você precisa</h2>
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
                className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-elevated transition-shadow"
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

      {/* CTA mid */}
      <section className="gradient-hero py-16">
        <div className="max-w-3xl mx-auto px-6 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold font-display">Comece agora, é grátis</h2>
          <p className="mt-3 opacity-90 max-w-lg mx-auto">
            Junte-se a milhares de gestantes que já usam o Minha Gestação para se sentirem mais seguras e informadas.
          </p>
          <Button
            size="lg"
            className="mt-8 rounded-xl text-base h-14 px-10 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            onClick={() => navigate("/cadastro")}
          >
            Começar grátis agora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display text-foreground">O que dizem as mamães</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-card"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 text-primary" weight="fill" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed italic">"{t.text}"</p>
                <div className="mt-4 pt-3 border-t border-border">
                  <p className="font-semibold text-sm text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.week}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Baby className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold font-display text-foreground">Pronta para começar?</h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Crie sua conta gratuita em menos de 2 minutos e comece a acompanhar sua gestação com carinho e segurança.
          </p>
          <Button size="lg" className="mt-8 rounded-xl text-base h-14 px-10" onClick={() => navigate("/cadastro")}>
            Criar conta grátis
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-xs text-muted-foreground/60 mt-4">
            Este app não substitui acompanhamento médico profissional.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Baby className="w-5 h-5 text-primary" />
            <span className="font-display font-semibold text-foreground">Minha Gestação</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Minha Gestação. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Sales;
