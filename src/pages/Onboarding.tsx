import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePregnancy, PregnancyProfile } from "@/contexts/PregnancyContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Heart, CalendarBlank, Sparkle, ArrowRight, ArrowLeft, Baby, Star } from "@phosphor-icons/react";
import { addDays, format } from "date-fns";
import mamybooPink from "@/assets/mamyboo-pink.png";
import mamybooWhite from "@/assets/mamyboo-white.png";
import { useAuth } from "@/contexts/AuthContext";
import { usePlan } from "@/hooks/usePlan";

const TOTAL_STEPS = 5; // welcome + 4 original steps

const Onboarding = () => {
  const { setProfile } = usePregnancy();
  const { userProfile } = useAuth();
  const { plan, isPremium } = usePlan();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [name, setName] = useState("");
  const [dateType, setDateType] = useState<"lmp" | "due">("lmp");
  const [dateValue, setDateValue] = useState("");
  const [age, setAge] = useState("");
  const [firstPregnancy, setFirstPregnancy] = useState("yes");
  const [working, setWorking] = useState("yes");
  const [hasMedicalCare, setHasMedicalCare] = useState("yes");
  const [emotionalLevel, setEmotionalLevel] = useState([3]);
  const [focus, setFocus] = useState<"physical" | "emotional" | "both">("both");

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const canProceed = () => {
    if (step === 0) return true; // welcome screen
    if (step === 1) return name.trim().length > 0;
    if (step === 2) return dateValue.length > 0 && age.length > 0;
    return true;
  };

  const finish = () => {
    const dueDate = dateType === "due" ? dateValue : format(addDays(new Date(dateValue), 280), "yyyy-MM-dd");
    const profile: PregnancyProfile = {
      name,
      dueDate,
      lastPeriodDate: dateType === "lmp" ? dateValue : undefined,
      age: parseInt(age),
      firstPregnancy: firstPregnancy === "yes",
      working: working === "yes",
      hasMedicalCare: hasMedicalCare === "yes",
      currentSymptoms: [],
      emotionalLevel: emotionalLevel[0],
      focus,
    };
    setProfile(profile);
    navigate("/painel");
  };

  const emojis = ["😢", "😟", "😐", "🙂", "😊"];

  const planLabel = isPremium ? "Premium" : plan === "essential" ? "Essencial" : "Gratuito";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress - hide on welcome step */}
      {step > 0 && (
        <div className="px-6 pt-6">
          <div className="flex gap-2">
            {Array.from({ length: TOTAL_STEPS - 1 }).map((_, i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-muted">
                <motion.div
                  className="h-full rounded-full gradient-primary"
                  initial={{ width: 0 }}
                  animate={{ width: i < step ? "100%" : "0%" }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* STEP 0: Welcome Screen */}
            {step === 0 && (
              <div className="text-center space-y-6">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="w-28 h-28 rounded-3xl gradient-hero mx-auto flex items-center justify-center shadow-elevated p-4"
                >
                  <img src={mamybooWhite} alt="MamyBoo" className="w-16 h-16 object-contain" />
                </motion.div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-bold font-display text-foreground">
                    Bem-vinda ao MamyBoo! 🎉
                  </h1>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    Estamos muito felizes em ter você aqui. Sua jornada de cuidado e amor começa agora! 💕
                  </p>
                </div>

                <div className="bg-card rounded-2xl border border-border shadow-card p-5 text-left space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Star className="w-5 h-5 text-primary" weight="fill" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Seu plano: {planLabel}</p>
                      <p className="text-xs text-muted-foreground">
                        {isPremium ? "Acesso completo + Assistente de IA" : "Acesso a todo conteúdo estruturado"}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3 space-y-3">
                    <p className="text-sm font-medium text-foreground">O que você terá acesso:</p>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { icon: "📅", text: "Jornada semana a semana" },
                        { icon: "💪", text: "Exercícios para gestantes" },
                        { icon: "🩺", text: "Dicas de saúde e bem-estar" },
                        { icon: "📝", text: "Diário de sentimentos" },
                        ...(isPremium ? [{ icon: "🤖", text: "Assistente de IA personalizado" }] : []),
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{item.icon}</span>
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground/60">
                  Vamos personalizar tudo para você em poucos passos!
                </p>
              </div>
            )}

            {/* STEP 1: Name */}
            {step === 1 && (
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto flex items-center justify-center shadow-soft p-2">
                  <Sparkle className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold font-display">Como podemos te chamar? 💕</h1>
                <p className="text-muted-foreground">Queremos tornar tudo mais pessoal</p>
                <div className="pt-4">
                  <Input
                    placeholder="Seu nome"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="text-center text-lg h-14 rounded-xl border-2 border-muted focus:border-primary"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Pregnancy info */}
            {step === 2 && (
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto flex items-center justify-center shadow-soft p-2">
                  <CalendarBlank className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold font-display">Sobre sua gestação</h1>
                <p className="text-muted-foreground">Essas informações nos ajudam a personalizar sua experiência</p>
                <div className="space-y-4 text-left pt-2">
                  <div>
                    <Label className="text-sm font-medium">Como deseja informar a data?</Label>
                    <RadioGroup value={dateType} onValueChange={(v: "lmp" | "due") => setDateType(v)} className="flex gap-4 mt-2">
                      <div className="flex items-center gap-2"><RadioGroupItem value="lmp" id="lmp" /><Label htmlFor="lmp" className="text-sm">Última menstruação</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="due" id="due" /><Label htmlFor="due" className="text-sm">Data prevista do parto</Label></div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="text-sm">{dateType === "lmp" ? "Data da última menstruação" : "Data prevista do parto"}</Label>
                    <Input type="date" value={dateValue} onChange={e => setDateValue(e.target.value)} className="mt-1 h-12 rounded-xl" />
                  </div>
                  <div>
                    <Label className="text-sm">Sua idade</Label>
                    <Input type="number" placeholder="28" value={age} onChange={e => setAge(e.target.value)} className="mt-1 h-12 rounded-xl" min="14" max="55" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: About you */}
            {step === 3 && (
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto flex items-center justify-center shadow-soft p-2">
                  <Heart className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold font-display">Sobre você</h1>
                <p className="text-muted-foreground">Nos conte um pouco mais</p>
                <div className="space-y-5 text-left pt-2">
                  <div>
                    <Label className="text-sm font-medium">Primeira gravidez?</Label>
                    <RadioGroup value={firstPregnancy} onValueChange={setFirstPregnancy} className="flex gap-4 mt-2">
                      <div className="flex items-center gap-2"><RadioGroupItem value="yes" id="fp-y" /><Label htmlFor="fp-y">Sim</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="no" id="fp-n" /><Label htmlFor="fp-n">Não</Label></div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Trabalha atualmente?</Label>
                    <RadioGroup value={working} onValueChange={setWorking} className="flex gap-4 mt-2">
                      <div className="flex items-center gap-2"><RadioGroupItem value="yes" id="w-y" /><Label htmlFor="w-y">Sim</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="no" id="w-n" /><Label htmlFor="w-n">Não</Label></div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Possui acompanhamento médico?</Label>
                    <RadioGroup value={hasMedicalCare} onValueChange={setHasMedicalCare} className="flex gap-4 mt-2">
                      <div className="flex items-center gap-2"><RadioGroupItem value="yes" id="mc-y" /><Label htmlFor="mc-y">Sim</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="no" id="mc-n" /><Label htmlFor="mc-n">Não</Label></div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Emotional */}
            {step === 4 && (
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto flex items-center justify-center shadow-soft p-2">
                  <img src={mamybooPink} alt="MamyBoo" className="w-10 h-10 object-contain" />
                </div>
                <h1 className="text-2xl font-bold font-display">Quase lá! 🌸</h1>
                <p className="text-muted-foreground">Como você está se sentindo?</p>
                <div className="space-y-6 pt-4">
                  <div>
                    <div className="flex justify-between mb-3">
                      {emojis.map((e, i) => (
                        <span key={i} className={`text-2xl transition-all ${emotionalLevel[0] === i + 1 ? "scale-125" : "opacity-40"}`}>{e}</span>
                      ))}
                    </div>
                    <Slider value={emotionalLevel} onValueChange={setEmotionalLevel} min={1} max={5} step={1} className="w-full" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Qual seu foco principal?</Label>
                    <RadioGroup value={focus} onValueChange={(v: typeof focus) => setFocus(v)} className="mt-3 space-y-2">
                      {[
                        { value: "physical", label: "Saúde física", desc: "Exercícios, alimentação, corpo" },
                        { value: "emotional", label: "Saúde emocional", desc: "Ansiedade, humor, bem-estar" },
                        { value: "both", label: "Ambos", desc: "Equilíbrio completo" },
                      ].map(opt => (
                        <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${focus === opt.value ? "border-primary bg-primary/5" : "border-muted"}`}>
                          <RadioGroupItem value={opt.value} />
                          <div>
                            <p className="font-medium text-sm">{opt.label}</p>
                            <p className="text-xs text-muted-foreground">{opt.desc}</p>
                          </div>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-8 max-w-md mx-auto w-full">
        <div className="flex gap-3">
          {step > 0 && (
            <Button variant="outline" onClick={prev} className="h-14 rounded-xl px-6">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <Button
            onClick={step === TOTAL_STEPS - 1 ? finish : next}
            disabled={!canProceed()}
            className="flex-1 h-14 rounded-xl gradient-primary text-primary-foreground font-semibold text-base shadow-soft"
          >
            {step === 0 ? "Vamos começar!" : step === TOTAL_STEPS - 1 ? "Começar minha jornada" : "Continuar"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
