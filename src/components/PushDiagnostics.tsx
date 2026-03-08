import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { requestFCMToken } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Bell, ArrowClockwise, PaperPlaneRight, SpinnerGap, CheckCircle, XCircle, Warning } from "@phosphor-icons/react";

const PushDiagnostics = () => {
  const { user } = useAuth();
  const [permission, setPermission] = useState<string>("checking...");
  const [swStatus, setSwStatus] = useState<string>("checking...");
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [dbTokens, setDbTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setTestResult(null);

    // Permission
    if ("Notification" in window) {
      setPermission(Notification.permission);
    } else {
      setPermission("not supported");
    }

    // Service Worker
    if ("serviceWorker" in navigator) {
      try {
        const regs = await navigator.serviceWorker.getRegistrations();
        const firebaseSW = regs.find(r => r.active?.scriptURL.includes("firebase-messaging-sw"));
        if (firebaseSW) {
          setSwStatus(`active (scope: ${firebaseSW.scope})`);
        } else if (regs.length > 0) {
          setSwStatus(`${regs.length} SW(s) registrado(s), nenhum é firebase-messaging-sw`);
        } else {
          setSwStatus("nenhum service worker registrado");
        }
      } catch (e: any) {
        setSwStatus(`erro: ${e.message}`);
      }
    } else {
      setSwStatus("not supported");
    }

    // FCM Token
    let token: string | null = null;
    try {
      token = await requestFCMToken();
      setFcmToken(token);
    } catch {
      token = null;
      setFcmToken(null);
    }

    // DB tokens
    if (user) {
      let { data } = await supabase
        .from("push_subscriptions")
        .select("id, fcm_token, device_info, created_at, updated_at")
        .eq("user_id", user.id);

      // Auto-sync: se o token atual não estiver salvo, salva e recarrega lista
      if (token && !(data || []).some((row) => row.fcm_token === token)) {
        await supabase
          .from("push_subscriptions")
          .upsert(
            {
              user_id: user.id,
              fcm_token: token,
              device_info: navigator.userAgent.slice(0, 200),
            },
            { onConflict: "user_id,fcm_token" }
          );

        const refreshed = await supabase
          .from("push_subscriptions")
          .select("id, fcm_token, device_info, created_at, updated_at")
          .eq("user_id", user.id);

        data = refreshed.data || data;
      }

      setDbTokens(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, [user]);

  const handleTestPush = async () => {
    if (!user) return;
    setTestSending(true);
    setTestResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("send-push", {
        body: {
          target_user_id: user.id,
          target_token: fcmToken,
          title: "🔔 Teste de Push",
          body: "Se você está vendo isso, as notificações funcionam!",
          url: "/perfil",
          self_test: true,
        },
      });
      if (error) throw error;
      setTestResult(JSON.stringify(data, null, 2));
      toast.success(`Push de teste enviado! (${data?.sent || 0} dispositivo(s))`);
    } catch (e: any) {
      setTestResult(`Erro: ${e.message}`);
      toast.error(e.message);
    } finally {
      setTestSending(false);
    }
  };

  const StatusIcon = ({ ok }: { ok: boolean | null }) => {
    if (ok === null) return <Warning className="w-4 h-4 text-yellow-500" />;
    return ok ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-destructive" />;
  };

  const permOk = permission === "granted";
  const swOk = swStatus.startsWith("active");
  const tokenOk = !!fcmToken;
  const dbOk = dbTokens.length > 0;

  return (
    <div className="bg-card border rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-sm">Diagnóstico Push</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={refresh} disabled={loading} className="rounded-xl gap-1">
          <ArrowClockwise className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      <div className="space-y-3 text-sm">
        {/* Permission */}
        <div className="flex items-center gap-2">
          <StatusIcon ok={permOk} />
          <span className="font-medium">Permissão:</span>
          <Badge variant={permOk ? "default" : "destructive"} className="text-xs">
            {permission}
          </Badge>
        </div>

        {/* Service Worker */}
        <div className="flex items-start gap-2">
          <StatusIcon ok={swOk} />
          <div>
            <span className="font-medium">Service Worker:</span>
            <p className="text-xs text-muted-foreground mt-0.5">{swStatus}</p>
          </div>
        </div>

        {/* FCM Token */}
        <div className="flex items-start gap-2">
          <StatusIcon ok={tokenOk} />
          <div className="min-w-0 flex-1">
            <span className="font-medium">Token FCM:</span>
            {fcmToken ? (
              <p className="text-xs text-muted-foreground mt-0.5 break-all font-mono">
                {fcmToken.slice(0, 40)}...
              </p>
            ) : (
              <p className="text-xs text-destructive mt-0.5">Nenhum token obtido</p>
            )}
          </div>
        </div>

        {/* DB Tokens */}
        <div className="flex items-start gap-2">
          <StatusIcon ok={dbOk} />
          <div>
            <span className="font-medium">Tokens no banco:</span>
            <p className="text-xs text-muted-foreground mt-0.5">
              {dbTokens.length} registro(s) para seu user_id
            </p>
            {dbTokens.map((t, i) => (
              <p key={t.id} className="text-[10px] text-muted-foreground font-mono mt-1">
                #{i + 1}: {t.fcm_token?.slice(0, 30)}... ({t.device_info?.slice(0, 40)})
              </p>
            ))}
          </div>
        </div>

        {/* Token match check */}
        {fcmToken && dbTokens.length > 0 && (
          <div className="flex items-center gap-2">
            <StatusIcon ok={dbTokens.some(t => t.fcm_token === fcmToken)} />
            <span className="font-medium text-xs">
              {dbTokens.some(t => t.fcm_token === fcmToken)
                ? "Token atual salvo no banco ✓"
                : "⚠️ Token atual NÃO está no banco!"}
            </span>
          </div>
        )}
      </div>

      {/* Test button */}
      <Button
        onClick={handleTestPush}
        disabled={testSending || !permOk}
        className="w-full rounded-xl gap-2"
        variant="outline"
      >
        {testSending ? (
          <>
            <SpinnerGap className="w-4 h-4 animate-spin" />
            Enviando teste...
          </>
        ) : (
          <>
            <PaperPlaneRight className="w-4 h-4" />
            Enviar push de teste para mim
          </>
        )}
      </Button>

      {/* Test result */}
      {testResult && (
        <pre className="text-[10px] bg-muted rounded-xl p-3 overflow-x-auto whitespace-pre-wrap font-mono">
          {testResult}
        </pre>
      )}

      {/* Troubleshooting tips */}
      {!permOk && (
        <p className="text-xs text-destructive">
          ⚠️ Permissão de notificação não concedida. Verifique as configurações do navegador/dispositivo.
        </p>
      )}
      {!swOk && (
        <p className="text-xs text-yellow-600">
          ⚠️ Service Worker do Firebase não encontrado. O app precisa ser acessado via HTTPS e o arquivo firebase-messaging-sw.js precisa estar na raiz.
        </p>
      )}
    </div>
  );
};

export default PushDiagnostics;
