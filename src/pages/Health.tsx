import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Apple, Moon, Brain, Heart, Baby } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  {
    title: "Alimentação",
    icon: Apple,
    gradient: "gradient-peach",
    tips: [
      "Coma de 5-6 refeições pequenas por dia",
      "Aumente a ingestão de ferro e ácido fólico",
      "Beba pelo menos 2L de água por dia",
      "Evite alimentos crus e mal cozidos",
      "Inclua frutas e verduras variadas",
    ],
  },
  {
    title: "Sono",
    icon: Moon,
    gradient: "gradient-lilac",
    tips: [
      "Durma de lado (esquerdo preferível)",
      "Use travesseiro entre as pernas",
      "Evite telas 1h antes de dormir",
      "Mantenha horário regular de sono",
      "Tome chá de camomila antes de dormir",
    ],
  },
  {
    title: "Saúde Emocional",
    icon: Brain,
    gradient: "gradient-sage",
    tips: [
      "É normal sentir ansiedade — permita-se sentir",
      "Converse com outras gestantes ou mães",
      "Pratique meditação ou respiração profunda",
      "Peça ajuda quando precisar",
      "Registre seus sentimentos no diário",
    ],
  },
  {
    title: "Sexualidade",
    icon: Heart,
    gradient: "gradient-peach",
    tips: [
      "A libido pode variar durante a gravidez",
      "Sexo é seguro na maioria das gestações",
      "Converse abertamente com seu parceiro",
      "Algumas posições podem ser mais confortáveis",
      "Consulte seu médico em caso de dúvida",
    ],
  },
  {
    title: "Preparação para o Parto",
    icon: Baby,
    gradient: "gradient-lilac",
    tips: [
      "Faça um plano de parto",
      "Prepare a mala da maternidade até a semana 36",
      "Aprenda técnicas de respiração",
      "Visite a maternidade antes",
      "Converse com seu médico sobre suas preferências",
    ],
  },
];

const Health = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="px-6 pt-6 pb-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/painel")} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold font-display">Saúde Integral</h1>
      </div>

      <div className="px-6 space-y-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card rounded-2xl p-5 shadow-card border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-11 h-11 rounded-xl ${cat.gradient} flex items-center justify-center`}>
                <cat.icon className="w-5 h-5 text-foreground/70" />
              </div>
              <h2 className="font-bold font-display">{cat.title}</h2>
            </div>
            <div className="space-y-2">
              {cat.tips.map((tip, ti) => (
                <div key={ti} className="flex items-start gap-2">
                  <span className="text-primary text-xs mt-1">●</span>
                  <p className="text-sm text-muted-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Health;
