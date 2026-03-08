import { usePregnancy } from "@/contexts/PregnancyContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWeekContents, useCategories, useActivePromotions, useDailyTip } from "@/hooks/useSupabaseData";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, Heartbeat, Heart, ChartBar, Robot, Smiley, WarningCircle, Sparkle, SignOut, ArrowRight, Bell, PencilSimple, Lock } from "@phosphor-icons/react";
import mamybooWhite from "@/assets/mamyboo-white.png";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { getWeekEmoji } from "@/data/weeks";
import { differenceInDays } from "date-fns";
import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import { useQuery } from "@tanstack/react-query";
import { usePlan } from "@/hooks/usePlan";
import PlanSelectionPopup from "@/components/PlanSelectionPopup";
import PremiumUpgradeCard from "@/components/PremiumUpgradeCard";

import { useAppSettings } from "@/hooks/useAppSettings";

import cardJourney from "@/assets/card-journey.png";
import cardSymptoms from "@/assets/card-symptoms.png";
import cardExercises from "@/assets/card-exercises.png";
import cardHealth from "@/assets/card-health.png";
import cardDiary from "@/assets/card-diary.png";
import cardAssistant from "@/assets/card-assistant.png";

const moodEmojis = ["😢", "😟", "😐", "🙂", "😊"];
const moodLabels = ["Muito triste", "Preocupada", "Neutra", "Bem", "Ótima"];

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
  const { user, signOut } = useAuth();
  const { hasAccess, isExpired, isEssential } = usePlan();
  const navigate = useNavigate();

  // Calculate day of week within current pregnancy week
  const dayOfWeek = (() => {
    if (!profile?.dueDate) return 1;
    const daysUntilDue = differenceInDays(new Date(profile.dueDate), new Date());
    const gestationalDays = Math.max(1, 280 - daysUntilDue);
    return ((gestationalDays - 1) % 7) + 1;
  })();

  const { data: weeks = [] } = useWeekContents();
  const { data: dailyTip } = useDailyTip(currentWeek, dayOfWeek);
  const { data: categories = [] } = useCategories();
  const { data: promotions = [] } = useActivePromotions();
  
  const { data: upcomingReminders = [] } = useQuery({
    queryKey: ["upcoming-reminders", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", user.id)
        .gte("reminder_date", today)
        .order("reminder_date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const notificationCount = upcomingReminders.length;
  const { unreadCount: unreadSupportCount } = useUnreadSupport();

  const [selectedMoodIndex, setSelectedMoodIndex] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const promoRef = useRef<HTMLDivElement>(null);
  const [promoIndex, setPromoIndex] = useState(0);
  const promoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [planPopupOpen, setPlanPopupOpen] = useState(!hasAccess);
  const [planPopupFilter, setPlanPopupFilter] = useState<string | undefined>(undefined);

  // AI mood feedback state
  const [moodFeedbackOpen, setMoodFeedbackOpen] = useState(false);
  const [moodFeedbackText, setMoodFeedbackText] = useState("");
  const [moodFeedbackLoading, setMoodFeedbackLoading] = useState(false);

  // Re-open popup when hasAccess changes (e.g. after refresh)
  useEffect(() => {
    if (!hasAccess) setPlanPopupOpen(true);
  }, [hasAccess]);

  // Auto-play carousel from Supabase settings
  const { getSetting } = useAppSettings();
  const autoPlayInterval = parseInt(getSetting("promo_carousel_interval", "5"), 10) * 1000;
  const autoPlayEnabled = getSetting("promo_carousel_autoplay", "true") === "true";

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

  const weekData = weeks.find(w => w.week_number === currentWeek)
    || [...weeks].sort((a, b) => Math.abs(a.week_number - currentWeek) - Math.abs(b.week_number - currentWeek))[0];

  const todayMood = moods.find(m => new Date(m.date).toDateString() === new Date().toDateString());
  const lastMood = moods.length > 0 ? moods[moods.length - 1] : null;

  const handleMoodWithNote = async (mood: number) => {
    addMood(mood, moodNote || undefined);
    const savedNote = moodNote;
    const savedMoodLabel = moodLabels[mood - 1];
    const savedEmoji = moodEmojis[mood - 1];
    setMoodNote("");
    setShowNoteInput(false);
    setSelectedMoodIndex(null);

    // Trigger AI feedback popup
    setMoodFeedbackOpen(true);
    setMoodFeedbackLoading(true);
    setMoodFeedbackText("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userMessage = savedNote
        ? `Registrei que estou me sentindo ${savedEmoji} ${savedMoodLabel}. Nota: "${savedNote}"`
        : `Registrei que estou me sentindo ${savedEmoji} ${savedMoodLabel}.`;

      const res = await supabase.functions.invoke("chat", {
        body: {
          messages: [{ role: "user", content: userMessage }],
          context: {
            name: profile?.name,
            week: currentWeek,
            trimester,
            moodFeedback: true,
          },
        },
      });

      if (res.error || res.data?.error) {
        setMoodFeedbackText("Obrigada por registrar como você se sente! 💕 Continue cuidando de si mesma.");
      } else {
        setMoodFeedbackText(res.data?.content || "Obrigada por registrar como você se sente! 💕");
      }
    } catch {
      setMoodFeedbackText("Obrigada por registrar como você se sente! 💕 Continue cuidando de si mesma.");
    } finally {
      setMoodFeedbackLoading(false);
    }
  };

  const { plan, hasAccess: planHasAccess } = usePlan();
  const visibleCards = categories
    .filter(c => c.visible)
    .sort((a, b) => a.display_order - b.display_order)
    .map(c => {
      const requiredPlan = (c as any).required_plan || "none";
      const planHierarchy: Record<string, number> = { none: 0, essential: 1, premium: 2 };
      const userLevel = planHierarchy[plan] ?? 0;
      const requiredLevel = planHierarchy[requiredPlan] ?? 0;
      // Lock if user doesn't have access OR plan level is insufficient
      const locked = !planHasAccess || requiredLevel > userLevel;
      return {
        title: c.title,
        description: c.description,
        icon: iconMap[c.icon] || BookOpen,
        path: c.path,
        image: c.image_url?.trim() ? c.image_url : (localImages[c.slug] || cardJourney),
        locked,
        requiredPlan,
      };
    });

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-background pb-8 lg:px-16 xl:px-32">
      {/* Plan selection popup for users without plan */}
      <PlanSelectionPopup open={planPopupOpen} onClose={() => { setPlanPopupOpen(false); setPlanPopupFilter(undefined); }} filterPlan={planPopupFilter} />

      {/* Header */}
      <div className="gradient-hero text-primary-foreground px-6 pt-8 pb-10 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm opacity-80">Olá, {profile?.name} 💕</p>
            <h1 className="text-2xl font-bold font-display">Semana {currentWeek}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/notificacoes")} className="relative w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors">
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[hsl(45,100%,50%)] text-[hsl(45,100%,10%)] rounded-full text-[10px] font-bold flex items-center justify-center px-1 border-2 border-primary shadow-sm">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </button>
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
        {/* Expired plan alert */}
        {isExpired && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4 flex items-start gap-3"
          >
            <WarningCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-destructive">Seu plano expirou</p>
              <p className="text-xs text-muted-foreground mt-1">Renove para continuar acessando todas as ferramentas do MamyBoo.</p>
              <Button size="sm" className="mt-2 rounded-xl" onClick={() => setPlanPopupOpen(true)}>
                Renovar plano
              </Button>
            </div>
          </motion.div>
        )}

        {/* Daily tip */}
        {(dailyTip || weekData) && (
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
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Dica Importante para Você</p>
                {dailyTip && <p className="font-semibold text-sm mt-0.5">✨ {dailyTip.title}</p>}
                <p className="text-sm text-muted-foreground mt-1">{dailyTip?.content || weekData?.tip}</p>
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
                      <img src={promo.image_url} alt={promo.title} className="w-full h-64 md:h-80 lg:h-96 object-cover" />
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

        {/* Mood check - same as diary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card rounded-2xl p-5 shadow-card border border-border"
        >
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Smiley className="w-5 h-5 text-primary" /> Como você está se sentindo?
          </h2>

          {/* Show last mood */}
          {lastMood && !selectedMoodIndex && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl mb-4">
              <span className="text-2xl">{moodEmojis[lastMood.mood - 1]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{moodLabels[lastMood.mood - 1]}</p>
                {lastMood.note && <p className="text-xs text-muted-foreground truncate italic">"{lastMood.note}"</p>}
              </div>
              <span className="text-[10px] text-muted-foreground flex-shrink-0">Último registro</span>
            </div>
          )}

          <div className="flex justify-around mb-4">
            {moodEmojis.map((emoji, i) => (
              <button
                key={i}
                onClick={() => setSelectedMoodIndex(i + 1)}
                className={`flex flex-col items-center gap-1 transition-transform ${selectedMoodIndex === i + 1 ? "scale-125 ring-2 ring-primary rounded-xl p-1" : "hover:scale-110"}`}
              >
                <span className="text-3xl">{emoji}</span>
                <span className="text-[10px] text-muted-foreground">{moodLabels[i]}</span>
              </button>
            ))}
          </div>

          {selectedMoodIndex && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl">
                <span className="text-2xl">{moodEmojis[selectedMoodIndex - 1]}</span>
                <span className="text-sm font-medium">{moodLabels[selectedMoodIndex - 1]}</span>
              </div>

              {!showNoteInput ? (
                <button
                  onClick={() => setShowNoteInput(true)}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors border border-dashed border-border rounded-xl"
                >
                  <PencilSimple className="w-4 h-4" /> Escrever como me sinto (opcional)
                </button>
              ) : (
                <div>
                  <Textarea
                    placeholder="Escreva aqui como você está se sentindo hoje..."
                    value={moodNote}
                    onChange={e => setMoodNote(e.target.value)}
                    className="rounded-xl resize-none min-h-[80px]"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-right">{moodNote.length}/500</p>
                </div>
              )}

              <Button className="w-full rounded-xl" onClick={() => handleMoodWithNote(selectedMoodIndex)}>
                Registrar emoção {moodEmojis[selectedMoodIndex - 1]}
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Cards grid */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 gap-3">
          {visibleCards.map(card => (
            <motion.button
              key={card.title}
              variants={item}
              onClick={() => {
                if (card.locked) {
                  // Essential users trying Premium content → show only Premium plan
                  if (isEssential && card.requiredPlan === "premium") {
                    setPlanPopupFilter("premium");
                  } else {
                    setPlanPopupFilter(undefined);
                  }
                  setPlanPopupOpen(true);
                  return;
                }
                navigate(card.path);
              }}
              className={`bg-card rounded-2xl shadow-card border border-border text-left hover:shadow-elevated transition-shadow overflow-hidden relative ${card.locked ? "opacity-60" : ""}`}
            >
              {card.locked && (
                <div className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-muted/80 backdrop-blur-sm flex items-center justify-center">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
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

        {/* Premium upgrade card for essential users */}
        <PremiumUpgradeCard />
        {/* Legal disclaimer */}
        <p className="text-xs text-center text-muted-foreground/60 mt-4">
          Este aplicativo não substitui acompanhamento médico profissional.
        </p>
      </div>


      {/* AI Mood Feedback Dialog */}
      <Dialog open={moodFeedbackOpen} onOpenChange={setMoodFeedbackOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-sm rounded-2xl p-4 sm:p-6 gap-3">
          <DialogHeader className="space-y-1">
            <DialogTitle className="flex items-center gap-2 text-base">
              <Sparkle className="w-5 h-5 text-primary shrink-0" />
              MamyBoo cuida de você 💕
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto -mx-1 px-1">
            {moodFeedbackLoading ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                />
                <p className="text-sm text-muted-foreground text-center">Preparando um conselho especial para você...</p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                <ReactMarkdown>{moodFeedbackText}</ReactMarkdown>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
