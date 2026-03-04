import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePregnancy, PregnancyProfile } from "@/contexts/PregnancyContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Heart, CalendarBlank, Sparkle, ArrowRight, ArrowLeft } from "@phosphor-icons/react";
import { addDays, format } from "date-fns";
import mamybooPink from "@/assets/mamyboo-pink.png";

const TOTAL_STEPS = 4;

const Onboarding = () => {
  const { setProfile } = usePregnancy();
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
    if (step === 0) return name.trim().length > 0;
    if (step === 1) return dateValue.length > 0 && age.length > 0;
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
  const stepIcons = [Sparkle, CalendarBlank, Heart, null];
  const StepIcon = stepIcons[step];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress */}
      <div className="px-6 pt-6">
        <div className="flex gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-muted">
              <motion.div
                className="h-full rounded-full gradient-primary"
                initial={{ width: 0 }}
                animate={{ width: i <= step ? "100%" : "0%" }}
                transition={{ duration: 0.4 }}
              />
            </div>
          ))}
        </div>
      </div>

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
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto flex items-center justify-center shadow-soft p-2">
                {StepIcon ? <StepIcon className="w-8 h-8 text-primary-foreground" /> : <img src={mamybooPink} alt="MamyBoo" className="w-10 h-10 object-contain" />}
              </div>

              {step === 0 && (
                <>
                  <h1 className="text-2xl font-bold font-display">Bem-vinda! 💕</h1>
                  <p className="text-muted-foreground">Como podemos te chamar?</p>
                  <div className="pt-4">
                    <Input
                      placeholder="Seu nome"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="text-center text-lg h-14 rounded-xl border-2 border-muted focus:border-primary"
                    />
                  </div>
                </>
              )}

              {step === 1 && (
                <>
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
                </>
              )}

              {step === 2 && (
                <>
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
                </>
              )}

              {step === 3 && (
                <>
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
                </>
              )}
            </div>
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
            {step === TOTAL_STEPS - 1 ? "Começar minha jornada" : "Continuar"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
