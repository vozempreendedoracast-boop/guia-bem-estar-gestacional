import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Bell, Stethoscope, Flask, Baby, Clock, Trash, CalendarBlank, X, MegaphoneSimple, CheckCircle, Checks } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categoryIcons: Record<string, React.ElementType> = {
  consulta: Stethoscope,
  exame: Flask,
  ultrassom: Baby,
  outro: Clock,
};

const categoryLabels: Record<string, string> = {
  consulta: "Consulta",
  exame: "Exame",
  ultrassom: "Ultrassom",
  outro: "Outro",
};

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("push");

  // Push notifications (inbox)
  const { data: pushNotifications = [] } = useQuery({
    queryKey: ["push-notifications-inbox", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("push_notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Reminders
  const { data: reminders = [] } = useQuery({
    queryKey: ["upcoming-reminders", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", user.id)
        .gte("reminder_date", today)
        .order("reminder_date", { ascending: true })
        .order("reminder_time", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const deleteReminderMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reminders").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["upcoming-reminders"] });
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      setSelectedId(null);
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("push_notifications").update({ read: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["push-notifications-inbox"] });
      queryClient.invalidateQueries({ queryKey: ["unread-push-notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const { error } = await supabase
        .from("push_notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["push-notifications-inbox"] });
      queryClient.invalidateQueries({ queryKey: ["unread-push-notifications"] });
    },
  });

  const deletePushMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("push_notifications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["push-notifications-inbox"] });
      queryClient.invalidateQueries({ queryKey: ["unread-push-notifications"] });
      setSelectedId(null);
    },
  });

  const unreadPushCount = pushNotifications.filter(n => !n.read).length;
  const selected = activeTab === "agenda" ? reminders.find((r) => r.id === selectedId) : null;
  const selectedPush = activeTab === "push" ? pushNotifications.find(n => n.id === selectedId) : null;

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="px-6 pt-6 pb-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/painel")} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold font-display">Notificações</h1>
      </div>

      <div className="px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full rounded-xl mb-4">
            <TabsTrigger value="push" className="flex-1 rounded-lg gap-1.5">
              <MegaphoneSimple className="w-4 h-4" />
              Avisos
              {unreadPushCount > 0 && (
                <span className="ml-1 min-w-[18px] h-[18px] bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center px-1">
                  {unreadPushCount > 9 ? "9+" : unreadPushCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="agenda" className="flex-1 rounded-lg gap-1.5">
              <CalendarBlank className="w-4 h-4" />
              Agenda
              {reminders.length > 0 && (
                <span className="ml-1 min-w-[18px] h-[18px] bg-muted-foreground/20 text-muted-foreground rounded-full text-[10px] font-bold flex items-center justify-center px-1">
                  {reminders.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Push notifications tab */}
          <TabsContent value="push" className="space-y-2">
            {unreadPushCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
                className="rounded-xl gap-1.5 text-xs mb-2"
              >
                <Checks className="w-4 h-4" />
                Marcar todas como lidas
              </Button>
            )}

            {pushNotifications.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">Nenhuma notificação</p>
                <p className="text-sm mt-1">Novidades do app aparecerão aqui</p>
              </div>
            ) : (
              pushNotifications.map((n, i) => (
                <motion.button
                  key={n.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => {
                    setSelectedId(n.id);
                    if (!n.read) markAsReadMutation.mutate(n.id);
                  }}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-colors ${
                    !n.read
                      ? "bg-primary/5 border-primary/20"
                      : "bg-card border-border hover:bg-muted/50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    !n.read ? "bg-primary/15" : "bg-muted"
                  }`}>
                    <MegaphoneSimple className={`w-5 h-5 ${!n.read ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm truncate ${!n.read ? "font-bold" : "font-medium"}`}>{n.title}</p>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </div>
                    {n.body && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{n.body}</p>}
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      {format(new Date(n.created_at), "dd/MM · HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </motion.button>
              ))
            )}
          </TabsContent>

          {/* Agenda / Reminders tab */}
          <TabsContent value="agenda" className="space-y-2">
            {reminders.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <CalendarBlank className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">Nenhum lembrete</p>
                <p className="text-sm mt-1">Seus lembretes de agenda aparecerão aqui</p>
              </div>
            ) : (
              reminders.map((r, i) => {
                const Icon = categoryIcons[r.category] || Clock;
                const isToday = r.reminder_date === new Date().toISOString().split("T")[0];
                return (
                  <motion.button
                    key={r.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setSelectedId(r.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-colors ${
                      isToday
                        ? "bg-primary/5 border-primary/20"
                        : "bg-card border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isToday ? "bg-primary/15" : "bg-muted"
                    }`}>
                      <Icon className={`w-5 h-5 ${isToday ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm truncate">{r.title}</p>
                        {isToday && (
                          <span className="text-[10px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded-md flex-shrink-0">HOJE</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(new Date(r.reminder_date + "T00:00:00"), "dd 'de' MMMM", { locale: ptBR })}
                        {r.reminder_time && ` às ${r.reminder_time.slice(0, 5)}`}
                        {" · "}
                        {categoryLabels[r.category] || r.category}
                      </p>
                    </div>
                    <CalendarBlank className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                  </motion.button>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Push notification detail modal */}
      <AnimatePresence>
        {selectedPush && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center"
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-card rounded-t-3xl p-6 space-y-4 shadow-elevated"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MegaphoneSimple className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {format(new Date(selectedPush.created_at), "dd/MM/yyyy · HH:mm", { locale: ptBR })}
                  </span>
                </div>
                <button onClick={() => setSelectedId(null)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h2 className="text-lg font-bold">{selectedPush.title}</h2>
                {selectedPush.body && (
                  <p className="text-sm text-muted-foreground mt-2">{selectedPush.body}</p>
                )}
              </div>

              {selectedPush.url && selectedPush.url !== "/painel" && (
                <Button
                  variant="outline"
                  className="w-full rounded-xl"
                  onClick={() => {
                    setSelectedId(null);
                    if (selectedPush.url.startsWith("http")) {
                      window.open(selectedPush.url, "_blank");
                    } else {
                      navigate(selectedPush.url);
                    }
                  }}
                >
                  Abrir link
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                onClick={() => deletePushMutation.mutate(selectedPush.id)}
                disabled={deletePushMutation.isPending}
              >
                <Trash className="w-4 h-4 mr-2" />
                {deletePushMutation.isPending ? "Removendo..." : "Remover notificação"}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reminder detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center"
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-card rounded-t-3xl p-6 space-y-4 shadow-elevated"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = categoryIcons[selected.category] || Clock;
                    return (
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                    );
                  })()}
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {categoryLabels[selected.category] || selected.category}
                  </span>
                </div>
                <button onClick={() => setSelectedId(null)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h2 className="text-lg font-bold">{selected.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  📅 {format(new Date(selected.reminder_date + "T00:00:00"), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
                {selected.reminder_time && (
                  <p className="text-sm text-muted-foreground">
                    🕐 {selected.reminder_time.slice(0, 5)}
                  </p>
                )}
              </div>

              {selected.description && (
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-sm text-foreground/80">{selected.description}</p>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                onClick={() => deleteReminderMutation.mutate(selected.id)}
                disabled={deleteReminderMutation.isPending}
              >
                <Trash className="w-4 h-4 mr-2" />
                {deleteReminderMutation.isPending ? "Removendo..." : "Remover lembrete"}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;
