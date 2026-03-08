import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useUnreadNotifications() {
  const { user } = useAuth();

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unread-push-notifications", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count, error } = await supabase
        .from("push_notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false);
      if (error) return 0;
      return count || 0;
    },
    enabled: !!user,
    refetchInterval: 15000,
  });

  return { unreadCount };
}
