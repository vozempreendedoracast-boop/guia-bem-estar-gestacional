import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { differenceInWeeks, addDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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

export interface MoodEntry {
  id?: string;
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
  loading: boolean;
}

const PregnancyContext = createContext<PregnancyContextType | null>(null);

export function PregnancyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [profile, setProfileState] = useState<PregnancyProfile | null>(() => {
    const saved = localStorage.getItem("pregnancy_profile");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);

  const [moods, setMoods] = useState<MoodEntry[]>([]);

  const [symptomEntries, setSymptomEntries] = useState<SymptomEntry[]>(() => {
    const saved = localStorage.getItem("pregnancy_symptoms");
    return saved ? JSON.parse(saved) : [];
  });

  // Load profile from Supabase when user logs in
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const [profileRes, moodsRes] = await Promise.all([
          supabase
            .from("pregnancy_profiles")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle(),
          supabase
            .from("mood_entries")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: true }),
        ]);

        if (profileRes.data && !profileRes.error) {
          const loaded: PregnancyProfile = {
            name: profileRes.data.name,
            dueDate: profileRes.data.due_date,
            lastPeriodDate: profileRes.data.last_period_date || undefined,
            age: profileRes.data.age,
            firstPregnancy: profileRes.data.first_pregnancy,
            working: profileRes.data.working,
            hasMedicalCare: profileRes.data.has_medical_care,
            currentSymptoms: profileRes.data.current_symptoms,
            emotionalLevel: profileRes.data.emotional_level,
            focus: profileRes.data.focus as "physical" | "emotional" | "both",
          };
          setProfileState(loaded);
          localStorage.setItem("pregnancy_profile", JSON.stringify(loaded));
        }

        if (moodsRes.data && !moodsRes.error) {
          setMoods(moodsRes.data.map(m => ({
            id: m.id,
            date: m.created_at,
            mood: m.mood,
            note: m.note || undefined,
          })));
        }
      } catch (err) {
        console.error("Error loading pregnancy profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const setProfile = async (p: PregnancyProfile) => {
    setProfileState(p);
    localStorage.setItem("pregnancy_profile", JSON.stringify(p));

    // Save to Supabase
    if (user) {
      try {
        await supabase
          .from("pregnancy_profiles")
          .upsert({
            user_id: user.id,
            name: p.name,
            due_date: p.dueDate,
            last_period_date: p.lastPeriodDate || null,
            age: p.age,
            first_pregnancy: p.firstPregnancy,
            working: p.working,
            has_medical_care: p.hasMedicalCare,
            current_symptoms: p.currentSymptoms,
            emotional_level: p.emotionalLevel,
            focus: p.focus,
          }, { onConflict: "user_id" });
      } catch (err) {
        console.error("Error saving pregnancy profile:", err);
      }
    }
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
      isOnboarded: !!profile, logout, loading,
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
