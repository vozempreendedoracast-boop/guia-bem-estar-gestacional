import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
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

const VISIBLE_DESKTOP = 4;

const TestimonialsCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = testimonials.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Mobile: 1 card sliding */}
      <div className="md:hidden relative h-[220px]">
        <div className="absolute inset-0 flex px-4">
          <motion.div
            key="mobile-track"
            animate={{ x: `${-current * 100}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="flex"
            style={{ width: `${total * 100}%` }}
          >
            {testimonials.map((t, i) => (
              <div key={i} className="flex items-center justify-center px-2" style={{ width: `${100 / total}%` }}>
                <TestimonialCard testimonial={t} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Desktop: 4 visible, slides 1 at a time */}
      <div className="hidden md:block">
        <div className="overflow-hidden">
          <motion.div
            animate={{ x: `${-current * (100 / (total + VISIBLE_DESKTOP - 1))}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="flex gap-4"
            style={{ width: `${((total + VISIBLE_DESKTOP - 1) / VISIBLE_DESKTOP) * 100}%` }}
          >
            {Array.from({ length: total + VISIBLE_DESKTOP - 1 }, (_, i) => (
              <div key={i} className="px-1" style={{ width: `${100 / (total + VISIBLE_DESKTOP - 1)}%` }}>
                <TestimonialCard testimonial={testimonials[i % total]} />
              </div>
            ))}
          </motion.div>
        </div>
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
  <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-5 border border-border shadow-card w-full">
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
