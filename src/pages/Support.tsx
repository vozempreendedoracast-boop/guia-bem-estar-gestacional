import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, PaperPlaneRight, ChatDots, SpinnerGap } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

const Support = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["support_messages", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("support_messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    refetchInterval: 10000,
  });

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!user || !message.trim()) return;
      const { error } = await supabase.from("support_messages").insert({
        user_id: user.id,
        message: message.trim(),
        sender: "user",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support_messages"] });
      setMessage("");
    },
    onError: () => toast.error("Erro ao enviar mensagem"),
  });

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
                <p className="text-sm">{msg.message}</p>
              </div>
              <p className={`text-[10px] mt-0.5 text-muted-foreground ${msg.sender === "user" ? "text-right" : ""}`}>
                {format(new Date(msg.created_at), "dd/MM HH:mm", { locale: ptBR })}
              </p>
            </motion.div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="px-6 pb-6 pt-3 border-t border-border bg-background">
        <div className="flex gap-2">
          <Textarea
            placeholder="Digite sua mensagem..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="rounded-xl resize-none min-h-[44px] max-h-[120px]"
            maxLength={1000}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (message.trim()) sendMutation.mutate();
              }
            }}
          />
          <Button
            size="icon"
            className="rounded-xl h-11 w-11 flex-shrink-0"
            disabled={!message.trim() || sendMutation.isPending}
            onClick={() => sendMutation.mutate()}
          >
            <PaperPlaneRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Support;
