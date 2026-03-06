import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, PaperPlaneRight, ChatDots, SpinnerGap, ImageSquare, Star, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useNotifications } from "@/hooks/useNotifications";

const SUPABASE_URL = "https://hmtrjnosuwtmulerhgnr.supabase.co";

const Support = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { requestPermission, sendNotification } = useNotifications();
  const prevMessageCountRef = useRef(0);

  // Rating state
  const [ratingOpen, setRatingOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingText, setRatingText] = useState("");

  // Get or create active conversation
  const { data: conversation } = useQuery({
    queryKey: ["support_conversation", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      // First check for a recently closed conversation pending rating
      const { data: closedConv } = await supabase
        .from("support_conversations")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "closed")
        .is("rating", null)
        .order("closed_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (closedConv) return closedConv;
      
      // Find open conversation
      const { data, error } = await supabase
        .from("support_conversations")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      if (data) return data;
      // Create new conversation
      const { data: newConv, error: createError } = await supabase
        .from("support_conversations")
        .insert({ user_id: user.id })
        .select()
        .single();
      if (createError) throw createError;
      return newConv;
    },
    enabled: !!user,
    refetchInterval: 10000,
  });

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["support_messages", user?.id, conversation?.id],
    queryFn: async () => {
      if (!user || !conversation?.id) return [];
      const { data, error } = await supabase
        .from("support_messages")
        .select("*")
        .eq("user_id", user.id)
        .eq("conversation_id", conversation.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!conversation?.id,
    refetchInterval: 8000,
  });

  // Request notification permission on mount
  useEffect(() => {
    requestPermission();
  }, []);

  // Mark admin messages as read when viewing
  useEffect(() => {
    if (!user || !conversation?.id || messages.length === 0) return;
    const unreadAdminIds = messages
      .filter(m => m.sender === "admin" && !m.read)
      .map(m => m.id);
    if (unreadAdminIds.length > 0) {
      supabase
        .from("support_messages")
        .update({ read: true })
        .in("id", unreadAdminIds)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["unread-support"] });
        });
    }
  }, [messages, user, conversation?.id]);

  // Detect new admin messages and notify
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current && prevMessageCountRef.current > 0) {
      const newMsgs = messages.slice(prevMessageCountRef.current);
      const hasAdminMsg = newMsgs.some(m => m.sender === "admin");
      if (hasAdminMsg) {
        toast.success("Nova resposta do suporte! 💬");
        sendNotification("MamyBoo Suporte 💬", "Você recebeu uma nova resposta do suporte!");
      }
    }
    prevMessageCountRef.current = messages.length;
  }, [messages]);

  // Check if conversation was closed
  const conversationClosed = conversation?.status === "closed";

  useEffect(() => {
    if (conversationClosed && !ratingOpen) {
      // Show rating dialog when conversation is closed
      setRatingOpen(true);
    }
  }, [conversationClosed]);

  const sendMutation = useMutation({
    mutationFn: async (imageUrl?: string) => {
      if (!user || !conversation?.id) return;
      if (!message.trim() && !imageUrl) return;
      const { error } = await supabase.from("support_messages").insert({
        user_id: user.id,
        message: imageUrl ? (message.trim() || "📷 Imagem") : message.trim(),
        sender: "user",
        conversation_id: conversation.id,
        image_url: imageUrl || "",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support_messages"] });
      setMessage("");
    },
    onError: () => toast.error("Erro ao enviar mensagem"),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !conversation?.id) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagem muito grande. Máximo 5MB.");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("support-images")
        .upload(path, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("support-images")
        .getPublicUrl(path);

      await sendMutation.mutateAsync(urlData.publicUrl);
    } catch {
      toast.error("Erro ao enviar imagem");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmitRating = async () => {
    if (!conversation?.id || rating === 0) return;
    try {
      await supabase
        .from("support_conversations")
        .update({ rating, rating_text: ratingText })
        .eq("id", conversation.id);
      toast.success("Obrigada pela avaliação! 💕");
      setRatingOpen(false);
      // Invalidate to create new conversation next time
      queryClient.invalidateQueries({ queryKey: ["support_conversation"] });
    } catch {
      toast.error("Erro ao enviar avaliação");
    }
  };

  const handleSkipRating = () => {
    setRatingOpen(false);
    queryClient.invalidateQueries({ queryKey: ["support_conversation"] });
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center gap-3 border-b border-border">
        <Button variant="ghost" size="icon" onClick={() => navigate("/painel")} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-lg font-bold font-display">Suporte</h1>
          <p className="text-xs text-muted-foreground">Converse com nossa equipe</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <SpinnerGap className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <ChatDots className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">Nenhuma mensagem ainda</p>
            <p className="text-xs mt-1">Envie sua dúvida ou feedback abaixo!</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className={`max-w-[80%] ${msg.sender === "user" ? "ml-auto" : "mr-auto"}`}
            >
              <div className={`rounded-2xl p-3 ${msg.sender === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-card border border-border rounded-bl-md"}`}>
                {msg.image_url && (
                  <img src={msg.image_url} alt="Anexo" className="rounded-xl max-w-full max-h-48 object-cover mb-2 cursor-pointer" onClick={() => window.open(msg.image_url, "_blank")} />
                )}
                {msg.message && msg.message !== "📷 Imagem" && <p className="text-sm">{msg.message}</p>}
                {msg.message === "📷 Imagem" && !msg.image_url && <p className="text-sm">{msg.message}</p>}
              </div>
              <p className={`text-[10px] mt-0.5 text-muted-foreground ${msg.sender === "user" ? "text-right" : ""}`}>
                {format(new Date(msg.created_at), "dd/MM HH:mm", { locale: ptBR })}
              </p>
            </motion.div>
          ))
        )}
      </div>

      {/* Input */}
      {!conversationClosed ? (
        <div className="px-6 pb-6 pt-3 border-t border-border bg-background">
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl h-11 w-11 flex-shrink-0"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <SpinnerGap className="w-5 h-5 animate-spin" /> : <ImageSquare className="w-5 h-5" />}
            </Button>
            <Textarea
              placeholder="Digite sua mensagem..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="rounded-xl resize-none min-h-[44px] max-h-[120px]"
              maxLength={1000}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (message.trim()) sendMutation.mutate(undefined);
                }
              }}
            />
            <Button
              size="icon"
              className="rounded-xl h-11 w-11 flex-shrink-0"
              disabled={!message.trim() || sendMutation.isPending}
              onClick={() => sendMutation.mutate(undefined)}
            >
              <PaperPlaneRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="px-6 pb-6 pt-3 border-t border-border bg-background text-center">
          <p className="text-sm text-muted-foreground">Esta conversa foi encerrada.</p>
          <Button variant="outline" className="rounded-xl mt-2" onClick={() => {
            queryClient.invalidateQueries({ queryKey: ["support_conversation"] });
          }}>
            Iniciar nova conversa
          </Button>
        </div>
      )}

      {/* Rating Dialog */}
      <Dialog open={ratingOpen} onOpenChange={setRatingOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">Como foi o atendimento?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setRating(n)} className="transition-transform hover:scale-110">
                  <Star className={`w-8 h-8 ${n <= rating ? "text-yellow-400" : "text-muted-foreground/30"}`} weight={n <= rating ? "fill" : "regular"} />
                </button>
              ))}
            </div>
            <Textarea
              placeholder="Deixe um comentário (opcional)..."
              value={ratingText}
              onChange={e => setRatingText(e.target.value)}
              className="rounded-xl resize-none"
              maxLength={500}
            />
            <div className="flex gap-2">
              <Button className="flex-1 rounded-xl" onClick={handleSubmitRating} disabled={rating === 0}>
                Enviar avaliação
              </Button>
              <Button variant="outline" className="rounded-xl" onClick={handleSkipRating}>
                Pular
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Support;
