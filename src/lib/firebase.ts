import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBtPwwHt-ijCMhx0XoA2zwdal5eTeTGrDU",
  authDomain: "app-mamyboo.firebaseapp.com",
  projectId: "app-mamyboo",
  storageBucket: "app-mamyboo.firebasestorage.app",
  messagingSenderId: "1076045195975",
  appId: "1:1076045195975:web:5fb6c76b141cd9756f2ce2",
  measurementId: "G-9FNXM2XCXP",
};

const VAPID_KEY = "BJDqVrdGyzp7JL8nTiyR4ZcHhNsL7BDCfR6V0igkYE4TGwdkU_EWEmdo3oscj3mS6fuggICAqowukLpFpDdh1sg";

const app = initializeApp(firebaseConfig);

let messagingInstance: ReturnType<typeof getMessaging> | null = null;
let messagingSWRegistration: ServiceWorkerRegistration | null = null;

async function getMessagingServiceWorkerRegistration() {
  if (!("serviceWorker" in navigator)) return null;
  if (messagingSWRegistration) return messagingSWRegistration;

  try {
    const existing = await navigator.serviceWorker.getRegistration("/firebase-cloud-messaging-push-scope");
    if (existing && existing.active?.scriptURL.includes("firebase-messaging-sw.js")) {
      messagingSWRegistration = existing;
      return existing;
    }

    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
      scope: "/firebase-cloud-messaging-push-scope",
    });
    messagingSWRegistration = registration;
    return registration;
  } catch (error) {
    console.error("Firebase SW registration error:", error);
    return null;
  }
}

export async function getFirebaseMessaging() {
  if (messagingInstance) return messagingInstance;
  const supported = await isSupported();
  if (!supported) return null;
  messagingInstance = getMessaging(app);
  return messagingInstance;
}

export async function requestFCMToken(): Promise<string | null> {
  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const registration = await getMessagingServiceWorkerRegistration();
    if (!registration) return null;

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    return token;
  } catch (err) {
    console.error("FCM token error:", err);
    return null;
  }
}

export function onForegroundMessage(callback: (payload: any) => void) {
  getFirebaseMessaging().then((messaging) => {
    if (!messaging) return;
    onMessage(messaging, callback);
  });
}

export { VAPID_KEY };
