import { useEffect, useState, useCallback } from "react";
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

const TestimonialsCarousel = () => {
  const [current, setCurrent] = useState(0);
  const itemsPerView = 3;
  const totalSlides = Math.ceil(testimonials.length / itemsPerView);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  const visibleTestimonials = testimonials.slice(
    current * itemsPerView,
    current * itemsPerView + itemsPerView
  );

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {visibleTestimonials.map((t) => (
            <div
              key={t.name}
              className="bg-card/90 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-card"
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
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalSlides }).map((_, i) => (
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

export default TestimonialsCarousel;
