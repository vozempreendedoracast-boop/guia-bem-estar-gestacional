import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Smiley, TrendUp, CalendarBlank, PencilSimple, Plus, Trash, Clock, Stethoscope, Flask, Baby } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

const moodEmojis = ["😢", "😟", "😐", "🙂", "😊"];
const moodLabels = ["Muito triste", "Preocupada", "Neutra", "Bem", "Ótima"];

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

const Diary = () => {
  const navigate = useNavigate();
  const { moods, addMood } = usePregnancy();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [moodNote, setMoodNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [selectedMoodIndex, setSelectedMoodIndex] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [newReminder, setNewReminder] = useState({ title: "", description: "", category: "consulta", time: "" });
  const [activeTab, setActiveTab] = useState<"mood" | "calendar">("mood");

  // Fetch reminders
  const { data: reminders = [] } = useQuery({
    queryKey: ["reminders", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", user.id)
        .order("reminder_date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addReminderMutation = useMutation({
    mutationFn: async () => {
      if (!user || !selectedDate) return;
      const { error } = await supabase.from("reminders").insert({
        user_id: user.id,
        title: newReminder.title,
        description: newReminder.description,
        category: newReminder.category,
        reminder_date: format(selectedDate, "yyyy-MM-dd"),
        reminder_time: newReminder.time || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      setReminderDialogOpen(false);
      setNewReminder({ title: "", description: "", category: "consulta", time: "" });
      toast.success("Lembrete criado!");
    },
    onError: () => toast.error("Erro ao criar lembrete"),
  });

  const deleteReminderMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reminders").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      toast.success("Lembrete removido");
    },
  });

  const sortedMoods = [...moods].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const avgMood = moods.length > 0
    ? (moods.reduce((sum, m) => sum + m.mood, 0) / moods.length).toFixed(1)
    : "—";

  const handleMoodWithNote = (mood: number) => {
    addMood(mood, moodNote || undefined);
    setMoodNote("");
    setShowNoteInput(false);
    setSelectedMoodIndex(null);
    toast.success("Humor registrado!");
  };

  // Dates that have reminders for calendar highlighting
  const reminderDates = reminders.map(r => new Date(r.reminder_date + "T00:00:00"));

  const upcomingReminders = reminders.filter(r => new Date(r.reminder_date) >= new Date(new Date().toDateString()));

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="px-6 pt-6 pb-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/painel")} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold font-display">Diário</h1>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-4">
        <div className="flex gap-2 bg-muted rounded-xl p-1">
          <button
            onClick={() => setActiveTab("mood")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "mood" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
          >
            <Smiley className="w-4 h-4 inline mr-1" /> Humor
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "calendar" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
          >
            <CalendarBlank className="w-4 h-4 inline mr-1" /> Agenda
          </button>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {activeTab === "mood" ? (
          <>
            {/* Quick mood with text */}
            <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Smiley className="w-5 h-5 text-primary" /> Como você está?
              </h2>
              <div className="flex justify-around mb-4">
                {moodEmojis.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedMoodIndex(i + 1)}
                    className={`flex flex-col items-center gap-1 transition-transform ${selectedMoodIndex === i + 1 ? "scale-125 ring-2 ring-primary rounded-xl p-1" : "hover:scale-110"}`}
                  >
                    <span className="text-3xl">{emoji}</span>
                    <span className="text-[10px] text-muted-foreground">{moodLabels[i]}</span>
                  </button>
                ))}
              </div>

              {selectedMoodIndex && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl">
                    <span className="text-2xl">{moodEmojis[selectedMoodIndex - 1]}</span>
                    <span className="text-sm font-medium">{moodLabels[selectedMoodIndex - 1]}</span>
                  </div>

                  {!showNoteInput ? (
                    <button
                      onClick={() => setShowNoteInput(true)}
                      className="w-full flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors border border-dashed border-border rounded-xl"
                    >
                      <PencilSimple className="w-4 h-4" /> Escrever como me sinto (opcional)
                    </button>
                  ) : (
                    <div>
                      <Textarea
                        placeholder="Escreva aqui como você está se sentindo hoje..."
                        value={moodNote}
                        onChange={e => setMoodNote(e.target.value)}
                        className="rounded-xl resize-none min-h-[80px]"
                        maxLength={500}
                      />
                      <p className="text-xs text-muted-foreground mt-1 text-right">{moodNote.length}/500</p>
                    </div>
                  )}

                  <Button
                    className="w-full rounded-xl"
                    onClick={() => handleMoodWithNote(selectedMoodIndex)}
                  >
                    Registrar emoção {moodEmojis[selectedMoodIndex - 1]}
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card rounded-2xl p-4 shadow-card border border-border text-center">
                <TrendUp className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{avgMood}</p>
                <p className="text-xs text-muted-foreground">Humor médio</p>
              </div>
              <div className="bg-card rounded-2xl p-4 shadow-card border border-border text-center">
                <CalendarBlank className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{moods.length}</p>
                <p className="text-xs text-muted-foreground">Registros</p>
              </div>
            </div>

            {/* History */}
            <div>
              <h2 className="font-semibold text-sm text-muted-foreground mb-3">Histórico</h2>
              {sortedMoods.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Smiley className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Nenhum registro ainda</p>
                  <p className="text-xs">Registre seu humor acima!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sortedMoods.slice(0, 20).map((entry, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-start gap-3 p-3 bg-card rounded-xl border border-border"
                    >
                      <span className="text-2xl">{moodEmojis[entry.mood - 1]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{moodLabels[entry.mood - 1]}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(entry.date), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
                        </p>
                        {entry.note && (
                          <p className="text-xs text-foreground/80 mt-1 bg-muted/50 rounded-lg p-2 italic">
                            "{entry.note}"
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Calendar */}
            <div className="bg-card rounded-2xl p-4 shadow-card border border-border flex flex-col items-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={ptBR}
                className="pointer-events-auto"
                modifiers={{ hasReminder: reminderDates }}
                modifiersClassNames={{ hasReminder: "bg-primary/20 text-primary font-bold" }}
              />
              <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="mt-3 rounded-xl w-full"
                    disabled={!selectedDate}
                    onClick={() => setReminderDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Novo lembrete {selectedDate && `(${format(selectedDate, "dd/MM")})`}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Novo Lembrete</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Select value={newReminder.category} onValueChange={v => setNewReminder(p => ({ ...p, category: v }))}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Título (ex: Consulta com Dr. Ana)"
                      value={newReminder.title}
                      onChange={e => setNewReminder(p => ({ ...p, title: e.target.value }))}
                      className="rounded-xl"
                      maxLength={100}
                    />
                    <Input
                      type="time"
                      value={newReminder.time}
                      onChange={e => setNewReminder(p => ({ ...p, time: e.target.value }))}
                      className="rounded-xl"
                    />
                    <Textarea
                      placeholder="Observações (opcional)"
                      value={newReminder.description}
                      onChange={e => setNewReminder(p => ({ ...p, description: e.target.value }))}
                      className="rounded-xl resize-none"
                      maxLength={300}
                    />
                    <Button
                      className="w-full rounded-xl"
                      disabled={!newReminder.title || addReminderMutation.isPending}
                      onClick={() => addReminderMutation.mutate()}
                    >
                      {addReminderMutation.isPending ? "Salvando..." : "Salvar lembrete"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Upcoming reminders */}
            <div>
              <h2 className="font-semibold text-sm text-muted-foreground mb-3">Próximos lembretes</h2>
              {upcomingReminders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarBlank className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Nenhum lembrete</p>
                  <p className="text-xs">Selecione uma data no calendário para criar um.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {upcomingReminders.map((r, i) => {
                    const Icon = categoryIcons[r.category] || Clock;
                    return (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 p-3 bg-card rounded-xl border border-border"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{r.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(r.reminder_date + "T00:00:00"), "dd 'de' MMMM", { locale: ptBR })}
                            {r.reminder_time && ` às ${r.reminder_time.slice(0, 5)}`}
                          </p>
                          {r.description && <p className="text-xs text-muted-foreground mt-0.5">{r.description}</p>}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive h-8 w-8"
                          onClick={() => deleteReminderMutation.mutate(r.id)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Diary;
