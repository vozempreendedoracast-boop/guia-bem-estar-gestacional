import { useLocation, useNavigate } from "react-router-dom";
import { useCategories } from "@/hooks/useSupabaseData";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type ContentItem = {
  id: string;
  title: string;
  content: string;
  display_order: number;
};

const DynamicPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: categories = [], isLoading: catLoading } = useCategories();

  // Match current path to a category
  const category = categories.find(c => c.path === location.pathname);

  // Fetch weekly_tips linked to this category (generic content table)
  const { data: tips = [], isLoading: contentLoading } = useQuery({
    queryKey: ["dynamic-content", category?.id],
    queryFn: async () => {
      if (!category) return [];
      const { data, error } = await supabase
        .from("weekly_tips")
        .select("*")
        .eq("category_id", category.id)
        .eq("active", true)
        .order("display_order");
      if (error) throw error;
      return data as ContentItem[];
    },
    enabled: !!category,
  });

  // Fetch symptoms linked to this category
  const { data: symptoms = [] } = useQuery({
    queryKey: ["dynamic-symptoms", category?.id],
    queryFn: async () => {
      if (!category) return [];
      const { data, error } = await supabase
        .from("symptoms")
        .select("*")
        .eq("category_id", category.id)
        .eq("active", true)
        .order("display_order");
      if (error) throw error;
      return data;
    },
    enabled: !!category,
  });

  // Fetch exercises linked to this category
  const { data: exercises = [] } = useQuery({
    queryKey: ["dynamic-exercises", category?.id],
    queryFn: async () => {
      if (!category) return [];
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .eq("category_id", category.id)
        .eq("active", true)
        .order("display_order");
      if (error) throw error;
      return data;
    },
    enabled: !!category,
  });

  // Fetch health tips linked to this category
  const { data: healthTips = [] } = useQuery({
    queryKey: ["dynamic-health-tips", category?.id],
    queryFn: async () => {
      if (!category) return [];
      const { data, error } = await supabase
        .from("health_tips")
        .select("*")
        .eq("category_id", category.id)
        .eq("active", true)
        .order("display_order");
      if (error) throw error;
      return data;
    },
    enabled: !!category,
  });

  const isLoading = catLoading || contentLoading;
  const hasAnyContent = tips.length > 0 || symptoms.length > 0 || exercises.length > 0 || healthTips.length > 0;

  // If categories loaded and no match → real 404
  if (!catLoading && !category) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Ops! Página não encontrada</p>
          <a href="/" className="text-primary underline hover:text-primary/90">
            Voltar para o início
          </a>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-6 w-72" />
        <div className="space-y-3 mt-8">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="gradient-hero text-primary-foreground px-6 pt-8 pb-10 rounded-b-[2rem]">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => navigate("/painel")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold font-display">{category?.title}</h1>
            {category?.description && (
              <p className="text-sm opacity-80 mt-1">{category.description}</p>
            )}
          </div>
        </div>
        {category?.image_url?.trim() && (
          <div className="rounded-2xl overflow-hidden mt-2">
            <img src={category.image_url} alt={category.title} className="w-full h-48 object-cover" />
          </div>
        )}
      </div>

      <div className="px-6 -mt-4 space-y-6">
        {/* No content yet */}
        {!hasAnyContent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-8 shadow-card border border-border text-center"
          >
            <p className="text-muted-foreground">Conteúdo em breve! 🚀</p>
            <p className="text-sm text-muted-foreground/70 mt-2">
              O administrador ainda não adicionou conteúdo para esta seção.
            </p>
          </motion.div>
        )}

        {/* Weekly Tips / Generic content */}
        {tips.length > 0 && (
          <div className="space-y-3">
            {tips.map((tip, i) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl p-5 shadow-card border border-border"
              >
                <h3 className="font-semibold text-foreground">{tip.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line">{tip.content}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Symptoms */}
        {symptoms.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-lg text-foreground">Sintomas</h2>
            {symptoms.map((s: any, i: number) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl p-5 shadow-card border border-border"
              >
                <h3 className="font-semibold text-foreground">{s.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{s.description}</p>
                {s.what_to_do && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-xl">
                    <p className="text-xs font-medium text-foreground">O que fazer:</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.what_to_do}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Exercises */}
        {exercises.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-lg text-foreground">Exercícios</h2>
            {exercises.map((ex: any, i: number) => (
              <motion.div
                key={ex.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl p-5 shadow-card border border-border"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{ex.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    ex.intensity === "leve" ? "bg-green-100 text-green-700" :
                    ex.intensity === "moderado" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>{ex.intensity}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{ex.description}</p>
                {ex.steps?.length > 0 && (
                  <ol className="mt-3 space-y-1">
                    {ex.steps.map((step: string, si: number) => (
                      <li key={si} className="text-xs text-muted-foreground flex gap-2">
                        <span className="font-semibold text-foreground">{si + 1}.</span> {step}
                      </li>
                    ))}
                  </ol>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Health Tips */}
        {healthTips.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-lg text-foreground">Dicas de Saúde</h2>
            {healthTips.map((ht: any, i: number) => (
              <motion.div
                key={ht.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl p-5 shadow-card border border-border"
              >
                <h3 className="font-semibold text-foreground">{ht.section_title}</h3>
                {ht.tips?.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {ht.tips.map((tip: string, ti: number) => (
                      <li key={ti} className="text-sm text-muted-foreground flex gap-2">
                        <span>•</span> {tip}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicPage;
