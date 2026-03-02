import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Assistant = () => {
  const navigate = useNavigate();
  const { profile, currentWeek, trimester } = usePregnancy();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const contextMsg = `[Contexto: Gestante "${profile?.name}", semana ${currentWeek}, ${trimester}° trimestre]`;
      const messagesForApi = [
        { role: "user" as const, content: contextMsg },
        { role: "assistant" as const, content: "Entendido, vou considerar esse contexto." },
        ...updatedMessages,
      ];

      const { data, error } = await supabase.functions.invoke("chat", {
        body: { messages: messagesForApi },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
    } catch (e: any) {
      toast.error(e.message || "Erro ao enviar mensagem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center gap-3 border-b border-border">
        <Button variant="ghost" size="icon" onClick={() => navigate("/painel")} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold font-display">Assistente IA</h1>
          <p className="text-xs text-muted-foreground">Sua companheira de gestação</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center gap-4 py-12">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-soft">
              <Bot className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold font-display text-lg">Olá, {profile?.name}! 💕</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                Estou aqui para te acompanhar. Pergunte sobre sua gestação, sintomas, exercícios ou qualquer dúvida!
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {["O que esperar na semana " + currentWeek + "?", "Dicas para enjoo", "Posso fazer exercícios?"].map(q => (
                <button key={q} onClick={() => { setInput(q); }} className="text-xs bg-card border border-border rounded-xl px-3 py-2 text-muted-foreground hover:bg-muted transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
              msg.role === "user"
                ? "gradient-primary text-primary-foreground rounded-br-md"
                : "bg-card border border-border text-foreground rounded-bl-md"
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Digite sua pergunta..."
            className="rounded-xl flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="rounded-xl h-10 w-10" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-[10px] text-center text-muted-foreground/60 mt-2">
          Este assistente não substitui acompanhamento médico profissional.
        </p>
      </div>
    </div>
  );
};

export default Assistant;
