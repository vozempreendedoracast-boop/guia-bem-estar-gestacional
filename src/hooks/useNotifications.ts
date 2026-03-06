/**
 * Hook to request browser notification permission and send notifications.
 * Works when app is open or in background (PWA).
 */
export function useNotifications() {
  const requestPermission = async () => {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") return false;
    const result = await Notification.requestPermission();
    return result === "granted";
  };

  const sendNotification = (title: string, body: string) => {
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    try {
      const notification = new Notification(title, {
        body,
        icon: "/pwa-192.png",
        badge: "/pwa-192.png",
        tag: "mamyboo-support",
        renotify: true,
      });

      // Play sound
      try {
        const audio = new Audio("/notification.mp3");
        audio.volume = 0.5;
        audio.play().catch(() => {});
      } catch {}

      notification.onclick = () => {
        window.focus();
        window.location.href = "/suporte";
        notification.close();
      };
    } catch {
      // Fallback for service worker context
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, {
            body,
            icon: "/pwa-192.png",
            badge: "/pwa-192.png",
            tag: "mamyboo-support",
          });
        });
      }
    }
  };

  return { requestPermission, sendNotification };
}
