import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Register Firebase messaging service worker separately from PWA SW
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((reg) => console.log("Firebase SW registered, scope:", reg.scope))
    .catch((err) => console.warn("Firebase SW registration failed:", err));
}

createRoot(document.getElementById("root")!).render(<App />);
