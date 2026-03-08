import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { PaperPlaneRight, Users, UserCircle, SpinnerGap, Bell, MegaphoneSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const AdminNotificationsTab = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<"mass" | "individual">("mass");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch users with push tokens
  const { data: subscribedUsers = [] } = useQuery({
    queryKey: ["push-subscribed-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("push_subscriptions" as any)
        .select("user_id");
      if (error) throw error;
      // Deduplicate user_ids
      const unique = [...new Set((data as any[]).map((d: any) => d.user_id))];
      return unique as string[];
    },
  });

  // Fetch user profiles for display
  const { data: userProfiles = [] } = useQuery({
    queryKey: ["admin_user_profiles_notifications"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_profiles").select("user_id, email");
      if (error) throw error;
      return data;
    },
  });

  const { data: pregnancyNames = [] } = useQuery({
    queryKey: ["admin_pregnancy_names_notifications"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pregnancy_profiles").select("user_id, name");
      if (error) throw error;
      return data;
    },
  });

  const emailMap = Object.fromEntries(userProfiles.map(u => [u.user_id, u.email]));
  const nameMap = Object.fromEntries(pregnancyNames.map(p => [p.user_id, p.name]));

  const subscribedWithInfo = subscribedUsers.map(uid => ({
    user_id: uid,
    name: nameMap[uid] || "",
    email: emailMap[uid] || uid.slice(0, 8),
  }));

  const filteredUsers = subscribedWithInfo.filter(u =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = async () => {
    if (!title.trim()) {
      toast.error("Informe o título da notificação");
      return;
    }

    setSending(true);
    try {
      if (mode === "individual") {
        if (!targetUserId) {
          toast.error("Selecione uma usuária");
          setSending(false);
          return;
        }
        const { data, error } = await supabase.functions.invoke("send-push", {
          body: { target_user_id: targetUserId, title: title.trim(), body: body.trim(), url: url.trim() || "/painel" },
        });
        if (error) throw error;
        toast.success(`Push enviado! (${data?.sent || 0} dispositivo(s))`);
      } else {
        // Mass send via dedicated server-side edge function
        const { data, error } = await supabase.functions.invoke("send-push-mass", {
          body: { title: title.trim(), body: body.trim(), url: url.trim() || "/painel" },
        });
        if (error) throw error;
        toast.success(`Push em massa enviado! ${data?.sent || 0} dispositivo(s) de ${data?.users || 0} usuária(s)`);
      }
      setTitle("");
      setBody("");
      setUrl("");
    } catch (e: any) {
      toast.error(e.message || "Erro ao enviar notificação");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      key="notifications"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="max-w-3xl"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-foreground">Notificações Push</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Envie notificações push para as usuárias do app.
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary" className="text-xs">
            <Users className="w-3 h-3 mr-1" />
            {subscribedUsers.length} usuária(s) com push ativo
          </Badge>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={mode === "mass" ? "default" : "outline"}
          onClick={() => setMode("mass")}
          className="rounded-xl gap-2"
        >
          <MegaphoneSimple className="w-4 h-4" />
          Envio em massa
        </Button>
        <Button
          variant={mode === "individual" ? "default" : "outline"}
          onClick={() => setMode("individual")}
          className="rounded-xl gap-2"
        >
          <UserCircle className="w-4 h-4" />
          Individual
        </Button>
      </div>

      {/* Individual: user picker */}
      {mode === "individual" && (
        <div className="mb-6 space-y-2">
          <Label className="font-medium">Selecionar usuária</Label>
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="rounded-xl"
          />
          <div className="max-h-48 overflow-y-auto border rounded-xl divide-y">
            {filteredUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma usuária com push ativo encontrada
              </p>
            ) : (
              filteredUsers.map(u => (
                <button
                  key={u.user_id}
                  onClick={() => setTargetUserId(u.user_id)}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                    targetUserId === u.user_id ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
                  }`}
                >
                  <UserCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">{u.name || u.email}</span>
                  {u.name && <span className="text-muted-foreground">({u.email})</span>}
                </button>
              ))
            )}
          </div>
          {targetUserId && (
            <p className="text-xs text-primary">
              ✓ Selecionada: {nameMap[targetUserId] || emailMap[targetUserId] || targetUserId.slice(0, 8)}
            </p>
          )}
        </div>
      )}

      {/* Notification form */}
      <div className="space-y-4 bg-card border rounded-2xl p-5">
        <div className="space-y-2">
          <Label className="font-medium">Título *</Label>
          <Input
            placeholder="Ex: 🎉 Novidade no MamyBoo!"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="rounded-xl"
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <Label className="font-medium">Mensagem</Label>
          <Textarea
            placeholder="Ex: Confira as novas dicas da semana para sua gestação..."
            value={body}
            onChange={e => setBody(e.target.value)}
            className="rounded-xl min-h-[80px]"
            maxLength={300}
          />
        </div>

        <div className="space-y-2">
          <Label className="font-medium">Link (opcional)</Label>
          <Input
            placeholder="Ex: /jornada ou https://mamyboo.vercel.app/vendas"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="rounded-xl"
          />
          <p className="text-xs text-muted-foreground">
            A usuária será redirecionada ao clicar na notificação
          </p>
        </div>

        <Button
          onClick={handleSend}
          disabled={sending || !title.trim() || (mode === "individual" && !targetUserId)}
          className="w-full rounded-xl gap-2"
        >
          {sending ? (
            <>
              <SpinnerGap className="w-4 h-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <PaperPlaneRight className="w-4 h-4" />
              {mode === "mass"
                ? `Enviar para ${subscribedUsers.length} usuária(s)`
                : "Enviar notificação"}
            </>
          )}
        </Button>
      </div>

      {/* Preview */}
      {title.trim() && (
        <div className="mt-6">
          <Label className="font-medium text-sm mb-2 block">Pré-visualização</Label>
          <div className="bg-muted/50 border rounded-2xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">{title}</p>
              {body && <p className="text-sm text-muted-foreground mt-0.5">{body}</p>}
              {url && <p className="text-xs text-primary/60 mt-1">{url}</p>}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminNotificationsTab;
