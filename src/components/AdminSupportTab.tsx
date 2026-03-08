import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChatDots, PaperPlaneRight, SpinnerGap, UserCircle, MagnifyingGlass, XCircle, Star, ImageSquare, Eye, Clock } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

const AdminSupportTab = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewProfileOpen, setViewProfileOpen] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<any>(null);
  const [viewProfileLoading, setViewProfileLoading] = useState(false);
  const [tab, setTab] = useState("open");

  // Fetch conversations
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["admin_support_conversations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_conversations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    refetchInterval: 8000,
  });

  // Fetch all messages
  const { data: allMessages = [] } = useQuery({
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

  // Fetch user profiles + pregnancy profiles for names
  const { data: userProfiles = [] } = useQuery({
    queryKey: ["admin_user_profiles_for_support"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_profiles").select("user_id, email");
      if (error) throw error;
      return data;
    },
  });

  const { data: pregnancyProfiles = [] } = useQuery({
    queryKey: ["admin_pregnancy_profiles_for_support"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pregnancy_profiles").select("user_id, name");
      if (error) throw error;
      return data;
    },
  });

  const emailMap = Object.fromEntries(userProfiles.map(u => [u.user_id, u.email]));
  const nameMap = Object.fromEntries(pregnancyProfiles.map(p => [p.user_id, p.name]));

  const getUserDisplay = (userId: string) => {
    const name = nameMap[userId];
    const email = emailMap[userId] || userId.slice(0, 8);
    return name ? `${name} (${email})` : email;
  };

  const getUserName = (userId: string) => nameMap[userId] || emailMap[userId] || userId.slice(0, 8);

  // Filter conversations by tab and search
  const filteredConversations = conversations
    .filter(c => tab === "open" ? c.status === "open" : c.status === "closed")
    .filter(c => {
      const display = getUserDisplay(c.user_id).toLowerCase();
      return display.includes(searchQuery.toLowerCase());
    });

  // Enrich conversations with last message and unread count
  const enrichedConversations = filteredConversations.map(conv => {
    const msgs = allMessages.filter(m => m.conversation_id === conv.id);
    const lastMsg = msgs[msgs.length - 1];
    const unread = msgs.filter(m => m.sender === "user" && !m.read).length;
    return { ...conv, lastMessage: lastMsg?.message || "", lastDate: lastMsg?.created_at || conv.created_at, unread };
  }).sort((a, b) => new Date(b.lastDate).getTime() - new Date(a.lastDate).getTime());

  const selectedConv = conversations.find(c => c.id === selectedConvId);
  const selectedMessages = selectedConvId ? allMessages.filter(m => m.conversation_id === selectedConvId) : [];

  // Mark as read
  useEffect(() => {
    if (!selectedConvId) return;
    const unreadIds = selectedMessages.filter(m => m.sender === "user" && !m.read).map(m => m.id);
    if (unreadIds.length > 0) {
      supabase.from("support_messages").update({ read: true }).in("id", unreadIds).then(() => {
        queryClient.invalidateQueries({ queryKey: ["admin_support_messages"] });
      });
    }
  }, [selectedConvId, selectedMessages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [selectedMessages.length]);

  const sendReply = useMutation({
    mutationFn: async (imageUrl?: string) => {
      if (!selectedConv || !user) return;
      if (!reply.trim() && !imageUrl) return;
      const messageText = imageUrl ? (reply.trim() || "📷 Imagem") : reply.trim();
      const { error } = await supabase.from("support_messages").insert({
        user_id: selectedConv.user_id,
        message: messageText,
        sender: "admin",
        conversation_id: selectedConv.id,
        image_url: imageUrl || "",
      });
      if (error) throw error;

      // Send push notification to user
      try {
        await supabase.functions.invoke("send-push", {
          body: {
            target_user_id: selectedConv.user_id,
            title: "💬 Nova resposta do suporte",
            body: messageText.slice(0, 100),
            url: "/suporte",
          },
        });
      } catch (e) {
        console.warn("Push notification failed:", e);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_support_messages"] });
      setReply("");
    },
    onError: () => toast.error("Erro ao enviar resposta"),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedConv || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagem muito grande. Máximo 5MB.");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `admin/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("support-images").upload(path, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("support-images").getPublicUrl(path);
      await sendReply.mutateAsync(urlData.publicUrl);
    } catch {
      toast.error("Erro ao enviar imagem");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCloseConversation = async () => {
    if (!selectedConv || !user) return;
    if (!confirm("Encerrar esta conversa? A usuária será convidada a avaliar o atendimento.")) return;
    try {
      await supabase
        .from("support_conversations")
        .update({ status: "closed", closed_by: user.id, closed_at: new Date().toISOString() })
        .eq("id", selectedConv.id);
      toast.success("Conversa encerrada!");
      queryClient.invalidateQueries({ queryKey: ["admin_support_conversations"] });
      setSelectedConvId(null);
    } catch {
      toast.error("Erro ao encerrar conversa");
    }
  };

  const handleViewProfile = async (userId: string) => {
    setViewProfileLoading(true);
    setViewProfileOpen(true);
    try {
      const [pregnancyResult, userProfileResult] = await Promise.all([
        supabase.from("pregnancy_profiles").select("*").eq("user_id", userId).maybeSingle(),
        supabase.from("user_profiles").select("*").eq("user_id", userId).maybeSingle(),
      ]);
      setViewingProfile({
        ...pregnancyResult.data,
        _userProfile: userProfileResult.data,
      });
    } catch { setViewingProfile(null); }
    finally { setViewProfileLoading(false); }
  };

  return (
    <motion.div key="support" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Suporte</h1>
        <p className="text-sm text-muted-foreground mt-1">Responda às mensagens das usuárias.</p>
      </div>

      <div className="grid md:grid-cols-[320px_1fr] gap-4 h-[70vh]">
        {/* Conversations list */}
        <div className="bg-card rounded-2xl border border-border shadow-card flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border space-y-2">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="w-full h-8">
                <TabsTrigger value="open" className="flex-1 text-xs">Abertas</TabsTrigger>
                <TabsTrigger value="closed" className="flex-1 text-xs">Histórico</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar..." className="pl-9 rounded-xl h-9 text-sm" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-8"><SpinnerGap className="w-5 h-5 animate-spin text-primary" /></div>
            ) : enrichedConversations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ChatDots className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">Nenhuma conversa {tab === "open" ? "aberta" : "no histórico"}</p>
              </div>
            ) : (
              enrichedConversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`w-full p-3 text-left border-b border-border hover:bg-muted/30 transition-colors ${selectedConvId === conv.id ? "bg-primary/5" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <UserCircle className="w-8 h-8 text-primary/50 flex-shrink-0" weight="duotone" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground truncate">{getUserName(conv.user_id)}</p>
                        {conv.unread > 0 && (
                          <Badge className="bg-primary text-primary-foreground text-[10px] h-5 min-w-[20px] justify-center">{conv.unread}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] text-muted-foreground">
                          {format(new Date(conv.lastDate), "dd/MM HH:mm", { locale: ptBR })}
                        </p>
                        {conv.status === "closed" && conv.rating && (
                          <div className="flex items-center gap-0.5">
                            {[1,2,3,4,5].map(n => (
                              <Star key={n} className={`w-2.5 h-2.5 ${n <= conv.rating ? "text-yellow-400" : "text-muted-foreground/20"}`} weight={n <= conv.rating ? "fill" : "regular"} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="bg-card rounded-2xl border border-border shadow-card flex flex-col overflow-hidden">
          {!selectedConvId ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <ChatDots className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Selecione uma conversa</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-3 border-b border-border bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{getUserDisplay(selectedConv?.user_id || "")}</p>
                    <div className="flex items-center gap-2">
                      {selectedConv?.status === "closed" && <Badge variant="outline" className="text-[10px]">Encerrada</Badge>}
                      {selectedConv?.status === "closed" && selectedConv?.closed_at && (
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(selectedConv.closed_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => selectedConv && handleViewProfile(selectedConv.user_id)} title="Ver perfil">
                    <Eye className="w-4 h-4" />
                  </Button>
                  {selectedConv?.status === "open" && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:text-destructive" onClick={handleCloseConversation} title="Encerrar conversa">
                      <XCircle className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedMessages.map(msg => (
                  <div key={msg.id} className={`max-w-[80%] ${msg.sender === "admin" ? "ml-auto" : "mr-auto"}`}>
                    <div className={`rounded-2xl p-3 ${msg.sender === "admin" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted rounded-bl-md"}`}>
                      {msg.image_url && (
                        <img src={msg.image_url} alt="Anexo" className="rounded-xl max-w-full max-h-48 object-cover mb-2 cursor-pointer" onClick={() => window.open(msg.image_url, "_blank")} />
                      )}
                      {msg.message && msg.message !== "📷 Imagem" && <p className="text-sm">{msg.message}</p>}
                    </div>
                    <p className={`text-[10px] mt-0.5 text-muted-foreground ${msg.sender === "admin" ? "text-right" : ""}`}>
                      {format(new Date(msg.created_at), "dd/MM HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                ))}
                {/* Show rating if closed */}
                {selectedConv?.status === "closed" && selectedConv?.rating && (
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-xs font-medium text-foreground mb-1">Avaliação da usuária</p>
                    <div className="flex justify-center gap-1 mb-1">
                      {[1,2,3,4,5].map(n => (
                        <Star key={n} className={`w-5 h-5 ${n <= selectedConv.rating ? "text-yellow-400" : "text-muted-foreground/20"}`} weight={n <= selectedConv.rating ? "fill" : "regular"} />
                      ))}
                    </div>
                    {selectedConv.rating_text && <p className="text-xs text-muted-foreground italic">"{selectedConv.rating_text}"</p>}
                  </div>
                )}
              </div>
              {selectedConv?.status === "open" && (
                <div className="p-3 border-t border-border">
                  <div className="flex gap-2">
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    <Button variant="ghost" size="icon" className="rounded-xl h-11 w-11 flex-shrink-0" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                      {uploading ? <SpinnerGap className="w-5 h-5 animate-spin" /> : <ImageSquare className="w-5 h-5" />}
                    </Button>
                    <Textarea
                      placeholder="Digite sua resposta..."
                      value={reply}
                      onChange={e => setReply(e.target.value)}
                      className="rounded-xl resize-none min-h-[44px] max-h-[100px] flex-1"
                      maxLength={1000}
                      onKeyDown={e => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (reply.trim()) sendReply.mutate(undefined);
                        }
                      }}
                    />
                    <Button size="icon" className="rounded-xl h-11 w-11 flex-shrink-0" disabled={!reply.trim() || sendReply.isPending} onClick={() => sendReply.mutate(undefined)}>
                      <PaperPlaneRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* View Profile Dialog */}
      <Dialog open={viewProfileOpen} onOpenChange={setViewProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-primary" weight="duotone" />
              Perfil da Gestante
            </DialogTitle>
            <DialogDescription>Informações do perfil de gestação.</DialogDescription>
          </DialogHeader>
          {viewProfileLoading ? (
            <div className="flex justify-center py-8"><SpinnerGap className="w-6 h-6 animate-spin text-primary" /></div>
          ) : !viewingProfile ? (
            <div className="text-center py-8 text-muted-foreground">
              <UserCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Esta usuária ainda não completou o cadastro.</p>
            </div>
          ) : (
            <div className="space-y-3 mt-2">
              {viewingProfile._userProfile && (
                <div className="bg-primary/5 rounded-xl p-3 space-y-2 border border-primary/10">
                  <p className="text-xs font-semibold text-primary">Dados da Conta</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-background rounded-lg p-2.5">
                      <p className="text-[10px] text-muted-foreground">Email</p>
                      <p className="text-xs font-medium text-foreground truncate">{viewingProfile._userProfile.email || "—"}</p>
                    </div>
                    <div className="bg-background rounded-lg p-2.5">
                      <p className="text-[10px] text-muted-foreground">Plano</p>
                      <p className="text-xs font-medium text-foreground capitalize">{viewingProfile._userProfile.plan || "—"}</p>
                    </div>
                    <div className="bg-background rounded-lg p-2.5">
                      <p className="text-[10px] text-muted-foreground">Status do plano</p>
                      <p className="text-xs font-medium text-foreground capitalize">{viewingProfile._userProfile.plan_status || "—"}</p>
                    </div>
                    <div className="bg-background rounded-lg p-2.5">
                      <p className="text-[10px] text-muted-foreground">Status da conta</p>
                      <p className="text-xs font-medium text-foreground capitalize">{viewingProfile._userProfile.account_status || "—"}</p>
                    </div>
                  </div>
                </div>
              )}

              {viewingProfile.name ? (
                <>
                  <div className="bg-muted/40 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-foreground">{viewingProfile.name || "Sem nome"}</p>
                    <p className="text-xs text-muted-foreground">{viewingProfile.age} anos</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Data prevista", value: viewingProfile.due_date ? new Date(viewingProfile.due_date).toLocaleDateString("pt-BR") : "—" },
                      { label: "Primeira gestação", value: viewingProfile.first_pregnancy ? "Sim" : "Não" },
                      { label: "Trabalhando", value: viewingProfile.working ? "Sim" : "Não" },
                      { label: "Acompanhamento médico", value: viewingProfile.has_medical_care ? "Sim" : "Não" },
                      { label: "Foco", value: viewingProfile.focus === "physical" ? "Físico" : viewingProfile.focus === "emotional" ? "Emocional" : "Ambos" },
                      { label: "Nível emocional", value: `${viewingProfile.emotional_level}/5` },
                    ].map(item => (
                      <div key={item.label} className="bg-muted/30 rounded-lg p-2.5">
                        <p className="text-[10px] text-muted-foreground">{item.label}</p>
                        <p className="text-sm font-medium text-foreground">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  {viewingProfile.current_symptoms?.length > 0 && (
                    <div className="bg-muted/30 rounded-lg p-2.5">
                      <p className="text-[10px] text-muted-foreground mb-1">Sintomas</p>
                      <div className="flex flex-wrap gap-1">
                        {viewingProfile.current_symptoms.map((s: string) => (
                          <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                !viewingProfile._userProfile && (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-xs">Cadastro de gestação não preenchido.</p>
                  </div>
                )
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AdminSupportTab;
