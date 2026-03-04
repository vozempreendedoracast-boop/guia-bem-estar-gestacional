import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowClockwise, PaperPlaneTilt, CheckCircle, XCircle, Copy, SpinnerGap, Link as LinkIcon
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";

interface WebhookLog {
  id: string;
  email: string;
  evento: string;
  produto: string;
  plano_aplicado: string;
  status_processamento: string;
  data_evento: string;
}

const WEBHOOK_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/kiwify-webhook`;

const WebhookAdmin = () => {
  const [simEmail, setSimEmail] = useState("");
  const [simEvento, setSimEvento] = useState("compra aprovada");
  const [simProduto, setSimProduto] = useState("Plano Essencial");
  const [simLoading, setSimLoading] = useState(false);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);

  const fetchLogs = async () => {
    setLogsLoading(true);
    const { data, error } = await supabase
      .from("webhook_logs" as any)
      .select("*")
      .order("data_evento", { ascending: false })
      .limit(10);
    if (!error && data) setLogs(data as any);
    setLogsLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleSimulate = async () => {
    if (!simEmail.trim()) { toast.error("Informe o email"); return; }
    setSimLoading(true);
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: simEmail,
          evento: simEvento,
          produto: simProduto,
          token: "dp4lparuq6h",
        }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success(`Webhook simulado com sucesso! Plano: ${result.plan || "—"}`);
      } else {
        toast.error(result.error || "Erro ao simular");
      }
      fetchLogs();
    } catch (e: any) {
      toast.error(e.message || "Erro de rede");
    } finally {
      setSimLoading(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(WEBHOOK_URL);
    toast.success("URL copiada!");
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-6">
      {/* Webhook URL */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-5 border border-border shadow-card"
      >
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-primary" weight="duotone" />
          URL do Webhook
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Cadastre esta URL na Kiwify em Configurações → Webhooks:
        </p>
        <div className="flex gap-2 items-center">
          <code className="flex-1 bg-muted/50 px-3 py-2 rounded-xl text-xs text-foreground font-mono break-all select-all">
            {WEBHOOK_URL}
          </code>
          <Button variant="outline" size="icon" className="rounded-xl shrink-0" onClick={copyUrl}>
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Simulator */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card rounded-2xl p-5 border border-border shadow-card"
      >
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          🔄 Simulador de Webhook Kiwify
        </h3>
        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          <div>
            <Label className="text-xs font-medium">Email</Label>
            <Input
              value={simEmail}
              onChange={e => setSimEmail(e.target.value)}
              placeholder="cliente@exemplo.com"
              className="mt-1 rounded-xl h-9 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs font-medium">Evento</Label>
            <select
              value={simEvento}
              onChange={e => setSimEvento(e.target.value)}
              className="mt-1 w-full h-9 rounded-xl border border-input bg-background px-3 text-sm"
            >
              <option>compra aprovada</option>
              <option>reembolso</option>
              <option>chargeback</option>
              <option>compra cancelada</option>
              <option>pix gerado</option>
            </select>
          </div>
          <div>
            <Label className="text-xs font-medium">Produto</Label>
            <select
              value={simProduto}
              onChange={e => setSimProduto(e.target.value)}
              className="mt-1 w-full h-9 rounded-xl border border-input bg-background px-3 text-sm"
            >
              <option>Plano Essencial</option>
              <option>Plano Premium</option>
            </select>
          </div>
        </div>
        <Button
          onClick={handleSimulate}
          disabled={simLoading}
          className="rounded-xl gradient-primary text-primary-foreground"
        >
          {simLoading ? <SpinnerGap className="w-4 h-4 mr-2 animate-spin" /> : <PaperPlaneTilt className="w-4 h-4 mr-2" />}
          Simular Webhook
        </Button>
      </motion.div>

      {/* Logs Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl p-5 border border-border shadow-card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            📋 Últimos Eventos
          </h3>
          <Button variant="ghost" size="sm" className="rounded-xl" onClick={fetchLogs}>
            <ArrowClockwise className="w-4 h-4 mr-1" /> Atualizar
          </Button>
        </div>

        {logsLoading ? (
          <div className="flex justify-center py-8">
            <SpinnerGap className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : logs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Nenhum evento registrado ainda.</p>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Data/Hora</TableHead>
                  <TableHead className="text-xs">Email</TableHead>
                  <TableHead className="text-xs">Evento</TableHead>
                  <TableHead className="text-xs">Produto</TableHead>
                  <TableHead className="text-xs">Plano</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(log.data_evento)}</TableCell>
                    <TableCell className="text-xs font-mono">{log.email}</TableCell>
                    <TableCell className="text-xs">{log.evento}</TableCell>
                    <TableCell className="text-xs">{log.produto}</TableCell>
                    <TableCell className="text-xs">
                      {log.plano_aplicado === "premium" && <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[10px]">Premium</Badge>}
                      {log.plano_aplicado === "essential" && <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-0 text-[10px]">Essencial</Badge>}
                      {log.plano_aplicado === "none" && <Badge variant="outline" className="text-[10px]">Nenhum</Badge>}
                      {!log.plano_aplicado && "—"}
                    </TableCell>
                    <TableCell>
                      {log.status_processamento.startsWith("sucesso") ? (
                        <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">
                          <CheckCircle className="w-3 h-3 mr-1" /> Sucesso
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 border-0 text-[10px]">
                          <XCircle className="w-3 h-3 mr-1" /> Erro
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default WebhookAdmin;
