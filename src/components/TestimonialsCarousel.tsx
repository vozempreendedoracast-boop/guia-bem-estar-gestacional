import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "@phosphor-icons/react";

const testimonials = [
  { name: "Camila S.", week: "Semana 28", text: "Eu ficava muito ansiosa no começo da gestação. O app me ajudou muito a entender cada fase e me trouxe mais tranquilidade." },
  { name: "Juliana M.", week: "Semana 16", text: "Uso todos os dias. O acompanhamento semanal é incrível." },
  { name: "Gabriela F.", week: "Semana 26", text: "A assistente de IA já me ajudou várias vezes quando tive dúvidas." },
  { name: "Ana Paula R.", week: "Semana 34", text: "Os exercícios são simples e me ajudaram muito com dores nas costas." },
  { name: "Mariana C.", week: "Semana 38", text: "O diário de humor me ajudou muito a entender minhas emoções." },
  { name: "Beatriz O.", week: "Semana 12", text: "Antes eu pesquisava tudo na internet e ficava confusa. No app tudo é claro." },
  { name: "Larissa T.", week: "Semana 30", text: "As comparações de tamanho do bebê são muito fofas." },
  { name: "Patrícia N.", week: "Semana 20", text: "Foi o melhor investimento da minha gravidez." },
  { name: "Renata D.", week: "Semana 36", text: "Me sinto acompanhada todos os dias." },
  { name: "Fernanda L.", week: "Semana 22", text: "Indiquei para várias amigas grávidas." },
];

const TestimonialsCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = testimonials.length;
  const touchStartX = useRef(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
    setIsPaused(false);
  };

  // Desktop: show 3 cards at a time
  const desktopVisible = 3;
  const desktopCards = [];
  for (let i = 0; i < desktopVisible; i++) {
    desktopCards.push(testimonials[(current + i) % total]);
  }

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Mobile: single card with swipe */}
      <div
        className="md:hidden px-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <TestimonialCard testimonial={testimonials[current]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Desktop: 3 cards */}
      <div className="hidden md:block px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="grid grid-cols-3 gap-4"
          >
            {desktopCards.map((t, i) => (
              <TestimonialCard key={`${current}-${i}`} testimonial={t} />
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
              i === current ? "bg-primary w-6" : "bg-primary/30 hover:bg-primary/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
  <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-5 border border-border shadow-card w-full h-full flex flex-col">
    <div className="flex gap-1 mb-3">
      {[...Array(5)].map((_, s) => (
        <Star key={s} className="w-4 h-4 text-primary" weight="fill" />
      ))}
    </div>
    <p className="text-sm text-foreground leading-relaxed italic flex-1">
      "{testimonial.text}"
    </p>
    <div className="mt-4 pt-3 border-t border-border">
      <p className="font-semibold text-sm text-foreground">{testimonial.name}</p>
      <p className="text-xs text-muted-foreground">{testimonial.week}</p>
    </div>
  </div>
);

export default TestimonialsCarousel;
