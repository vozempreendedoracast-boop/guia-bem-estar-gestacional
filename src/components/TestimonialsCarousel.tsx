import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "@phosphor-icons/react";

const testimonials = [
  { name: "Camila S.", week: "Semana 28", text: "Me sinto acompanhada todos os dias. As dicas são certeiras e o diário me ajuda muito!" },
  { name: "Juliana M.", week: "Semana 16", text: "A assistente IA me tranquilizou em vários momentos de dúvida. Recomendo muito!" },
  { name: "Ana Paula R.", week: "Semana 34", text: "Os exercícios por trimestre são perfeitos. Me sinto mais preparada para o parto." },
  { name: "Fernanda L.", week: "Semana 22", text: "Amo o acompanhamento semana a semana! Cada detalhe sobre o bebê me emociona." },
  { name: "Mariana C.", week: "Semana 38", text: "O diário de humor salvou minha saúde mental. Consigo entender melhor minhas emoções." },
  { name: "Beatriz O.", week: "Semana 12", text: "Estava muito ansiosa no primeiro trimestre e o app me deu segurança com informações confiáveis." },
  { name: "Larissa T.", week: "Semana 30", text: "As comparações de tamanho do bebê são fofas demais! Meu marido adora ver também." },
  { name: "Patrícia N.", week: "Semana 20", text: "Melhor investimento que fiz na minha gestação. Vale cada centavo!" },
  { name: "Gabriela F.", week: "Semana 26", text: "A IA responde minhas dúvidas de madrugada, quando a ansiedade bate. Incrível!" },
  { name: "Renata D.", week: "Semana 36", text: "Indiquei para todas as minhas amigas grávidas. É como ter uma doula no bolso!" },
];

const VISIBLE_DESKTOP = 4;
const VISIBLE_MOBILE = 1;

const TestimonialsCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isMobileRef = useRef(false);
  const total = testimonials.length;

  useEffect(() => {
    const check = () => { isMobileRef.current = window.innerWidth < 768; };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  const getVisibleIndices = (start: number, count: number) => {
    return Array.from({ length: count }, (_, i) => (start + i) % total);
  };

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Mobile: 1 card */}
      <div className="md:hidden relative h-[220px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 flex items-center justify-center px-4"
          >
            <TestimonialCard testimonial={testimonials[current]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Desktop: 4 cards, slide 1 at a time */}
      <div className="hidden md:block">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-4 gap-4 px-4"
          >
            {getVisibleIndices(current, VISIBLE_DESKTOP).map((idx) => (
              <TestimonialCard key={idx} testimonial={testimonials[idx]} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === current
                ? "bg-primary w-6"
                : "bg-primary/30 hover:bg-primary/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
  <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-5 border border-border shadow-card w-full h-full">
    <div className="flex gap-1 mb-3">
      {[...Array(5)].map((_, s) => (
        <Star key={s} className="w-4 h-4 text-primary" weight="fill" />
      ))}
    </div>
    <p className="text-sm text-foreground leading-relaxed italic">
      "{testimonial.text}"
    </p>
    <div className="mt-4 pt-3 border-t border-border">
      <p className="font-semibold text-sm text-foreground">{testimonial.name}</p>
      <p className="text-xs text-muted-foreground">{testimonial.week}</p>
    </div>
  </div>
);

export default TestimonialsCarousel;
