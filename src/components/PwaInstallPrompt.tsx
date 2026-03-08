import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DeviceMobileCamera, X, DownloadSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const DISMISSED_KEY = "pwa-prompt-dismissed";
const INSTALLED_KEY = "pwa-installed";

const isRunningAsInstalledApp = () => {
  const displayModes = ["standalone", "fullscreen", "minimal-ui", "window-controls-overlay"];
  const hasInstalledDisplayMode = displayModes.some((mode) => window.matchMedia(`(display-mode: ${mode})`).matches);
  const isIosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  const isAndroidTwa = document.referrer.startsWith("android-app://");

  return hasInstalledDisplayMode || isIosStandalone || isAndroidTwa;
};

const PwaInstallPrompt = () => {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const markInstalled = () => {
      localStorage.setItem(INSTALLED_KEY, "1");
      localStorage.setItem(DISMISSED_KEY, "1");
      setShow(false);
    };

    // If app is already running as installed, never show and persist this state
    if (isRunningAsInstalledApp()) {
      markInstalled();
      return;
    }

    // Don't show on admin or sales/login pages
    if (
      window.location.pathname.startsWith("/administracao") ||
      window.location.pathname.startsWith("/vendas") ||
      window.location.pathname.startsWith("/planos") ||
      window.location.pathname.startsWith("/login")
    ) return;

    // If we've ever detected install or user already dismissed, don't nag
    if (localStorage.getItem(INSTALLED_KEY) === "1") return;
    if (localStorage.getItem(DISMISSED_KEY) === "1") return;

    // Detect iOS
    const ua = navigator.userAgent;
    const iosDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIos(iosDevice);

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    const handleAppInstalled = () => {
      markInstalled();
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Fallback only for iOS
    const timer = iosDevice
      ? setTimeout(() => {
          if (isRunningAsInstalledApp()) {
            markInstalled();
            return;
          }
          setShow(true);
        }, 6000)
      : null;

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
          localStorage.setItem(INSTALLED_KEY, "1");
          localStorage.setItem(DISMISSED_KEY, "1");
          setShow(false);
        }
      } catch (err) {
        console.warn("Install prompt error:", err);
      }

      setDeferredPrompt(null);
      return;
    }

    // On iOS, just dismiss - the instructions are in the text
    setShow(false);
    localStorage.setItem(DISMISSED_KEY, "1");
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShow(false);
    localStorage.setItem(DISMISSED_KEY, "1");
  }, []);

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key="pwa-prompt"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 z-[100] max-w-md mx-auto"
        >
          <div className="bg-card border border-border rounded-2xl p-5 shadow-lg relative">
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
                <DeviceMobileCamera className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-sm">
                  Instale o MamyBoo no seu celular 📱
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {isIos
                    ? 'Toque no botão de compartilhar (↑) e depois em "Adicionar à Tela de Início" para instalar.'
                    : "Acesse mais rápido, direto da sua tela inicial — sem precisar abrir o navegador toda vez!"}
                </p>
              </div>
            </div>

            <Button
              onClick={handleInstall}
              className="w-full mt-4 h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
            >
              <DownloadSimple className="w-4 h-4 mr-2" />
              {isIos ? "Entendi!" : "Instalar agora"}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PwaInstallPrompt;
