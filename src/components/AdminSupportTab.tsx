import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChatDots, PaperPlaneRight, SpinnerGap, UserCircle, MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

interface SupportConversation {
  user_id: string;
  email: string;
  lastMessage: string;
  lastDate: string;
  unread: number;
}

const AdminSupportTab = () => {
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch all support messages grouped by user
  const { data: allMessages = [], isLoading } = useQuery({
    queryKey: ["admin_support_messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_messages")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    refetchInterval: 8000,
  });

  // Fetch user emails
  const { data: userProfiles = [] } = useQuery({
    queryKey: ["admin_user_profiles_for_support"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_profiles").select("user_id, email");
      if (error) throw error;
      return data;
    },
  });

  const emailMap = Object.fromEntries(userProfiles.map(u => [u.user_id, u.email]));

  // Build conversation list
  const conversations: SupportConversation[] = [];
  const userGroups = new Map<string, typeof allMessages>();
  allMessages.forEach(msg => {
    const group = userGroups.get(msg.user_id) || [];
    group.push(msg);
    userGroups.set(msg.user_id, group);
  });

  userGroups.forEach((msgs, userId) => {
    const lastMsg = msgs[msgs.length - 1];
    conversations.push({
      user_id: userId,
      email: emailMap[userId] || userId.slice(0, 8),
      lastMessage: lastMsg.message,
      lastDate: lastMsg.created_at,
      unread: msgs.filter(m => m.sender === "user" && !m.read).length,
    });
  });

  conversations.sort((a, b) => new Date(b.lastDate).getTime() - new Date(a.lastDate).getTime());

  const filteredConversations = conversations.filter(c =>
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedMessages = selectedUserId
    ? allMessages.filter(m => m.user_id === selectedUserId)
    : [];

  // Mark as read
  useEffect(() => {
    if (!selectedUserId) return;
    const unreadIds = selectedMessages.filter(m => m.sender === "user" && !m.read).map(m => m.id);
    if (unreadIds.length > 0) {
      supabase.from("support_messages").update({ read: true }).in("id", unreadIds).then(() => {
        queryClient.invalidateQueries({ queryKey: ["admin_support_messages"] });
      });
    }
  }, [selectedUserId, selectedMessages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [selectedMessages.length]);

  const sendReply = useMutation({
    mutationFn: async () => {
      if (!selectedUserId || !reply.trim()) return;
      const { error } = await supabase.from("support_messages").insert({
        user_id: selectedUserId,
        message: reply.trim(),
        sender: "admin",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_support_messages"] });
      setReply("");
    },
    onError: () => toast.error("Erro ao enviar resposta"),
  });

  return (
    <motion.div key="support" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Suporte</h1>
        <p className="text-sm text-muted-foreground mt-1">Responda às mensagens das usuárias.</p>
      </div>

      <div className="grid md:grid-cols-[320px_1fr] gap-4 h-[70vh]">
        {/* Conversations list */}
        <div className="bg-card rounded-2xl border border-border shadow-card flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar..." className="pl-9 rounded-xl h-9 text-sm" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-8"><SpinnerGap className="w-5 h-5 animate-spin text-primary" /></div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ChatDots className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">Nenhuma conversa</p>
              </div>
            ) : (
              filteredConversations.map(conv => (
                <button
                  key={conv.user_id}
                  onClick={() => setSelectedUserId(conv.user_id)}
                  className={`w-full p-3 text-left border-b border-border hover:bg-muted/30 transition-colors ${selectedUserId === conv.user_id ? "bg-primary/5" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <UserCircle className="w-8 h-8 text-primary/50 flex-shrink-0" weight="duotone" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground truncate">{conv.email}</p>
                        {conv.unread > 0 && (
                          <Badge className="bg-primary text-primary-foreground text-[10px] h-5 min-w-[20px] justify-center">{conv.unread}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {format(new Date(conv.lastDate), "dd/MM HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="bg-card rounded-2xl border border-border shadow-card flex flex-col overflow-hidden">
          {!selectedUserId ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <ChatDots className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Selecione uma conversa</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-3 border-b border-border bg-muted/20">
                <p className="text-sm font-medium text-foreground">{emailMap[selectedUserId] || selectedUserId.slice(0, 8)}</p>
              </div>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedMessages.map(msg => (
                  <div key={msg.id} className={`max-w-[80%] ${msg.sender === "admin" ? "ml-auto" : "mr-auto"}`}>
                    <div className={`rounded-2xl p-3 ${msg.sender === "admin" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted rounded-bl-md"}`}>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    <p className={`text-[10px] mt-0.5 text-muted-foreground ${msg.sender === "admin" ? "text-right" : ""}`}>
                      {format(new Date(msg.created_at), "dd/MM HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-border">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Digite sua resposta..."
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    className="rounded-xl resize-none min-h-[44px] max-h-[100px] flex-1"
                    maxLength={1000}
                    onKeyDown={e => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (reply.trim()) sendReply.mutate();
                      }
                    }}
                  />
                  <Button size="icon" className="rounded-xl h-11 w-11 flex-shrink-0" disabled={!reply.trim() || sendReply.isPending} onClick={() => sendReply.mutate()}>
                    <PaperPlaneRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSupportTab;
