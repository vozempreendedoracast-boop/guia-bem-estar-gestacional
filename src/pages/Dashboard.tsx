import { usePregnancy } from "@/contexts/PregnancyContext";
import { getClosestWeekData } from "@/data/weeks";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Baby, BookOpen, Activity, Heart, BarChart3, Bot, Smile, AlertCircle, Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import cardJourney from "@/assets/card-journey.png";
import cardSymptoms from "@/assets/card-symptoms.png";
import cardExercises from "@/assets/card-exercises.png";
import cardHealth from "@/assets/card-health.png";
import cardDiary from "@/assets/card-diary.png";
import cardAssistant from "@/assets/card-assistant.png";

const moodEmojis = ["😢", "😟", "😐", "🙂", "😊"];

const Dashboard = () => {
  const { profile, currentWeek, trimester, progressPercent, addMood, moods, logout } = usePregnancy();
  const navigate = useNavigate();
  const weekData = getClosestWeekData(currentWeek);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const todayMood = moods.find(m => new Date(m.date).toDateString() === new Date().toDateString());

  const handleMoodSelect = (mood: number) => {
    setSelectedMood(mood);
    addMood(mood);
    setShowMoodPicker(false);
    setTimeout(() => setSelectedMood(null), 2000);
  };

  const cards = [
    { title: "Minha Jornada", description: "Semana a semana", icon: BookOpen, path: "/jornada", gradient: "gradient-peach", image: cardJourney },
    { title: "Sintomas", description: "Guia completo", icon: AlertCircle, path: "/sintomas", gradient: "gradient-lilac", image: cardSymptoms },
    { title: "Exercícios", description: `${trimester}° trimestre`, icon: Activity, path: "/exercicios", gradient: "gradient-sage", image: cardExercises },
    { title: "Saúde Integral", description: "Corpo e mente", icon: Heart, path: "/saude", gradient: "gradient-peach", image: cardHealth },
    { title: "Diário", description: "Registros", icon: BarChart3, path: "/diario", gradient: "gradient-lilac", image: cardDiary },
    { title: "Assistente IA", description: "Tire dúvidas", icon: Bot, path: "/assistente", gradient: "gradient-sage", image: cardAssistant },
  ];

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="gradient-hero text-primary-foreground px-6 pt-8 pb-10 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm opacity-80">Olá, {profile?.name} 💕</p>
            <h1 className="text-2xl font-bold font-display">Semana {currentWeek}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Baby className="w-6 h-6" />
            </div>
            <Button variant="ghost" size="icon" className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10" onClick={logout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs opacity-80">
            <span>{trimester}° Trimestre</span>
            <span>{currentWeek}/40 semanas</span>
          </div>
          <div className="h-3 bg-primary-foreground/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary-foreground"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>

        {/* Baby info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-5 bg-primary-foreground/10 rounded-2xl p-4 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{weekData.babySizeComparison.split(" ")[0]}</span>
            <div>
              <p className="font-semibold text-sm">Seu bebê tem ~{weekData.babySize}</p>
              <p className="text-xs opacity-80">{weekData.babySizeComparison}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-6 -mt-4 space-y-6">
        {/* Quick tip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card rounded-2xl p-4 shadow-card border border-border"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-peach flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-peach-foreground" />
            </div>
            <div>
              <p className="font-semibold text-sm">Dica da semana</p>
              <p className="text-sm text-muted-foreground mt-1">{weekData.tip}</p>
            </div>
          </div>
        </motion.div>

        {/* Mood check */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card rounded-2xl p-4 shadow-card border border-border"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-lilac flex items-center justify-center">
                <Smile className="w-5 h-5 text-lilac-foreground" />
              </div>
              <div>
                <p className="font-semibold text-sm">Como está se sentindo?</p>
                {todayMood && <p className="text-xs text-muted-foreground">Hoje: {moodEmojis[todayMood.mood - 1]}</p>}
              </div>
            </div>
            {!showMoodPicker && (
              <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setShowMoodPicker(true)}>
                Registrar
              </Button>
            )}
          </div>
          {showMoodPicker && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 flex justify-around">
              {moodEmojis.map((emoji, i) => (
                <button key={i} onClick={() => handleMoodSelect(i + 1)} className={`text-3xl transition-all hover:scale-125 ${selectedMood === i + 1 ? "scale-125" : ""}`}>
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Cards grid */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 gap-3">
          {cards.map(card => (
            <motion.button
              key={card.title}
              variants={item}
              onClick={() => navigate(card.path)}
              className="bg-card rounded-2xl shadow-card border border-border text-left hover:shadow-elevated transition-shadow overflow-hidden"
            >
              <div className="w-full h-24 overflow-hidden">
                <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm">{card.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{card.description}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Legal disclaimer */}
        <p className="text-xs text-center text-muted-foreground/60 mt-4">
          Este aplicativo não substitui acompanhamento médico profissional.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
