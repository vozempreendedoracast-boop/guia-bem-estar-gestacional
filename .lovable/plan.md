

# Plano de Correção Geral - MamyBoo

## Diagnóstico dos Problemas

### Problemas Gerais

**1. Erro no login / senha não registrada na criação**
O `handleCreateUser` no Admin usa `inviteUserByEmail`, que envia um email de convite mas **não define senha**. A usuária precisa clicar no link do email para definir a senha. Isso é o comportamento esperado do Supabase invite flow. O problema real pode ser que o convite não chega (rate limit detectado nos logs: `429 over_email_send_rate_limit`). Solução: adicionar opção de definir senha na criação da conta pelo Admin.

**2. Usuário desativado/apagado fica preso no app**
O `AuthContext` não monitora mudanças no `plan_status`. Quando o admin desativa ou deleta um usuário, o frontend não reage. Solução: adicionar polling periódico do perfil e listener de `onAuthStateChange` para `USER_DELETED`/`SIGNED_OUT`.

**3. Conta criada deve ser "Sem Plano" + "Ativo"**
Atualmente, quando plan=none, plan_status é setado como "none" (inativo). Precisamos separar o conceito de "conta ativa" do "plano ativo". Solução: adicionar campo `account_status` (active/banned) na tabela `user_profiles`, ou usar plan_status="active" com plan="none" como estado padrão.

**4. Push Notifications com som**
Requer configuração real do Service Worker (PWA já está instalado via `vite-plugin-pwa`). Precisa de permissão do browser e lógica de envio.

### Painel Usuário

**5. Notificar quando respondida pelo suporte**
Atualmente o polling a cada 10s busca mensagens, mas não há notificação visual/sonora. Solução: detectar novas mensagens do admin e mostrar toast/badge/som.

**6. Avaliação após encerramento do suporte**
Não existe sistema de encerramento nem avaliação. Solução: adicionar campos `closed`, `rating`, `rating_text`, `closed_by` na tabela `support_messages` (ou criar tabela `support_conversations`).

**7. Suporte enviar imagens**
Não há suporte a upload de imagens. Precisa de storage bucket + UI de upload.

### Painel Admin

**8. Encerrar suporte + histórico + avaliações**
`AdminSupportTab` não tem botão de encerrar nem mostra avaliações.

**9. Nome da usuária + informações no suporte**
Atualmente mostra apenas email. Precisa cruzar com `pregnancy_profiles` para pegar o nome.

**10. Auto-play e intervalo do carrossel não funcionam**
Dashboard lê de `localStorage` (`promo_carousel_interval`, `promo_carousel_autoplay`), mas no Admin as configurações de push/notificações não persistem esses valores - os switches são apenas visuais (`defaultChecked`) sem `onChange` conectado.

**11. Controle de acesso por plano nos painéis**
Não existe campo para definir qual plano pode acessar cada card/painel. Solução: adicionar `required_plan` na tabela `categories`.

---

## Plano de Implementação

### Fase 1: Database (Migrações)

1. **Adicionar campos na tabela `categories`**:
   - `required_plan` (text, default 'none') - valores: 'none' (todos), 'essential', 'premium'

2. **Criar tabela `support_conversations`**:
   - `id`, `user_id`, `status` (open/closed), `closed_by` (admin user_id), `rating` (1-5), `rating_text`, `created_at`, `closed_at`
   - Adicionar `conversation_id` na `support_messages`
   - Adicionar `image_url` na `support_messages`

3. **Criar storage bucket `support-images`** (público para leitura autenticada)

4. **Adicionar `account_status` na `user_profiles`** (text, default 'active') para distinguir conta ativa vs plano ativo

### Fase 2: Backend (Edge Functions)

5. **Atualizar `admin-users`**: incluir ação `create` com senha opcional, e `ban`/`unban` usando `account_status`

### Fase 3: Frontend - Correções Críticas

6. **AuthContext - Auto-logout**: Adicionar polling a cada 30s que verifica `account_status` e `plan_status`. Se conta banida ou deletada, faz `signOut()` e redireciona para `/login`.

7. **Login - Verificar account_status**: Após login, checar se `account_status === 'active'`. Se não, mostrar erro e fazer logout.

8. **Admin - Criar usuária com senha**: Adicionar campo de senha no modal de criação. Alterar edge function para aceitar `password` e usar `createUser` ao invés de `inviteUserByEmail` quando senha for fornecida.

9. **Admin - Carrossel auto-play**: Conectar os switches de configuração ao `localStorage` com persistência real.

### Fase 4: Frontend - Suporte Completo

10. **Support (usuária)**: 
    - Upload de imagens (botão de câmera/anexo)
    - Detecção de nova resposta do admin com toast + som
    - Modal de avaliação (estrelas + texto) ao encerrar
    - Ocultar conversas encerradas

11. **AdminSupportTab**:
    - Mostrar nome da usuária (cruzando com `pregnancy_profiles`)
    - Botão "Encerrar conversa"
    - Aba de histórico com avaliações e quem atendeu
    - Botão para ver perfil da usuária

### Fase 5: Controle de Acesso por Plano

12. **Admin - Cards**: Adicionar select de `required_plan` no modal de edição de card

13. **Dashboard**: Filtrar cards visíveis com base no plano do usuário + `required_plan` do card. Cards inacessíveis podem aparecer com cadeado.

14. **ProtectedRoute/DynamicPage**: Verificar `required_plan` da categoria ao acessar rota dinâmica.

### Fase 6: Push Notifications (Básico)

15. **Service Worker**: Configurar `vite-plugin-pwa` para suportar push notifications com som customizado
16. **Permissão**: Solicitar permissão no dashboard + armazenar subscription
17. **Envio**: Criar edge function para enviar pushes (nova resposta de suporte como primeiro caso de uso)

---

## Estimativa de Complexidade

- **Fase 1-2** (DB + Edge): Média - migrações SQL + atualização da edge function
- **Fase 3** (Correções críticas): Alta - AuthContext polling, criação com senha, carrossel
- **Fase 4** (Suporte completo): Alta - storage, upload, avaliação, histórico
- **Fase 5** (Controle de plano): Média - campo no DB + filtros no frontend
- **Fase 6** (Push): Alta - Service Worker, subscription, edge function de envio

Total: ~12 tarefas principais distribuídas em implementações incrementais.

