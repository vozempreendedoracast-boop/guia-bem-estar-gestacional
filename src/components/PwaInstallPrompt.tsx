import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DeviceMobileCamera, X, DownloadSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const PwaInstallPrompt = () => {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // If already installed (standalone mode), never show
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const dismissed = sessionStorage.getItem("pwa-prompt-dismissed");
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Show after 8 seconds
    const timer = setTimeout(() => {
      if (window.matchMedia("(display-mode: standalone)").matches) return;
      setShow(true);
    }, 8000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShow(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback: just close and let user know how to install manually
      setShow(false);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    sessionStorage.setItem("pwa-prompt-dismissed", "1");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 z-[100] max-w-md mx-auto"
        >
          <div className="bg-card border border-border rounded-2xl p-5 shadow-elevated relative">
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                <DeviceMobileCamera className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-sm">
                  Instale o MamyBoo no seu celular 📱
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Acesse mais rápido, direto da sua tela inicial — sem precisar abrir o navegador toda vez!
                </p>
              </div>
            </div>

            <Button
              onClick={handleInstall}
              className="w-full mt-4 h-11 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm shadow-soft"
            >
              <DownloadSimple className="w-4 h-4 mr-2" />
              Instalar agora
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PwaInstallPrompt;
