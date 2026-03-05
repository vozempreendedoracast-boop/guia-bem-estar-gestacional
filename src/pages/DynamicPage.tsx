import { useLocation, useNavigate } from "react-router-dom";
import { useCategories } from "@/hooks/useSupabaseData";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, InstagramLogo, WhatsappLogo, YoutubeLogo, TiktokLogo, FacebookLogo, LinkedinLogo, Envelope, Phone, MapPin, Globe } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type ContentItem = {
  id: string;
  title: string;
  content: string;
  display_order: number;
};

const SOCIAL_ICONS: Record<string, any> = {
  instagram: InstagramLogo, whatsapp: WhatsappLogo, youtube: YoutubeLogo,
  tiktok: TiktokLogo, facebook: FacebookLogo, linkedin: LinkedinLogo,
  email: Envelope, phone: Phone,
};

const PageBlockRenderer = ({ block }: { block: any }) => {
  const c = block.content || {};

  if (block.block_type === "text_rich") {
    return (
      <div>
        {block.title && <h3 className="font-semibold text-foreground text-sm sm:text-base">{block.title}</h3>}
        {c.image_url && <img src={c.image_url} alt={block.title} className="w-full rounded-xl mt-2 max-h-48 object-cover" />}
        {c.body && <p className="text-xs sm:text-sm text-muted-foreground mt-2 whitespace-pre-line">{c.body}</p>}
        {c.link_url && c.link_text && (
          <a href={c.link_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
            {c.link_text}
          </a>
        )}
      </div>
    );
  }

  if (block.block_type === "button") {
    const style = c.style === "outline" ? "border border-primary text-primary bg-transparent" : c.style === "secondary" ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground";
    return (
      <div className="text-center">
        {block.title && <p className="text-xs text-muted-foreground mb-2">{block.title}</p>}
        <a href={c.url} target="_blank" rel="noopener noreferrer" className={`inline-block w-full px-6 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity ${style}`}>
          {c.label || "Clique aqui"}
        </a>
      </div>
    );
  }

  if (block.block_type === "image") {
    const img = <img src={c.image_url} alt={c.alt || block.title} className="w-full rounded-xl max-h-64 object-cover" />;
    return (
      <div>
        {block.title && <h3 className="font-semibold text-foreground text-sm sm:text-base mb-2">{block.title}</h3>}
        {c.link_url ? <a href={c.link_url} target="_blank" rel="noopener noreferrer">{img}</a> : img}
      </div>
    );
  }

  if (block.block_type === "social_links") {
    const links = (c.links || []) as Array<{ platform: string; url: string }>;
    return (
      <div>
        {block.title && <h3 className="font-semibold text-foreground text-sm sm:text-base mb-3">{block.title}</h3>}
        <div className="flex flex-wrap gap-2 justify-center">
          {links.map((link: any, i: number) => {
            const Icon = SOCIAL_ICONS[link.platform] || Globe;
            return (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-foreground text-xs font-medium">
                <Icon className="w-4 h-4" weight="duotone" />
                {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
              </a>
            );
          })}
        </div>
      </div>
    );
  }

  if (block.block_type === "professional") {
    return (
      <div className="text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {c.photo_url && <img src={c.photo_url} alt={c.name} className="w-20 h-20 rounded-full object-cover flex-shrink-0 border-2 border-primary/20" />}
          <div className="min-w-0">
            <h3 className="font-bold text-foreground text-base">{c.name || block.title}</h3>
            {c.specialty && <p className="text-xs text-primary font-medium mt-0.5">{c.specialty}</p>}
            {c.description && <p className="text-xs text-muted-foreground mt-1">{c.description}</p>}
            {c.location && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-center sm:justify-start">
                <MapPin className="w-3 h-3" /> {c.location}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
          {c.phone && <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs hover:bg-muted/80 transition-colors"><Phone className="w-3.5 h-3.5" />{c.phone}</a>}
          {c.email && <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs hover:bg-muted/80 transition-colors"><Envelope className="w-3.5 h-3.5" />{c.email}</a>}
          {c.instagram && <a href={c.instagram.startsWith("http") ? c.instagram : `https://instagram.com/${c.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs hover:bg-muted/80 transition-colors"><InstagramLogo className="w-3.5 h-3.5" />Instagram</a>}
          {c.website && <a href={c.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs hover:bg-muted/80 transition-colors"><Globe className="w-3.5 h-3.5" />Site</a>}
        </div>
      </div>
    );
  }

  return <p className="text-xs text-muted-foreground">Bloco não suportado: {block.block_type}</p>;
};

const DynamicPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: categories = [], isLoading: catLoading } = useCategories();

  const category = categories.find(c => c.path === location.pathname);

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

  const { data: pageBlocks = [] } = useQuery({
    queryKey: ["dynamic-page-blocks", category?.id],
    queryFn: async () => {
      if (!category) return [];
      const { data, error } = await supabase
        .from("page_blocks" as any)
        .select("*")
        .eq("category_id", category.id)
        .eq("active", true)
        .order("display_order");
      if (error) throw error;
      return data as any[];
    },
    enabled: !!category,
  });

  const isLoading = catLoading || contentLoading;
  const hasAnyContent = tips.length > 0 || symptoms.length > 0 || exercises.length > 0 || healthTips.length > 0 || pageBlocks.length > 0;

  if (!catLoading && !category) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center px-6">
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

  const ContentCard = ({ children, index = 0 }: { children: React.ReactNode; index?: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card rounded-2xl shadow-card border border-border overflow-hidden"
    >
      {/* Category sticky bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border-b border-primary/20">
        <div className="w-1 h-4 rounded-full bg-primary" />
        <span className="text-xs font-bold text-primary tracking-wide truncate">{category?.title}</span>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="gradient-hero text-primary-foreground px-4 sm:px-6 lg:px-16 pt-6 sm:pt-8 pb-8 sm:pb-10 rounded-b-[2rem]">
        <div className="flex items-center gap-3 mb-4 max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10 flex-shrink-0"
            onClick={() => navigate("/painel")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-display truncate">{category?.title}</h1>
            {category?.description && (
              <p className="text-xs sm:text-sm opacity-80 mt-1 line-clamp-2">{category.description}</p>
            )}
          </div>
        </div>
        {category?.image_url?.trim() && (
          <div className="rounded-2xl overflow-hidden mt-2 max-w-4xl mx-auto">
            <img
              src={category.image_url}
              alt={category.title}
              className="w-full h-40 sm:h-48 lg:h-64 object-cover"
            />
          </div>
        )}
      </div>

      <div className="px-4 sm:px-6 lg:px-16 -mt-4 space-y-4 sm:space-y-6 max-w-4xl mx-auto">
        {/* No content yet */}
        {!hasAnyContent && (
          <ContentCard>
            <div className="text-center py-4">
              <p className="text-muted-foreground">Conteúdo em breve! 🚀</p>
              <p className="text-sm text-muted-foreground/70 mt-2">
                O administrador ainda não adicionou conteúdo para esta seção.
              </p>
            </div>
          </ContentCard>
        )}

        {/* Weekly Tips */}
        {tips.length > 0 && (
          <div className="space-y-3">
            {tips.map((tip, i) => (
              <ContentCard key={tip.id} index={i}>
                <h3 className="font-semibold text-foreground text-sm sm:text-base">{tip.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 whitespace-pre-line">{tip.content}</p>
              </ContentCard>
            ))}
          </div>
        )}

        {/* Symptoms */}
        {symptoms.length > 0 && (
          <div className="space-y-3">
            {symptoms.map((s: any, i: number) => (
              <ContentCard key={s.id} index={i}>
                <h3 className="font-semibold text-foreground text-sm sm:text-base">{s.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{s.description}</p>
                {s.what_to_do && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-xl">
                    <p className="text-xs font-medium text-foreground">O que fazer:</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.what_to_do}</p>
                  </div>
                )}
              </ContentCard>
            ))}
          </div>
        )}

        {/* Exercises */}
        {exercises.length > 0 && (
          <div className="space-y-3">
            {exercises.map((ex: any, i: number) => (
              <ContentCard key={ex.id} index={i}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">{ex.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    ex.intensity === "leve" ? "bg-accent text-accent-foreground" :
                    ex.intensity === "moderado" ? "bg-peach text-peach-foreground" :
                    "bg-destructive/10 text-destructive"
                  }`}>{ex.intensity}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{ex.description}</p>
                {ex.steps?.length > 0 && (
                  <ol className="mt-3 space-y-1">
                    {ex.steps.map((step: string, si: number) => (
                      <li key={si} className="text-xs text-muted-foreground flex gap-2">
                        <span className="font-semibold text-foreground">{si + 1}.</span> {step}
                      </li>
                    ))}
                  </ol>
                )}
              </ContentCard>
            ))}
          </div>
        )}

        {/* Health Tips */}
        {healthTips.length > 0 && (
          <div className="space-y-3">
            {healthTips.map((ht: any, i: number) => (
              <ContentCard key={ht.id} index={i}>
                <h3 className="font-semibold text-foreground text-sm sm:text-base">{ht.section_title}</h3>
                {ht.tips?.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {ht.tips.map((tip: string, ti: number) => (
                      <li key={ti} className="text-xs sm:text-sm text-muted-foreground flex gap-2">
                        <span>•</span> {tip}
                      </li>
                    ))}
                  </ul>
                )}
              </ContentCard>
            ))}
          </div>
        )}

        {/* Page Blocks (Bio Links) */}
        {pageBlocks.length > 0 && (
          <div className="space-y-3">
            {pageBlocks.map((block: any, i: number) => (
              <ContentCard key={block.id} index={i}>
                <PageBlockRenderer block={block} />
              </ContentCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicPage;
