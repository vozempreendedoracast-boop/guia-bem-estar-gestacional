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

// ─── Weekly Tips (Daily Tips) ───
export type WeeklyTipRow = Tables<"weekly_tips"> & { day_of_week?: number };

export function useWeeklyTips() {
  return useQuery({
    queryKey: ["weekly_tips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("weekly_tips")
        .select("*")
        .order("week_number")
        .order("day_of_week" as any);
      if (error) throw error;
      return data as WeeklyTipRow[];
    },
  });
}

export function useDailyTip(weekNumber: number, dayOfWeek: number) {
  return useQuery({
    queryKey: ["daily_tip", weekNumber, dayOfWeek],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("weekly_tips")
        .select("*")
        .eq("week_number", weekNumber)
        .eq("day_of_week" as any, dayOfWeek)
        .eq("active", true)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as WeeklyTipRow | null;
    },
    enabled: weekNumber >= 1 && weekNumber <= 40 && dayOfWeek >= 1 && dayOfWeek <= 7,
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

// ─── Plans ───
export type PlanRow = Tables<"plans">;

export function usePlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as PlanRow[];
    },
  });
}

export function useActivePlans() {
  return useQuery({
    queryKey: ["plans", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("active", true)
        .order("display_order");
      if (error) throw error;
      return data as PlanRow[];
    },
  });
}

export function useUpdatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"plans"> & { id: string }) => {
      const { data, error } = await supabase.from("plans").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["plans"] }),
  });
}

export function useCreatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (plan: TablesInsert<"plans">) => {
      const { data, error } = await supabase.from("plans").insert(plan).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["plans"] }),
  });
}

export function useDeletePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("plans").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["plans"] }),
  });
}

// ─── Promotions ───
export type PromotionRow = Tables<"promotions">;

export function usePromotions() {
  return useQuery({
    queryKey: ["promotions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as PromotionRow[];
    },
  });
}

export function useActivePromotions() {
  return useQuery({
    queryKey: ["promotions", "active"],
    queryFn: async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .eq("active", true)
        .order("display_order");
      if (error) throw error;
      // Filter by date range client-side
      return (data as PromotionRow[]).filter(p => {
        if (p.starts_at && p.starts_at > now) return false;
        if (p.ends_at && p.ends_at < now) return false;
        return true;
      });
    },
  });
}

export function useCreatePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (promo: TablesInsert<"promotions">) => {
      const { data, error } = await supabase.from("promotions").insert(promo).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["promotions"] }),
  });
}

export function useUpdatePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"promotions"> & { id: string }) => {
      const { data, error } = await supabase.from("promotions").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["promotions"] }),
  });
}

export function useDeletePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("promotions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["promotions"] }),
  });
}

// ─── Page Blocks (Bio Links) ───
export type PageBlockRow = {
  id: string;
  category_id: string | null;
  block_type: string;
  title: string;
  content: Record<string, any>;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export function usePageBlocks() {
  return useQuery({
    queryKey: ["page_blocks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_blocks" as any)
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as unknown as PageBlockRow[];
    },
  });
}

export function useCreatePageBlock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (block: Omit<PageBlockRow, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase.from("page_blocks" as any).insert(block as any).select().single();
      if (error) throw error;
      return data as unknown as PageBlockRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["page_blocks"] }),
  });
}

export function useUpdatePageBlock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PageBlockRow> & { id: string }) => {
      const { data, error } = await supabase.from("page_blocks" as any).update(updates as any).eq("id", id).select().single();
      if (error) throw error;
      return data as unknown as PageBlockRow;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["page_blocks"] }),
  });
}

export function useDeletePageBlock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("page_blocks" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["promotions"] }),
  });
}
