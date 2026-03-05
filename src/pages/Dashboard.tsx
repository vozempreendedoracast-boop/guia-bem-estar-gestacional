import { usePregnancy } from "@/contexts/PregnancyContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWeekContents, useCategories, useActivePromotions } from "@/hooks/useSupabaseData";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, Heartbeat, Heart, ChartBar, Robot, Smiley, WarningCircle, Sparkle, SignOut, ArrowRight } from "@phosphor-icons/react";
import mamybooWhite from "@/assets/mamyboo-white.png";
import { Button } from "@/components/ui/button";
import { getWeekEmoji } from "@/data/weeks";
import { useState, useRef, useEffect, useCallback } from "react";

import cardJourney from "@/assets/card-journey.png";
import cardSymptoms from "@/assets/card-symptoms.png";
import cardExercises from "@/assets/card-exercises.png";
import cardHealth from "@/assets/card-health.png";
import cardDiary from "@/assets/card-diary.png";
import cardAssistant from "@/assets/card-assistant.png";

const moodEmojis = ["😢", "😟", "😐", "🙂", "😊"];

const localImages: Record<string, string> = {
  journey: cardJourney,
  symptoms: cardSymptoms,
  exercises: cardExercises,
  health: cardHealth,
  diary: cardDiary,
  assistant: cardAssistant,
};

const iconMap: Record<string, React.ElementType> = {
  BookOpen, WarningCircle, Heartbeat, Heart, ChartBar, Robot,
};

const Dashboard = () => {
  const { profile, currentWeek, trimester, progressPercent, addMood, moods, logout } = usePregnancy();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { data: weeks = [] } = useWeekContents();
  const { data: categories = [] } = useCategories();
  const { data: promotions = [] } = useActivePromotions();
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const promoRef = useRef<HTMLDivElement>(null);
  const [promoIndex, setPromoIndex] = useState(0);
  const promoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-play carousel
  const autoPlayInterval = parseInt(localStorage.getItem("promo_carousel_interval") || "5", 10) * 1000;
  const autoPlayEnabled = localStorage.getItem("promo_carousel_autoplay") !== "false";

  const nextPromo = useCallback(() => {
    if (promotions.length > 1) {
      setPromoIndex(prev => (prev + 1) % promotions.length);
    }
  }, [promotions.length]);

  useEffect(() => {
    if (autoPlayEnabled && promotions.length > 1) {
      promoTimerRef.current = setInterval(nextPromo, autoPlayInterval);
      return () => { if (promoTimerRef.current) clearInterval(promoTimerRef.current); };
    }
  }, [autoPlayEnabled, autoPlayInterval, nextPromo, promotions.length]);

  // Find the closest week data from DB
  const weekData = weeks.find(w => w.week_number === currentWeek)
    || [...weeks].sort((a, b) => Math.abs(a.week_number - currentWeek) - Math.abs(b.week_number - currentWeek))[0];

  const todayMood = moods.find(m => new Date(m.date).toDateString() === new Date().toDateString());

  const handleMoodSelect = (mood: number) => {
    setSelectedMood(mood);
    addMood(mood);
    setShowMoodPicker(false);
    setTimeout(() => setSelectedMood(null), 2000);
  };

  const visibleCards = categories
    .filter(c => c.visible)
    .sort((a, b) => a.display_order - b.display_order)
    .map(c => ({
      title: c.title,
      description: c.description,
      icon: iconMap[c.icon] || BookOpen,
      path: c.path,
      image: localImages[c.slug] || cardJourney,
    }));

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-background pb-8 lg:px-16 xl:px-32">
      {/* Header */}
      <div className="gradient-hero text-primary-foreground px-6 pt-8 pb-10 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm opacity-80">Olá, {profile?.name} 💕</p>
            <h1 className="text-2xl font-bold font-display">Semana {currentWeek}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/perfil")} className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors p-2">
              <img src={mamybooWhite} alt="MamyBoo" className="w-7 h-7 object-contain" />
            </button>
            <Button variant="ghost" size="icon" className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10" onClick={() => { logout(); signOut(); }}>
              <SignOut className="w-4 h-4" />
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
        {weekData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-5 bg-primary-foreground/10 rounded-2xl p-4 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-primary-foreground/20 flex items-center justify-center text-3xl backdrop-blur-sm">
                {getWeekEmoji(currentWeek)}
              </div>
              <div>
                <p className="font-semibold text-sm">Seu bebê tem ~{weekData.baby_size}</p>
                <p className="text-xs opacity-80">{weekData.baby_size_comparison}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="px-6 -mt-4 space-y-6">
        {/* Quick tip */}
        {weekData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card rounded-2xl p-4 shadow-card border border-border"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-peach flex items-center justify-center flex-shrink-0">
                <Sparkle className="w-5 h-5 text-peach-foreground" />
              </div>
              <div>
                <p className="font-semibold text-sm">Dica da semana</p>
                <p className="text-sm text-muted-foreground mt-1">{weekData.tip}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Promotions Carousel */}
        {promotions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="relative overflow-hidden rounded-2xl"
          >
            <div
              ref={promoRef}
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${promoIndex * 100}%)` }}
            >
              {promotions.map((promo) => (
                <a
                  key={promo.id}
                  href={promo.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-full block"
                >
                  {promo.image_url ? (
                    <div className="relative rounded-2xl overflow-hidden shadow-card border border-border">
                      <img src={promo.image_url} alt={promo.title} className="w-full h-32 md:h-48 lg:h-56 object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white font-semibold text-sm">{promo.title}</p>
                        {promo.description && <p className="text-white/80 text-xs mt-0.5 line-clamp-1">{promo.description}</p>}
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-white mt-1.5 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-0.5">
                          {promo.button_text} <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-card rounded-2xl p-4 shadow-card border border-border">
                      <p className="font-semibold text-sm text-foreground">{promo.title}</p>
                      {promo.description && <p className="text-xs text-muted-foreground mt-1">{promo.description}</p>}
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-2">
                        {promo.button_text} <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  )}
                </a>
              ))}
            </div>
            {promotions.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-2">
                {promotions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPromoIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === promoIndex ? "bg-primary w-4" : "bg-muted-foreground/30"}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

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
                <Smiley className="w-5 h-5 text-lilac-foreground" />
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
          {visibleCards.map(card => (
            <motion.button
              key={card.title}
              variants={item}
              onClick={() => navigate(card.path)}
              className="bg-card rounded-2xl shadow-card border border-border text-left hover:shadow-elevated transition-shadow overflow-hidden"
            >
              <div className="w-full h-24 md:h-52 lg:h-64 xl:h-72 overflow-hidden">
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
