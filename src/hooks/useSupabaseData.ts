import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

// ─── Categories ───
export type Category = Tables<"categories">;

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as Category[];
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"categories"> & { id: string }) => {
      const { data, error } = await supabase.from("categories").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

// ─── Week Contents ───
export type WeekContent = Tables<"week_contents">;

export function useWeekContents() {
  return useQuery({
    queryKey: ["week_contents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("week_contents")
        .select("*")
        .order("week_number");
      if (error) throw error;
      return data as WeekContent[];
    },
  });
}

export function useWeekContent(weekNumber: number) {
  return useQuery({
    queryKey: ["week_contents", weekNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("week_contents")
        .select("*")
        .eq("week_number", weekNumber)
        .single();
      if (error) throw error;
      return data as WeekContent;
    },
  });
}

export function useUpdateWeekContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"week_contents"> & { id: string }) => {
      const { data, error } = await supabase.from("week_contents").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["week_contents"] }),
  });
}

export function useDeleteWeekContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("week_contents").update({
        baby_development: "", mother_changes: "", tip: "", common_symptoms: [], alerts: [],
        status: "empty", reviewed: false,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["week_contents"] }),
  });
}

// ─── Symptoms ───
export type SymptomRow = Tables<"symptoms">;

export function useSymptoms() {
  return useQuery({
    queryKey: ["symptoms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("symptoms")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as SymptomRow[];
    },
  });
}

export function useActiveSymptoms() {
  return useQuery({
    queryKey: ["symptoms", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("symptoms")
        .select("*")
        .eq("active", true)
        .order("display_order");
      if (error) throw error;
      return data as SymptomRow[];
    },
  });
}

export function useUpdateSymptom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"symptoms"> & { id: string }) => {
      const { data, error } = await supabase.from("symptoms").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["symptoms"] }),
  });
}

export function useCreateSymptom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (symptom: TablesInsert<"symptoms">) => {
      const { data, error } = await supabase.from("symptoms").insert(symptom).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["symptoms"] }),
  });
}

export function useDeleteSymptom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("symptoms").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["symptoms"] }),
  });
}

// ─── Exercises ───
export type ExerciseRow = Tables<"exercises">;

export function useExercises() {
  return useQuery({
    queryKey: ["exercises"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as ExerciseRow[];
    },
  });
}

export function useActiveExercises() {
  return useQuery({
    queryKey: ["exercises", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .eq("active", true)
        .order("display_order");
      if (error) throw error;
      return data as ExerciseRow[];
    },
  });
}

export function useUpdateExercise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"exercises"> & { id: string }) => {
      const { data, error } = await supabase.from("exercises").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["exercises"] }),
  });
}

export function useCreateExercise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (exercise: TablesInsert<"exercises">) => {
      const { data, error } = await supabase.from("exercises").insert(exercise).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["exercises"] }),
  });
}

export function useDeleteExercise() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("exercises").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["exercises"] }),
  });
}

// ─── Health Tips ───
export type HealthTipRow = Tables<"health_tips">;

export function useHealthTips() {
  return useQuery({
    queryKey: ["health_tips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("health_tips")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as HealthTipRow[];
    },
  });
}

export function useActiveHealthTips() {
  return useQuery({
    queryKey: ["health_tips", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("health_tips")
        .select("*")
        .eq("active", true)
        .order("display_order");
      if (error) throw error;
      return data as HealthTipRow[];
    },
  });
}

export function useUpdateHealthTip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"health_tips"> & { id: string }) => {
      const { data, error } = await supabase.from("health_tips").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["health_tips"] }),
  });
}

export function useCreateHealthTip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (tip: TablesInsert<"health_tips">) => {
      const { data, error } = await supabase.from("health_tips").insert(tip).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["health_tips"] }),
  });
}

export function useDeleteHealthTip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("health_tips").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["health_tips"] }),
  });
}

// ─── Category CRUD ───
export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (cat: TablesInsert<"categories">) => {
      const { data, error } = await supabase.from("categories").insert(cat).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

// ─── Weekly Tips ───
export type WeeklyTipRow = Tables<"weekly_tips">;

export function useWeeklyTips() {
  return useQuery({
    queryKey: ["weekly_tips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("weekly_tips")
        .select("*")
        .order("week_number");
      if (error) throw error;
      return data as WeeklyTipRow[];
    },
  });
}

export function useUpdateWeeklyTip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"weekly_tips"> & { id: string }) => {
      const { data, error } = await supabase.from("weekly_tips").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["weekly_tips"] }),
  });
}

export function useCreateWeeklyTip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (tip: TablesInsert<"weekly_tips">) => {
      const { data, error } = await supabase.from("weekly_tips").insert(tip).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["weekly_tips"] }),
  });
}

export function useDeleteWeeklyTip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("weekly_tips").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["weekly_tips"] }),
  });
}
