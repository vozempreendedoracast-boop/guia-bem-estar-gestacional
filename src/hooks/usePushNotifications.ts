import { useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { requestFCMToken, onForegroundMessage } from "@/lib/firebase";
import { toast } from "sonner";

export function usePushNotifications() {
  const { user } = useAuth();

  const registerToken = useCallback(async () => {
    if (!user) return null;
    const token = await requestFCMToken();
    if (!token) return null;

    // Upsert token in push_subscriptions
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

  // Listen for foreground messages
  useEffect(() => {
    if (!user) return;

    onForegroundMessage((payload) => {
      const title = payload.notification?.title || "MamyBoo";
      const body = payload.notification?.body || "";
      toast(title, { description: body });

      // Play sound
      try {
        const audio = new Audio("/notification.mp3");
        audio.volume = 0.5;
        audio.play().catch(() => {});
      } catch {}
    });
  }, [user]);

  return { registerToken };
}
