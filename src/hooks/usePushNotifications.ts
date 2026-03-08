import { useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { requestFCMToken, onForegroundMessage } from "@/lib/firebase";
import { playNotificationSound } from "@/lib/notificationSound";
import { toast } from "sonner";

export function usePushNotifications() {
  const { user } = useAuth();

  const registerToken = useCallback(async () => {
    if (!user) return null;
    const token = await requestFCMToken();
    if (!token) return null;

    const { error } = await supabase
      .from("push_subscriptions" as any)
      .upsert(
        {
          user_id: user.id,
          fcm_token: token,
          device_info: navigator.userAgent.slice(0, 200),
        },
        { onConflict: "user_id,fcm_token" }
      );

    if (error) console.error("Push subscription save error:", error);
    return token;
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onForegroundMessage((payload) => {
      const title = payload.notification?.title || "MamyBoo";
      const body = payload.notification?.body || "";
      toast(title, { description: body });
      void playNotificationSound();
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [user]);

  return { registerToken };
}

