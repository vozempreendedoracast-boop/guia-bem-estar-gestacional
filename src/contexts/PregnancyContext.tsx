import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { differenceInWeeks, addDays } from "date-fns";

export interface PregnancyProfile {
  dueDate: string;
  lastPeriodDate?: string;
  age: number;
  firstPregnancy: boolean;
  working: boolean;
  hasMedicalCare: boolean;
  currentSymptoms: string[];
  emotionalLevel: number;
  focus: "physical" | "emotional" | "both";
  name: string;
}

interface MoodEntry {
  date: string;
  mood: number;
  note?: string;
}

interface SymptomEntry {
  date: string;
  symptoms: string[];
}

interface PregnancyContextType {
  profile: PregnancyProfile | null;
  setProfile: (p: PregnancyProfile) => void;
  currentWeek: number;
  trimester: number;
  progressPercent: number;
  moods: MoodEntry[];
  addMood: (mood: number, note?: string) => void;
  symptomEntries: SymptomEntry[];
  addSymptomEntry: (symptoms: string[]) => void;
  isOnboarded: boolean;
  logout: () => void;
}

const PregnancyContext = createContext<PregnancyContextType | null>(null);

export function PregnancyProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<PregnancyProfile | null>(() => {
    const saved = localStorage.getItem("pregnancy_profile");
    return saved ? JSON.parse(saved) : null;
  });

  const [moods, setMoods] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem("pregnancy_moods");
    return saved ? JSON.parse(saved) : [];
  });

  const [symptomEntries, setSymptomEntries] = useState<SymptomEntry[]>(() => {
    const saved = localStorage.getItem("pregnancy_symptoms");
    return saved ? JSON.parse(saved) : [];
  });

  const setProfile = (p: PregnancyProfile) => {
    setProfileState(p);
    localStorage.setItem("pregnancy_profile", JSON.stringify(p));
  };

  const addMood = (mood: number, note?: string) => {
    const entry: MoodEntry = { date: new Date().toISOString(), mood, note };
    const updated = [...moods, entry];
    setMoods(updated);
    localStorage.setItem("pregnancy_moods", JSON.stringify(updated));
  };

  const addSymptomEntry = (symptoms: string[]) => {
    const entry: SymptomEntry = { date: new Date().toISOString(), symptoms };
    const updated = [...symptomEntries, entry];
    setSymptomEntries(updated);
    localStorage.setItem("pregnancy_symptoms", JSON.stringify(updated));
  };

  const logout = () => {
    localStorage.removeItem("pregnancy_profile");
    localStorage.removeItem("pregnancy_moods");
    localStorage.removeItem("pregnancy_symptoms");
    setProfileState(null);
    setMoods([]);
    setSymptomEntries([]);
  };

  const currentWeek = profile
    ? Math.min(40, Math.max(1, (() => {
        if (profile.lastPeriodDate) {
          return differenceInWeeks(new Date(), new Date(profile.lastPeriodDate)) + 1;
        }
        const lmp = addDays(new Date(profile.dueDate), -280);
        return differenceInWeeks(new Date(), lmp) + 1;
      })()))
    : 1;

  const trimester = currentWeek <= 13 ? 1 : currentWeek <= 27 ? 2 : 3;
  const progressPercent = Math.round((currentWeek / 40) * 100);

  return (
    <PregnancyContext.Provider value={{
      profile, setProfile, currentWeek, trimester, progressPercent,
      moods, addMood, symptomEntries, addSymptomEntry,
      isOnboarded: !!profile, logout,
    }}>
      {children}
    </PregnancyContext.Provider>
  );
}

export function usePregnancy() {
  const ctx = useContext(PregnancyContext);
  if (!ctx) throw new Error("usePregnancy must be used within PregnancyProvider");
  return ctx;
}
