import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShieldCheck, Check } from "@phosphor-icons/react";
import mamybooPink from "@/assets/mamyboo-pink.png";

const Terms = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    if (!accepted || !user) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ terms_accepted_at: new Date().toISOString() } as any)
        .eq("user_id", user.id);
      if (error) throw error;
      await refreshProfile();
      toast.success("Termos aceitos com sucesso!");
      navigate("/painel", { replace: true });
    } catch {
      toast.error("Erro ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg space-y-6"
        >
          <div className="text-center space-y-3">
            <img src={mamybooPink} alt="MamyBoo" className="w-16 h-16 mx-auto object-contain" />
            <h1 className="text-2xl font-bold font-display">Termos de Uso</h1>
            <p className="text-sm text-muted-foreground">
              Antes de continuar, leia e aceite nossos termos e condições.
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-card p-5 space-y-4 max-h-[50vh] overflow-y-auto">
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <h2 className="font-semibold text-foreground text-base">1. Aceitação dos Termos</h2>
              <p>
                Ao utilizar o aplicativo MamyBoo, você concorda com estes Termos de Uso. 
                Caso não concorde, não utilize o aplicativo.
              </p>

              <h2 className="font-semibold text-foreground text-base">2. Descrição do Serviço</h2>
              <p>
                O MamyBoo é um aplicativo de acompanhamento gestacional que fornece informações 
                educativas sobre gravidez, incluindo desenvolvimento do bebê, dicas de saúde, 
                exercícios e bem-estar emocional.
              </p>

              <h2 className="font-semibold text-foreground text-base">3. Aviso Médico</h2>
              <p>
                <strong>O MamyBoo NÃO substitui acompanhamento médico profissional.</strong> As informações 
                fornecidas são de caráter educativo e informativo. Consulte sempre seu médico 
                obstetra para orientações específicas sobre sua gestação.
              </p>

              <h2 className="font-semibold text-foreground text-base">4. Assistente de IA</h2>
              <p>
                O assistente de inteligência artificial disponível no plano Premium oferece 
                respostas informativas e de apoio emocional. Suas respostas não constituem 
                aconselhamento médico e não devem ser usadas como base para decisões de saúde.
              </p>

              <h2 className="font-semibold text-foreground text-base">5. Privacidade e Dados</h2>
              <p>
                Seus dados pessoais e de gestação são armazenados de forma segura e utilizados 
                exclusivamente para personalizar sua experiência no aplicativo. Não compartilhamos 
                seus dados com terceiros sem seu consentimento.
              </p>

              <h2 className="font-semibold text-foreground text-base">6. Pagamento e Reembolso</h2>
              <p>
                Os planos são de pagamento único com acesso por 12 meses. Oferecemos garantia 
                incondicional de 7 dias para reembolso a partir da data da compra.
              </p>

              <h2 className="font-semibold text-foreground text-base">7. Conta e Acesso</h2>
              <p>
                Você é responsável por manter a segurança de sua conta. O acesso pode ser 
                suspenso em caso de violação destes termos.
              </p>

              <h2 className="font-semibold text-foreground text-base">8. Alterações nos Termos</h2>
              <p>
                Reservamo-nos o direito de alterar estes termos a qualquer momento. Alterações 
                significativas serão comunicadas através do aplicativo.
              </p>
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              onClick={() => setAccepted(!accepted)}
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                accepted
                  ? "bg-primary border-primary"
                  : "border-border group-hover:border-primary/50"
              }`}
            >
              {accepted && <Check className="w-4 h-4 text-primary-foreground" weight="bold" />}
            </div>
            <span className="text-sm text-foreground">
              Li e aceito os <strong>Termos de Uso</strong> e a{" "}
              <strong>Política de Privacidade</strong> do MamyBoo.
            </span>
          </label>

          <Button
            className="w-full h-14 rounded-xl gradient-primary text-primary-foreground font-semibold text-base shadow-soft"
            disabled={!accepted || loading}
            onClick={handleAccept}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 animate-pulse" /> Salvando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> Aceitar e continuar
              </span>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
