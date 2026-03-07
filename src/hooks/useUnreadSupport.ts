import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useUnreadSupport() {
  const { user } = useAuth();

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unread-support", user?.id],
    queryFn: async () => {
      if (!user) return 0;

      // Only count unread admin messages from OPEN conversations
      const { data: openConvos } = await supabase
        .from("support_conversations")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "open");

      if (!openConvos || openConvos.length === 0) return 0;

      const openIds = openConvos.map(c => c.id);
      const { count, error } = await supabase
        .from("support_messages")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("sender", "admin")
        .eq("read", false)
        .in("conversation_id", openIds);

      if (error) return 0;
      return count || 0;
    },
    enabled: !!user,
    refetchInterval: 10000,
  });

  // Check if conversation was just closed (for rating prompt)
  const { data: closedConversation } = useQuery({
    queryKey: ["closed-support-pending-rating", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("support_conversations")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "closed")
        .is("rating", null)
        .order("closed_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
    refetchInterval: 15000,
  });

  return { unreadCount, closedConversation };
}
